import optionsMap from './optionsMap';

export const nameChangedLayoutParams = [
  ['galleryLayout', optionsMap.layoutParams.structure.galleryLayout],
  ['imageMargin', optionsMap.layoutParams.structure.itemSpacing],
  ['groupsPerStrip', optionsMap.layoutParams.groups.numberOfGroupsPerRow],
  ['cubeImages', optionsMap.layoutParams.crop.enable],
  ['smartCrop', optionsMap.layoutParams.crop.enableSmartCrop],
  ['cropOnlyFill', optionsMap.layoutParams.crop.cropOnlyFill],
  ['minItemSize', optionsMap.layoutParams.targetItemSize.minimum],
  ['scatter', optionsMap.layoutParams.structure.scatter.randomScatter],
  ['rotatingScatter', optionsMap.layoutParams.structure.scatter.manualScatter],
  ['numberOfImagesPerCol', optionsMap.layoutParams.structure.numberOfGridRows],
  //['collageAmount', optionsMap.layoutParams.groups.amount], //This doesnt really exist. need to eradicate as a refactor
  ['collageDensity', optionsMap.layoutParams.groups.density],
  ['chooseBestGroup', optionsMap.layoutParams.groups.groupByOrientation],
  ['groupSize', optionsMap.layoutParams.groups.groupSize],
  ['hasThumbnails', optionsMap.layoutParams.thumbnails.enable],
  ['thumbnailSpacings', optionsMap.layoutParams.thumbnails.spacing],
  ['thumbnailSize', optionsMap.layoutParams.thumbnails.size],
  ['showArrows', optionsMap.layoutParams.navigationArrows.enable],
  ['arrowsPadding', optionsMap.layoutParams.navigationArrows.padding],
  ['arrowsVerticalPosition', optionsMap.layoutParams.navigationArrows.verticalAlignment],
  ['arrowsSize', optionsMap.layoutParams.navigationArrows.size],
  ['imageInfoType', optionsMap.layoutParams.info.layout],

  //['textBoxWidthPercent', optionsMap.layoutParams.info.widthByPercent],
  ['textImageSpace', optionsMap.layoutParams.info.spacing],
  ['textBoxBorderWidth', optionsMap.layoutParams.info.border.width],
  ['textBoxBorderColor', optionsMap.layoutParams.info.border.color],
  ['textBoxBorderRadius', optionsMap.layoutParams.info.border.radius],
];

export const reversedLayoutParams = [['useMaxDimensions', optionsMap.layoutParams.structure.enableStreching]];

export const nameChangedBehaviourParams = [
  ['magnificationLevel', optionsMap.behaviourParams.item.content.magnificationValue],
  ['tiltAngleValue', optionsMap.behaviourParams.item.content.tiltAngleValue],
  ['videoLoop', optionsMap.behaviourParams.item.video.loop],
  ['showVideoPlayButton', optionsMap.behaviourParams.item.video.enablePlayButton],
  ['showVideoControls', optionsMap.behaviourParams.item.video.enableControls],
  ['enableVideoPlaceholder', optionsMap.behaviourParams.item.video.enablePlaceholder],
  ['overlayAnimation', optionsMap.behaviourParams.item.overlay.hoverAnimation],
  ['overlayPosition', optionsMap.behaviourParams.item.overlay.position],
  ['overlaySize', optionsMap.behaviourParams.item.overlay.size],
  ['overlaySizeType', optionsMap.behaviourParams.item.overlay.sizeUnits],
  ['overlayPadding', optionsMap.behaviourParams.item.overlay.padding],
  ['overlayBackground', optionsMap.behaviourParams.item.overlay.backgroundColor],
  ['imageHoverAnimation', optionsMap.behaviourParams.item.content.hoverAnimation],
  ['imagePlacementAnimation', optionsMap.behaviourParams.item.content.placementAnimation],
  ['imageLoadingMode', optionsMap.behaviourParams.item.content.loader],
  ['scrollSnap', optionsMap.behaviourParams.gallery.horizontal.enableScrollSnap],
  ['scrollAnimation', optionsMap.behaviourParams.gallery.scrollAnimation],
  ['shouldIndexDirectShareLinkInSEO', optionsMap.behaviourParams.gallery.enableIndexingShareLinks],
  ['loadMoreButtonText', optionsMap.behaviourParams.gallery.vertical.loadMore.text],
  ['slideAnimation', optionsMap.behaviourParams.gallery.horizontal.slideAnimation],
  ['slideTransition', optionsMap.behaviourParams.gallery.horizontal.slideTransition],
  ['scrollDuration', optionsMap.behaviourParams.gallery.horizontal.navigationDuration], //This might need to move to navigationArrows in layoutParams.
  ['slideshowLoop', optionsMap.behaviourParams.gallery.horizontal.loop],
  ['autoSlideshowInterval', optionsMap.behaviourParams.gallery.horizontal.autoSlide.interval],
  ['pauseAutoSlideshowOnHover', optionsMap.behaviourParams.gallery.horizontal.autoSlide.pauseOnHover],
  ['autoSlideshowContinuousSpeed', optionsMap.behaviourParams.gallery.horizontal.autoSlide.speed],
  ['allowSlideshowCounter', optionsMap.behaviourParams.gallery.horizontal.slideshowInfo.enableCounter],
  ['playButtonForAutoSlideShow', optionsMap.behaviourParams.gallery.horizontal.slideshowInfo.enablePlayButton],
];

export const reversedBehaviourParams = [
  ['enableInfiniteScroll', optionsMap.behaviourParams.gallery.vertical.loadMore.enable],
  ['allowContextMenu', optionsMap.behaviourParams.gallery.blockContextMenu],
  ['enableScroll', optionsMap.behaviourParams.gallery.horizontal.blockScroll], //requires a reversal! (blocks instead of allowing),
];

export const nameChangedStylingParams = [
  ['itemShadowBlur', optionsMap.stylingParams.itemShadowBlur],
  ['itemShadowDirection', optionsMap.stylingParams.itemShadowDirection],
  ['itemShadowOpacityAndColor', optionsMap.stylingParams.itemShadowOpacityAndColor],
  ['arrowsColor', optionsMap.stylingParams.arrowsColor],
  ['itemShadowSize', optionsMap.stylingParams.itemShadowSize],
  ['itemEnableShadow', optionsMap.stylingParams.itemEnableShadow],
  ['itemBorderRadius', optionsMap.stylingParams.itemBorderRadius],
  ['itemBorderColor', optionsMap.stylingParams.itemBorderColor],
  ['itemBorderWidth', optionsMap.stylingParams.itemBorderWidth],
];

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
  if (typeof obj[newName] === 'undefined' && typeof obj[oldName] !== 'undefined') {
    obj[newName] = obj[oldName];
  }
  delete obj[oldName];
  return obj;
}
export function reverseBooleanTo(obj, oldName, newName) {
  if (typeof obj[newName] === 'undefined' && typeof obj[oldName] !== 'undefined') {
    obj[newName] = !obj[oldName];
  }
  delete obj[oldName];
  return obj;
}
