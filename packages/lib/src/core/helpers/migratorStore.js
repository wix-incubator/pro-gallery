import optionsMap from './optionsMap';
import { assignByString, getByString } from './optionsUtils';

export const nameChangedLayoutParams = [
  ['imageMargin', optionsMap.layoutParams.itemSpacing],
  ['cubeImages', optionsMap.layoutParams.enableCrop],
  ['smartCrop', optionsMap.layoutParams.enableSmartCrop],
  ['minItemSize', optionsMap.layoutParams.targetItemSize.minimum],
  ['cropOnlyFill', optionsMap.layoutParams.cropOnlyFill],
  ['slideshowInfoSize', optionsMap.layoutParams.info.slideshowInfoSize],
  ['scatter', optionsMap.layoutParams.scatter.randomScatter],
  ['rotatingScatter', optionsMap.layoutParams.scatter.manualScatter],
  ['isSlideshow', optionsMap.layoutParams.isSlideshow],
  ['isGrid', optionsMap.layoutParams.isGrid],
  ['isMasonry', optionsMap.layoutParams.isMasonry],
  ['isSlider', optionsMap.layoutParams.isSlider],
  ['isColumns', optionsMap.layoutParams.isColumns],
  ['numberOfImagesPerCol', optionsMap.layoutParams.numberOfRows],
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
  ['imageInfoType', optionsMap.layoutParams.info.layout],
  ['textBoxHeight', optionsMap.layoutParams.info.height],
  //['textBoxWidthPercent', optionsMap.layoutParams.info.widthByPercent],
  ['textImageSpace', optionsMap.layoutParams.info.spacing],
  ['textBoxBorderWidth', optionsMap.layoutParams.info.border.width],
  ['textBoxBorderColor', optionsMap.layoutParams.info.border.color],
  ['textBoxBorderRadius', optionsMap.layoutParams.info.border.radius],
];

export const reversedLayoutParams = [
  ['useMaxDimensions', optionsMap.layoutParams.enableStreching],
];

export const nameChangedBehaviourParams = [
  ['videoLoop', optionsMap.behaviourParams.item.video.loop],
  ['showVideoControls', optionsMap.behaviourParams.item.video.enableControls],
  [
    'enableVideoPlaceholder',
    optionsMap.behaviourParams.item.video.enablePlaceholder,
  ],
  ['overlayAnimation', optionsMap.behaviourParams.item.overlay.hoverAnimation],
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
];

export const reversedBehaviourParams = [
  [
    'enableInfiniteScroll',
    optionsMap.behaviourParams.gallery.vertical.loadMore.enable,
  ],
  ['allowContextMenu', optionsMap.behaviourParams.gallery.disableContextMenu],
  ['hidePlay', optionsMap.behaviourParams.item.video.enablePlayButton],
  ['enableScroll', optionsMap.behaviourParams.gallery.horizontal.blockScroll], //requires a reversal! (blocks instead of allowing),
];

export const nameChangedStylingParams = [
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
];

export const layoutParamsMap = {
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
  placeGroupsLtr: optionsMap.layoutParams.groupsOrder, //REFACTOR - LEFT_TO_RIGHT, RIGHT_TO_LEFT
  rotatingGroupTypes: optionsMap.layoutParams.repeatingGroupTypes,

  slideshowInfoSize: optionsMap.layoutParams.info.slideshowInfoSize,

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
  calculateTextBoxWidthMode: optionsMap.layoutParams.info.sizeUnits,
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

export const behaviourParams = {
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

export const stylingParams = {
  arrowsColor: optionsMap.stylingParams.arrowsColor,
  itemShadowBlur: optionsMap.stylingParams.itemShadowBlur,
  itemShadowDirection: optionsMap.stylingParams.itemShadowDirection,
  itemShadowOpacityAndColor: optionsMap.stylingParams.itemShadowOpacityAndColor,
  itemShadowSize: optionsMap.stylingParams.itemShadowSize,
  itemEnableShadow: optionsMap.stylingParams.itemEnableShadow,
  itemBorderRadius: optionsMap.stylingParams.itemBorderRadius,
  itemBorderWidth: optionsMap.stylingParams.itemBorderWidth,
};

//---------tooling---------//
export function changeNames(obj, pairsArray) {
  let _obj = { ...obj };
  for (const [oldName, newName] of pairsArray) {
    _obj = namingChange(_obj, oldName, newName);
  }
  return _obj;
}
export function reverseBooleans(obj, pairsArray) {
  let _obj = { ...obj };
  for (const [oldName, newName] of pairsArray) {
    _obj = reverseBooleanTo(_obj, oldName, newName);
  }
  return _obj;
}
export function namingChange(obj, oldName, newName) {
  let val = obj[oldName];
  delete obj[oldName];
  return (
    (typeof val !== 'undefined' &&
      typeof getByString(obj, newName) === 'undefined' &&
      assignByString(obj, newName, val)) ||
    obj
  ); //dont overwrite existing property
}
export function reverseBooleanTo(obj, oldName, newName) {
  let val = !obj[oldName];
  delete obj[oldName];
  return assignByString(obj, newName, val);
}
