import _ from 'lodash';
import utils from '../../utils';
import PLACEMENTS from '../../utils/constants/placements';
import INFO_BEHAVIOUR_ON_HOVER from '../../utils/constants/infoBehaviourOnHover';
import SCROLL_ANIMATIONS from '../../utils/constants/scrollAnimations';
import window from '../../utils/window/windowWrapper';
import { layoutsVersionManager } from '@wix/photography-client-lib/dist/src/versioning/features/layouts';
import { spacingVersionManager } from '@wix/photography-client-lib/dist/src/versioning/features/spacing';
import dimensionsHelper from './dimensionsHelper';
import { getFixedLayouts } from './fixedLayoutsHelper';
import designConsts from '../../constants/designConsts';

const emptyLayout = {
  galleryType: undefined,
  groupSize: undefined,
  showArrows: undefined,
  cubeImages: undefined,
  cubeType: undefined,
  cubeRatio: undefined,
  isVertical: undefined,
  gallerySize: undefined,
  collageAmount: undefined,
  collageDensity: undefined,
  groupTypes: undefined,
  oneRow: undefined,
  imageMargin: undefined,
  galleryMargin: undefined,
  floatingImages: undefined,
  chooseBestGroup: undefined,
  smartCrop: undefined,
  hasThumbnails: undefined,
  enableScroll: undefined,
  isGrid: undefined,
  isSlider: undefined,
  isColumns: undefined,
  isSlideshow: undefined,
  cropOnlyFill: undefined,
  fixedColumns: undefined,
  enableInfiniteScroll: undefined,
};

function getStyleBySeed(seed) {
  if (!seed > 0) {
    seed = 999999;
  }
  seed = Math.floor(seed);

  const strToSeed = str => {
    str = String(str);
    let total = 0;
    for (let s = 0; s < str.length; s++) {
      total += str.charCodeAt(s);
    }
    return total;
  };

  const mergeSeeds = (s1, s2) => {
    return Math.floor((s1 / s2 - Math.floor(s1 / s2)) * 10000000);
  };

  const numFromSeed = (min, max, strSeed) => {
    const seed2 = strToSeed(strSeed);
    const range = max - min + 1;
    return (mergeSeeds(seed, seed2) % range) + min;
  };

  const boolFromSeed = strSeed => {
    return !!numFromSeed(0, 1, strSeed);
  };

  const style = {
    cubeImages: boolFromSeed('cubeImages'),
    cubeRatio: numFromSeed(1, 25, 'cubeRatio') / 5,
    isVertical: boolFromSeed('isVertical'),
    gallerySize: numFromSeed(300, 800, 'gallerySize'),
    collageAmount: numFromSeed(5, 10, 'collageAmount') / 10,
    collageDensity:
      (spacingVersionManager.isNewSpacing()
        ? numFromSeed(1, 100, 'collageDensity')
        : numFromSeed(5, 10, 'collageDensity')) / 100,
    groupTypes: ['1'].concat(
      _.filter('2h,2v,3t,3b,3l,3r,3h,3v'.split(','), (type, i) =>
        boolFromSeed('groupTypes' + i),
      ),
    ),
    oneRow: boolFromSeed('oneRow'),
    imageMargin: numFromSeed(
      0,
      spacingVersionManager.isNewSpacing()
        ? numFromSeed(300, 800, 'gallerySize') / 5
        : 5,
      'imageMargin',
    ),
    galleryMargin: spacingVersionManager.isNewSpacing()
      ? 0
      : numFromSeed(0, 5, 'imageMargin'),
    floatingImages: 0,
    chooseBestGroup: boolFromSeed('chooseBestGroup'),
    smartCrop: boolFromSeed('smartCrop'),
    showArrows: false,
    cubeType: 'fill',
    hasThumbnails: false,
    enableScroll: true,
    isGrid: false,
    isSlideshow: false,
    isSlider: false,
    isColumns: false,
    cropOnlyFill: false,
    fixedColumns: 0,
    enableInfiniteScroll: 1,
  };

  //force adjustments
  if (style.oneRow) {
    style.isVertical = false;
  }
  style.galleryType = style.isVertical ? 'Columns' : 'Strips';
  style.groupSize = parseInt(_.last(style.groupTypes));
  style.groupTypes = style.groupTypes.join(',');
  style.minItemSize = style.gallerySize / style.groupSize / 2;

  return style;
}

