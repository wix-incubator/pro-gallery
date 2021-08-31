import {
  assignByString,
  getByString,
  mergeNestedObjects,
} from './optionsUtils';
import optionsMap from './optionsMap';

function convertOptions(initialOptions) {
  //This will add the new names while keeping the old ones.
  let options = { ...initialOptions };
  Object.keys(initialOptions).forEach((key) => {
    options[layoutParamsMap[key]] = initialOptions[key];
  });
  Object.keys(initialOptions).forEach((key) => {
    options[behaviourParams[key]] = initialOptions[key];
  });
  Object.keys(initialOptions).forEach((key) => {
    options[stylingParams[key]] = initialOptions[key];
  });
  return options;
}

function convertOptionsBackwards(initialOptions) {
  //This will add the old names while keeping the new ones.
  let options = { ...initialOptions };
  Object.keys(layoutParamsMap).forEach((key) => {
    if (typeof initialOptions[layoutParamsMap[key]] !== 'undefined') {
      options[key] = initialOptions[layoutParamsMap[key]];
    }
  });
  Object.keys(behaviourParams).forEach((key) => {
    if (typeof initialOptions[behaviourParams[key]] !== 'undefined') {
      options[key] = initialOptions[behaviourParams[key]];
    }
  });
  Object.keys(stylingParams).forEach((key) => {
    if (typeof initialOptions[stylingParams[key]] !== 'undefined') {
      options[key] = initialOptions[stylingParams[key]];
    }
  });
  return options;
}

const layoutParamsMap = {
  //done
  galleryMargin: optionsMap.layoutParams.gallerySpacing, //done
  groupsPerStrip: optionsMap.layoutParams.numberOfGroupsPerRow, //done
  columnWidths: optionsMap.layoutParams.columnRatios,
  cubeFitPosition: optionsMap.layoutParams.croppedAlignment,
  //Are all of the following content keys? so they could go into layoutParams_content_
  cubeRatio: optionsMap.layoutParams.cropRatio, //done
  cubeType: optionsMap.layoutParams.cropMethod,
  cubeImages: optionsMap.layoutParams.enableCrop,
  useMaxDimensions: optionsMap.layoutParams.enableStreching, //naming???
  rotatingCropRatios: optionsMap.layoutParams.repeatingCropRatios,
  smartCrop: optionsMap.layoutParams.enableSmartCrop,
  minItemSize: optionsMap.layoutParams.minItemSize,
  cropOnlyFill: optionsMap.layoutParams.cropOnlyFill, //????????????????

  imageMargin: optionsMap.layoutParams.itemSpacing,
  placeGroupsLtr: optionsMap.layoutParams.forceGroupsOrder, //REFACTOR - LEFT_TO_RIGHT, RIGHT_TO_LEFT
  rotatingGroupTypes: optionsMap.layoutParams.repeatingGroupTypes,

  slideshowInfoSize: optionsMap.layoutParams.slideshowInfoSize,

  //is is is?
  isSlideshow: optionsMap.layoutParams.isSlideshow,
  isGrid: optionsMap.layoutParams.isGrid,
  isMasonry: optionsMap.layoutParams.isMasonry,
  isSlider: optionsMap.layoutParams.isSlider,
  isColumns: optionsMap.layoutParams.isColumns,
  //targetItemSize
  gallerySize: optionsMap.layoutParams.targetItemSize.smart,
  gallerySizePx: optionsMap.layoutParams.targetItemSize.pixel,
  gallerySizeRatio: optionsMap.layoutParams.targetItemSize.percent,
  gallerySizeType: optionsMap.layoutParams.targetItemSize.mode,
  //bundle collage
  collageAmount: optionsMap.layoutParams.collage.amount, //????????????????
  collageDensity: optionsMap.layoutParams.collage.density,
  chooseBestGroup: optionsMap.layoutParams.collage.groupByOrientation,
  groupTypes: optionsMap.layoutParams.collage.groupTypes,
  groupSize: optionsMap.layoutParams.collage.groupSize,
  //bundle thumbnails
  hasThumbnails: optionsMap.layoutParams.thumbnails.enable,
  thumbnailSpacings: optionsMap.layoutParams.thumbnails.spacing,
  thumbnailSize: optionsMap.layoutParams.thumbnails.size,
  galleryThumbnailsAlignment: optionsMap.layoutParams.thumbnails.alignment,

  //bundle arrows
  showArrows: optionsMap.layoutParams.navigationArrows.enable,
  arrowsPadding: optionsMap.layoutParams.navigationArrows.padding,
  arrowsVerticalPosition:
    optionsMap.layoutParams.navigationArrows.verticalAlignment,
  arrowsSize: optionsMap.layoutParams.navigationArrows.size,
  arrowsPosition: optionsMap.layoutParams.navigationArrows.position,

  fixedColumns: optionsMap.layoutParams.fixedColumns, //????????????????

  scatter: optionsMap.layoutParams.scatter.randomScatter,
  rotatingScatter: optionsMap.layoutParams.scatter.manualScatter,
  scrollDirection: optionsMap.layoutParams.scrollDirection,

  isVertical: optionsMap.layoutParams.layoutOrientation, // This needs to be refactored to be an enum. but can wait

  //info
  calculateTextBoxWidthMode: optionsMap.layoutParams.info.sizeCalculationMode,
  textBoxHeight: optionsMap.layoutParams.info.height,
  textBoxWidth: optionsMap.layoutParams.info.width,
  // textBoxWidthPercent: optionsMap.layoutParams.info.widthByPercent,
  textImageSpace: optionsMap.layoutParams.info.spacing,
  titlePlacement: optionsMap.layoutParams.info.placement,
  //----------border
  textBoxBorderColor: optionsMap.layoutParams.info.border.color,
  textBoxBorderRadius: optionsMap.layoutParams.info.border.radius,
  textBoxBorderWidth: optionsMap.layoutParams.info.border.width,

  externalInfoHeight: optionsMap.layoutParams.externalInfoHeight, //layouter API
  externalInfoWidth: optionsMap.layoutParams.externalInfoWidth, //layouter API
  targetItemSize: optionsMap.layoutParams.targetItemSize, //layouter API
};

