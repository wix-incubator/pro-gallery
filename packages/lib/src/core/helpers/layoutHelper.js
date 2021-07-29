/* eslint-disable prettier/prettier */
import utils from '../../common/utils';
import window from '../../common/window/windowWrapper';
import PLACEMENTS, {
  hasVerticalPlacement,
  hasHoverPlacement,
  hasHorizontalPlacement,
} from '../../common/constants/placements';
import INFO_BEHAVIOUR_ON_HOVER from '../../common/constants/infoBehaviourOnHover';
import LOADING_MODE from '../../common/constants/loadingMode';
import LOADING_WITH_COLOR_MODE from '../../common/constants/loadingWithColorMode';
import SLIDE_ANIMATIONS from '../../common/constants/slideAnimations';
import GALLERY_SIZE_TYPE from '../../common/constants/gallerySizeType';
import INFO_TYPE from '../../common/constants/infoType';
import TEXT_BOX_WIDTH_CALCULATION_OPTIONS from '../../common/constants/textBoxWidthCalculationOptions';
import LAYOUTS from '../../common/constants/layout';
import ARROWS_POSITION from '../../common/constants/arrowsPosition';
import { default as GALLERY_CONSTS } from '../../common/constants/index';

export const calcTargetItemSize = (styles, smartCalc = false) => {
  if (
    styles.gallerySizeType === GALLERY_SIZE_TYPE.PIXELS &&
    styles.gallerySizePx > 0
  ) {
    return styles.gallerySizePx;
  } else if (
    styles.gallerySizeType === GALLERY_SIZE_TYPE.RATIO &&
    styles.gallerySizeRatio > 0
  ) {
    return (
      ((window && window.innerWidth) || 980) * (styles.gallerySizeRatio / 100)
    );
  } else {
    return smartCalc ? smartCalc : styles.gallerySize;
  }
};

export const processNumberOfImagesPerRow = (styles) => {
  //This will be used in the masonry and grid presets
  if (
    styles.scrollDirection === GALLERY_CONSTS.scrollDirection.VERTICAL || //relevant for grid, in Masonry its fixed to !oneRow
      styles.isVertical //relevant for masonry, in grid its fixed to true.
  ) {
    const res = {}

    res.fixedColumns =
      String(styles.gridStyle) === '1'
        ? Number(styles.numberOfImagesPerRow)
        : 0;
    res.groupTypes = '1';
    res.groupSize = 1;
    res.collageAmount = 0;
    res.collageDensity = 0;
    // }
    return res;
  } else {
    return {};
  }
}