function getStyleByGalleryType(styles, container) {
  //legacy layouts
  const { galleryType, gallerySize } = styles;

  const galleryTypes = {
    collage_ver: () => ({
      cubeImages: false,
      isVertical: true,
      galleryType: 'Columns',
      groupSize: 3,
      groupTypes: '1,2h,2v,3t,3b,3l,3r',
      gallerySize: Math.round(gallerySize * 5 + 500),
      fixedColumns: 0,
    }),
    collage_hor: () => ({
      cubeImages: false,
      isVertical: false,
      galleryType: 'Strips',
      groupSize: 3,
      groupTypes: '1,2h,2v,3t,3b,3l,3r',
      gallerySize: Math.round(gallerySize * 5 + 500),
      fixedColumns: 0,
    }),
    grid: () => ({
      cubeImages: true,
      isVertical: true,
      galleryType: 'Columns',
      groupSize: 1,
      groupTypes: '1',
      gallerySize: Math.round(gallerySize * 8.5 + 150),
      fixedColumns: 0,
      isGrid: true,
    }),
    masonry_ver: () => ({
      cubeImages: false,
      isVertical: true,
      galleryType: 'Columns',
      groupSize: 1,
      groupTypes: '1',
      gallerySize: Math.round(gallerySize * 8 + 200),
      fixedColumns: 0,
    }),
    masonry_hor: () => ({
      cubeImages: false,
      isVertical: false,
      galleryType: 'Strips',
      groupSize: 1,
      groupTypes: '1',
      gallerySize: Math.round(gallerySize * 5 + 200),
      fixedColumns: 0,
    }),
    one_col: () => ({
      cubeImages: false,
      isVertical: true,
      galleryType: 'Columns',
      groupSize: 1,
      groupTypes: '1',
      gallerySize: () => dimensionsHelper.getGalleryWidth(), //'full_width';
      fixedColumns: 1,
    }),
    one_row: () => ({
      cubeImages: false,
      isVertical: false,
      galleryType: 'Strips',
      groupSize: 1,
      groupTypes: '1',
      gallerySize: () => dimensionsHelper.getGalleryHeight(),
      fixedColumns: 0,
    }),
    slideshow: () => ({
      showArrows: true,
      cubeImages: true,
      cubeRatio: () => dimensionsHelper.getGalleryRatio(),
      isVertical: true,
      gallerySize: () => dimensionsHelper.getGalleryWidth(),
      galleryType: 'Columns',
      groupSize: 1,
      groupTypes: '1',
      fixedColumns: 1,
    }),
  };

  let styleState;

  switch (galleryType) {
    case '-1': //empty
      styleState = {
        gallerySize,
      };
      break;
    case '0': //vertical collage
      styleState = galleryTypes.collage_ver();
      break;
    default:
    case '1': //horizontal collage
      styleState = galleryTypes.collage_hor();
      break;
    case '2': //grid
      styleState = galleryTypes.grid();
      break;
    case '3': //vertical masonry
      styleState = galleryTypes.masonry_ver();
      break;
    case '4': //horizontal masonry
      styleState = galleryTypes.masonry_hor();
      break;
    case '5': //one column
      styleState = galleryTypes.one_col();
      break;
    case '6': //one row
      styleState = galleryTypes.one_row();
      break;
    case '7': //slideshow
      styleState = galleryTypes.slideshow();
      break;
  }

  return styleState;
}