const behaviourParams = {
  //item
  itemClick: optionsMap.behaviourParams.item.clickAction, //possible refactor (join fullscreen, expand into one 'action')
  //----video
  videoSpeed: optionsMap.behaviourParams.item.video.speed,
  hidePlay: optionsMap.behaviourParams.item.video.enablePlayButton,
  videoPlay: optionsMap.behaviourParams.item.video.playTrigger,
  videoLoop: optionsMap.behaviourParams.item.video.loop,
  showVideoControls: optionsMap.behaviourParams.item.video.enableControls,
  videoSound: optionsMap.behaviourParams.item.video.volume,
  enableVideoPlaceholder:
    optionsMap.behaviourParams.item.video.enablePlaceholder,
  //----overlay
  hoveringBehaviour: optionsMap.behaviourParams.item.overlay.hoveringBehaviour,
  overlayAnimation: optionsMap.behaviourParams.item.overlay.hoverAnimation,
  overlayPosition: optionsMap.behaviourParams.item.overlay.position,
  overlaySize: optionsMap.behaviourParams.item.overlay.size,
  overlaySizeType: optionsMap.behaviourParams.item.overlay.sizeUnits,
  overlayPadding: optionsMap.behaviourParams.item.overlay.padding,
  //----content
  imageHoverAnimation: optionsMap.behaviourParams.item.content.hoverAnimation,
  imagePlacementAnimation:
    optionsMap.behaviourParams.item.content.placementAnimation,
  imageLoadingMode: optionsMap.behaviourParams.item.content.loader,
  //gallery
  scrollSnap: optionsMap.behaviourParams.gallery.horizontal.enableScrollSnap,
  isRTL: optionsMap.behaviourParams.gallery.layoutDirection, // changes from boolean to an enum (refactor)
  // allowLeanGallery: optionsMap.behaviourParams.gallery.enableLeanGallery', //think about removing this!
  allowContextMenu: optionsMap.behaviourParams.gallery.disableContextMenu, //REFACTOR reverse
  scrollAnimation: optionsMap.behaviourParams.gallery.scrollAnimation,
  shouldIndexDirectShareLinkInSEO:
    optionsMap.behaviourParams.gallery.enableIndexingShareLinks,
  //----vertical
  //--------loadMore
  enableInfiniteScroll:
    optionsMap.behaviourParams.gallery.vertical.loadMore.enable,
  loadMoreAmount: optionsMap.behaviourParams.gallery.vertical.loadMore.amount,
  loadMoreButtonText: optionsMap.behaviourParams.gallery.vertical.loadMore.text,

  //----horizontal
  slideAnimation: optionsMap.behaviourParams.gallery.horizontal.slideAnimation,
  slideTransition:
    optionsMap.behaviourParams.gallery.horizontal.slideTransition,
  enableScroll: optionsMap.behaviourParams.gallery.horizontal.blockScroll, //requires a reversal! (blocks instead of allowing),
  scrollDuration:
    optionsMap.behaviourParams.gallery.horizontal.navigationDuration,
  slideshowLoop: optionsMap.behaviourParams.gallery.horizontal.loop,
  //--------Auto Slide
  autoSlideshowInterval:
    optionsMap.behaviourParams.gallery.horizontal.autoSlide.interval,
  isAutoSlideshow: 'behaviourParams_gallery_horizontal_autoSlide_enable',
  pauseAutoSlideshowOnHover:
    optionsMap.behaviourParams.gallery.horizontal.autoSlide.pauseOnHover,
  autoSlideshowType: 'behaviourParams_gallery_horizontal_autoSlide_type',
  autoSlideshowContinuousSpeed:
    optionsMap.behaviourParams.gallery.horizontal.autoSlide.continuous_speed,

  //--------SlideshowInfo
  galleryTextAlign:
    optionsMap.behaviourParams.gallery.horizontal.slideshowInfo
      .buttonsAlignment, //think if slideshow is under horizontal or is a separate thing
  allowSlideshowCounter:
    optionsMap.behaviourParams.gallery.horizontal.slideshowInfo.enableCounter,
  playButtonForAutoSlideShow:
    optionsMap.behaviourParams.gallery.horizontal.slideshowInfo
      .enablePlayButton,
};

