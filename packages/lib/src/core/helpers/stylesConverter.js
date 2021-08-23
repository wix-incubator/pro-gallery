import { assignByString, getByString } from './stylesUtils';
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
  galleryMargin: 'layoutParams_gallerySpacing', //done
  groupsPerStrip: 'layoutParams_numberOfGroupsPerRow', //done

  //Are all of the following content keys? so they could go into layoutParams_content_
  cubeRatio: 'layoutParams_cropRatio', //done
  cubeType: 'layoutParams_cropMethod',
  cubeImages: 'layoutParams_enableCrop',
  useMaxDimensions: 'layoutParams_enableStreching', //naming???
  rotatingCropRatios: 'layoutParams_repeatingCropRatios',
  smartCrop: 'layoutParams_enableSmartCrop',
  minItemSize: 'layoutParams_minItemSize',
  cropOnlyFill: 'layoutParams_cropOnlyFill', //????????????????

  imageMargin: 'layoutParams_itemSpacing',
  placeGroupsLtr: 'layoutParams_groupsOrder', //REFACTOR - LEFT_TO_RIGHT, RIGHT_TO_LEFT
  rotatingGroupTypes: 'layoutParams_repeatingGroupTypes',

  slideshowInfoSize: 'layoutParams_slideshowInfoSize',

  //is is is?
  isSlideshow: 'layoutParams_isSlideshow',
  isGrid: 'layoutParams_isGrid',
  isMasonry: 'layoutParams_isMasonry',
  isSlider: 'layoutParams_isSlider',
  isColumns: 'layoutParams_isColumns',
  //bundle collage
  collageAmount: 'layoutParams_collage_amount',
  collageDensity: 'layoutParams_collage_density',
  chooseBestGroup: 'layoutParams_collage_groupByOrientation',
  groupTypes: 'layoutParams_collage_groupTypes',
  groupSize: 'layoutParams_collage_groupSize',
  //bundle thumbnails
  hasThumbnails: 'layoutParams_thumbnails_enable',
  thumbnailSpacings: 'layoutParams_thumbnails_spacing',
  thumbnailSize: 'layoutParams_thumbnails_size',
  galleryThumbnailsAlignment: 'layoutParams_thumbnails_alignment',

  //bundle arrows
  showArrows: 'layoutParams_navigationArrows_enable',
  arrowsPadding: 'layoutParams_navigationArrows_padding',
  arrowsVerticalPosition: 'layoutParams_navigationArrows_verticalAlignment',
  arrowsSize: 'layoutParams_navigationArrows_size',
  arrowsPosition: 'layoutParams_navigationArrows_position',

  columnsWidth: 'layoutParams_columnsWidth', //????????????????
  fixedColumns: 'layoutParams_fixedColumns', //????????????????

  scatter: 'layoutParams_scatter',
  scrollDirection: 'layoutParams_scrollDirection',

  isVertical: 'layoutParams_layoutOrientation', // This needs to be refactored to be an enum. but can wait
  columnWidths: 'layoutParams_columnWidths',

  externalInfoHeight: 'layoutParams_externalInfoHeight', //layouter API
  externalInfoWidth: 'layoutParams_externalInfoWidth', //layouter API
  targetItemSize: 'layoutParams_targetItemSize', //layouter API
};