export const processNumberOfImagesPerCol = (styles) => {
    //This will be used in the grid preset
  if (
    !utils.isUndefined(styles.numberOfImagesPerCol) &&
    styles.scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL
  ) {
    const res = {}
    res.fixedColumns = 0;
    switch (styles.numberOfImagesPerCol) {
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
    return res
  } else {
    return {};
  }

}

const forceInfoOnHoverWhenNeeded = (styles) =>{
  let _styles = {...styles}
  const isDesignedPreset =
  _styles.galleryLayout === LAYOUTS.DESIGNED_PRESET;

  if (
    (!_styles.isVertical ||
      _styles.groupSize > 1 ||
      (_styles.scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL && !isDesignedPreset)) &&
    !_styles.isSlider &&
    !_styles.isColumns
  ) {
    // Dont allow titlePlacement to be above / below / left / right
    _styles.titlePlacement = PLACEMENTS.SHOW_ON_HOVER;
  }

  return _styles;
}

const setMobileFonts = (styles) => {
  let _styles = {...styles}
  if (isSlideshowFont(_styles)) {
    if (!utils.isUndefined(_styles.itemFontSlideshow)) {
      _styles = setTextUnderline('itemFontSlideshow', 'textDecorationTitle', _styles);
    }
    if (!utils.isUndefined(_styles.itemDescriptionFontSlideshow)) {
      _styles = setTextUnderline('itemDescriptionFontSlideshow', 'textDecorationDesc', _styles);
    }
  } else {
    if (!utils.isUndefined(_styles.itemFont)) {
      _styles = setTextUnderline('itemFont', 'textDecorationTitle', _styles);
    }
    if (!utils.isUndefined(_styles.itemDescriptionFont)) {
      _styles = setTextUnderline('itemDescriptionFont', 'textDecorationDesc', _styles);
    }
  }

  return _styles;
}

const forceHoverToShowTextsIfNeeded = (styles) =>{
  let _styles = {...styles}
  if (
    !hasHoverPlacement(_styles.titlePlacement) &&
    _styles.hoveringBehaviour !== INFO_BEHAVIOUR_ON_HOVER.NEVER_SHOW
  ) {
    _styles.hoveringBehaviour = INFO_BEHAVIOUR_ON_HOVER.APPEARS;
  }

  return _styles
}

const processImageLoadingWithColorMode = (styles) => {
  let _styles = {...styles}
  if (
    _styles.imageLoadingMode === LOADING_MODE.COLOR &&
    _styles.imageLoadingWithColorMode ===
      LOADING_WITH_COLOR_MODE.MAIN_COLOR
  ) {
    _styles.imageLoadingMode = LOADING_MODE.MAIN_COLOR;
  }
  return _styles;
}
const removeShadowOnHorizontalGalleries = (styles) => {
  let _styles = {...styles}
  if(_styles.itemEnableShadow && _styles.scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL) {
    _styles.itemEnableShadow = false;
  }
  return _styles;
}
const forceHorizontalOrientationInHorizontalGalleries = (styles) => {
  let _styles = {...styles}
  if (_styles.scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL) {
    // in horizontal galleries allow only horizontal orientation
    _styles.isVertical = false;
  } 
  return _styles;
}
const removeLoopOnVerticalGalleries = (styles) => {
  let _styles = {...styles}
  if (_styles.scrollDirection === GALLERY_CONSTS.scrollDirection.VERTICAL) {
    _styles.slideshowLoop = false; // allow slideshowLoop only for horizontal layouts
  }
  return _styles;
}
const limitImageMargin = (styles) => {
  let _styles = {...styles}
  if (_styles.imageMargin > 0) {
    _styles.imageMargin = Math.min(_styles.imageMargin, 50); // limit mobile spacing to 50px (25 on each side)
  }
  return _styles;
}
const forceScrollAnimationOnSingleImageInViewGalleries = (styles) => {
  let _styles = {...styles}
  if (
    _styles.scrollDirection === GALLERY_CONSTS.scrollDirection.VERTICAL ||
    _styles.groupSize > 1 ||
    !_styles.cubeImages
  ) {
    _styles.slideAnimation = SLIDE_ANIMATIONS.SCROLL;
  }
  return _styles;
}
const removeArrowPaddingIfOutsideTheGallery = (styles) => {
  let _styles = {...styles}
  if (_styles.arrowsPosition === ARROWS_POSITION.OUTSIDE_GALLERY) {
    _styles.arrowsPadding = 0;
  }
  return _styles;
}
const fixColumnsInMobile = (styles) => {
  let _styles = {...styles}
  if (
    _styles.fixedColumns > 0 &&
    typeof _styles.m_numberOfImagesPerRow === 'undefined'
    ) {
      _styles.fixedColumns = 1;
    }
  
  return _styles;
}
const removeVideoAutoplayInIOS = (styles) => {
  let _styles = {...styles}
  // Handle case of autoplay on ios devices
  if (
    _styles.videoPlay === 'auto' &&
    _styles.itemClick === 'nothing' &&
    utils.isiOS()
  ) {
    _styles.videoPlay = 'onClick';
  }
  return _styles;
}

const processTextDimensions = (styles, customExternalInfoRendererExists) => {
  let _styles = {...styles}

  _styles.textBoxHeight = getTextBoxAboveOrBelowHeight(
    _styles,
    customExternalInfoRendererExists
  );
  _styles.externalInfoHeight = getHeightFromStyleParams(
    _styles,
    _styles.textBoxHeight
  );

  _styles.externalInfoWidth = getTextBoxRightOrLeftWidth(
    _styles,
    customExternalInfoRendererExists
  );
  return _styles;
}
const processForceMobileCustomButton = (styles) => {
  let _styles = {...styles}
  if (_styles.forceMobileCustomButton) {
    _styles.targetItemSize = Math.round(30 * 8.5 + 150);
    _styles.titlePlacement = PLACEMENTS.SHOW_BELOW;
    _styles.galleryLayout = 2;
    _styles.fixedColumns = 1;
    _styles.numberOfImagesPerRow = 1;
  }
  return _styles;
}
const processSpecialGallerySize = (styles) => {
  let _styles = {...styles}
  // in case a special gallery size was specified, use it
  if (
    _styles.gallerySizeType === GALLERY_SIZE_TYPE.PIXELS &&
    _styles.gallerySizePx > 0
  ) {
    _styles.targetItemSize = _styles.gallerySizePx;
  } else if (
    _styles.gallerySizeType === GALLERY_SIZE_TYPE.RATIO &&
    _styles.gallerySizeRatio > 0
  ) {
    _styles.targetItemSize =
      ((window && window.innerWidth) || 980) *
      (_styles.gallerySizeRatio / 100);
  }
  return _styles;
}
const processLoadMoreButtonFont = (styles) => {
  let _styles = {...styles}
  if (_styles.loadMoreButtonFont && utils.isMobile()) {
    _styles.loadMoreButtonFont.value =
      _styles.loadMoreButtonFont.value.replace(/^font\s*:\s*/, '');
    _styles.loadMoreButtonFont.value =
      _styles.loadMoreButtonFont.value.replace(/;$/, '');
    if (_styles.loadMoreButtonFont.value.indexOf('underline') > -1) {
      _styles.loadMoreButtonFont.value =
        _styles.loadMoreButtonFont.value.replace('underline', '');
      _styles.textDecorationLoadMore = 'underline';
    } else {
      _styles.textDecorationLoadMore = 'none';
    }
  }
  return _styles;
}
const addMarginsToSupportShadows = (styles) => {
  let _styles = {...styles}

  if (_styles.itemEnableShadow && _styles.scrollDirection === GALLERY_CONSTS.scrollDirection.VERTICAL) {
    // add galleryMargin to allow the shadow to be seen
    _styles.galleryMargin = Math.max(
      _styles.galleryMargin,
      (_styles.itemShadowSize || 0) +
        (_styles.itemShadowBlur || 0)
    );
  }
  return _styles;
}

const removeBordersIfNeeded = (styles) => {
//TODO this can go into the _stylespective 4 layouts.
let _styles = {...styles}

if (
  _styles.cubeType === 'fit' &&
  (_styles.isGrid || 
    _styles.hasThumbnails ||
    _styles.isSlider ||
    _styles.isSlideshow)
) {
  _styles.itemBorderWidth = 0;
  _styles.itemBorderRadius = 0;
  _styles.itemEnableShadow = false;
}

return _styles
}

const setTextUnderline = (itemFontStyleParam, textDecorationType, styles) => {
  /* itemFontStyleParam: itemFontSlideshow / itemDescriptionFontSlideshow / itemFont / itemDescriptionFont
  textDecorationType: textDecorationTitle / textDecorationDesc */

  let _styles = {...styles}
  _styles[itemFontStyleParam].value = _styles[
    itemFontStyleParam
  ].value.replace(/^font\s*:\s*/, '');
  _styles[itemFontStyleParam].value = _styles[
    itemFontStyleParam
  ].value.replace(/;$/, '');
  if (
    _styles[itemFontStyleParam].value.indexOf('underline') > -1 ||
    _styles[itemFontStyleParam].style.underline === true
  ) {
    _styles[itemFontStyleParam].value = _styles[
      itemFontStyleParam
    ].value.replace('underline', '');
    _styles[textDecorationType] = 'underline';
  } else if (_styles[itemFontStyleParam].style.underline === false) {
    _styles[textDecorationType] = 'none';
  }
  return _styles;
};

function processLayouts(styles, customExternalInfoRendererExists) {
  let processedStyles = {...styles};
  if (utils.isMobile()) {
    processedStyles = setMobileFonts(processedStyles);
    processedStyles = limitImageMargin(processedStyles);
    processedStyles = fixColumnsInMobile(processedStyles);
  }
    processedStyles = forceInfoOnHoverWhenNeeded(processedStyles);
    processedStyles = forceHoverToShowTextsIfNeeded(processedStyles);
    processedStyles = processImageLoadingWithColorMode(processedStyles);
    processedStyles = removeBordersIfNeeded(processedStyles);
    processedStyles = removeShadowOnHorizontalGalleries(processedStyles);
    processedStyles = addMarginsToSupportShadows(processedStyles);
    processedStyles = removeArrowPaddingIfOutsideTheGallery(processedStyles);
    processedStyles = forceHorizontalOrientationInHorizontalGalleries(processedStyles);
    processedStyles = removeLoopOnVerticalGalleries(processedStyles);
    processedStyles = forceScrollAnimationOnSingleImageInViewGalleries(processedStyles);
    processedStyles = processLoadMoreButtonFont(processedStyles); //contains if isMobile, but also has an else.
    processedStyles = processForceMobileCustomButton(processedStyles); //TODO this seems like it doesnt really exists. consider deleting support.
    processedStyles = processSpecialGallerySize(processedStyles); 
    processedStyles = processTextDimensions(processedStyles, customExternalInfoRendererExists);
    processedStyles = removeVideoAutoplayInIOS(processedStyles); 
    
  return processedStyles;
}

function getHeightFromStyleParams(styleParams, textBoxHeight) {
  let additionalHeight = textBoxHeight;
  if (
    textBoxHeight > 0 &&
    hasVerticalPlacement(styleParams.titlePlacement) &&
    styleParams.imageInfoType === INFO_TYPE.SEPARATED_BACKGROUND
  ) {
    additionalHeight += styleParams.textImageSpace;
    additionalHeight += styleParams.textBoxBorderWidth * 2;
  }
  return additionalHeight;
}

function getTextBoxRightOrLeftWidth(
  styleParams,
  customExternalInfoRendererExists
) {
  if (
    !shouldShowTextRightOrLeft(styleParams, customExternalInfoRendererExists)
  ) {
    return 0;
  }
  const {
    targetItemSize,
    calculateTextBoxWidthMode,
    textBoxWidth,
    textBoxWidthPercent,
  } = styleParams;
  let width = 0;
  if (
    calculateTextBoxWidthMode === TEXT_BOX_WIDTH_CALCULATION_OPTIONS.PERCENT
  ) {
    width = Math.min(100, Math.max(0, textBoxWidthPercent)) / 100;
  } else {
    width = Math.min(targetItemSize, textBoxWidth);
  }
  return width;
}

function shouldShowTextRightOrLeft(
  styleParams,
  customExternalInfoRendererExists
) {
  const { scrollDirection, isVertical, groupSize, titlePlacement } = styleParams;

  const allowedByLayoutConfig = scrollDirection === GALLERY_CONSTS.scrollDirection.VERTICAL && isVertical && groupSize === 1;

  return (
    allowedByLayoutConfig &&
    hasHorizontalPlacement(titlePlacement) &&
    customExternalInfoRendererExists
  );
}

function getTextBoxAboveOrBelowHeight(
  styleParams,
  customExternalInfoRendererExists
) {
  if (
    !shouldShowTextBoxAboveOrBelow(
      styleParams,
      customExternalInfoRendererExists
    )
  ) {
    return 0;
  }
  return styleParams.textBoxHeight;
}

function shouldShowTextBoxAboveOrBelow(
  styleParams,
  customExternalInfoRendererExists
) {
  return (
    hasVerticalPlacement(styleParams.titlePlacement) &&
    customExternalInfoRendererExists
  );
}

function isSlideshowFont(styles) {
  const galleryLayout = styles.galleryLayout;
  if (galleryLayout === LAYOUTS.SLIDESHOW) {
    return true;
  }
  if (hasVerticalPlacement(styles.titlePlacement)) {
    if (galleryLayout === 4 || galleryLayout === 6 || galleryLayout === 7) {
      return true;
    } else if (galleryLayout === 1 && styles.isVertical) {
      return true;
    } else if (galleryLayout === 2 && styles.scrollDirection !== 1) {
      return true;
    }
  }
  return false;
}

export default processLayouts;
/* eslint-enable prettier/prettier */
