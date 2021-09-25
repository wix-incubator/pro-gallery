import { expect } from 'chai';
// import optionsMap from '../src/core/helpers/optionsMap';
import GALLERY_CONSTS from '../src/common/constants';
import { flattenObject } from '../src/core/helpers/optionsUtils';
import {
  migrateOptions,
  addMigratedOptions,
} from '../src/core/helpers/optionsConverter';
import {
  reverseMigrateOptions,
  addOldOptions,
} from '../src/core/helpers/optionsBackwardConverter';

describe('Styles processing', () => {
  it('should migrated new options to old ones', () => {
    let old = reverseMigrateOptions(defaultOptions_new());
    expect(old).to.eql(defaultOptions_old());
  });
  it('should migrate styles from old to new until theres nothing ot migrate anymore', () => {
    const migrated = migrateOptions(defaultOptions_old());
    expect(migrated).to.eql(defaultOptions_new());
  });
  it('should have new and old styles combined coming from both old and new objects', () => {
    const migrated = addMigratedOptions(defaultOptions_old());
    const reversed = addOldOptions(defaultOptions_new());
    expect(migrated).to.eql(reversed);
  });

  it('should have new and old options when converted back and forth', () => {
    const migrated = addMigratedOptions(
      addOldOptions(addMigratedOptions(addOldOptions(semiRefactored())))
    );
    // const expected = afterConverstionAndBack();
    expect(migrated.layoutParams.info.height).to.eql(150);
    expect(migrated.slideshowInfoSize).to.eql(150);
    expect(migrated.textBoxHeight).to.eql(150);
    expect(migrated.layoutParams.structure.galleryLayout).to.eql(4);
    expect(migrated.galleryLayout).to.eql(4);
    expect(migrated.isAutoSlideshow).to.eql(false);
    expect(
      migrated.behaviourParams.gallery.horizontal.autoSlide.behaviour
    ).to.eql('OFF');
  });
  it('should not have defined properties if they were not initialy defined', () => {
    const migrated = addOldOptions(addMigratedOptions({}));
    const flat = flattenObject(migrated);
    Object.keys(flat).forEach((key) =>
      flat[key] === undefined ? delete flat[key] : {}
    );
    expect(Object.keys(flat).length).to.eql(0);
  });
});

function semiRefactored() {
  return {
    layoutParams: {
      info: { height: 150 },
      structure: {
        galleryLayout: 4,
      },
    },
    isAutoSlideshow: false,
  };
}
// function afterConverstionAndBack() {
//   return {
//     layoutParams: {
//       info: { height: 150 },
//       structure: {
//         galleryLayout: 4,
//       },
//     },
//     behaviourParams: {
//       gallery: {
//         horizontal: {
//           autoSlide: {
//             behaviour: 'OFF',
//           },
//         },
//       },
//     },
//     isAutoSlideshow: false,
//     galleryLayout: 4,
//     textBoxHeight: 150,
//     slideshowInfoSize: 150,
//   };
// }