const behaviourParams = {
  //item
  itemClick: 'behaviourParams_item_clickAction', //possible refactor (join fullscreen, expand into one 'action')
  //----video
  videoSpeed: 'behaviourParams_item_video_speed',
  hidePlay: 'behaviourParams_item_video_enablePlayButton',
  videoPlay: 'behaviourParams_item_video_playTrigger',
  videoLoop: 'behaviourParams_item_video_loop',
  showVideoControls: 'behaviourParams_item_video_enableControls',
  videoSound: 'behaviourParams_item_video_volume',
  //----overlay
  hoveringBehaviour: 'behaviourParams_item_overlay_hoveringBehaviour',
  overlayAnimation: 'behaviourParams_item_overlay_hoverAnimation',
  overlayPosition: 'behaviourParams_item_overlay_position',
  overlaySize: 'behaviourParams_item_overlay_size',
  overlaySizeType: 'behaviourParams_item_overlay_sizeUnits',
  overlayPadding: 'behaviourParams_item_overlay_padding',
  //----content
  imageHoverAnimation: 'behaviourParams_item_content_hoverAnimation',
  imagePlacementAnimation: 'behaviourParams_item_content_placementAnimation',
  imageLoadingMode: 'behaviourParams_item_content_loader',
  //----info
  titlePlacement: 'behaviourParams_item_info_placement',

  //gallery
  scrollSnap: 'behaviourParams_gallery_enableScrollSnap',
  isRTL: 'behaviourParams_gallery_layoutDirection', // changes from boolean to an enum (refactor)
  allowLeanGallery: 'behaviourParams_gallery_enableLeanGallery', //think about removing this!
  allowContextMenu: 'behaviourParams_gallery_disableContextMenu', //REFACTOR reverse
  scrollAnimation: 'behaviourParams_gallery_scrollAnimation',
  //----vertical
  //--------loadMore
  enableInfiniteScroll: 'behaviourParams_gallery_vertical_loadMore_enable',
  loadMoreAmount: 'behaviourParams_gallery_vertical_loadMore_amount',
  loadMoreButtonText: 'behaviourParams_gallery_vertical_loadMore_text',

  //----horizontal
  slideAnimation: 'behaviourParams_gallery_horizontal_slideAnimation',
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
  textBoxBorderColor: 'stylingParams_textBoxBorderColor',
  textBoxBorderRadius: 'stylingParams_textBoxBorderRadius',
  itemShadowSize: 'stylingParams_itemShadowSize',
  itemEnableShadow: 'stylingParams_itemEnableShadow',
  itemBorderRadius: 'stylingParams_itemBorderRadius',
  itemBorderWidth: 'stylingParams_itemBorderWidth',
  textBoxBorderWidth: 'stylingParams_textBoxBorderWidth',
};