function getStyleByLayout(styles, container) {
  //new layouts
  let { galleryLayout, gallerySize, magicLayoutSeed } = styles;

  const layouts = {
    collage: () => ({
      showArrows: false,
      cubeImages: false,
      groupSize: 3,
      groupTypes: '1,2h,2v,3t,3b,3l,3r',
      gallerySize: Math.round(gallerySize * 5 + 500),
      fixedColumns: 0,
      hasThumbnails: false,
      enableScroll: true,
      isGrid: false,
      isSlider: false,
      isMasonry: false,
      isColumns: false,
      isSlideshow: false,
      cropOnlyFill: false,
      slideshowLoop: false,
    }),
    masonry: () => ({
      showArrows: false,
      cubeImages: false,
      groupSize: 1,
      groupTypes: '1',
      gallerySize,
      fixedColumns: 0,
      hasThumbnails: false,
      enableScroll: true,
      isGrid: false,
      isSlider: false,
      isMasonry: true,
      isColumns: false,
      isSlideshow: false,
      cropOnlyFill: false,
      oneRow: false,
      slideshowLoop: false,
    }),
    grid: () => ({
      showArrows: false,
      cubeImages: true,
      smartCrop: false,
      imageResize: false,
      isVertical: true,
      galleryType: 'Columns',
      groupSize: 1,
      groupTypes: '1',
      fixedColumns: undefined,
      gallerySize: Math.round(gallerySize * 8.5 + 150),
      hasThumbnails: false,
      enableScroll: true,
      cropOnlyFill: false,
      isSlider: false,
      isColumns: false,
      isGrid: true,
      isMasonry: false,
      isSlideshow: false,
      minItemSize: 50,
      slideshowLoop: false,
    }),
    thumbnails: () => ({
      showArrows: true,
      cubeImages: true,
      smartCrop: false,
      cubeRatio: () => dimensionsHelper.getGalleryRatio(),
      isVertical: false,
      galleryType: 'Strips',
      groupSize: 1,
      gallerySize: () => dimensionsHelper.getGalleryWidth(),
      groupTypes: '1',
      oneRow: true,
      hasThumbnails: true,
      enableScroll: false,
      isGrid: false,
      isSlider: false,
      isMasonry: false,
      isColumns: false,
      isSlideshow: false,
      cropOnlyFill: false,
      floatingImages: 0,
      galleryMargin: 0,
      imageMargin: 0,
    }),
    slider: () => ({
      showArrows: true,
      cubeImages: true,
      smartCrop: false,
      isVertical: false,
      galleryType: 'Strips',
      groupSize: 1,
      groupTypes: '1',
      gallerySize: () => dimensionsHelper.getGalleryHeight(),
      oneRow: true,
      hasThumbnails: false,
      enableScroll: true,
      isGrid: false,
      isSlider: true,
      isColumns: false,
      isMasonry: false,
      isSlideshow: false,
      cropOnlyFill: true,
    }),
    slideshow: () => ({
      showArrows: true,
      cubeImages: true,
      smartCrop: false,
      cubeRatio: () => dimensionsHelper.getGalleryRatio(),
      isVertical: false,
      gallerySize: 550,
      galleryType: 'Strips',
      groupSize: 1,
      groupTypes: '1',
      fixedColumns: 1,
      oneRow: true,
      hasThumbnails: false,
      enableScroll: true,
      isGrid: false,
      isColumns: false,
      isMasonry: false,
      isSlider: false,
      isSlideshow: true,
      cropOnlyFill: false,
      floatingImages: 0,
      galleryMargin: 0,
      imageMargin: 0,
    }),
    panorama: () => ({
      showArrows: false,
      cubeImages: false,
      isVertical: true,
      galleryType: 'Columns',
      groupSize: 1,
      groupTypes: '1',
      gallerySize: () => dimensionsHelper.getGalleryWidth(),
      oneRow: false,
      fixedColumns: 1,
      hasThumbnails: false,
      enableScroll: true,
      isGrid: false,
      isColumns: false,
      isMasonry: false,
      isSlider: false,
      isSlideshow: false,
      cropOnlyFill: false,
      slideshowLoop: false,
    }),
    column: () => ({
      showArrows: true,
      cubeImages: true,
      smartCrop: false,
      cubeType: 'fill',
      cubeRatio: 0.35,
      isVertical: false,
      galleryType: 'Strips',
      groupSize: 1,
      groupTypes: '1',
      gallerySize: () => dimensionsHelper.getGalleryHeight(),
      fixedColumns: 0,
      hasThumbnails: false,
      oneRow: true,
      enableScroll: true,
      isGrid: false,
      isColumns: true,
      isMasonry: false,
      isSlider: false,
      isSlideshow: false,
      cropOnlyFill: false,
    }),
    fullsize: () => ({
      showArrows: true,
      cubeImages: true,
      smartCrop: false,
      cubeType: 'fill',
      cubeRatio: () => dimensionsHelper.getGalleryRatio(),
      isVertical: false,
      galleryType: 'Strips',
      groupSize: 1,
      gallerySize: () => dimensionsHelper.getGalleryWidth(),
      groupTypes: '1',
      oneRow: true,
      hasThumbnails: false,
      enableScroll: false,
      isGrid: false,
      isSlider: false,
      isColumns: false,
      isMasonry: false,
      isSlideshow: false,
      cropOnlyFill: false,
      floatingImages: 0,
      galleryMargin: 0,
      imageMargin: 0,
      slideshowLoop: false,
    }),
    empty: () => ({
      gallerySize: Math.round(gallerySize * 9 + 100),
    }),
    magic: () => getStyleBySeed(magicLayoutSeed),
    bricks: () => getFixedLayouts(0),
    alternate: () => getFixedLayouts(1),
    mix: () => getFixedLayouts(2),
  };

  const galleyLayoutList = [
    'empty', // -1
    'collage', // 0
    'masonry', // 1
    'grid', // 2
    'thumbnails', // 3
    'slider', // 4
    'slideshow', // 5
    'panorama', // 6
    'column', // 7
    'magic', // 8
    'fullsize', // 9
    'bricks', // 10
    'alternate', // 11
    'mix', // 12
  ];

  let layoutName = galleyLayoutList[galleryLayout + 1]; //the empty layout is -1, collage is 0 etc.
  if (_.isUndefined(layoutName)) {
    if (utils.isStoreGallery()) {
      galleryLayout = 2;
      layoutName = 'grid';
    } else {
      galleryLayout = 0;
      layoutName = 'collage';
    }
  }

  const specialMobileStoreConfig = {};
  if (utils.isStoreGallery() && utils.isMobile()) {
    galleryLayout = 2;
    layoutName = 'grid';
    specialMobileStoreConfig.forceMobileCustomButton = true;
  }

  if (utils.isVerbose()) {
    console.log('chosen layout is', layoutName);
  }

  return _.merge(layouts[layoutName](), specialMobileStoreConfig, {
    galleryLayout,
  });
}

