import optionsMap from '../core/helpers/optionsMap.js';
import GALLERY_CONSTS from './constants/index.js';
import { flattenObject } from '../core/helpers/optionsUtils.js';
const defaultV4Options = {
  layoutParams: {
    crop: {
      ratios: [1], // determine the ratio of the images when using grid (use 1 for squares grid)
      method: GALLERY_CONSTS[optionsMap.layoutParams.crop.method].FILL,
      enable: false,
      enableSmartCrop: false,
      cropOnlyFill: false,
      alignment: GALLERY_CONSTS[optionsMap.layoutParams.crop.alignment].CENTER,
    },
    structure: {
      galleryLayout: -1,
      galleryRatio: { value: 0, includeExternalInfo: false },
      scrollDirection: GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].VERTICAL,
      gallerySpacing: 0,
      itemSpacing: 10,
      enableStreching: true,
      responsiveMode: GALLERY_CONSTS[optionsMap.layoutParams.structure.responsiveMode].FIT_TO_SCREEN,
      scatter: {
        randomScatter: 0,
        manualScatter: '',
      },
      layoutOrientation: GALLERY_CONSTS[optionsMap.layoutParams.structure.layoutOrientation].HORIZONTAL,
      groupsOrder: GALLERY_CONSTS[optionsMap.layoutParams.structure.groupsOrder].BY_HEIGHT,
      numberOfGridRows: 1,
      numberOfColumns: 3,
      columnRatios: [],
    },

    groups: {
      groupByOrientation: true,
      numberOfGroupsPerRow: 0,
      density: 0.8,
      groupSize: 3,
      allowedGroupTypes: [
        GALLERY_CONSTS[optionsMap.layoutParams.groups.allowedGroupTypes]['1'],
        GALLERY_CONSTS[optionsMap.layoutParams.groups.allowedGroupTypes]['2h'],
        GALLERY_CONSTS[optionsMap.layoutParams.groups.allowedGroupTypes]['2v'],
        GALLERY_CONSTS[optionsMap.layoutParams.groups.allowedGroupTypes]['3t'],
        GALLERY_CONSTS[optionsMap.layoutParams.groups.allowedGroupTypes]['3b'],
        GALLERY_CONSTS[optionsMap.layoutParams.groups.allowedGroupTypes]['3l'],
        GALLERY_CONSTS[optionsMap.layoutParams.groups.allowedGroupTypes]['3r'],
      ],
      repeatingGroupTypes: [],
    },
    thumbnails: {
      size: 120,
      spacing: 4,
      enable: false,
      position: GALLERY_CONSTS[optionsMap.layoutParams.thumbnails.position].OUTSIDE_GALLERY,
      alignment: GALLERY_CONSTS[optionsMap.layoutParams.thumbnails.alignment].BOTTOM,
      ratio: 1,
    },
    navigationArrows: {
      enable: true,
      position: GALLERY_CONSTS[optionsMap.layoutParams.navigationArrows.position].ON_GALLERY,
      padding: 23,
      size: 23,
      verticalAlignment: GALLERY_CONSTS[optionsMap.layoutParams.navigationArrows.verticalAlignment].ITEM_CENTER,
      type: GALLERY_CONSTS[optionsMap.layoutParams.navigationArrows.type].DEFAULT_ARROW,
      container: {
        type: GALLERY_CONSTS[optionsMap.layoutParams.navigationArrows.container.type].SHADOW,
        backgroundColor: '',
        borderRadius: -1,
      },
    },
    targetItemSize: {
      unit: GALLERY_CONSTS[optionsMap.layoutParams.targetItemSize.unit].SMART,
      value: 30,
      minimum: 120,
    },
    info: {
      sizeUnits: GALLERY_CONSTS[optionsMap.layoutParams.info.sizeUnits].PERCENT,
      width: 50,
      height: 200,
      spacing: 10,
      layout: GALLERY_CONSTS[optionsMap.layoutParams.info.layout].NO_BACKGROUND,
      // widthByPercent: 50, //I want this to be in the width just like we did the overlaySize
      placement: GALLERY_CONSTS[optionsMap.layoutParams.info.placement].OVERLAY,
      border: {
        width: 0,
        radius: 0,
        color: '',
      },
    },
  },
  behaviourParams: {
    item: {
      clickAction: GALLERY_CONSTS[optionsMap.behaviourParams.item.clickAction].NOTHING,
      video: {
        playTrigger: GALLERY_CONSTS[optionsMap.behaviourParams.item.video.playTrigger].HOVER,
        loop: true,
        volume: 0,
        enableControls: false,
        speed: 1,
        enablePlayButton: false,
        enablePlaceholder: true,
      },
      overlay: {
        hoveringBehaviour: GALLERY_CONSTS[optionsMap.behaviourParams.item.overlay.hoveringBehaviour].APPEARS,
        hoverAnimation: GALLERY_CONSTS[optionsMap.behaviourParams.item.overlay.hoverAnimation].NO_EFFECT,
        position: GALLERY_CONSTS[optionsMap.behaviourParams.item.overlay.position].LEFT,
        size: 100,
        sizeUnits: GALLERY_CONSTS[optionsMap.behaviourParams.item.overlay.sizeUnits].PERCENT,
        padding: 0,
      },
      content: {
        hoverAnimation: GALLERY_CONSTS[optionsMap.behaviourParams.item.content.hoverAnimation].NO_EFFECT,
        loader: GALLERY_CONSTS[optionsMap.behaviourParams.item.content.loader].BLUR,
        placementAnimation: GALLERY_CONSTS[optionsMap.behaviourParams.item.content.placementAnimation].NO_EFFECT,
        magnificationValue: 2,
      },
      secondaryMedia: {
        trigger: GALLERY_CONSTS[optionsMap.behaviourParams.item.secondaryMedia.trigger].OFF,
        behaviour: GALLERY_CONSTS[optionsMap.behaviourParams.item.secondaryMedia.behaviour].APPEARS,
      },
    },
    gallery: {
      blockContextMenu: true, //is this actually a default??
      layoutDirection: GALLERY_CONSTS[optionsMap.behaviourParams.gallery.layoutDirection].LEFT_TO_RIGHT,
      scrollAnimation: GALLERY_CONSTS[optionsMap.behaviourParams.gallery.scrollAnimation].NO_EFFECT,
      enableIndexingShareLinks: true,
      horizontal: {
        enableScrollSnap: false,
        navigationDuration: 400,
        blockScroll: false,
        loop: false,
        slideTransition: GALLERY_CONSTS[optionsMap.behaviourParams.gallery.horizontal.slideTransition].EASE,
        slideAnimation: GALLERY_CONSTS[optionsMap.behaviourParams.gallery.horizontal.slideAnimation].SCROLL,
        autoSlide: {
          behaviour: GALLERY_CONSTS[optionsMap.behaviourParams.gallery.horizontal.autoSlide.behaviour].OFF,
          interval: 4,
          pauseOnHover: true,
          speed: 200,
        },
        slideshowInfo: {
          buttonsAlignment:
            GALLERY_CONSTS[optionsMap.behaviourParams.gallery.horizontal.slideshowInfo.buttonsAlignment].CENTER,
          enablePlayButton: false,
          enableCounter: false,
        },
      },
      vertical: {
        loadMore: {
          enable: false,
          text: '',
          amount: GALLERY_CONSTS[optionsMap.behaviourParams.gallery.vertical.loadMore.amount].ALL,
        },
      },
    },
  },
  stylingParams: {
    itemBorderWidth: 0,
    itemBorderRadius: 0,
    itemEnableShadow: false,
    itemBorderColor: '',
    itemShadowBlur: 20,
    itemShadowDirection: 135,
    itemShadowSize: 10,
    itemShadowOpacityAndColor: '',
    arrowsColor: '',
  },
  //layouter API params
  fixedColumns: 0, // determine the number of columns regardless of the screen size (use 0 to ignore)
};

export default defaultV4Options;
export const flatV4DefaultOptions = flattenObject(defaultV4Options);
