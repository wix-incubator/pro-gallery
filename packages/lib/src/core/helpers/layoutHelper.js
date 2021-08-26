/* eslint-disable prettier/prettier */
import utils from '../../common/utils';
import window from '../../common/window/windowWrapper';
import PLACEMENTS, {
  hasExternalVerticalPlacement,
  hasHoverPlacement,
} from '../../common/constants/placements';
import INFO_BEHAVIOUR_ON_HOVER from '../../common/constants/infoBehaviourOnHover';
import LOADING_MODE from '../../common/constants/loadingMode';
import LOADING_WITH_COLOR_MODE from '../../common/constants/loadingWithColorMode';
import SLIDE_ANIMATIONS from '../../common/constants/slideAnimations';
import GALLERY_SIZE_TYPE from '../../common/constants/gallerySizeType';
import LAYOUTS from '../../common/constants/layout';
import ARROWS_POSITION from '../../common/constants/arrowsPosition';
import { default as GALLERY_CONSTS } from '../../common/constants/index';
import {assignByString} from './optionsUtils'
import processTextDimensions from './textBoxDimensionsHelper'

export const calcTargetItemSize = (options, smartCalc = false) => {
  if (
    options.gallerySizeType === GALLERY_SIZE_TYPE.PIXELS &&
    options.gallerySizePx > 0
  ) {
    return options.gallerySizePx;
  } else if (
    options.gallerySizeType === GALLERY_SIZE_TYPE.RATIO &&
    options.gallerySizeRatio > 0
  ) {
    return (
      ((window && window.innerWidth) || 980) * (options.gallerySizeRatio / 100)
    );
  } else {
    return smartCalc ? smartCalc : options.gallerySize;
  }
};

export const processNumberOfImagesPerRow = (options) => {
  //This will be used in the masonry and grid presets
  let res = {...options}
  if (
    options.scrollDirection === GALLERY_CONSTS.scrollDirection.VERTICAL || //relevant for grid, in Masonry its fixed to !oneRow
      options.isVertical //relevant for masonry, in grid its fixed to true.
  ) {
    res.fixedColumns =
      String(options.gridStyle) === '1'
        ? Number(options.numberOfImagesPerRow)
        : 0;
    res.groupTypes = '1';
    res.groupSize = 1;
    res.collageAmount = 0;
    res.collageDensity = 0;
  }
  return res;
}

export const processNumberOfImagesPerCol = (options) => {
  //This will be used in the grid preset
  let res = {...options}
  if (
    !utils.isUndefined(options.numberOfImagesPerCol) &&
    options.scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL
  ) {
    res.fixedColumns = 0;
    switch (options.numberOfImagesPerCol) {
      case 1:
      default:
        res.groupTypes = '1';
        res.groupSize = 1;
        res.collageAmount = 0;
        res.collageDensity = 0;
        break;
      case 2:
        res.groupTypes = '2v';
        res.groupSize = 2;
        res.collageAmount = 1;
        res.collageDensity = 1;
        break;
      case 3:
        res.groupTypes = '3v';
        res.groupSize = 3;
        res.collageAmount = 1;
        res.collageDensity = 1;
        break;
    }
  }
  return res
}

const forceInfoOnHoverWhenNeeded = (options) =>{
  let _options = {...options}
  const isDesignedPreset =
  _options.galleryLayout === LAYOUTS.DESIGNED_PRESET;

  if (
    (!_options.isVertical ||
      _options.groupSize > 1 ||
      (_options.scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL && !isDesignedPreset)) &&
    !_options.isSlider &&
    !_options.isColumns
  ) {
    // Dont allow titlePlacement to be above / below / left / right
    _options.titlePlacement = PLACEMENTS.SHOW_ON_HOVER;
  }

  return _options;
}

const setMobileFonts = (options) => {
  let _options = {...options}
  if (isSlideshowFont(_options)) {
    if (!utils.isUndefined(_options.itemFontSlideshow)) {
      _options = setTextUnderline('itemFontSlideshow', 'textDecorationTitle', _options);
    }
    if (!utils.isUndefined(_options.itemDescriptionFontSlideshow)) {
      _options = setTextUnderline('itemDescriptionFontSlideshow', 'textDecorationDesc', _options);
    }
  } else {
    if (!utils.isUndefined(_options.itemFont)) {
      _options = setTextUnderline('itemFont', 'textDecorationTitle', _options);
    }
    if (!utils.isUndefined(_options.itemDescriptionFont)) {
      _options = setTextUnderline('itemDescriptionFont', 'textDecorationDesc', _options);
    }
  }

  return _options;
}

