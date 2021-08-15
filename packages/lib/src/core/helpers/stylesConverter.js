function convertStyles(initialStyles) {
  //This will add the new names while keeping the old ones.
  let styles = { ...initialStyles };
  Object.keys(initialStyles).forEach((key) => {
    styles[layoutParamsMap[key]] = initialStyles[key];
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
  return styles;
}

const layoutParamsMap = {
  galleryMargin: 'layoutParams_gallerySpacing',
  groupsPerStrip: 'layoutParams_numberOfGroupsPerRow',
  cubeFitPosition: 'layoutParams_fitAlignment',
  cubeRatio: 'layoutParams_cropRatio',
  cubeType: 'layoutParams_cropType',
  cubeImages: 'layoutParams_enableCrop',

  imageMargin: 'layoutParams_itemSpacing',
  placeGroupsLtr: 'layoutParams_forceGroupsOrder',
  rotatingGroupTypes: 'layoutParams_repeatingGroupTypes',
  rotatingCropRatios: 'layoutParams_repeatingCropRatios',
  smartCrop: 'layoutParams_enableSmartCrop',

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
  cropOnlyFill: 'layoutParams_cropOnlyFill', //????????????????
  fixedColumns: 'layoutParams_fixedColumns', //????????????????

  scatter: 'layoutParams_scatter',
  scrollDirection: 'layoutParams_scrollDirection',
  minItemSize: 'layoutParams_minItemSize',

  isVertical: 'layoutParams_isVerticalOrientation', // This needs to be refactored to be an enum. but can wait
  columnWidths: 'layoutParams_columnWidths',

  externalInfoHeight: 'layoutParams_externalInfoHeight', //layouter internal
  externalInfoWidth: 'layoutParams_externalInfoWidth', //layouter internal
  targetItemSize: 'layoutParams_targetItemSize', //layouter internal
};

export { convertStyles, convertStylesBackwards };
