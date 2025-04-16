/* eslint-disable prettier/prettier */
import utils from '../../common/utils';
import window from '../../common/window/windowWrapper';
import {
  hasHoverPlacement,
  isConstantVerticalPlacement,
  isHoverPlacement,
} from '../../common/constants/layoutParams_info_placement';
import { default as GALLERY_CONSTS } from '../../common/constants';
import processTextDimensions from './textBoxDimensionsHelper'
import { default as slideAnimation } from '../../settings/options/behaviourParams_gallery_horizontal_slideAnimation';
import { default as arrowsPosition } from '../../settings/options/layoutParams_navigationArrows_position';
import optionsMap from './optionsMap';

export const calcTargetItemSize = (options, smartValue) => { 
  if (
    options[optionsMap.layoutParams.targetItemSize.unit] === GALLERY_CONSTS[optionsMap.layoutParams.targetItemSize.unit].PIXEL &&
    options[optionsMap.layoutParams.targetItemSize.value] > 0
  ) {
    return options[optionsMap.layoutParams.targetItemSize.value];
  } else if (
    options[optionsMap.layoutParams.targetItemSize.unit] === GALLERY_CONSTS[optionsMap.layoutParams.targetItemSize.unit].PERCENT &&
    options[optionsMap.layoutParams.targetItemSize.value] > 0
  ) {
    return (
      ((window && window.innerWidth) || 980) * (options[optionsMap.layoutParams.targetItemSize.value] / 100)
    );
  } else if(smartValue > 0) {
    return smartValue;
  } else {
    return options[optionsMap.layoutParams.targetItemSize.value];
  }
};

export const processNumberOfImagesPerRow = (options) => { 
  //This will be used in the masonry and grid presets
  let res = {...options}
  res = fixColumnsIfNeeded(res);
  if (
    res[optionsMap.layoutParams.structure.scrollDirection] ===
    GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].VERTICAL || //relevant for grid, in Masonry its fixed to !oneRow
    res[optionsMap.layoutParams.structure.layoutOrientation] ===
    GALLERY_CONSTS[
      optionsMap.layoutParams.structure.layoutOrientation
    ].VERTICAL //relevant for masonry, in grid its fixed to vertical.
  ) {
    res[optionsMap.layoutParams.groups.allowedGroupTypes] = [
      GALLERY_CONSTS[optionsMap.layoutParams.groups.allowedGroupTypes]['1'],
    ];
    res[optionsMap.layoutParams.groups.groupSize] = 1;
    // res.collageAmount = 0; //doesnt really exist. I'll comment and then remove.
    res[optionsMap.layoutParams.groups.density] = 0;
  }
  return res;
}

export const fixColumnsIfNeeded = (options) => {
  let res = {...options}
  res.fixedColumns = 0;
  if (
    res[optionsMap.layoutParams.structure.scrollDirection] ===
    GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].VERTICAL || //relevant for grid, in Masonry its fixed to !oneRow
    res[optionsMap.layoutParams.structure.layoutOrientation] ===
    GALLERY_CONSTS[
      optionsMap.layoutParams.structure.layoutOrientation
    ].VERTICAL //relevant for masonry, in grid its fixed to vertical.
  ) {
    res.fixedColumns = // a layouter thing
      options[optionsMap.layoutParams.structure.responsiveMode] === GALLERY_CONSTS[optionsMap.layoutParams.structure.responsiveMode].SET_ITEMS_PER_ROW
        ? res[optionsMap.layoutParams.structure.numberOfColumns]
        : 0;
  }
  return res;
}

export const processGridStyle = (options) => { 
  let res = {...options};
  const isVerticalOrientation =
    res[optionsMap.layoutParams.structure.layoutOrientation] ===
    GALLERY_CONSTS[optionsMap.layoutParams.structure.layoutOrientation]
      .VERTICAL;
  res[optionsMap.layoutParams.structure.responsiveMode] =
  isVerticalOrientation ? options[optionsMap.layoutParams.structure.responsiveMode] : GALLERY_CONSTS[optionsMap.layoutParams.structure.responsiveMode].FIT_TO_SCREEN;
  return res;
}