const forceHoverToShowTextsIfNeeded = (options) =>{
  let _options = {...options}
  if (
    !hasHoverPlacement(_options.titlePlacement) &&
    _options.hoveringBehaviour !== INFO_BEHAVIOUR_ON_HOVER.NEVER_SHOW
  ) {
    _options.hoveringBehaviour = INFO_BEHAVIOUR_ON_HOVER.APPEARS;
  }

  return _options
}

const processImageLoadingWithColorMode = (options) => {
  let _options = {...options}
  if (
    _options.imageLoadingMode === LOADING_MODE.COLOR &&
    _options.imageLoadingWithColorMode ===
      LOADING_WITH_COLOR_MODE.MAIN_COLOR
  ) {
    _options.imageLoadingMode = LOADING_MODE.MAIN_COLOR;
  }
  return _options;
}

const removeShadowOnHorizontalGalleries = (options) => {
  let _options = {...options}
  if(_options.itemEnableShadow && _options.scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL) {
    _options.itemEnableShadow = false;
  }
  return _options;
}

const forceHorizontalOrientationInHorizontalGalleries = (options) => {
  let _options = {...options}
  if (_options.scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL) {
    // in horizontal galleries allow only horizontal orientation
    _options.isVertical = false;
  }
  return _options;
}

const removeLoopOnVerticalGalleries = (options) => {
  let _options = {...options}
  if (_options.scrollDirection === GALLERY_CONSTS.scrollDirection.VERTICAL) {
    _options.slideshowLoop = false; // allow slideshowLoop only for horizontal layouts
  }
  return _options;
}

const limitImageMargin = (options) => {
  let _options = {...options}
  if (_options.imageMargin > 0) {
    _options.imageMargin = Math.min(_options.imageMargin, 50); // limit mobile spacing to 50px (25 on each side)
  }
  return _options;
}

const forceScrollAnimationOnSingleImageInViewGalleries = (options) => {
  let _options = {...options}
  if (
    _options.scrollDirection === GALLERY_CONSTS.scrollDirection.VERTICAL ||
    _options.groupSize > 1 ||
    !_options.cubeImages
  ) {
    _options.slideAnimation = SLIDE_ANIMATIONS.SCROLL;
  }
  return _options;
}

const removeArrowPaddingIfOutsideTheGallery = (options) => {
  let _options = {...options}
  if (_options.arrowsPosition === ARROWS_POSITION.OUTSIDE_GALLERY) {
    _options.arrowsPadding = 0;
  }
  return _options;
}

const removeVideoAutoplayInIOS = (options) => {
  let _options = {...options}
  // Handle case of autoplay on ios devices
  if (
    _options.videoPlay === 'auto' &&
    _options.itemClick === 'nothing' &&
    utils.isiOS()
  ) {
    _options.videoPlay = 'onClick';
  }
  return _options;
}

const processForceMobileCustomButton = (options) => {
  let _options = {...options}
  if (_options.forceMobileCustomButton) {
    _options.targetItemSize = Math.round(30 * 8.5 + 150);
    _options.titlePlacement = PLACEMENTS.SHOW_BELOW;
    _options.galleryLayout = 2;
    _options.fixedColumns = 1;
    _options.numberOfImagesPerRow = 1;
  }
  return _options;
}

const processSpecialGallerySize = (options) => {
  let _options = {...options}
  // in case a special gallery size was specified, use it
  if (
    _options.gallerySizeType === GALLERY_SIZE_TYPE.PIXELS &&
    _options.gallerySizePx > 0
  ) {
    _options.targetItemSize = _options.gallerySizePx;
  } else if (
    _options.gallerySizeType === GALLERY_SIZE_TYPE.RATIO &&
    _options.gallerySizeRatio > 0
  ) {
    _options.targetItemSize =
      ((window && window.innerWidth) || 980) *
      (_options.gallerySizeRatio / 100);
  }
  return _options;
}

const processLoadMoreButtonFont = (options) => {
  let _options = {...options}
  if (_options.loadMoreButtonFont && utils.isMobile()) {
    _options.loadMoreButtonFont.value =
      _options.loadMoreButtonFont.value.replace(/^font\s*:\s*/, '');
    _options.loadMoreButtonFont.value =
      _options.loadMoreButtonFont.value.replace(/;$/, '');
    if (_options.loadMoreButtonFont.value.indexOf('underline') > -1) {
      _options.loadMoreButtonFont.value =
        _options.loadMoreButtonFont.value.replace('underline', '');
      _options.textDecorationLoadMore = 'underline';
    } else {
      _options.textDecorationLoadMore = 'none';
    }
  }
  return _options;
}

