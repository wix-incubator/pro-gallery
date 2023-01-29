// import { GALLERY.CONSTS } from 'pro-gallery-lib';
import { optionsMap, GALLERY_CONSTS } from 'pro-gallery-lib';

const options = {
  [optionsMap.layoutParams.structure.gallerySpacing]: 0,
  [optionsMap.layoutParams.crop.ratios]: [1],
  [optionsMap.layoutParams.groups.repeatingGroupTypes]: [],
  [optionsMap.layoutParams.info.placement]:
    GALLERY_CONSTS[optionsMap.layoutParams.info.placement].OVERLAY,
  [optionsMap.behaviourParams.item.overlay.hoveringBehaviour]:
    GALLERY_CONSTS[optionsMap.behaviourParams.item.overlay.hoveringBehaviour]
      .ALWAYS_SHOW,
  [optionsMap.layoutParams.structure.galleryLayout]: 2,
  [optionsMap.layoutParams.structure.scrollDirection]:
    GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection]
      .HORIZONTAL,
  [optionsMap.layoutParams.structure.numberOfColumns]: 3,
  [optionsMap.layoutParams.structure.numberOfGridRows]: 2,
  [optionsMap.behaviourParams.gallery.layoutDirection]:
    GALLERY_CONSTS[optionsMap.behaviourParams.gallery.layoutDirection]
      .LEFT_TO_RIGHT,
  [optionsMap.layoutParams.structure.layoutOrientation]:
    GALLERY_CONSTS[optionsMap.layoutParams.structure.layoutOrientation]
      .HORIZONTAL,
  fixedColumns: 0,
  [optionsMap.layoutParams.structure.itemSpacing]: 10,
  [optionsMap.layoutParams.groups.numberOfGroupsPerRow]: 0,
  [optionsMap.layoutParams.crop.enable]: false,
  [optionsMap.layoutParams.crop.enableSmartCrop]: false,
  [optionsMap.layoutParams.crop.cropOnlyFill]: false,
  [optionsMap.layoutParams.targetItemSize.minimum]: 120,
  [optionsMap.layoutParams.structure.scatter.randomScatter]: 0,
  [optionsMap.layoutParams.structure.scatter.manualScatter]: '',
  [optionsMap.layoutParams.groups.density]: 0.8,
  [optionsMap.layoutParams.groups.groupByOrientation]: true,
  [optionsMap.layoutParams.groups.groupSize]: 3,
  [optionsMap.layoutParams.thumbnails.enable]: true,
  [optionsMap.layoutParams.thumbnails.spacing]: 4, //TODO THUMBNAILS_FIX
  [optionsMap.layoutParams.thumbnails.marginToGallery]: 4, //TODO THUMBNAILS_FIX
  [optionsMap.layoutParams.thumbnails.size]: 250,
  [optionsMap.layoutParams.navigationArrows.enable]: true,
  [optionsMap.layoutParams.navigationArrows.padding]: 23,
  [optionsMap.layoutParams.navigationArrows.verticalAlignment]:
    GALLERY_CONSTS[optionsMap.layoutParams.navigationArrows.verticalAlignment]
      .ITEM_CENTER,
  [optionsMap.layoutParams.navigationArrows.size]: 23,
  [optionsMap.layoutParams.info.spacing]: 10,
  [optionsMap.layoutParams.info.border.width]: 0,
  [optionsMap.layoutParams.info.border.radius]: 0,
  [optionsMap.layoutParams.thumbnails.alignment]:
    GALLERY_CONSTS[optionsMap.layoutParams.thumbnails.alignment].BOTTOM,
  [optionsMap.layoutParams.structure.groupsOrder]:
    GALLERY_CONSTS[optionsMap.layoutParams.structure.groupsOrder].BY_HEIGHT,
  [optionsMap.layoutParams.groups.allowedGroupTypes]: [
    '1',
    '2h',
    '2v',
    '3t',
    '3b',
    '3l',
    '3r',
  ],
  [optionsMap.layoutParams.structure.columnRatios]: undefined,
  [optionsMap.layoutParams.crop.method]:
    GALLERY_CONSTS[optionsMap.layoutParams.crop.method].FILL,
  [optionsMap.layoutParams.structure.responsiveMode]:
    GALLERY_CONSTS[optionsMap.layoutParams.structure.responsiveMode]
      .FIT_TO_SCREEN,
  [optionsMap.layoutParams.info.height]: 200,
  [optionsMap.layoutParams.navigationArrows.position]:
    GALLERY_CONSTS[optionsMap.layoutParams.navigationArrows.position]
      .ON_GALLERY,
  [optionsMap.behaviourParams.item.video.loop]: true,
  [optionsMap.behaviourParams.item.video.enablePlaceholder]: true,
  [optionsMap.behaviourParams.gallery.horizontal.enableScrollSnap]: false,
  [optionsMap.behaviourParams.gallery.enableIndexingShareLinks]: true,
  [optionsMap.behaviourParams.gallery.vertical.loadMore.text]: '',
  [optionsMap.behaviourParams.gallery.horizontal.slideTransition]:
    GALLERY_CONSTS[
      optionsMap.behaviourParams.gallery.horizontal.slideTransition
    ].EASE,
  [optionsMap.behaviourParams.gallery.horizontal.loop]: false,
  [optionsMap.behaviourParams.gallery.horizontal.autoSlide.interval]: 4,
  [optionsMap.behaviourParams.gallery.horizontal.autoSlide.pauseOnHover]: true,
  [optionsMap.behaviourParams.gallery.horizontal.slideshowInfo
    .enableCounter]: false,
  [optionsMap.behaviourParams.gallery.horizontal.slideshowInfo
    .enablePlayButton]: false,
  [optionsMap.behaviourParams.gallery.vertical.loadMore.enable]: false,
  [optionsMap.behaviourParams.gallery.horizontal.blockScroll]: false,
  [optionsMap.behaviourParams.item.clickAction]: undefined,
  [optionsMap.behaviourParams.item.video.playTrigger]: undefined,
  [optionsMap.behaviourParams.item.video.volume]: 0,
  [optionsMap.behaviourParams.item.video.speed]: 1,
  [optionsMap.behaviourParams.gallery.vertical.loadMore.amount]: undefined,
  [optionsMap.behaviourParams.gallery.horizontal.autoSlide.behaviour]:
    GALLERY_CONSTS[
      optionsMap.behaviourParams.gallery.horizontal.autoSlide.behaviour
    ].OFF,
  [optionsMap.behaviourParams.gallery.horizontal.slideshowInfo
    .buttonsAlignment]:
    GALLERY_CONSTS[
      optionsMap.behaviourParams.gallery.horizontal.slideshowInfo
        .buttonsAlignment
    ].CENTER,
  [optionsMap.stylingParams.itemShadowBlur]: 20,
  [optionsMap.stylingParams.itemShadowDirection]: 135,
  [optionsMap.stylingParams.itemShadowSize]: 10,
  [optionsMap.stylingParams.itemEnableShadow]: false,
  [optionsMap.stylingParams.itemBorderRadius]: 0,
  [optionsMap.stylingParams.itemBorderWidth]: 0,
};

const container = {
  width: 1150,
  height: 850,
  scrollBase: 0,
};

const customComponents = {
  customHoverRenderer: () => {},
  customInfoRenderer: () => {},
};

export { container, options, customComponents };