const stylingParams = {
  arrowsColor: optionsMap.stylingParams.arrowsColor,
  itemShadowBlur: optionsMap.stylingParams.itemShadowBlur,
  itemShadowDirection: optionsMap.stylingParams.itemShadowDirection,
  itemShadowOpacityAndColor: optionsMap.stylingParams.itemShadowOpacityAndColor,
  itemShadowSize: optionsMap.stylingParams.itemShadowSize,
  itemEnableShadow: optionsMap.stylingParams.itemEnableShadow,
  itemBorderRadius: optionsMap.stylingParams.itemBorderRadius,
  itemBorderWidth: optionsMap.stylingParams.itemBorderWidth,
};

function addMigratedOptions(options) {
  let migrated = migrateOptions(options);
  let combinedOptions = mergeNestedObjects(migrated, options);
  delete combinedOptions.oldRefactoredOptionInCore;
  return combinedOptions;
}

function migrateOptions(oldStyles) {
  let newStyles = { ...oldStyles };
  //naming
  newStyles = changeNames(newStyles, [
    ['imageMargin', optionsMap.layoutParams.itemSpacing],
    ['cubeType', optionsMap.layoutParams.cropMethod], //Must get its own function o unite with the rotating!
    //rotatingCropRatios + cropType//TODO!
    ['cubeImages', optionsMap.layoutParams.enableCrop],
    ['smartCrop', optionsMap.layoutParams.enableSmartCrop],
    ['minItemSize', optionsMap.layoutParams.minItemSize],
    ['cropOnlyFill', optionsMap.layoutParams.cropOnlyFill],
    ['slideshowInfoSize', optionsMap.layoutParams.slideshowInfoSize],
    ['scatter', optionsMap.layoutParams.scatter.randomScatter],
    ['rotatingScatter', optionsMap.layoutParams.scatter.manualScatter],
    ['isSlideshow', optionsMap.layoutParams.isSlideshow],
    ['isGrid', optionsMap.layoutParams.isGrid],
    ['isMasonry', optionsMap.layoutParams.isMasonry],
    ['isSlider', optionsMap.layoutParams.isSlider],
    ['isColumns', optionsMap.layoutParams.isColumns],
    ['numberOfImagesPerCol', optionsMap.layoutParams.numberOfRows],
    ['columnWidths', optionsMap.layoutParams.columnRatios],
    //['collageAmount', optionsMap.layoutParams.collage.amount], //This doesnt really exist. need to eradicate as a refactor
    ['collageDensity', optionsMap.layoutParams.collage.density],
    ['chooseBestGroup', optionsMap.layoutParams.collage.groupByOrientation],
    ['groupSize', optionsMap.layoutParams.collage.groupSize],
    ['hasThumbnails', optionsMap.layoutParams.thumbnails.enable],
    ['thumbnailSpacings', optionsMap.layoutParams.thumbnails.spacing],
    ['thumbnailSize', optionsMap.layoutParams.thumbnails.size],
    ['showArrows', optionsMap.layoutParams.navigationArrows.enable],
    ['arrowsPadding', optionsMap.layoutParams.navigationArrows.padding],
    [
      'arrowsVerticalPosition',
      optionsMap.layoutParams.navigationArrows.verticalAlignment,
    ],
    ['arrowsSize', optionsMap.layoutParams.navigationArrows.size],
    ['arrowsPosition', optionsMap.layoutParams.navigationArrows.position],

    [
      'calculateTextBoxWidthMode',
      optionsMap.layoutParams.info.sizeCalculationMode,
    ],
    ['textBoxHeight', optionsMap.layoutParams.info.height],
    ['textBoxWidth', optionsMap.layoutParams.info.width],
    //['textBoxWidthPercent', optionsMap.layoutParams.info.widthByPercent],
    ['textImageSpace', optionsMap.layoutParams.info.spacing],
    ['imageInfoType', optionsMap.layoutParams.info.backgroundMode],
    ['textBoxBorderWidth', optionsMap.layoutParams.info.border.width],
    ['textBoxBorderColor', optionsMap.layoutParams.info.border.color],
    ['textBoxBorderRadius', optionsMap.layoutParams.info.border.radius],
    ['gallerySize', optionsMap.layoutParams.targetItemSize.smart],
    ['gallerySizePx', optionsMap.layoutParams.targetItemSize.pixel],
    ['gallerySizeRatio', optionsMap.layoutParams.targetItemSize.percent],
  ]);
  newStyles = reverseBooleans(newStyles, [
    ['useMaxDimensions', optionsMap.layoutParams.enableStreching],
  ]);
  newStyles = processThumbnailAlignment(newStyles);
  newStyles = processScrollDirection(newStyles);
  newStyles = processLayoutOrientation(newStyles);
  newStyles = processForceGroupsOrder(newStyles);
  newStyles = processGroupTypes(newStyles);
  newStyles = processNumberOfColumns(newStyles); // fixedColumns || numberOfImagesPerRow || numberOfGroupsPerRow (notice its losing if its 0)
  newStyles = processInfoBackgroundMode(newStyles);
  newStyles = processtargetItemSizeMode(newStyles);
  newStyles = processCroppedAlignment(newStyles);
  newStyles = processCropRatio(newStyles);

  ///-----------BEHAVIOUR -------------///
  newStyles = changeNames(newStyles, [
    ['videoLoop', optionsMap.behaviourParams.item.video.loop],
    ['showVideoControls', optionsMap.behaviourParams.item.video.enableControls],
    [
      'enableVideoPlaceholder',
      optionsMap.behaviourParams.item.video.enablePlaceholder,
    ],
    [
      'overlayAnimation',
      optionsMap.behaviourParams.item.overlay.hoverAnimation,
    ],
    ['overlayPosition', optionsMap.behaviourParams.item.overlay.position],
    ['overlaySize', optionsMap.behaviourParams.item.overlay.size],
    ['overlaySizeType', optionsMap.behaviourParams.item.overlay.sizeUnits],
    ['overlayPadding', optionsMap.behaviourParams.item.overlay.padding],
    [
      'imageHoverAnimation',
      optionsMap.behaviourParams.item.content.hoverAnimation,
    ],
    [
      'imagePlacementAnimation',
      optionsMap.behaviourParams.item.content.placementAnimation,
    ],
    ['imageLoadingMode', optionsMap.behaviourParams.item.content.loader],
    [
      'scrollSnap',
      optionsMap.behaviourParams.gallery.horizontal.enableScrollSnap,
    ],
    ['scrollAnimation', optionsMap.behaviourParams.gallery.scrollAnimation],
    [
      'shouldIndexDirectShareLinkInSEO',
      optionsMap.behaviourParams.gallery.enableIndexingShareLinks,
    ],
    [
      'loadMoreButtonText',
      optionsMap.behaviourParams.gallery.vertical.loadMore.text,
    ],
    [
      'slideAnimation',
      optionsMap.behaviourParams.gallery.horizontal.slideAnimation,
    ],
    [
      'slideTransition',
      optionsMap.behaviourParams.gallery.horizontal.slideTransition,
    ],
    [
      'scrollDuration',
      optionsMap.behaviourParams.gallery.horizontal.navigationDuration,
    ], //This might need to move to navigationArrows in layoutParams.
    ['slideshowLoop', optionsMap.behaviourParams.gallery.horizontal.loop],
    [
      'autoSlideshowInterval',
      optionsMap.behaviourParams.gallery.horizontal.autoSlide.interval,
    ],
    [
      'pauseAutoSlideshowOnHover',
      optionsMap.behaviourParams.gallery.horizontal.autoSlide.pauseOnHover,
    ],
    [
      'autoSlideshowContinuousSpeed',
      optionsMap.behaviourParams.gallery.horizontal.autoSlide.speed,
    ],
    [
      'galleryTextAlign',
      optionsMap.behaviourParams.gallery.horizontal.slideshowInfo
        .buttonsAlignment,
    ], //think if slideshow is under horizontal or is a separate thing
    [
      'allowSlideshowCounter',
      optionsMap.behaviourParams.gallery.horizontal.slideshowInfo.enableCounter,
    ],
    [
      'playButtonForAutoSlideShow',
      optionsMap.behaviourParams.gallery.horizontal.slideshowInfo
        .enablePlayButton,
    ],
  ]);
  newStyles = reverseBooleans(newStyles, [
    [
      'enableInfiniteScroll',
      optionsMap.behaviourParams.gallery.vertical.loadMore.enable,
    ],
    ['allowContextMenu', optionsMap.behaviourParams.gallery.disableContextMenu],
    ['hidePlay', optionsMap.behaviourParams.item.video.enablePlayButton],
    ['enableScroll', optionsMap.behaviourParams.gallery.horizontal.blockScroll], //requires a reversal! (blocks instead of allowing),
  ]);
  newStyles = processClickAction(newStyles);
  newStyles = processVideoPlayTrigger(newStyles);
  newStyles = processVideoVolume(newStyles);
  newStyles = processVideoSpeed(newStyles);
  newStyles = processOverlayHoveringBehaviour(newStyles);
  newStyles = processInfoPlacement(newStyles);
  newStyles = processlayoutDirection(newStyles);
  newStyles = processLoadMoreAmount(newStyles);
  newStyles = processAutoSlideBehaviour(newStyles);

  newStyles = changeNames(newStyles, [
    ['itemShadowBlur', optionsMap.stylingParams.itemShadowBlur],
    ['itemShadowDirection', optionsMap.stylingParams.itemShadowDirection],
    [
      'itemShadowOpacityAndColor',
      optionsMap.stylingParams.itemShadowOpacityAndColor,
    ],
    ['arrowsColor', optionsMap.stylingParams.arrowsColor],
    ['itemShadowSize', optionsMap.stylingParams.itemShadowSize],
    ['itemEnableShadow', optionsMap.stylingParams.itemEnableShadow],
    ['itemBorderRadius', optionsMap.stylingParams.itemBorderRadius],
    ['itemBorderWidth', optionsMap.stylingParams.itemBorderWidth],
  ]);

  delete newStyles.textBoxWidthPercent;
  delete newStyles.enableLeanGallery;
  delete newStyles.fullscreen;
  delete newStyles.magicLayoutSeed;
  delete newStyles.gridStyle;
  return newStyles;
}
//---------tooling---------//
function changeNames(obj, pairsArray) {
  let _obj = { ...obj };
  for (const [oldName, newName] of pairsArray) {
    _obj = namingChange(_obj, oldName, newName);
  }
  return _obj;
}
function reverseBooleans(obj, pairsArray) {
  let _obj = { ...obj };
  for (const [oldName, newName] of pairsArray) {
    _obj = reverseBooleanTo(_obj, oldName, newName);
  }
  return _obj;
}
function namingChange(obj, oldName, newName) {
  let val = obj[oldName];
  delete obj[oldName];
  return (
    (typeof val !== 'undefined' &&
      typeof getByString(obj, newName) === 'undefined' &&
      assignByString(obj, newName, val)) ||
    obj
  ); //dont overwrite existing property
}
function reverseBooleanTo(obj, oldName, newName) {
  let val = !obj[oldName];
  delete obj[oldName];
  return assignByString(obj, newName, val);
}