export const processNumberOfImagesPerCol = (options) => { 
  //This will be used in the grid preset
  let res = {...options}
  if (
    !utils.isUndefined(options[optionsMap.layoutParams.structure.numberOfGridRows]) &&
    options[optionsMap.layoutParams.structure.scrollDirection] ===
    GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].HORIZONTAL ) {
      res[optionsMap.layoutParams.structure.numberOfColumns] = 0;
    switch (options[optionsMap.layoutParams.structure.numberOfGridRows]) {
      case 1:
      default:
        res[optionsMap.layoutParams.groups.allowedGroupTypes] = [
          GALLERY_CONSTS[optionsMap.layoutParams.groups.allowedGroupTypes]['1'],
        ];
        res[optionsMap.layoutParams.groups.groupSize] = 1;
        // res.collageAmount = 0;
        res[optionsMap.layoutParams.groups.density] = 0;
        break;
      case 2:
        res[optionsMap.layoutParams.groups.allowedGroupTypes] = [
          GALLERY_CONSTS[optionsMap.layoutParams.groups.allowedGroupTypes]['2v'],
        ];
        res[optionsMap.layoutParams.groups.groupSize] = 2;
        // res.collageAmount = 1;
        res[optionsMap.layoutParams.groups.density] = 1;
        break;
      case 3:
        res[optionsMap.layoutParams.groups.allowedGroupTypes] = [
          GALLERY_CONSTS[optionsMap.layoutParams.groups.allowedGroupTypes]['3v'],
        ];
        res[optionsMap.layoutParams.groups.groupSize] = 3;
        // res.collageAmount = 1;
        res[optionsMap.layoutParams.groups.density] = 1;
        break;
    }
  }
  return res
}

const forceInfoOnHoverWhenNeeded = (options) =>{ 
  let _options = {...options}
if (    
  !GALLERY_CONSTS.isLayout('SLIDER')(_options) && //not slider
  !GALLERY_CONSTS.isLayout('COLUMN')(_options) &&  //not columns
  !GALLERY_CONSTS.isLayout('SLIDESHOW')(_options) //not columns
  ) {
    if (
      (_options[optionsMap.layoutParams.structure.layoutOrientation] === GALLERY_CONSTS[optionsMap.layoutParams.structure.layoutOrientation].HORIZONTAL || //layout orientation is horizontal
        _options[optionsMap.layoutParams.groups.groupSize] > 1) //groups are larger than one (items can be on top or right left of eachother)
    ) {
      // Dont allow info placement to be external
      _options[optionsMap.layoutParams.info.placement] = GALLERY_CONSTS[optionsMap.layoutParams.info.placement].OVERLAY;
    }
  }

  return _options;
}

const forceHoverToShowTextsIfNeeded = (options) => { 
  let _options = {...options}
  if(options.EXPERIMENTALallowParallelInfos) return _options
  if (
    !hasHoverPlacement(_options[optionsMap.layoutParams.info.placement]) &&
    _options[optionsMap.behaviourParams.item.overlay.hoveringBehaviour] !== GALLERY_CONSTS[optionsMap.behaviourParams.item.overlay.hoveringBehaviour].NEVER_SHOW
  ) {
    _options[optionsMap.behaviourParams.item.overlay.hoveringBehaviour] = GALLERY_CONSTS[optionsMap.behaviourParams.item.overlay.hoveringBehaviour].APPEARS;
  }
  return _options
}

const blockScrollOnFadeOrDeckScrollAnimations = (options) => { 
  let _options = {...options}
  if ((
    options[optionsMap.behaviourParams.gallery.horizontal.slideAnimation] === GALLERY_CONSTS[optionsMap.behaviourParams.gallery.horizontal.slideAnimation].FADE ||
    options[optionsMap.behaviourParams.gallery.horizontal.slideAnimation] === GALLERY_CONSTS[optionsMap.behaviourParams.gallery.horizontal.slideAnimation].DECK
  ) && (slideAnimation.isRelevant(options))) {
    _options[optionsMap.behaviourParams.gallery.horizontal.blockScroll] = true;
  }

  return _options
}