function addLayoutStyles(styles, container) {
  const galleryLayoutV1 = styles.galleryType;
  const galleryLayoutV2 = styles.galleryLayout;

  if (!_.isUndefined(galleryLayoutV1) && _.isUndefined(galleryLayoutV2)) {
    //legacy layouts - only if galleyrType parameter is specifically defined (i.e. layout had changed)

    styles = Object.assign(styles, getStyleByGalleryType(styles, container)); //legacy layouts
    styles.layoutsVersion = 1;
    const selectedLayoutVars = [
      'galleryType',
      'galleryThumbnailsAlignment',
      'magicLayoutSeed',
      'imageResize',
      'isVertical',
      'scrollDirection',
      'enableInfiniteScroll',
    ];
    styles.selectedLayout = selectedLayoutVars
      .map(key => String(styles[key]))
      .join('|');
  } else {
    //new layouts
    if (utils.isVerbose()) {
      console.log('Using galleryLayout for defaults', styles);
    }
    styles = Object.assign(
      {},
      emptyLayout,
      styles,
      getStyleByLayout(styles, container),
    ); //legacy layouts
    const selectedLayoutVars = [
      'galleryLayout',
      'galleryThumbnailsAlignment',
      'magicLayoutSeed',
      'imageResize',
      'isVertical',
      'scrollDirection',
      'enableInfiniteScroll',
    ];
    styles.selectedLayout = selectedLayoutVars
      .map(key => String(styles[key]))
      .join('|');
    styles.layoutsVersion = 2;
    styles.selectedLayoutV2 = galleryLayoutV2;
    if (utils.isVerbose()) {
      console.log('new selected layout', styles.selectedLayout);
    }
  }
  styles = Object.assign(styles, processLayouts(styles));
  return styles;
}

