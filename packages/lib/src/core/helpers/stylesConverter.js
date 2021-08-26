import { assignByString, getByString } from './stylesUtils';
import styleParamsMap from './styleParamsMap';

function convertStyles(initialStyles) {
  //This will add the new names while keeping the old ones.
  let styles = { ...initialStyles };
  Object.keys(initialStyles).forEach((key) => {
    styles[layoutParamsMap[key]] = initialStyles[key];
  });
  Object.keys(initialStyles).forEach((key) => {
    styles[behaviourParams[key]] = initialStyles[key];
  });
  Object.keys(initialStyles).forEach((key) => {
    styles[stylingParams[key]] = initialStyles[key];
  });
  return styles;
}

function convertStylesBackwards(initialStyles) {
  //This will add the old names while keeping the new ones.
  let styles = { ...initialStyles };
  Object.keys(layoutParamsMap).forEach((key) => {
    if (typeof initialStyles[layoutParamsMap[key]] !== 'undefined') {
      styles[key] = initialStyles[layoutParamsMap[key]];
    }
  });
  Object.keys(behaviourParams).forEach((key) => {
    if (typeof initialStyles[behaviourParams[key]] !== 'undefined') {
      styles[key] = initialStyles[behaviourParams[key]];
    }
  });
  Object.keys(stylingParams).forEach((key) => {
    if (typeof initialStyles[stylingParams[key]] !== 'undefined') {
      styles[key] = initialStyles[stylingParams[key]];
    }
  });
  return styles;
}

const layoutParamsMap = {
  //done
  galleryMargin: styleParamsMap.layoutParams.gallerySpacing, //done
  groupsPerStrip: styleParamsMap.layoutParams.numberOfGroupsPerRow, //done
  columnWidths: styleParamsMap.layoutParams.columnRatios,
  cubeFitPosition: styleParamsMap.layoutParams.croppedAlignment,
  //Are all of the following content keys? so they could go into layoutParams_content_
  cubeRatio: styleParamsMap.layoutParams.cropRatio, //done
  cubeType: styleParamsMap.layoutParams.cropMethod,
  cubeImages: styleParamsMap.layoutParams.enableCrop,
  useMaxDimensions: styleParamsMap.layoutParams.enableStreching, //naming???
  rotatingCropRatios: styleParamsMap.layoutParams.repeatingCropRatios,
  smartCrop: styleParamsMap.layoutParams.enableSmartCrop,
  minItemSize: styleParamsMap.layoutParams.minItemSize,
  cropOnlyFill: styleParamsMap.layoutParams.cropOnlyFill, //????????????????

  imageMargin: styleParamsMap.layoutParams.itemSpacing,
  placeGroupsLtr: styleParamsMap.layoutParams.forceGroupsOrder, //REFACTOR - LEFT_TO_RIGHT, RIGHT_TO_LEFT
  rotatingGroupTypes: styleParamsMap.layoutParams.repeatingGroupTypes,

  slideshowInfoSize: styleParamsMap.layoutParams.slideshowInfoSize,

  //is is is?
  isSlideshow: styleParamsMap.layoutParams.isSlideshow,
  isGrid: styleParamsMap.layoutParams.isGrid,
  isMasonry: styleParamsMap.layoutParams.isMasonry,
  isSlider: styleParamsMap.layoutParams.isSlider,
  isColumns: styleParamsMap.layoutParams.isColumns,
  //targetItemSize
  gallerySize: styleParamsMap.layoutParams.targetItemSize.smart,
  gallerySizePx: styleParamsMap.layoutParams.targetItemSize.pixel,
  gallerySizeRatio: styleParamsMap.layoutParams.targetItemSize.percent,
  gallerySizeType: styleParamsMap.layoutParams.targetItemSize.mode,
  //bundle collage
  collageAmount: styleParamsMap.layoutParams.collage.amount, //????????????????
  collageDensity: styleParamsMap.layoutParams.collage.density,
  chooseBestGroup: styleParamsMap.layoutParams.collage.groupByOrientation,
  groupTypes: styleParamsMap.layoutParams.collage.groupTypes,
  groupSize: styleParamsMap.layoutParams.collage.groupSize,
  //bundle thumbnails
  hasThumbnails: styleParamsMap.layoutParams.thumbnails.enable,
  thumbnailSpacings: styleParamsMap.layoutParams.thumbnails.spacing,
  thumbnailSize: styleParamsMap.layoutParams.thumbnails.size,
  galleryThumbnailsAlignment: styleParamsMap.layoutParams.thumbnails.alignment,

  //bundle arrows
  showArrows: styleParamsMap.layoutParams.navigationArrows.enable,
  arrowsPadding: styleParamsMap.layoutParams.navigationArrows.padding,
  arrowsVerticalPosition:
    styleParamsMap.layoutParams.navigationArrows.verticalAlignment,
  arrowsSize: styleParamsMap.layoutParams.navigationArrows.size,
  arrowsPosition: styleParamsMap.layoutParams.navigationArrows.position,

  fixedColumns: styleParamsMap.layoutParams.fixedColumns, //????????????????

  scatter: styleParamsMap.layoutParams.scatter.randomScatter,
  rotatingScatter: styleParamsMap.layoutParams.scatter.manualScatter,
  scrollDirection: styleParamsMap.layoutParams.scrollDirection,

  isVertical: styleParamsMap.layoutParams.layoutOrientation, // This needs to be refactored to be an enum. but can wait

  //info
  calculateTextBoxWidthMode:
    styleParamsMap.layoutParams.info.sizeCalculationMode,
  textBoxHeight: styleParamsMap.layoutParams.info.height,
  textBoxWidth: styleParamsMap.layoutParams.info.width,
  // textBoxWidthPercent: styleParamsMap.layoutParams.info.widthByPercent,
  textImageSpace: styleParamsMap.layoutParams.info.spacing,
  titlePlacement: styleParamsMap.layoutParams.info.placement,
  //----------border
  textBoxBorderColor: styleParamsMap.layoutParams.info.border.color,
  textBoxBorderRadius: styleParamsMap.layoutParams.info.border.radius,
  textBoxBorderWidth: styleParamsMap.layoutParams.info.border.width,

  externalInfoHeight: styleParamsMap.layoutParams.externalInfoHeight, //layouter API
  externalInfoWidth: styleParamsMap.layoutParams.externalInfoWidth, //layouter API
  targetItemSize: styleParamsMap.layoutParams.targetItemSize, //layouter API
};

