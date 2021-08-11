function convertStyles(initialStyles) {
  //This will add the new names while keeping the old ones.
  let styles = convertLayoutParams(initialStyles);
  return styles;
}

function convertLayoutParams(initialStyles) {
  //This will add the new names while keeping the old ones.
  let styles = { ...initialStyles };
  styles['cropRatio'] = initialStyles['layoutParams_cubeRatio'];
  styles['cubeType'] = initialStyles['layoutParams_cropType'];
  styles['cubeImages'] = initialStyles['layoutParams_enableCrop'];
  styles['groupsPerStrip'] = initialStyles['layoutParams_numberOfGroupsPerRow'];
  styles['galleryMargin'] = initialStyles['layoutParams_gallerySpacing'];

  styles['imageMargin'] = initialStyles['layoutParams_itemSpacing'];
  styles['placeGroupsLtr'] = initialStyles['layoutParams_forceGroupsOrder'];
  styles['rotatingGroupTypes'] =
    initialStyles['layoutParams_repeatingGroupTypes'];
  styles['rotatingCropRatios'] =
    initialStyles['layoutParams_repeatingCropRatios'];
  styles['smartCrop'] = initialStyles['layoutParams_enableSmartCrop'];

  styles['slideshowInfoSize'] = initialStyles['layoutParams_slideshowInfoSize'];

  //is is is?
  styles['isSlideshow'] = initialStyles['layoutParams_isSlideshow'];
  styles['isGrid'] = initialStyles['layoutParams_isGrid'];
  styles['isMasonry'] = initialStyles['layoutParams_isMasonry'];
  styles['isSlider'] = initialStyles['layoutParams_isSlider'];
  styles['isColumns'] = initialStyles['layoutParams_isColumns'];
  styles['isSlideshow'] = initialStyles['layoutParams_isSlideshow'];

  //bundle collage
  styles['collageAmount'] = initialStyles['layoutParams_collage_amount']; //????????????????
  styles['collageDensity'] = initialStyles['layoutParams_collage_density'];
  styles['chooseBestGroup'] =
    initialStyles['layoutParams_collage_groupByOrientation'];
  styles['groupTypes'] = initialStyles['layoutParams_collage_groupTypes'];
  styles['groupSize'] = initialStyles['layoutParams_collage_groupSize'];
  //bundle thumbnails
  styles['hasThumbnails'] =
    initialStyles['layoutParams_thumbnails_enableThumbnails'];
  styles['thumbnailSpacings'] =
    initialStyles['layoutParams_thumbnails_spacings'];
  styles['thumbnailSize'] = initialStyles['layoutParams_thumbnails_size'];
  styles['galleryThumbnailsAlignment'] =
    initialStyles['layoutParams_thumbnails_alignment'];

  styles['columnsWidth'] = initialStyles['layoutParams_columnsWidth']; //????????????????
  styles['cropOnlyFill'] = initialStyles['layoutParams_cropOnlyFill']; //????????????????
  styles['fixedColumns'] = initialStyles['layoutParams_fixedColumns']; //????????????????

  styles['scatter'] = initialStyles['layoutParams_scatter'];
  styles['scrollDirection'] = initialStyles['layoutParams_scrollDirection'];
  styles['minItemSize'] = initialStyles['layoutParams_minItemSize'];

  styles['isVertical'] = initialStyles['layoutParams_isVerticalOrientation']; // This needs to be refactored to be an enum. but can wait

  // 'externalInfoHeight', //internals for layouter
  // 'externalInfoWidth', //internals for layouter
  // 'targetItemSize',//internals for layouter
  styles['externalInfoHeight'] =
    initialStyles['layoutParams_externalInfoHeight'];
  styles['externalInfoWidth'] = initialStyles['layoutParams_externalInfoWidth'];
  styles['targetItemSize'] = initialStyles['layoutParams_targetItemSize'];
  return styles;
}

export { convertStyles };