const blockVideoControlsOnMouseCursorNavigation = (options) => { 
  let _options = {...options}
  if ((options[optionsMap.layoutParams.navigationArrows.position] === GALLERY_CONSTS[optionsMap.layoutParams.navigationArrows.position].MOUSE_CURSOR) && (arrowsPosition.isRelevant(options))) {
    _options[optionsMap.behaviourParams.item.video.enableControls] = false;
  }
  return _options
}

const blockMouseCursorNavigationOnTouchDevice = (options) => { 
  let _options = {...options}
  if (utils.isTouch() && (options[optionsMap.layoutParams.navigationArrows.position] === GALLERY_CONSTS[optionsMap.layoutParams.navigationArrows.position].MOUSE_CURSOR) && (arrowsPosition.isRelevant(options))) {
    _options[optionsMap.layoutParams.navigationArrows.enable] = false;

  }
  return _options
}

const removeShadowOnHorizontalGalleries = (options) => { 
  let _options = {...options}
  if(_options[optionsMap.stylingParams.itemEnableShadow] && _options[optionsMap.layoutParams.structure.scrollDirection] === GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].HORIZONTAL) {
    _options[optionsMap.stylingParams.itemEnableShadow] = false;
  }
  return _options;
}

const forceHorizontalOrientationInHorizontalGalleries = (options) => { 
  let _options = {...options}
  if (_options[optionsMap.layoutParams.structure.scrollDirection] === GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].HORIZONTAL) {
    // in horizontal galleries allow only horizontal orientation
    _options[optionsMap.layoutParams.structure.layoutOrientation] = GALLERY_CONSTS[optionsMap.layoutParams.structure.layoutOrientation].HORIZONTAL;
  }
  return _options;
}

const removeLoopOnVerticalGalleries = (options) => { 
  let _options = {...options}
  if (_options[optionsMap.layoutParams.structure.scrollDirection] === GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].VERTICAL) {
    _options[optionsMap.behaviourParams.gallery.horizontal.loop] = false; // allow loop only for horizontal layouts
  }
  return _options;
}

const limitImageMargin = (options) => { 
  let _options = {...options}
  if (_options[optionsMap.layoutParams.structure.itemSpacing] > 0) {
    _options[optionsMap.layoutParams.structure.itemSpacing] = Math.min(_options[optionsMap.layoutParams.structure.itemSpacing], 50); // limit mobile spacing to 50px (25 on each side)
  }
  return _options;
}

const forceScrollAnimationOnSingleImageInViewGalleries = (options) => { 
  let _options = {...options}
  if (
    _options[optionsMap.layoutParams.structure.scrollDirection] === GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].VERTICAL ||
    _options[optionsMap.layoutParams.groups.groupSize] > 1 ||
    !_options[optionsMap.layoutParams.crop.enable]
  ) {
    _options[optionsMap.behaviourParams.gallery.horizontal.slideAnimation] = GALLERY_CONSTS[optionsMap.behaviourParams.gallery.horizontal.slideAnimation].SCROLL;
  }
  return _options;
}

const removeArrowPaddingIfOutsideTheGallery = (options) => { 
  let _options = {...options}
  if (_options[optionsMap.layoutParams.navigationArrows.position] === GALLERY_CONSTS[optionsMap.layoutParams.navigationArrows.position].OUTSIDE_GALLERY) {
    _options[optionsMap.layoutParams.navigationArrows.padding] = 0;
  }
  return _options;
}


const processLoadMoreButtonFont = (options) => { //This is not a pg option per se. it should be removed...
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
const blockCounterByProduct = (options) => { 
  let _options = {...options}
  if(!_options[optionsMap.behaviourParams.gallery.horizontal.slideshowInfo.enableCounter]) {
    return _options
  }

  if(_options[optionsMap.behaviourParams.gallery.horizontal.autoSlide.behaviour] === GALLERY_CONSTS[optionsMap.behaviourParams.gallery.horizontal.autoSlide.behaviour].OFF) {
    _options[optionsMap.behaviourParams.gallery.horizontal.slideshowInfo.enableCounter] = false
  }

  if (GALLERY_CONSTS.isLayout('SLIDESHOW')(options) === false) {
    _options[optionsMap.behaviourParams.gallery.horizontal.slideshowInfo.enableCounter] = false;
  }
  return _options;
}

const addMarginsToSupportShadows = (options) => { 
  let _options = {...options}

  if (_options[optionsMap.stylingParams.itemEnableShadow] && _options[optionsMap.layoutParams.structure.scrollDirection] === GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].VERTICAL) {
    // add gallerySpacing to allow the shadow to be seen
    _options[optionsMap.layoutParams.structure.gallerySpacing] = Math.max(
      _options[optionsMap.layoutParams.structure.gallerySpacing],
      (_options[optionsMap.stylingParams.itemShadowSize] || 0) +
        (_options[optionsMap.stylingParams.itemShadowBlur] || 0)
    );
  }
  return _options;
}