const behaviourParams = {
  //item
  itemClick: styleParamsMap.behaviourParams.item.clickAction, //possible refactor (join fullscreen, expand into one 'action')
  //----video
  videoSpeed: styleParamsMap.behaviourParams.item.video.speed,
  hidePlay: styleParamsMap.behaviourParams.item.video.enablePlayButton,
  videoPlay: styleParamsMap.behaviourParams.item.video.playTrigger,
  videoLoop: styleParamsMap.behaviourParams.item.video.loop,
  showVideoControls: styleParamsMap.behaviourParams.item.video.enableControls,
  videoSound: styleParamsMap.behaviourParams.item.video.volume,
  enableVideoPlaceholder:
    styleParamsMap.behaviourParams.item.video.enablePlaceholder,
  //----overlay
  hoveringBehaviour:
    styleParamsMap.behaviourParams.item.overlay.hoveringBehaviour,
  overlayAnimation: styleParamsMap.behaviourParams.item.overlay.hoverAnimation,
  overlayPosition: styleParamsMap.behaviourParams.item.overlay.position,
  overlaySize: styleParamsMap.behaviourParams.item.overlay.size,
  overlaySizeType: styleParamsMap.behaviourParams.item.overlay.sizeUnits,
  overlayPadding: styleParamsMap.behaviourParams.item.overlay.padding,
  //----content
  imageHoverAnimation:
    styleParamsMap.behaviourParams.item.content.hoverAnimation,
  imagePlacementAnimation:
    styleParamsMap.behaviourParams.item.content.placementAnimation,
  imageLoadingMode: styleParamsMap.behaviourParams.item.content.loader,
  //gallery
  scrollSnap: 'behaviourParams_gallery_enableScrollSnap',
  isRTL: 'behaviourParams_gallery_layoutDirection', // changes from boolean to an enum (refactor)
  // allowLeanGallery: 'behaviourParams_gallery_enableLeanGallery', //think about removing this!
  allowContextMenu: 'behaviourParams_gallery_disableContextMenu', //REFACTOR reverse
  scrollAnimation: 'behaviourParams_gallery_scrollAnimation',
  shouldIndexDirectShareLinkInSEO:
    'behaviourParams_gallery_enableIndexingShareLinks',
  //----vertical
  //--------loadMore
  enableInfiniteScroll:
    styleParamsMap.behaviourParams.gallery.vertical.loadMore.enable,
  loadMoreAmount:
    styleParamsMap.behaviourParams.gallery.vertical.loadMore.amount,
  loadMoreButtonText:
    styleParamsMap.behaviourParams.gallery.vertical.loadMore.text,

  //----horizontal
  slideAnimation: 'behaviourParams_gallery_horizontal_slideAnimation',
  slideTransition: 'behaviourParams_gallery_horizontal_slideTransition',
  enableScroll: 'behaviourParams_gallery_horizontal_blockScroll', //requires a reversal! (blocks instead of allowing),
  scrollDuration: 'behaviourParams_gallery_horizontal_navigationDuration',
  slideshowLoop: 'behaviourParams_gallery_horizontal_enableLoop',
  //--------Auto Slide
  autoSlideshowInterval:
    'behaviourParams_gallery_horizontal_autoSlide_interval',
  isAutoSlideshow: 'behaviourParams_gallery_horizontal_autoSlide_enable',
  pauseAutoSlideshowOnHover:
    'behaviourParams_gallery_horizontal_autoSlide_pauseOnHover',
  autoSlideshowType: 'behaviourParams_gallery_horizontal_autoSlide_type',
  autoSlideshowContinuousSpeed:
    'behaviourParams_gallery_horizontal_autoSlide_continuous_speed',

  //--------SlideshowInfo
  galleryTextAlign:
    'behaviourParams_gallery_horizontal_slideshowInfo_buttonsAlignment', //think if slideshow is under horizontal or is a separate thing
  allowSlideshowCounter:
    'behaviourParams_gallery_horizontal_slideshowInfo_enableCounter',
  playButtonForAutoSlideShow:
    'behaviourParams_gallery_horizontal_slideshowInfo_enablePlayButton',
};

