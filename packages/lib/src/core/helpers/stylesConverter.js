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
  cubeType: 'layoutParams_cropType',
  cubeImages: 'layoutParams_enableCrop',
  useMaxDimensions: 'layoutParams_enableStretchImages', //naming???
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
  collageAmount: 'layoutParams_collage_amount', //????????????????
  collageDensity: 'layoutParams_collage_density',
  chooseBestGroup: 'layoutParams_collage_groupByOrientation',
  groupTypes: 'layoutParams_collage_groupTypes',
  groupSize: 'layoutParams_collage_groupSize',
  //bundle thumbnails
  hasThumbnails: 'layoutParams_thumbnails_enableThumbnails',
  thumbnailSpacings: 'layoutParams_thumbnails_spacings',
  thumbnailSize: 'layoutParams_thumbnails_size',
  galleryThumbnailsAlignment: 'layoutParams_thumbnails_alignment',

  //bundle arrows
  showArrows: 'layoutParams_navigationArrows_enableArrows',
  arrowsPadding: 'layoutParams_navigationArrows_padding',
  arrowsVerticalPosition: 'layoutParams_navigationArrows_verticalAlignment',
  arrowsSize: 'layoutParams_navigationArrows_size',
  arrowsPosition: 'layoutParams_navigationArrows_position',

  columnsWidth: 'layoutParams_columnsWidth', //????????????????
  fixedColumns: 'layoutParams_fixedColumns', //????????????????

  scatter: 'layoutParams_scatter',
  scrollDirection: 'layoutParams_scrollDirection',

  isVertical: 'layoutParams_isVerticalOrientation', // This needs to be refactored to be an enum. but can wait
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
  overlaySizeType: 'behaviourParams_item_overlay_sizeType',
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
  //----vertical
  scrollAnimation: 'behaviourParams_gallery_vertical_scrollAnimation',
  //--------loadMore
  enableInfiniteScroll:
    'behaviourParams_gallery_vertical_loadMore_showLoadMore',
  loadMoreAmount: 'behaviourParams_gallery_vertical_loadMore_amount',
  loadMoreButtonText: 'behaviourParams_gallery_vertical_loadMore_buttonText',

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
    'behaviourParams_gallery_horizontal_slideShowInfo_buttonsAlignment', //think if slideshow is under horizontal or is a separate thing
  allowSlideshowCounter:
    'behaviourParams_gallery_horizontal_slideShowInfo_enableCounter',
  playButtonForAutoSlideShow:
    'behaviourParams_gallery_horizontal_slideShowInfo_enablePlayButton',
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
};

export { convertStyles, convertStylesBackwards, layoutParamsMap };