function processLayouts(styles) {
  const processedStyles = styles;
  processedStyles.isSlideshowFont = isSlideshowFont(processedStyles);

  if (utils.isMobile()) {
    if (processedStyles.isSlideshowFont) {
      if (!_.isUndefined(processedStyles.itemFontSlideshow)) {
        processedStyles.itemFontSlideshow.value = processedStyles.itemFontSlideshow.value.replace(
          /^font\s*:\s*/,
          '',
        );
        processedStyles.itemFontSlideshow.value = processedStyles.itemFontSlideshow.value.replace(
          /;$/,
          '',
        );
        if (processedStyles.itemFontSlideshow.value.indexOf('underline') > -1) {
          processedStyles.itemFontSlideshow.value = processedStyles.itemFontSlideshow.value.replace(
            'underline',
            '',
          );
          processedStyles.textDecorationTitle = 'underline';
        } else {
          processedStyles.textDecorationTitle = 'none';
        }
      }
      if (!_.isUndefined(processedStyles.itemDescriptionFontSlideshow)) {
        processedStyles.itemDescriptionFontSlideshow.value = processedStyles.itemDescriptionFontSlideshow.value.replace(
          /^font\s*:\s*/,
          '',
        );
        processedStyles.itemDescriptionFontSlideshow.value = processedStyles.itemDescriptionFontSlideshow.value.replace(
          /;$/,
          '',
        );
        if (
          processedStyles.itemDescriptionFontSlideshow.value.indexOf(
            'underline',
          ) > -1
        ) {
          processedStyles.itemDescriptionFontSlideshow.value = processedStyles.itemDescriptionFontSlideshow.value.replace(
            'underline',
            '',
          );
          processedStyles.textDecorationDesc = 'underline';
        } else {
          processedStyles.textDecorationDesc = 'none';
        }
      }
    } else {
      if (!_.isUndefined(processedStyles.itemFont)) {
        processedStyles.itemFont.value = processedStyles.itemFont.value.replace(
          /^font\s*:\s*/,
          '',
        );
        processedStyles.itemFont.value = processedStyles.itemFont.value.replace(
          /;$/,
          '',
        );
        if (processedStyles.itemFont.value.indexOf('underline') > -1) {
          processedStyles.itemFont.value = processedStyles.itemFont.value.replace(
            'underline',
            '',
          );
          processedStyles.textDecorationTitle = 'underline';
        } else {
          processedStyles.textDecorationTitle = 'none';
        }
      }
      if (!_.isUndefined(processedStyles.itemDescriptionFont)) {
        processedStyles.itemDescriptionFont.value = processedStyles.itemDescriptionFont.value.replace(
          /^font\s*:\s*/,
          '',
        );
        processedStyles.itemDescriptionFont.value = processedStyles.itemDescriptionFont.value.replace(
          /;$/,
          '',
        );
        if (
          processedStyles.itemDescriptionFont.value.indexOf('underline') > -1
        ) {
          processedStyles.itemDescriptionFont.value = processedStyles.itemDescriptionFont.value.replace(
            'underline',
            '',
          );
          processedStyles.textDecorationDesc = 'underline';
        } else {
          processedStyles.textDecorationDesc = 'none';
        }
      }
    }
  }

  if (
    (!processedStyles.isVertical ||
      processedStyles.groupSize > 1 ||
      processedStyles.oneRow === true) &&
    !processedStyles.isSlider &&
    !processedStyles.isColumns
  ) {
    processedStyles.titlePlacement = PLACEMENTS.SHOW_ON_HOVER;
  }

  if (processedStyles.titlePlacement === PLACEMENTS.SHOW_ON_HOVER) {
    if (
      processedStyles.hoveringBehaviour === INFO_BEHAVIOUR_ON_HOVER.DISAPPEARS
    ) {
      processedStyles.titlePlacement = PLACEMENTS.SHOW_NOT_ON_HOVER;
    } else if (
      processedStyles.hoveringBehaviour === INFO_BEHAVIOUR_ON_HOVER.NO_CHANGE
    ) {
      processedStyles.titlePlacement = PLACEMENTS.SHOW_ALWAYS;
    } else {
      //processedStyles.hoveringBehaviour === INFO_BEHAVIOUR_ON_HOVER.APPEARS
      processedStyles.titlePlacement = PLACEMENTS.SHOW_ON_HOVER;
    }
  }

  processedStyles.externalInfoHeight = getExternalInfoHeight(processedStyles);

  if (
    processedStyles.cubeType === 'fit' &&
    (processedStyles.isGrid ||
      processedStyles.hasThumbnails ||
      processedStyles.isSlider ||
      processedStyles.isSlideshow)
  ) {
    processedStyles.itemBorderWidth = 0;
    processedStyles.itemBorderRadius = 0;
    processedStyles.itemEnableShadow = false;
  }

  if (processedStyles.itemEnableShadow) {
    if (processedStyles.oneRow) {
      processedStyles.itemEnableShadow = false;
    } else {
      //add galleryMargin to allow the shadow to be seen
      processedStyles.galleryMargin = Math.max(
        processedStyles.galleryMargin,
        (processedStyles.itemShadowSize || 10) +
          (processedStyles.itemShadowBlur || 20),
      );
    }
  }

  if (processedStyles.oneRow) {
    //if oneRow is true, use horizontal layouts only
    processedStyles.isVertical = false;
    processedStyles.scrollAnimation = SCROLL_ANIMATIONS.NO_EFFECT;
  }
  if (processedStyles.imageMargin > 0) {
    if (utils.isMobile()) {
      processedStyles.imageMargin = Math.min(processedStyles.imageMargin, 50); //limit mobile spacing to 50px (25 on each side)
    }
    processedStyles.imageMargin /= 2;
  }

  if (processedStyles.loadMoreButtonFont && utils.isMobile()) {
    processedStyles.loadMoreButtonFont.value = processedStyles.loadMoreButtonFont.value.replace(
      /^font\s*:\s*/,
      '',
    );
    processedStyles.loadMoreButtonFont.value = processedStyles.loadMoreButtonFont.value.replace(
      /;$/,
      '',
    );
    if (processedStyles.loadMoreButtonFont.value.indexOf('underline') > -1) {
      processedStyles.loadMoreButtonFont.value = processedStyles.loadMoreButtonFont.value.replace(
        'underline',
        '',
      );
      processedStyles.textDecorationLoadMore = 'underline';
    } else {
      processedStyles.textDecorationLoadMore = 'none';
    }
  }

  if (processedStyles.isSlider) {
    processedStyles.cubeRatio = processedStyles.gallerySliderImageRatio;
  } else if (
    processedStyles.isGrid &&
    !_.isUndefined(processedStyles.galleryImageRatioFromWix)
  ) {
    processedStyles.cubeRatio = processedStyles.galleryImageRatioFromWix;
  }
  //Used to look like that before the split :
  // if (stateStyles.isSlider && canSet('gallerySliderImageRatio', 'cubeRatio')) {
  // 	stateStyles.cubeRatio = Number(eval(['16/9', '4/3', '1', '3/4', '9/16'][Number(wixStyles.gallerySliderImageRatio)]));
  // } else if (stateStyles.isSlider && _.isUndefined(stateStyles.cubeRatio)) {
  // 	stateStyles.cubeRatio = Number(eval(['16/9', '4/3', '1', '3/4', '9/16'][Number(this.defaultStateStyles.gallerySliderImageRatio)]));
  // } else if (stateStyles.isGrid && canSet('galleryImageRatio', 'cubeRatio')) {
  // 	stateStyles.cubeRatio = Number(eval(['16/9', '4/3', '1', '3/4', '9/16'][Number(wixStyles.galleryImageRatio)]));
  // }

  if (
    (processedStyles.isGrid && !processedStyles.oneRow) ||
    (layoutsVersionManager.allowFixedColumnsInMasonry() &&
      processedStyles.isMasonry &&
      processedStyles.isVertical)
  ) {
    // if (canSet('numberOfImagesPerRow', 'fixedColumns')) {
    //If toggle is for Items per row, fill the fixedColumns with the number of items
    //If toggle is responsive, make fixedColumns to be 0 or undefined;
    //Show the new controls only on Vertical scroll (one ow is false)
    processedStyles.fixedColumns =
      String(processedStyles.gridStyle) === '1'
        ? Number(processedStyles.numberOfImagesPerRow)
        : 0;
    processedStyles.groupTypes = '1';
    processedStyles.groupSize = 1;
    processedStyles.collageAmount = 0;
    processedStyles.collageDensity = 0;
    // }
  }

  //TODO this needs to split, need to leave the wixStyles assign in the statics section
  if (
    !_.isUndefined(processedStyles.numberOfImagesPerCol) &&
    processedStyles.isGrid &&
    processedStyles.oneRow
  ) {
    processedStyles.fixedColumns = 0;
    switch (processedStyles.numberOfImagesPerCol) {
      case 1:
      default:
        processedStyles.groupTypes = '1';
        processedStyles.groupSize = 1;
        processedStyles.collageAmount = 0;
        processedStyles.collageDensity = 0;
        break;
      case 2:
        processedStyles.groupTypes = '2v';
        processedStyles.groupSize = 2;
        processedStyles.collageAmount = 1;
        processedStyles.collageDensity = 1;
        break;
      case 3:
        processedStyles.groupTypes = '3v';
        processedStyles.groupSize = 3;
        processedStyles.collageAmount = 1;
        processedStyles.collageDensity = 1;
        break;
    }
  }

  //returned to the statics because it was the definition of the object.
  // processedStyles.sharpParams = {
  //   quality: 90,
  //   usm: {}
  // };

  //Backwards compatibility for masonry layout
  if (String(processedStyles.galleryLayout) === '1') {
    if (processedStyles.isVertical) {
      processedStyles.gallerySize = Math.round(
        processedStyles.gallerySize * 8 + 200,
      );
    } else {
      processedStyles.gallerySize = Math.round(
        processedStyles.gallerySize * 5 + 200,
      );
    }
  }

  if (processedStyles.forceMobileCustomButton) {
    processedStyles.gallerySize = Math.round(30 * 8.5 + 150);
    processedStyles.titlePlacement = PLACEMENTS.SHOW_BELOW;
    processedStyles.galleryLayout = 2;
    processedStyles.fixedColumns = 1;
    processedStyles.numberOfImagesPerRow = 1;
  }

  if (
    processedStyles.fixedColumns > 0 &&
    utils.isMobile() &&
    typeof processedStyles.m_numberOfImagesPerRow === 'undefined'
  ) {
    processedStyles.fixedColumns = 1;
  }

  //in case a special gallery size was specified, use it
  if (
    processedStyles.gallerySizeType === 'px' &&
    processedStyles.gallerySizePx > 0
  ) {
    processedStyles.gallerySize = processedStyles.gallerySizePx;
  } else if (
    processedStyles.gallerySizeType === 'ratio' &&
    processedStyles.gallerySizeRatio > 0
  ) {
    processedStyles.gallerySize =
      ((window && window.innerWidth) || 980) *
      (processedStyles.gallerySizeRatio / 100);
  }

  return processedStyles;
}