const stylingParams = {
  arrowsColor: 'stylingParams_arrowsColor',
  itemShadowBlur: 'stylingParams_itemShadowBlur',
  itemShadowDirection: 'stylingParams_itemShadowDirection',
  itemShadowOpacityAndColor: 'stylingParams_itemShadowOpacityAndColor',
  itemShadowSize: 'stylingParams_itemShadowSize',
  itemEnableShadow: 'stylingParams_itemEnableShadow',
  itemBorderRadius: 'stylingParams_itemBorderRadius',
  itemBorderWidth: 'stylingParams_itemBorderWidth',
};

function migrateStyles(oldStyles) {
  let newStyles = { ...oldStyles };
  //naming
  newStyles = changeNames(newStyles, [
    ['imageMargin', styleParamsMap.layoutParams.itemSpacing],
    ['cubeType', styleParamsMap.layoutParams.cropMethod], //Must get its own function o unite with the rotating!
    //rotatingCropRatios + cropType//TODO!
    ['cubeImages', styleParamsMap.layoutParams.enableCrop],
    ['smartCrop', styleParamsMap.layoutParams.enableSmartCrop],
    ['minItemSize', styleParamsMap.layoutParams.minItemSize],
    ['cropOnlyFill', styleParamsMap.layoutParams.cropOnlyFill],
    ['slideshowInfoSize', styleParamsMap.layoutParams.slideshowInfoSize],
    ['scatter', styleParamsMap.layoutParams.scatter.randomScatter],
    ['rotatingScatter', styleParamsMap.layoutParams.scatter.manualScatter],
    ['isSlideshow', styleParamsMap.layoutParams.isSlideshow],
    ['isGrid', styleParamsMap.layoutParams.isGrid],
    ['isMasonry', styleParamsMap.layoutParams.isMasonry],
    ['isSlider', styleParamsMap.layoutParams.isSlider],
    ['isColumns', styleParamsMap.layoutParams.isColumns],
    ['numberOfImagesPerCol', styleParamsMap.layoutParams.numberOfRows],
    ['columnWidths', styleParamsMap.layoutParams.columnRatios],
    //['collageAmount', styleParamsMap.layoutParams.collage.amount], //This doesnt really exist. need to eradicate as a refactor
    ['collageDensity', styleParamsMap.layoutParams.collage.density],
    ['chooseBestGroup', styleParamsMap.layoutParams.collage.groupByOrientation],
    ['groupSize', styleParamsMap.layoutParams.collage.groupSize],
    ['hasThumbnails', styleParamsMap.layoutParams.thumbnails.enable],
    ['thumbnailSpacings', styleParamsMap.layoutParams.thumbnails.spacing],
    ['thumbnailSize', styleParamsMap.layoutParams.thumbnails.size],
    ['showArrows', styleParamsMap.layoutParams.navigationArrows.enable],
    ['arrowsPadding', styleParamsMap.layoutParams.navigationArrows.padding],
    [
      'arrowsVerticalPosition',
      styleParamsMap.layoutParams.navigationArrows.verticalAlignment,
    ],
    ['arrowsSize', styleParamsMap.layoutParams.navigationArrows.size],
    ['arrowsPosition', styleParamsMap.layoutParams.navigationArrows.position],

    [
      'calculateTextBoxWidthMode',
      styleParamsMap.layoutParams.info.sizeCalculationMode,
    ],
    ['textBoxHeight', styleParamsMap.layoutParams.info.height],
    ['textBoxWidth', styleParamsMap.layoutParams.info.width],
    //['textBoxWidthPercent', styleParamsMap.layoutParams.info.widthByPercent],
    ['textImageSpace', styleParamsMap.layoutParams.info.spacing],
    ['imageInfoType', styleParamsMap.layoutParams.info.backgroundMode],
    ['textBoxBorderWidth', styleParamsMap.layoutParams.info.border.width],
    ['textBoxBorderColor', styleParamsMap.layoutParams.info.border.color],
    ['textBoxBorderRadius', styleParamsMap.layoutParams.info.border.radius],
    ['gallerySize', styleParamsMap.layoutParams.targetItemSize.smart],
    ['gallerySizePx', styleParamsMap.layoutParams.targetItemSize.pixel],
    ['gallerySizeRatio', styleParamsMap.layoutParams.targetItemSize.percent],
  ]);
  newStyles = reverseBooleans(newStyles, [
    ['useMaxDimensions', styleParamsMap.layoutParams.enableStreching],
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
    ['videoLoop', 'behaviourParams_item_video_loop'],
    ['showVideoControls', 'behaviourParams_item_video_enableControls'],
    ['enableVideoPlaceholder', 'behaviourParams_item_video_enablePlaceholder'],
    [
      'overlayAnimation',
      styleParamsMap.behaviourParams.item.overlay.hoverAnimation,
    ],
    ['overlayPosition', styleParamsMap.behaviourParams.item.overlay.position],
    ['overlaySize', styleParamsMap.behaviourParams.item.overlay.size],
    ['overlaySizeType', styleParamsMap.behaviourParams.item.overlay.sizeUnits],
    ['overlayPadding', styleParamsMap.behaviourParams.item.overlay.padding],
    [
      'imageHoverAnimation',
      styleParamsMap.behaviourParams.item.content.hoverAnimation,
    ],
    [
      'imagePlacementAnimation',
      styleParamsMap.behaviourParams.item.content.placementAnimation,
    ],
    ['imageLoadingMode', styleParamsMap.behaviourParams.item.content.loader],
    ['scrollSnap', 'behaviourParams_gallery_horizontal_enableScrollSnap'],
    ['scrollAnimation', 'behaviourParams_gallery_scrollAnimation'],
    [
      'shouldIndexDirectShareLinkInSEO',
      'behaviourParams_gallery_enableIndexingShareLinks',
    ],
    [
      'loadMoreButtonText',
      styleParamsMap.behaviourParams.gallery.vertical.loadMore.text,
    ],
    ['slideAnimation', 'behaviourParams_gallery_horizontal_slideAnimation'],
    ['slideTransition', 'behaviourParams_gallery_horizontal_slideTransition'],
    ['scrollDuration', 'behaviourParams_gallery_horizontal_navigationDuration'], //This might need to move to navigationArrows in layoutParams.
    ['slideshowLoop', 'behaviourParams_gallery_horizontal_enableLoop'],
    [
      'autoSlideshowInterval',
      'behaviourParams_gallery_horizontal_autoSlide_interval',
    ],
    [
      'pauseAutoSlideshowOnHover',
      'behaviourParams_gallery_horizontal_autoSlide_pauseOnHover',
    ],
    [
      'autoSlideshowContinuousSpeed',
      'behaviourParams_gallery_horizontal_autoSlide_continuous_speed',
    ],
    [
      'galleryTextAlign',
      'behaviourParams_gallery_horizontal_slideshowInfo_buttonsAlignment',
    ], //think if slideshow is under horizontal or is a separate thing
    [
      'allowSlideshowCounter',
      'behaviourParams_gallery_horizontal_slideshowInfo_enableCounter',
    ],
    [
      'playButtonForAutoSlideShow',
      'behaviourParams_gallery_horizontal_slideshowInfo_enablePlayButton',
    ],
  ]);
  newStyles = reverseBooleans(newStyles, [
    [
      'enableInfiniteScroll',
      styleParamsMap.behaviourParams.gallery.vertical.loadMore.enable,
    ],
    ['allowContextMenu', 'behaviourParams_gallery_disableContextMenu'],
    ['hidePlay', 'behaviourParams_item_video_enablePlayButton'],
    ['enableScroll', 'behaviourParams_gallery_horizontal_blockScroll'], //requires a reversal! (blocks instead of allowing),
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
    ['itemShadowBlur', 'stylingParams_itemShadowBlur'],
    ['itemShadowDirection', 'stylingParams_itemShadowDirection'],
    ['itemShadowOpacityAndColor', 'stylingParams_itemShadowOpacityAndColor'],
    ['arrowsColor', 'stylingParams_arrowsColor'],
    ['itemShadowSize', 'stylingParams_itemShadowSize'],
    ['itemEnableShadow', 'stylingParams_itemEnableShadow'],
    ['itemBorderRadius', 'stylingParams_itemBorderRadius'],
    ['itemBorderWidth', 'stylingParams_itemBorderWidth'],
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
  //['galleryThumbnailsAlignment', styleParamsMap.layoutParams.thumbnails.alignment'],
  let _obj = { ...obj };
  _obj = namingChange(
    _obj,
    'galleryThumbnailsAlignment',
    styleParamsMap.layoutParams.thumbnails.alignment
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
    'behaviourParams_item_video_playTrigger'
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
    styleParamsMap.layoutParams.targetItemSize.mode
  );
  _obj.layoutParams.targetItemSize.mode =
    _obj.layoutParams.targetItemSize.mode?.toUpperCase();
  return _obj;
}
function processVideoVolume(obj) {
  let _obj = { ...obj };
  _obj = namingChange(_obj, 'videoSound', 'behaviourParams_item_video_volume');
  _obj.behaviourParams.item.video.volume = _obj.behaviourParams.item.video
    .volume
    ? _obj.behaviourParams.item.video.volume
    : 0;
  return _obj;
}
function processVideoSpeed(obj) {
  let _obj = { ...obj };
  _obj = namingChange(_obj, 'videoSpeed', 'behaviourParams_item_video_speed');
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
    styleParamsMap.layoutParams.scrollDirection
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
  _obj = namingChange(_obj, 'isRTL', 'behaviourParams_gallery_layoutDirection');
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
    styleParamsMap.layoutParams.layoutOrientation
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
    styleParamsMap.layoutParams.forceGroupsOrder
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
    styleParamsMap.behaviourParams.gallery.vertical.loadMore.amount
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
    styleParamsMap.layoutParams.croppedAlignment
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
    styleParamsMap.layoutParams.info.backgroundMode
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
    styleParamsMap.behaviourParams.item.overlay.hoveringBehaviour
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
    styleParamsMap.layoutParams.info.placement
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
  _obj = namingChange(_obj, 'itemClick', 'behaviourParams_item_clickAction');
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
    'behaviourParams_gallery_horizontal_autoSlide_behaviour',
    finalVal
  );
  delete _obj.isAutoSlideshow;
  delete _obj.autoSlideshowType;
  return _obj;
}
function processCropRatio(obj) {
  let _obj = { ...obj };
  //['groupTypes', styleParamsMap.layoutParams.collage.groupTypes'], //Need to change this to incorporate rotatingGroupTypes //change the 'Types'?
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
  //['groupTypes', styleParamsMap.layoutParams.collage.groupTypes'], //Need to change this to incorporate rotatingGroupTypes //change the 'Types'?
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
  convertStyles,
  convertStylesBackwards,
  migrateStyles,
  layoutParamsMap,
};
