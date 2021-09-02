import { expect } from 'chai';
// import optionsMap from '../src/core/helpers/optionsMap';
import GALLERY_CONSTS from '../src/common/constants';
import defaultOptions from '../src/common/defaultOptions';
import {
  // convertOptions,
  // layoutParamsMap,
  migrateOptions,
  // convertOptionsBackwards,
} from '../src/core/helpers/optionsConverter';
import { reverseMigrateOptions } from '../src/core/helpers/optionsBackwardConverter';

// describe('optionsConverter', () => {
//   it('should contain correct keys for params map', () => {
//     expect(optionsMap.layoutParams.collage.density).to.equal(
//       'layoutParams_collage_density'
//     );
//     expect(
//       optionsMap.layoutParams.navigationArrows.verticalAlignment
//     ).to.equal('layoutParams_navigationArrows_verticalAlignment');
//   });
//   it('should create new options from old ones', () => {
//     const expected = { ...oldOptions(), ...newOptions() };
//     const converted = convertOptions(oldOptions());

//     Object.keys(expected).forEach((key) => {
//       expect(converted[key]).to.equal(expected[key]);
//     });
//   });
//   it('should create old options from new ones while keeping existing ones', () => {
//     const expected = {
//       ...oldOptions(),
//       ...newOptions(),
//       groupTypes: '1,2h,2v,3t,3b,3l,3r',
//       someUnrelatedOldOption: 0,
//     };
//     const converted = convertOptionsBackwards({
//       ...newOptions(),
//       groupTypes: '1,2h,2v,3t,3b,3l,3r',
//       someUnrelatedOldOption: 0,
//     });

//   //     Object.keys(expected).forEach((key) => {
//   //       expect(converted[key]).to.equal(expected[key]);
//   //     });
//   //   });
// });
describe('Styles processing', () => {
  it('should migrated new options to old ones', () => {
    let old = reverseMigrateOptions(defaultOptions_new());
    expect(old).to.eql(defaultOptions_old());
  });
  it('should migrate styles from old to new until theres nothing ot migrate anymore', () => {
    let migrated = migrateOptions(defaultOptions_old());
    expect(migrated).to.eql(defaultOptions_new());
  });
});

// function oldStyles() {
//   return {
//     cubeRatio: 0.5,
//     isVertical: false,
//   };
// }
// function newStyles() {
//   return {
//     layoutParams_cropRatio: 0.5,
//     layoutParams_layoutOrientation: 'HORIZONTAL',
//   };
// }

function defaultOptions_old() {
  let def = { ...defaultOptions };
  delete def.fullscreen; //removing this from tests, we should be also removing it from the code. Izaac tested that its not relevant
  delete def.magicLayoutSeed;
  return def;
}

function defaultOptions_new() {
  let options = {
    layoutParams: {
      scrollDirection: 'VERTICAL', //TODO, create and use use NEW_CONSTS
      gallerySpacing: 0,
      itemSpacing: 10,
      enableStreching: true,

      isGrid: false,
      isSlider: false,
      isColumns: false,
      isMasonry: false,
      isSlideshow: false,

      crop: {
        ratios: [1], // determine the ratio of the images when using grid (use 1 for squares grid)
        method: 'FILL',
        enable: false,
        enableSmartCrop: false,
        cropOnlyFill: false,
        alignment: 'CENTER',
      },
      structure: {
        responsiveMode: 'FIT_TO_SCREEN',
        scatter: {
          randomScatter: 0,
          manualScatter: '',
        },
        layoutOrientation: 'HORIZONTAL', //TODO, create and use use NEW_CONSTS
        groupsOrder: 'BY_HEIGHT', //TODO, create and use use NEW_CON
        numberOfRows: 1,
        numberOfColumns: 3,
        columnRatios: [],
      },

      collage: {
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
        position: GALLERY_CONSTS.arrowsPosition.ON_GALLERY,
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
        slideshowInfoSize: 200,
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
        },
      },
      gallery: {
        disableContextMenu: true,
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
      itemBorderWidth: 0,
      itemBorderRadius: 0,
      itemEnableShadow: false,
      itemShadowBlur: 20,
      itemShadowDirection: 135,
      itemShadowSize: 10,
      itemShadowOpacityAndColor: '',
      arrowsColor: '',
    },
    // magicLayoutSeed: 1, //DELETE
    // gridStyle: 0, //Looks like it doesnt really exist
  };
  return options;
}
// function oldOptions() {
//   return {
//     cubeRatio: 0.5,
//     isVertical: false,
//   };
// }
// function newOptions() {
//   return {
//     layoutParams_cropRatio: 0.5,
//     layoutParams_isVerticalOrientation: false,
//   };
// }