function getExternalInfoHeight(styleParams) {
  const {
    titlePlacement,
    itemFontSlideshow,
    itemDescriptionFontSlideshow,
    allowTitle,
    allowDescription,
    useCustomButton,
  } = styleParams;

  if (
    (titlePlacement !== 'SHOW_ABOVE' && titlePlacement !== 'SHOW_BELOW') ||
    (!allowTitle && !allowDescription && !useCustomButton)
  ) {
    return 0;
  }

  const paddingTopAndBottom = 45;
  const defaultButtonHeight = useCustomButton ? 33 : 0;
  const defaultItemFontSize = 22;
  const defaultItemDescriptionFontSize = 15;

  let totalSpaceBetweenElements =
    useCustomButton && (allowTitle || allowDescription)
      ? designConsts.spaceBetweenElements
      : 0;
  let titleFontSize = 0;
  let descriptionFontSize = 0;

  if (allowTitle) {
    titleFontSize = itemFontSlideshow
      ? getFontLineHeight(itemFontSlideshow)
      : defaultItemFontSize;
    totalSpaceBetweenElements += allowDescription
      ? designConsts.spaceBetweenTitleAndDescription
      : 0;
  }

  if (allowDescription) {
    descriptionFontSize = itemDescriptionFontSlideshow
      ? getFontLineHeight(itemDescriptionFontSlideshow)
      : defaultItemDescriptionFontSize;
  }

  return (
    10 +
    titleFontSize +
    3 * descriptionFontSize +
    paddingTopAndBottom +
    totalSpaceBetweenElements +
    defaultButtonHeight
  ); // HACK  +10 for spare place. we can not really know that this is the final font - thus, this whole calc to get the bottom info height will break one day again.
}