const addMarginsToSupportShadows = (options) => {
  let _options = {...options}

  if (_options.itemEnableShadow && _options.scrollDirection === GALLERY_CONSTS.scrollDirection.VERTICAL) {
    // add gallerySpacing to allow the shadow to be seen
    let _gallerySpacing = Math.max(
      _options.layoutParams.gallerySpacing,
      (_options.itemShadowSize || 0) +
        (_options.itemShadowBlur || 0)
    );
    _options = assignByString(_options, 'layoutParams_gallerySpacing', _gallerySpacing)
  }
  return _options;
}

const removeBordersIfNeeded = (options) => {
  //TODO this can go into the _optionspective 4 layouts.
  let _options = {...options}

  if (_options.cubeType === 'fit' && (_options.isGrid || _options.hasThumbnails || _options.isSlider || _options.isSlideshow)) {
    _options.itemBorderWidth = 0;
    _options.itemBorderRadius = 0;
    _options.itemEnableShadow = false;
  }

  return _options
}

const setTextUnderline = (itemFontOption, textDecorationType, options) => {
  /* itemFontOption: itemFontSlideshow / itemDescriptionFontSlideshow / itemFont / itemDescriptionFont
  textDecorationType: textDecorationTitle / textDecorationDesc */

  let _options = {...options}
  _options[itemFontOption].value = _options[
    itemFontOption
  ].value.replace(/^font\s*:\s*/, '');
  _options[itemFontOption].value = _options[
    itemFontOption
  ].value.replace(/;$/, '');
  if (
    _options[itemFontOption].value.indexOf('underline') > -1 ||
    _options[itemFontOption].style.underline === true
  ) {
    _options[itemFontOption].value = _options[
      itemFontOption
    ].value.replace('underline', '');
    _options[textDecorationType] = 'underline';
  } else if (_options[itemFontOption].style.underline === false) {
    _options[textDecorationType] = 'none';
  }
  return _options;
};

function processLayouts(options, customExternalInfoRendererExists) {
  let processedOptions = {...options};
  if (utils.isMobile()) {
    processedOptions = setMobileFonts(processedOptions);
    processedOptions = limitImageMargin(processedOptions);
  }
    processedOptions = forceInfoOnHoverWhenNeeded(processedOptions);
    processedOptions = forceHoverToShowTextsIfNeeded(processedOptions);
    processedOptions = processImageLoadingWithColorMode(processedOptions);
    processedOptions = removeBordersIfNeeded(processedOptions);
    processedOptions = removeShadowOnHorizontalGalleries(processedOptions);
    processedOptions = addMarginsToSupportShadows(processedOptions);
    processedOptions = removeArrowPaddingIfOutsideTheGallery(processedOptions);
    processedOptions = forceHorizontalOrientationInHorizontalGalleries(processedOptions);
    processedOptions = removeLoopOnVerticalGalleries(processedOptions);
    processedOptions = forceScrollAnimationOnSingleImageInViewGalleries(processedOptions);
    processedOptions = processLoadMoreButtonFont(processedOptions); //contains if isMobile, but also has an else.
    processedOptions = processForceMobileCustomButton(processedOptions); //TODO this seems like it doesnt really exists. consider deleting support.
    processedOptions = processSpecialGallerySize(processedOptions);
    processedOptions = processTextDimensions(processedOptions, customExternalInfoRendererExists);
    processedOptions = removeVideoAutoplayInIOS(processedOptions);

  return processedOptions;
}

function isSlideshowFont(options) {
  const galleryLayout = options.galleryLayout;
  if (galleryLayout === LAYOUTS.SLIDESHOW) {
    return true;
  }
  if (hasExternalVerticalPlacement(options.titlePlacement)) {
    if (galleryLayout === 4 || galleryLayout === 6 || galleryLayout === 7) {
      return true;
    } else if (galleryLayout === 1 && options.isVertical) {
      return true;
    } else if (galleryLayout === 2 && options.scrollDirection !== 1) {
      return true;
    }
  }
  return false;
}

export default processLayouts;
/* eslint-enable prettier/prettier */
