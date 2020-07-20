import utils from '../../common/utils';
import PLACEMENTS, {hasHorizontalPlacement, hasVerticalPlacement, hasHoverPlacement} from '../../common/constants/placements';
import INFO_BEHAVIOUR_ON_HOVER from '../../common/constants/infoBehaviourOnHover';
import SCROLL_ANIMATIONS from '../../common/constants/scrollAnimations';
import GALLERY_SIZE_TYPE from '../../common/constants/gallerySizeType';
import window from '../../common/window/windowWrapper';
import { featureManager } from './versionsHelper';
import dimensionsHelper from './dimensionsHelper';
import INFO_TYPE from '../../common/constants/infoType';
import TEXT_BOX_WIDTH_CALCULATION_OPTIONS from '../../common/constants/textBoxWidthCalculationOptions';
import SCROLL_DIRECTION from '../../common/constants/scrollDirection';
import LOADING_MODE from '../../common/constants/loadingMode';
import LOADING_WITH_COLOR_MODE from '../../common/constants/loadingWithColorMode';
import NEW_PRESETS from '../gallery/presets/presets';
import { GALLERY_CONSTS } from '../../settings/utils/constants';

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


function getStyleByGalleryType(styles) {
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

//returns true if the given param is in the current layout preset
export const isInPreset = (styleParams, paramToCheck) => {
  const layoutName = getLayoutName(styleParams.galleryLayout) || 'empty';// empty for when there is no layout given
  return Object.keys(NEW_PRESETS[layoutName]).includes(paramToCheck);
}

const getLayoutName = (galleryLayout) => {
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
  return galleyLayoutList[galleryLayout + 1]
}

function addLayoutStyles(styles, customExternalInfoRendererExists) {
  const galleryLayoutV1 = styles.galleryType;
  const galleryLayoutV2 = styles.galleryLayout;

  if (!utils.isUndefined(galleryLayoutV1) && utils.isUndefined(galleryLayoutV2)) {
    //legacy layouts - only if galleyrType parameter is specifically defined (i.e. layout had changed)

    styles = Object.assign(styles, getStyleByGalleryType(styles)); //legacy layouts
    styles.layoutsVersion = 1;
    const selectedLayoutVars = [
      'galleryType',
      'galleryThumbnailsAlignment',
      'magicLayoutSeed',
      'cubeType',
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

    styles = Object.assign({}, emptyLayout, styles);
    const selectedLayoutVars = [
      'galleryLayout',
      'galleryThumbnailsAlignment',
      'magicLayoutSeed',
      'cubeType',
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
  styles = Object.assign(styles, processLayouts(styles, customExternalInfoRendererExists));
  return styles;
}

function processLayouts(styles, customExternalInfoRendererExists) {
  const processedStyles = styles;
  processedStyles.isSlideshowFont = isSlideshowFont(processedStyles);
  processedStyles.oneRow = processedStyles.oneRow || processedStyles.scrollDirection === SCROLL_DIRECTION.HORIZONTAL;

  if (utils.isMobile()) {
    if (processedStyles.isSlideshowFont) {
      if (!utils.isUndefined(processedStyles.itemFontSlideshow)) {
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
      if (!utils.isUndefined(processedStyles.itemDescriptionFontSlideshow)) {
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
      if (!utils.isUndefined(processedStyles.itemFont)) {
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
      if (!utils.isUndefined(processedStyles.itemDescriptionFont)) {
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
    // all horizontal layouts that are not slider or columns
    processedStyles.titlePlacement = PLACEMENTS.SHOW_ON_HOVER;
  }

  // to_wrapper
  if (!hasHoverPlacement(processedStyles.titlePlacement) &&
    processedStyles.hoveringBehaviour !== INFO_BEHAVIOUR_ON_HOVER.NEVER_SHOW
    ) {
    processedStyles.hoveringBehaviour = INFO_BEHAVIOUR_ON_HOVER.APPEARS;
  }

  if (processedStyles.imageLoadingMode === LOADING_MODE.COLOR && processedStyles.imageLoadingWithColorMode === LOADING_WITH_COLOR_MODE.MAIN_COLOR) {
    processedStyles.imageLoadingMode = LOADING_MODE.MAIN_COLOR;
  }

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
        (processedStyles.itemShadowSize || 0) +
        (processedStyles.itemShadowBlur || 0),
      );
    }
  }

  if (processedStyles.oneRow) {
    //if oneRow is true, use horizontal layouts only
    processedStyles.isVertical = false;
    processedStyles.scrollAnimation = SCROLL_ANIMATIONS.NO_EFFECT;
  } else {
    processedStyles.slideshowLoop = false; //allow slideshowLoop only for horizontal layouts
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

  if (
    (processedStyles.isGrid && !processedStyles.oneRow) ||
    (featureManager.supports.fixedColumnsInMasonry &&
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
    !utils.isUndefined(processedStyles.numberOfImagesPerCol) &&
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
    processedStyles.gallerySizeType === GALLERY_SIZE_TYPE.PIXELS &&
    processedStyles.gallerySizePx > 0
  ) {
    processedStyles.gallerySize = processedStyles.gallerySizePx;
  } else if (
    processedStyles.gallerySizeType === GALLERY_SIZE_TYPE.RATIO &&
    processedStyles.gallerySizeRatio > 0
  ) {
    processedStyles.gallerySize =
      ((window && window.innerWidth) || 980) *
      (processedStyles.gallerySizeRatio / 100);
  }

  processedStyles.textBoxHeight = getTextBoxAboveOrBelowHeight(processedStyles, customExternalInfoRendererExists);
  processedStyles.externalInfoHeight = getHeightFromStyleParams(
    processedStyles,
    processedStyles.textBoxHeight
  );

  processedStyles.externalInfoWidth = getTextBoxRightOrLeftWidth(processedStyles, customExternalInfoRendererExists);

  return processedStyles;
}

function getHeightFromStyleParams(styleParams, textBoxHeight) {
  let additionalHeight = textBoxHeight;
  if (textBoxHeight > 0 && hasVerticalPlacement(styleParams.titlePlacement) &&
    styleParams.imageInfoType === INFO_TYPE.SEPARATED_BACKGROUND
  ) {
    additionalHeight += styleParams.textImageSpace;
    additionalHeight += styleParams.textBoxBorderWidth * 2;
  }
  return additionalHeight;
}

function getTextBoxRightOrLeftWidth(styleParams, customExternalInfoRendererExists) {
  if (!shouldShowTextRightOrLeft(styleParams, customExternalInfoRendererExists)) {
    return 0;
  }
  const {gallerySize, calculateTextBoxWidthMode, textBoxWidth, textBoxWidthPercent} = styleParams;
  let width = 0;
  if (calculateTextBoxWidthMode === TEXT_BOX_WIDTH_CALCULATION_OPTIONS.PERCENT) {
    width = Math.min(100, Math.max(0, textBoxWidthPercent)) / 100;
  } else {
    width = Math.min(gallerySize, textBoxWidth);
  }
  return width;
}

function shouldShowTextRightOrLeft(styleParams, customExternalInfoRendererExists) {
  const {
    oneRow,
    isVertical,
    groupSize,
    titlePlacement,
  } = styleParams;

  const allowedByLayoutConfig = !oneRow && isVertical && groupSize === 1;

  return (allowedByLayoutConfig &&
    hasHorizontalPlacement(titlePlacement) &&
    customExternalInfoRendererExists)
}

function getTextBoxAboveOrBelowHeight(styleParams, customExternalInfoRendererExists) {
  if (!shouldShowTextBoxAboveOrBelow(styleParams, customExternalInfoRendererExists)) {
    return 0;
  }
  return styleParams.textBoxHeight;
}

function shouldShowTextBoxAboveOrBelow(styleParams, customExternalInfoRendererExists) {
  return (
    hasVerticalPlacement(styleParams.titlePlacement) &&
    customExternalInfoRendererExists
  );
}



function isSlideshowFont(styles) {
  const galleryLayout = styles.galleryLayout;
  if (galleryLayout === GALLERY_CONSTS.layout.SLIDESHOW) {
    return true;
  }
  if (
    hasVerticalPlacement(styles.titlePlacement)
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

export { addLayoutStyles , processLayouts};