function getFontLineHeight(font) {
  if (font.value.match(/\/(\d+)px/)) {
    //lineHeight is in px
    return parseInt(font.value.match(/\/(\d+)px/)[1]);
  } else if (font.value.match(/\/(\d+)%/)) {
    //lineHeight is in percentage
    return font.size * (parseInt(font.value.match(/\/(\d+)%/)[1]) / 100);
  } else if (font.value.match(/px\/(([0-9]*[.])?[0-9]*)/)) {
    //lineHeight is in em or without any units (which means em too)
    return (
      font.size * parseFloat(font.value.match(/px\/(([0-9]*[.])?[0-9]*)/)[1])
    );
  } else {
    console.error(
      'GalleryContainer -> getFontLineHeight -> font lineHeight do not match any pattern. font value: ',
      font.value,
    );
    return font.size;
  }
}

function isSlideshowFont(styles) {
  const galleryLayout = styles.galleryLayout;
  if (galleryLayout === 5) {
    return true;
  }
  if (
    styles.titlePlacement === 'SHOW_ABOVE' ||
    styles.titlePlacement === 'SHOW_BELOW'
  ) {
    if (galleryLayout === 4 || galleryLayout === 6 || galleryLayout === 7) {
      return true;
    } else if (galleryLayout === 1 && styles.isVertical) {
      return true;
    } else if (galleryLayout === 2 && styles.scrollDirection !== 1) {
      return true;
    }
  }
  return false;
}

export { addLayoutStyles };