//----- refactor functions ----------//
function processThumbnailAlignment(obj) {
  //['galleryThumbnailsAlignment', optionsMap.layoutParams.thumbnails.alignment'],
  let _obj = { ...obj };
  _obj = namingChange(
    _obj,
    'galleryThumbnailsAlignment',
    optionsMap.layoutParams.thumbnails.alignment
  );
  _obj.layoutParams.thumbnails.alignment =
    _obj.layoutParams.thumbnails.alignment?.toUpperCase();
  return _obj;
}
function processVideoPlayTrigger(obj) {
  let _obj = { ...obj };
  _obj = namingChange(
    _obj,
    'videoPlay',
    optionsMap.behaviourParams.item.video.playTrigger
  );
  _obj.behaviourParams.item.video.playTrigger =
    _obj.behaviourParams.item.video.playTrigger?.toUpperCase();
  return _obj;
}
function processtargetItemSizeMode(obj) {
  let _obj = { ...obj };
  _obj = namingChange(
    _obj,
    'gallerySizeType',
    optionsMap.layoutParams.targetItemSize.mode
  );
  _obj.layoutParams.targetItemSize.mode =
    _obj.layoutParams.targetItemSize.mode?.toUpperCase();
  return _obj;
}
function processVideoVolume(obj) {
  let _obj = { ...obj };
  _obj = namingChange(
    _obj,
    'videoSound',
    optionsMap.behaviourParams.item.video.volume
  );
  _obj.behaviourParams.item.video.volume = _obj.behaviourParams.item.video
    .volume
    ? _obj.behaviourParams.item.video.volume
    : 0;
  return _obj;
}
function processVideoSpeed(obj) {
  let _obj = { ...obj };
  _obj = namingChange(
    _obj,
    'videoSpeed',
    optionsMap.behaviourParams.item.video.speed
  );
  _obj.behaviourParams.item.video.volume = Number(
    _obj.behaviourParams.item.video.volume
  );
  return _obj;
}
function processScrollDirection(obj) {
  let _obj = { ...obj };
  _obj = namingChange(
    _obj,
    'scrollDirection',
    optionsMap.layoutParams.scrollDirection
  );
  switch (_obj.layoutParams.scrollDirection) {
    case 0:
      _obj.layoutParams.scrollDirection = 'VERTICAL';
      break;
    case 1:
      _obj.layoutParams.scrollDirection = 'HORIZONTAL';
      break;
    default:
      break;
  }
  return _obj;
}
function processlayoutDirection(obj) {
  let _obj = { ...obj };
  _obj = namingChange(
    _obj,
    'isRTL',
    optionsMap.behaviourParams.gallery.layoutDirection
  );
  switch (_obj.behaviourParams.gallery.layoutDirection) {
    case true:
      _obj.behaviourParams.gallery.layoutDirection = 'RIGHT_TO_LEFT';
      break;
    case false:
      _obj.behaviourParams.gallery.layoutDirection = 'LEFT_TO_RIGHT';
      break;
    default:
      break;
  }
  return _obj;
}
function processLayoutOrientation(obj) {
  let _obj = { ...obj };
  _obj = namingChange(
    _obj,
    'isVertical',
    optionsMap.layoutParams.layoutOrientation
  );
  switch (_obj.layoutParams.layoutOrientation) {
    case true:
      _obj.layoutParams.layoutOrientation = 'VERTICAL';
      break;
    case false:
      _obj.layoutParams.layoutOrientation = 'HORIZONTAL';
      break;
    default:
      break;
  }
  return _obj;
}
function processForceGroupsOrder(obj) {
  let _obj = { ...obj };
  _obj = namingChange(
    _obj,
    'placeGroupsLtr',
    optionsMap.layoutParams.forceGroupsOrder
  );
  switch (_obj.layoutParams.forceGroupsOrder) {
    case true:
      _obj.layoutParams.forceGroupsOrder = 'LEFT_TO_RIGHT';
      break;
    case false:
      _obj.layoutParams.forceGroupsOrder = 'BY_COLUMNS';
      break;
    default:
      break;
  }
  // 'RIGHT_TO_LEFT' doesnt exist yet.
  return _obj;
}
function processLoadMoreAmount(obj) {
  let _obj = { ...obj };
  _obj = namingChange(
    _obj,
    'loadMoreAmount',
    optionsMap.behaviourParams.gallery.vertical.loadMore.amount
  );
  _obj.behaviourParams.gallery.vertical.loadMore.amount =
    _obj.behaviourParams.gallery.vertical.loadMore.amount?.toUpperCase();
  return _obj;
}
function processCroppedAlignment(obj) {
  let _obj = { ...obj };
  _obj = namingChange(
    _obj,
    'cubeFitPosition',
    optionsMap.layoutParams.croppedAlignment
  );
  switch (_obj.layoutParams.croppedAlignment) {
    case 'MIDDLE':
      _obj.layoutParams.croppedAlignment = 'CENTER';
      break;
    default:
      break;
  }
  return _obj;
}
function processInfoBackgroundMode(obj) {
  let _obj = { ...obj };
  _obj = namingChange(
    _obj,
    'imageInfoType',
    optionsMap.layoutParams.info.backgroundMode
  );
  switch (_obj.layoutParams.info.backgroundMode) {
    case 'DONT_SHOW':
      _obj.layoutParams.info.backgroundMode = 'NO_BACKGROUND';
      break;
    default:
      break;
  }
  return _obj;
}
function processOverlayHoveringBehaviour(obj) {
  let _obj = { ...obj };
  _obj = namingChange(
    _obj,
    'hoveringBehaviour',
    optionsMap.behaviourParams.item.overlay.hoveringBehaviour
  );
  switch (_obj.behaviourParams.item.overlay.hoveringBehaviour) {
    case 'NO_CHANGE':
      _obj.behaviourParams.item.overlay.hoveringBehaviour = 'ALWAYS_VISIBLE';
      break;
    case 'NEVER_SHOW':
      _obj.behaviourParams.item.overlay.hoveringBehaviour = 'NEVER_VISIBLE';
      break;
    default:
      break;
  }
  return _obj;
}
function processInfoPlacement(obj) {
  let _obj = { ...obj };
  _obj = namingChange(
    _obj,
    'titlePlacement',
    optionsMap.layoutParams.info.placement
  );
  switch (_obj.layoutParams.info.placement) {
    case 'SHOW_ON_HOVER':
      _obj.layoutParams.info.placement = 'OVERLAY';
      break;
    case 'SHOW_BELOW':
      _obj.layoutParams.info.placement = 'BELOW';
      break;
    case 'SHOW_ABOVE':
      _obj.layoutParams.info.placement = 'ABOVE';
      break;
    case 'SHOW_ON_THE_RIGHT':
      _obj.layoutParams.info.placement = 'RIGHT';
      break;
    case 'SHOW_ON_THE_LEFT':
      _obj.layoutParams.info.placement = 'LEFT';
      break;
    case 'ALTERNATE_HORIZONTAL':
      _obj.layoutParams.info.placement = 'ALTERNATE_HORIZONTALLY';
      break;
    case 'ALTERNATE_VERTICAL':
      _obj.layoutParams.info.placement = 'ALTERNATE_VERTICALLY';
      break;
    default:
      break;
  }
  return _obj;
}
function processClickAction(obj) {
  let _obj = { ...obj };
  _obj = namingChange(
    _obj,
    'itemClick',
    optionsMap.behaviourParams.item.clickAction
  );
  _obj.behaviourParams.item.clickAction =
    _obj.behaviourParams.item.clickAction.toUpperCase();
  switch (_obj.behaviourParams.item.clickAction) {
    case 'FULLSCREEN':
    case 'EXPAND':
      _obj.behaviourParams.item.clickAction = 'ACTION';
      break;
    default:
      break;
  }
  return _obj;
}
function processAutoSlideBehaviour(obj) {
  let _obj = { ...obj };
  let isAutoSlide = _obj.isAutoSlideshow;
  let autoSlideshowType = _obj.autoSlideshowType;
  let finalVal;
  if (!isAutoSlide) {
    finalVal = 'OFF';
  } else {
    if (autoSlideshowType === 'interval') {
      finalVal = 'INTERVAL';
    } else {
      finalVal = 'CONTINUOUS';
    }
  }
  _obj = assignByString(
    _obj,
    optionsMap.behaviourParams.gallery.horizontal.autoSlide.behaviour,
    finalVal
  );
  delete _obj.isAutoSlideshow;
  delete _obj.autoSlideshowType;
  return _obj;
}
function processCropRatio(obj) {
  let _obj = { ...obj };
  //['groupTypes', optionsMap.layoutParams.collage.groupTypes'], //Need to change this to incorporate rotatingGroupTypes //change the 'Types'?
  let repeatingVal = obj.rotatingCropRatios;
  let val = obj.cubeRatio || obj.layoutParams?.cropRatio;

  let finalVal;
  if (typeof repeatingVal === 'string' && repeatingVal !== '') {
    finalVal = repeatingVal;
  } else {
    finalVal = val;
  }
  _obj.layoutParams.cropRatio = finalVal;
  delete _obj.cropRatio;
  delete _obj.rotatingCropRatios;
  return _obj;
}
function processGroupTypes(obj) {
  let _obj = { ...obj };
  //['groupTypes', optionsMap.layoutParams.collage.groupTypes'], //Need to change this to incorporate rotatingGroupTypes //change the 'Types'?
  let repeatingVal =
    obj.rotatingGroupTypes || obj.layoutParams?.repeatingGroupTypes;
  let val = obj.groupTypes;
  let finalVal;
  if (typeof repeatingVal === 'string' && repeatingVal !== '') {
    finalVal = repeatingVal;
  } else {
    finalVal = val;
  }
  _obj.layoutParams.groupTypes = finalVal;
  delete _obj.layoutParams.repeatingGroupTypes;
  delete _obj.groupTypes;
  delete _obj.repeatingGroupTypes;
  return _obj;
}

function processNumberOfColumns(obj) {
  let _obj = { ...obj };
  let fixedColumns = obj.fixedColumns;
  let numberOfImagesPerRow = obj.numberOfImagesPerRow;
  let numberOfGroupsPerRow = obj.groupsPerStrip;
  let finalVal = fixedColumns || numberOfImagesPerRow || numberOfGroupsPerRow;

  _obj.layoutParams.numberOfColumns = finalVal;
  delete _obj.fixedColumns;
  delete _obj.numberOfImagesPerRow;
  delete _obj.groupsPerStrip;
  return _obj;
}

export {
  convertOptions,
  convertOptionsBackwards,
  migrateOptions,
  addMigratedOptions,
  layoutParamsMap,
};