function migrateStyles(oldStyles) {
  let newStyles = { ...oldStyles };
  delete newStyles.enableLeanGallery;
  //naming
  newStyles = changeNames(newStyles, [
    ['imageMargin', 'layoutParams_itemSpacing'],
    ['cubeType', 'layoutParams_cropMethod'], //Must get its own function o unite with the rotating!
    //rotatingCropRatios + cropType//TODO!
    ['cubeImages', 'layoutParams_enableCrop'],
    ['smartCrop', 'layoutParams_enableSmartCrop'],
    ['minItemSize', 'layoutParams_minItemSize'],
    ['cropOnlyFill', 'layoutParams_cropOnlyFill'],
    ['slideshowInfoSize', 'layoutParams_slideshowInfoSize'],
    ['scatter', 'layoutParams_scatter'],
    ['isSlideshow', 'layoutParams_isSlideshow'],
    ['isGrid', 'layoutParams_isGrid'],
    ['isMasonry', 'layoutParams_isMasonry'],
    ['isSlider', 'layoutParams_isSlider'],
    ['isColumns', 'layoutParams_isColumns'],
    ['numberOfImagesPerCol', 'layoutParams_numberOfRows'],
    //['collageAmount', 'layoutParams_collage_amount'], //This doesnt really exist. need to eradicate as a refactor
    ['collageDensity', 'layoutParams_collage_density'],
    ['chooseBestGroup', 'layoutParams_collage_groupByOrientation'],
    ['groupSize', 'layoutParams_collage_groupSize'],
    ['hasThumbnails', 'layoutParams_thumbnails_enable'],
    ['thumbnailSpacings', 'layoutParams_thumbnails_spacing'],
    ['thumbnailSize', 'layoutParams_thumbnails_size'],
    ['showArrows', 'layoutParams_navigationArrows_enable'],
    ['arrowsPadding', 'layoutParams_navigationArrows_padding'],
    [
      'arrowsVerticalPosition',
      'layoutParams_navigationArrows_verticalAlignment',
    ],
    ['arrowsSize', 'layoutParams_navigationArrows_size'],
    ['arrowsPosition', 'layoutParams_navigationArrows_position'],
  ]);
  newStyles = reverseBooleans(newStyles, [
    ['useMaxDimensions', 'layoutParams_enableStreching'],
  ]);
  newStyles = processThumbnailAlignment(newStyles);
  newStyles = processScrollDirection(newStyles);
  newStyles = processLayoutOrientation(newStyles);
  newStyles = processForceGroupOrder(newStyles);
  newStyles = processGroupTypes(newStyles);
  newStyles = processNumberOfColumns(newStyles); // fixedColumns || numberOfImagesPerRow || numberOfGroupsPerRow (notice its losing if its 0)

  newStyles = changeNames(newStyles, [
    ['videoLoop', 'behaviourParams_item_video_loop'],
    ['showVideoControls', 'behaviourParams_item_video_enableControls'],
    ['overlayAnimation', 'behaviourParams_item_overlay_hoverAnimation'],
    ['overlayPosition', 'behaviourParams_item_overlay_position'],
    ['overlaySize', 'behaviourParams_item_overlay_size'],
    ['overlaySizeType', 'behaviourParams_item_overlay_sizeUnits'],
    ['overlayPadding', 'behaviourParams_item_overlay_padding'],
    ['imageHoverAnimation', 'behaviourParams_item_content_hoverAnimation'],
    [
      'imagePlacementAnimation',
      'behaviourParams_item_content_placementAnimation',
    ],
    ['imageLoadingMode', 'behaviourParams_item_content_loader'],
    ['scrollSnap', 'behaviourParams_gallery_horizontal_enableScrollSnap'],
    ['scrollAnimation', 'behaviourParams_gallery_scrollAnimation'],
    ['loadMoreButtonText', 'behaviourParams_gallery_vertical_loadMore_text'],
    ['slideAnimation', 'behaviourParams_gallery_horizontal_slideAnimation'],
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
      'behaviourParams_gallery_vertical_loadMore_enable',
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
    ['textBoxBorderColor', 'stylingParams_textBoxBorderColor'],
    ['textBoxBorderRadius', 'stylingParams_textBoxBorderRadius'],
    ['itemShadowSize', 'stylingParams_itemShadowSize'],
    ['itemEnableShadow', 'stylingParams_itemEnableShadow'],
    ['itemBorderRadius', 'stylingParams_itemBorderRadius'],
    ['itemBorderWidth', 'stylingParams_itemBorderWidth'],
    ['textBoxBorderWidth', 'stylingParams_textBoxBorderWidth'],
  ]);
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
      !getByString(obj, newName) &&
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
  //['galleryThumbnailsAlignment', 'layoutParams_thumbnails_alignment'],
  let _obj = { ...obj };
  _obj = namingChange(
    _obj,
    'galleryThumbnailsAlignment',
    'layoutParams_thumbnails_alignment'
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
  _obj = namingChange(_obj, 'scrollDirection', 'layoutParams_scrollDirection');
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
  _obj = namingChange(_obj, 'isVertical', 'layoutParams_layoutOrientation');
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
function processForceGroupOrder(obj) {
  let _obj = { ...obj };
  _obj = namingChange(_obj, 'placeGroupsLtr', 'layoutParams_forceGroupOrder');
  switch (_obj.layoutParams.forceGroupOrder) {
    case true:
      _obj.layoutParams.forceGroupOrder = 'LEFT_TO_RIGHT';
      break;
    case false:
      _obj.layoutParams.forceGroupOrder = 'BY_COLUMNS';
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
    'behaviourParams_gallery_vertical_loadMore_amount'
  );
  _obj.behaviourParams.gallery.vertical.loadMore.amount =
    _obj.behaviourParams.gallery.vertical.loadMore.amount?.toUpperCase();
  return _obj;
}
function processOverlayHoveringBehaviour(obj) {
  let _obj = { ...obj };
  _obj = namingChange(
    _obj,
    'hoveringBehaviour',
    'behaviourParams_item_overlay_hoveringBehaviour'
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
    'behaviourParams_item_info_placement'
  );
  switch (_obj.behaviourParams.item.info.placement) {
    case 'SHOW_ON_HOVER':
      _obj.behaviourParams.item.info.placement = 'OVERLAY';
      break;
    case 'SHOW_BELOW':
      _obj.behaviourParams.item.info.placement = 'BELOW';
      break;
    case 'SHOW_ABOVE':
      _obj.behaviourParams.item.info.placement = 'ABOVE';
      break;
    case 'SHOW_ON_THE_RIGHT':
      _obj.behaviourParams.item.info.placement = 'RIGHT';
      break;
    case 'SHOW_ON_THE_LEFT':
      _obj.behaviourParams.item.info.placement = 'LEFT';
      break;
    case 'ALTERNATE_HORIZONTAL':
      _obj.behaviourParams.item.info.placement = 'ALTERNATE_HORIZONTALLY';
      break;
    case 'ALTERNATE_VERTICAL':
      _obj.behaviourParams.item.info.placement = 'ALTERNATE_VERTICALLY';
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
function processGroupTypes(obj) {
  let _obj = { ...obj };
  //['groupTypes', 'layoutParams_collage_groupTypes'], //Need to change this to incorporate rotatingGroupTypes //change the 'Types'?
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

export { convertStyles, convertStylesBackwards, migrateStyles };