const centerArrowsWhenNeeded = (options) => {  
  let _options = {...options}
  const isSingleVerticalItemRendered =  _options[optionsMap.layoutParams.groups.allowedGroupTypes].length >= 1 ? 
  _options[optionsMap.layoutParams.groups.allowedGroupTypes].join('') === '1' : false
  const filteredPlacement = _options[optionsMap.layoutParams.info.placement] // filtering hover since it doesn't affect this product
  .split(',')
  .filter(placement => !isHoverPlacement(placement))
  .join(',')
  if (!isConstantVerticalPlacement(filteredPlacement) || 
      !isSingleVerticalItemRendered)
    {
    // if text (info) placement is not above/below placement or more then 1 images per col, arrows are gallery("item") centered
    _options[optionsMap.layoutParams.navigationArrows.verticalAlignment] = GALLERY_CONSTS[optionsMap.layoutParams.navigationArrows.verticalAlignment].ITEM_CENTER;
  }
  return _options;
}

export const removeBordersIfNeeded = (options) => { 
  //TODO this can go into the _optionspective 4 layouts.
  let _options = {...options}

  if (_options[optionsMap.layoutParams.crop.method] ===
    GALLERY_CONSTS[optionsMap.layoutParams.crop.method].FIT ) {
    _options[optionsMap.stylingParams.itemBorderWidth] = 0;
    _options[optionsMap.stylingParams.itemBorderRadius] = 0;
    _options[optionsMap.stylingParams.itemEnableShadow] = false;
  }

  return _options
}

const cropItemsWithCropOnlyFillParam = (options) => {
  let _options = { ...options };
  if (_options[optionsMap.layoutParams.crop.cropOnlyFill]) {
    _options[optionsMap.layoutParams.crop.enable] =
      _options[optionsMap.layoutParams.crop.method] === GALLERY_CONSTS[optionsMap.layoutParams.crop.method].FILL;
  }
  return _options;
};

function processLayouts(options, customExternalInfoRendererExists) {
  let processedOptions = {...options};
  if (utils.isMobile()) {
    processedOptions = limitImageMargin(processedOptions);
  }
    processedOptions = forceInfoOnHoverWhenNeeded(processedOptions);
    processedOptions = forceHoverToShowTextsIfNeeded(processedOptions); 
    processedOptions = removeShadowOnHorizontalGalleries(processedOptions); 
    processedOptions = addMarginsToSupportShadows(processedOptions); 
    processedOptions = removeArrowPaddingIfOutsideTheGallery(processedOptions); 
    processedOptions = forceHorizontalOrientationInHorizontalGalleries(processedOptions);
    processedOptions = removeLoopOnVerticalGalleries(processedOptions);
    processedOptions = forceScrollAnimationOnSingleImageInViewGalleries(processedOptions);
    processedOptions = processLoadMoreButtonFont(processedOptions); // NEW STYPEPARAMS METHOD - should be removed but currently supported//contains if isMobile, but also has an else.
    processedOptions = processTextDimensions(processedOptions, customExternalInfoRendererExists);
    processedOptions = centerArrowsWhenNeeded(processedOptions); 
    processedOptions = blockCounterByProduct(processedOptions); 
    processedOptions = blockScrollOnFadeOrDeckScrollAnimations(processedOptions); 
    processedOptions = blockVideoControlsOnMouseCursorNavigation(processedOptions);
    processedOptions = blockMouseCursorNavigationOnTouchDevice(processedOptions);
    processedOptions = cropItemsWithCropOnlyFillParam(processedOptions);

  return processedOptions;
}

export default processLayouts;
/* eslint-enable prettier/prettier */
