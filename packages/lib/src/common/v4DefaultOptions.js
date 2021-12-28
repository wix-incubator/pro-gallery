import GALLERY_CONSTS from './constants';

const defaultOptions = {
  layoutParams: {
    crop: {
      ratios: [1], // determine the ratio of the images when using grid (use 1 for squares grid)
      method: 'FILL',
      enable: false,
      enableSmartCrop: false,
      cropOnlyFill: false,
      alignment: 'CENTER',
    },
    structure: {
      galleryLayout: -1,
      scrollDirection: 'VERTICAL', //TODO, create and use use NEW_CONSTS
      gallerySpacing: 0,
      itemSpacing: 10,
      enableStreching: true,
      responsiveMode: 'FIT_TO_SCREEN',
      scatter: {
        randomScatter: 0,
        manualScatter: '',
      },
      layoutOrientation: 'HORIZONTAL', //TODO, create and use use NEW_CONSTS
      groupsOrder: 'BY_HEIGHT', //TODO, create and use use NEW_CON
      numberOfGridRows: 1,
      numberOfColumns: 3,
      columnRatios: [],
    },

    groups: {
      groupByOrientation: true,
      numberOfGroupsPerRow: 0,
      density: 0.8,
      groupSize: 3,
      allowedGroupTypes: ['1', '2h', '2v', '3t', '3b', '3l', '3r'],
      repeatingGroupTypes: [],
    },
    thumbnails: {
      size: 120,
      spacing: 4,
      enable: false,
      alignment: 'BOTTOM', //TODO, create and use use NEW_CONSTS
    },
    navigationArrows: {
      enable: true,
      position: 'ON_GALLERY', //TODO, create and use use NEW_CONSTS
      padding: 23,
      size: 23,
      verticalAlignment: GALLERY_CONSTS.arrowsVerticalPosition.ITEM_CENTER,
      type: GALLERY_CONSTS.arrowsType.DEFAULT_ARROW,
    },
    targetItemSize: {
      unit: 'SMART',
      value: 30,
      minimum: 120,
    },
    info: {
      sizeUnits: GALLERY_CONSTS.textBoxWidthCalculationOptions.PERCENT,
      width: 50,
      height: 200,
      spacing: 10,
      layout: GALLERY_CONSTS.infoType.NO_BACKGROUND,
      // widthByPercent: 50, //I want this to be in the width just like we did the overlaySize
      placement: 'OVERLAY', //TODO, create and use use consts
      border: {
        width: 0,
        radius: 0,
        color: '',
      },
    },
  },
  behaviourParams: {
    item: {
      clickAction: 'NOTHING', //TODO, create and use use NEW_CONSTS
      video: {
        playTrigger: 'HOVER',
        loop: true,
        volume: 0,
        enableControls: false,
        speed: 1,
        enablePlayButton: true,
        enablePlaceholder: true,
      },
      overlay: {
        hoveringBehaviour: GALLERY_CONSTS.infoBehaviourOnHover.APPEARS,
        hoverAnimation: GALLERY_CONSTS.overlayAnimations.NO_EFFECT,
        position: GALLERY_CONSTS.overlayPositions.LEFT,
        size: 100,
        sizeUnits: GALLERY_CONSTS.overlaySizeType.PERCENT,
        padding: 0,
      },
      content: {
        hoverAnimation: GALLERY_CONSTS.imageHoverAnimations.NO_EFFECT,
        loader: GALLERY_CONSTS.loadingMode.BLUR,
        placementAnimation: GALLERY_CONSTS.imagePlacementAnimations.NO_EFFECT,
        magnificationValue: 2,
      },
    },
    gallery: {
      blockContextMenu: true,
      layoutDirection: 'LEFT_TO_RIGHT', //TODO, create and use use consts
      scrollAnimation: GALLERY_CONSTS.scrollAnimations.NO_EFFECT,
      enableIndexingShareLinks: true,
      horizontal: {
        enableScrollSnap: false,
        navigationDuration: 400,
        blockScroll: false,
        loop: false,
        slideTransition: GALLERY_CONSTS.slideTransition.ease,
        slideAnimation: GALLERY_CONSTS.slideAnimations.SCROLL,
        autoSlide: {
          behaviour: 'OFF',
          interval: 4,
          pauseOnHover: true,
          speed: 200,
        },
        slideshowInfo: {
          buttonsAlignment: 'CENTER',
          enablePlayButton: false,
          enableCounter: false,
        },
      },
      vertical: {
        loadMore: {
          enable: false,
          text: '',
          amount: 'ALL',
        },
      },
    },
  },
  stylingParams: {
    itemBorderWidth: 0,
    itemBorderRadius: 0,
    itemEnableShadow: false,
    itemShadowBlur: 20,
    itemShadowDirection: 135,
    itemShadowSize: 10,
    itemShadowOpacityAndColor: '',
    arrowsColor: '',
  },
};

export default defaultOptions;
