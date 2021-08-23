import { expect } from 'chai';
import {
  convertStyles,
  convertStylesBackwards,
  migrateStyles,
} from '../src/core/helpers/stylesConverter';
import GALLERY_CONSTS from '../src/common/constants';
import defaultStyles from '../src/common/defaultStyles';

describe('stylesConverter', () => {
  it('should create new styles from old ones', () => {
    const expected = { ...oldStyles(), ...newStyles() };
    const converted = convertStyles(oldStyles());

    Object.keys(expected).forEach((key) => {
      expect(converted[key]).to.equal(expected[key]);
    });
  });
  it('should create old styles from new ones while keeping existing ones', () => {
    const expected = {
      ...oldStyles(),
      ...newStyles(),
      groupTypes: '1,2h,2v,3t,3b,3l,3r',
      someUnrelatedOldStyle: 0,
    };
    const converted = convertStylesBackwards({
      ...newStyles(),
      groupTypes: '1,2h,2v,3t,3b,3l,3r',
      someUnrelatedOldStyle: 0,
    });

    Object.keys(expected).forEach((key) => {
      expect(converted[key]).to.equal(expected[key]);
    });
  });
});
describe('Old to new styles processing', () => {
  it.only('should migrate styles from old to new until theres nothing ot migrate anymore', () => {
    let migrated = migrateStyles(defaultStyles_old());
    expect(migrated).to.eql(defaultStyles_new());
  });
});

function oldStyles() {
  return {
    cubeRatio: 0.5,
    isVertical: false,
  };
}
function newStyles() {
  return {
    layoutParams_cropRatio: 0.5,
    layoutParams_isVerticalOrientation: false,
  };
}

function defaultStyles_old() {
  return defaultStyles;
}

function defaultStyles_new() {
  let styles = {
    layoutParams: {
      groupTypes: '1,2h,2v,3t,3b,3l,3r',
      gallerySpacing: 0,
      cropRatio: 1, // determine the ratio of the images when using grid (use 1 for squares grid)
      itemSpacing: 10,
      enableStreching: true,
      cropMethod: 'fill',
      enableCrop: false,
      enableSmartCrop: false,
      minItemSize: 120,
      cropOnlyFill: false,
      slideshowInfoSize: 200,
      scatter: 0,
      isGrid: false,
      isSlider: false,
      isColumns: false,
      isMasonry: false,
      isSlideshow: false,
      scrollDirection: 'VERTICAL', //TODO, create and use use NEW_CONSTS
      layoutOrientation: 'HORIZONTAL', //TODO, create and use use NEW_CONSTS
      forceGroupOrder: 'BY_COLUMNS', //TODO, create and use use NEW_CON
      numberOfRows: 1,
      numberOfColumns: 3,
      collage: {
        groupByOrientation: true,
        density: 0.8,
        groupSize: 3,
      },
      thumbnails: {
        size: 120,
        spacing: 4,
        enable: false,
        alignment: 'BOTTOM', //TODO, create and use use NEW_CONSTS
      },
      navigationArrows: {
        enable: true,
        position: GALLERY_CONSTS.arrowsPosition.ON_GALLERY,
        padding: 23,
        size: 23,
        verticalAlignment: GALLERY_CONSTS.arrowsVerticalPosition.ITEM_CENTER,
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
          speed: '1',
          enablePlayButton: true,
        },
        overlay: {
          hoveringBehaviour: GALLERY_CONSTS.infoBehaviourOnHover.APPEARS,
          hoverAnimation: GALLERY_CONSTS.overlayAnimations.NO_EFFECT,
          position: GALLERY_CONSTS.overlayPositions.LEFT,
          size: 100,
          sizeUnits: GALLERY_CONSTS.overlaySizeType.PERCENT,
          padding: 0,
        },
        info: {
          placement: 'OVERLAY', //TODO, create and use use consts
        },
        content: {
          hoverAnimation: GALLERY_CONSTS.imageHoverAnimations.NO_EFFECT,
          loader: GALLERY_CONSTS.loadingMode.BLUR,
          placementAnimation: GALLERY_CONSTS.imagePlacementAnimations.NO_EFFECT,
        },
      },
      gallery: {
        disableContextMenu: true,
        layoutDirection: 'LEFT_TO_RIGHT', //TODO, create and use use consts
        scrollAnimation: GALLERY_CONSTS.scrollAnimations.NO_EFFECT,
        horizontal: {
          enableScrollSnap: false,
          navigationDuration: 400,
          blockScroll: false,
          enableLoop: false,
          slideAnimation: GALLERY_CONSTS.slideAnimations.SCROLL,
          autoSlide: {
            behaviour: 'OFF',
            interval: 4,
            pauseOnHover: true,
            continuous: {
              speed: 200,
            },
          },
          slideshowInfo: {
            buttonsAlignment: 'center',
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
      textBoxBorderRadius: 0,
      textBoxBorderWidth: 0,
      itemBorderWidth: 0,
      itemBorderRadius: 0,
      itemEnableShadow: false,
      itemShadowBlur: 20,
      itemShadowDirection: 135,
      itemShadowSize: 10,
      itemShadowOpacityAndColor: '',
      arrowsColor: '',
      textBoxBorderColor: '',
    },
    calculateTextBoxWidthMode:
      GALLERY_CONSTS.textBoxWidthCalculationOptions.PERCENT,
    textBoxWidth: 200,
    textBoxHeight: 200,
    textImageSpace: 10,
    textBoxWidthPercent: 50,

    rotatingCropRatios: '',

    gallerySize: 30,
    columnWidths: '', //columnsRatio ?
    rotatingScatter: '', //incorporate into scatter
    magicLayoutSeed: 1,
    shouldIndexDirectShareLinkInSEO: true,
    slideTransition: GALLERY_CONSTS.slideTransition.ease,
    enableVideoPlaceholder: true,
    fullscreen: true,
    gridStyle: 0,
    imageInfoType: GALLERY_CONSTS.infoType.NO_BACKGROUND,
    jsonStyleParams: '',
  };

  return styles;
}