function defaultOptions_old() {
  let def = {
    isRTL: false,
    isVertical: false,
    minItemSize: 120,
    groupSize: 3,
    chooseBestGroup: true,
    groupTypes: '1,2h,2v,3t,3b,3l,3r',
    cubeImages: false,
    cubeType: 'fill',
    smartCrop: false,
    fullscreen: true,
    videoLoop: true,
    videoSound: false,
    videoPlay: 'hover',
    numberOfImagesPerRow: 3,
    collageDensity: 0.8,
    galleryTextAlign: 'center',
    fixedColumns: undefined, // determine the number of columns regardless of the screen size (use 0 to ignore)
    showArrows: true,
    hasThumbnails: false,
    galleryThumbnailsAlignment: 'bottom',
    gridStyle: 0,
    titlePlacement: GALLERY_CONSTS.placements.SHOW_ON_HOVER,
    hoveringBehaviour: GALLERY_CONSTS.infoBehaviourOnHover.APPEARS,
    isAutoSlideshow: false,
    slideshowLoop: false,
    playButtonForAutoSlideShow: false,
    pauseAutoSlideshowOnHover: true,
    allowSlideshowCounter: false,
    autoSlideshowInterval: 4,
    arrowsSize: 23,
    slideshowInfoSize: 200,
    imageLoadingMode: GALLERY_CONSTS.loadingMode.BLUR,
    scrollAnimation: GALLERY_CONSTS.scrollAnimations.NO_EFFECT,
    overlayAnimation: GALLERY_CONSTS.overlayAnimations.NO_EFFECT,
    imageHoverAnimation: GALLERY_CONSTS.imageHoverAnimations.NO_EFFECT,
    itemBorderWidth: 0,
    itemBorderRadius: 0,
    itemEnableShadow: false,
    itemShadowBlur: 20,
    loadMoreAmount: 'all',
    itemShadowDirection: 135,
    itemShadowSize: 10,
    imageInfoType: GALLERY_CONSTS.infoType.NO_BACKGROUND,
    textBoxBorderRadius: 0,
    textBoxBorderWidth: 0,
    textBoxHeight: 200,
    textImageSpace: 10,
    scrollDirection: 0,
    autoSlideshowType: GALLERY_CONSTS.autoSlideshowTypes.INTERVAL,
    autoSlideshowContinuousSpeed: 200,
    layoutParams: {
      repeatingGroupTypes: '',
      gallerySpacing: 0,
      cropRatio: 1, // determine the ratio of the images when using grid (use 1 for squares grid)
    },
    // adding
    galleryLayout: -1,
    gallerySizePx: undefined,
    gallerySizeRatio: undefined,
    gallerySizeType: GALLERY_CONSTS.gallerySizeType.SMART,
    itemShadowOpacityAndColor: '',
    arrowsColor: '',
    textBoxBorderColor: '',
    allowContextMenu: false,
    showVideoPlayButton: true,
    // ----
    gallerySize: 30,
    cropOnlyFill: false,
    rotatingCropRatios: undefined,
    columnWidths: '',
    numberOfImagesPerCol: 1,
    groupsPerStrip: 0,
    imageMargin: 10,
    scatter: 0,
    rotatingScatter: '',
    placeGroupsLtr: false,
    enableInfiniteScroll: true,
    thumbnailSpacings: 4,
    enableScroll: true,
    scrollSnap: false,
    itemClick: GALLERY_CONSTS.itemClick.NOTHING,
    slideAnimation: GALLERY_CONSTS.slideAnimations.SCROLL,
    scrollDuration: 400,
    arrowsPosition: GALLERY_CONSTS.arrowsPosition.ON_GALLERY,
    arrowsVerticalPosition: GALLERY_CONSTS.arrowsVerticalPosition.ITEM_CENTER,
    arrowsPadding: 23,
    thumbnailSize: 120,
    magicLayoutSeed: 1,
    imagePlacementAnimation: GALLERY_CONSTS.imagePlacementAnimations.NO_EFFECT,
    calculateTextBoxWidthMode:
      GALLERY_CONSTS.textBoxWidthCalculationOptions.PERCENT,
    textBoxWidth: 200,
    textBoxWidthPercent: 50,
    loadMoreButtonText: '',
    videoSpeed: '1',
    showVideoControls: false,
    shouldIndexDirectShareLinkInSEO: true,
    slideTransition: GALLERY_CONSTS.slideTransition.ease,
    useMaxDimensions: false,
    enableVideoPlaceholder: true,
    overlayPosition: GALLERY_CONSTS.overlayPositions.LEFT,
    overlaySize: 100,
    overlaySizeType: GALLERY_CONSTS.overlaySizeType.PERCENT,
    overlayPadding: 0,
    cubeFitPosition: GALLERY_CONSTS.cubeFitPosition.MIDDLE,
    magnificationLevel: 2,
  };
  delete def.fullscreen; //removing this from tests, we should be also removing it from the code. Izaac tested that its not relevant
  delete def.magicLayoutSeed;
  return def;
}

function defaultOptions_new() {
  let options = {
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
  return options;
}
