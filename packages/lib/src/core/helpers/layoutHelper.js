import utils from '../../common/utils';
import window from '../../common/window/windowWrapper';
import { featureManager } from './versionsHelper';
import SCROLL_DIRECTION from '../../common/constants/scrollDirection';
import PLACEMENTS, {
  hasVerticalPlacement,
  hasHoverPlacement,
  hasHorizontalPlacement,
} from '../../common/constants/placements';
import INFO_BEHAVIOUR_ON_HOVER from '../../common/constants/infoBehaviourOnHover';
import LOADING_MODE from '../../common/constants/loadingMode';
import LOADING_WITH_COLOR_MODE from '../../common/constants/loadingWithColorMode';
import SLIDE_ANIMATIONS from '../../common/constants/slideAnimations';
import GALLERY_SIZE_TYPE from '../../common/constants/gallerySizeType';
import INFO_TYPE from '../../common/constants/infoType';
import TEXT_BOX_WIDTH_CALCULATION_OPTIONS from '../../common/constants/textBoxWidthCalculationOptions';
import LAYOUTS from '../../common/constants/layout';

export const calcTargetItemSize = (styles, smartCalc = false) => {
  if (
    styles.gallerySizeType === GALLERY_SIZE_TYPE.PIXELS &&
    styles.gallerySizePx > 0
  ) {
    return styles.gallerySizePx;
  } else if (
    styles.gallerySizeType === GALLERY_SIZE_TYPE.RATIO &&
    styles.gallerySizeRatio > 0
  ) {
    return (
      ((window && window.innerWidth) || 980) * (styles.gallerySizeRatio / 100)
    );
  } else {
    return smartCalc ? smartCalc : styles.gallerySize;
  }
};
function processLayouts(styles, customExternalInfoRendererExists) {
  const processedStyles = styles;
  processedStyles.isSlideshowFont = isSlideshowFont(processedStyles);
  processedStyles.oneRow =
    processedStyles.oneRow ||
    processedStyles.scrollDirection === SCROLL_DIRECTION.HORIZONTAL;

  const setTextUnderline = (itemFontStyleParam, textDecorationType) => {
    /* itemFontStyleParam: itemFontSlideshow / itemDescriptionFontSlideshow / itemFont / itemDescriptionFont
    textDecorationType: textDecorationTitle / textDecorationDesc */
    processedStyles[itemFontStyleParam].value = processedStyles[
      itemFontStyleParam
    ].value.replace(/^font\s*:\s*/, '');
    processedStyles[itemFontStyleParam].value = processedStyles[
      itemFontStyleParam
    ].value.replace(/;$/, '');
    if (
      processedStyles[itemFontStyleParam].value.indexOf('underline') > -1 ||
      processedStyles[itemFontStyleParam].style.underline === true
    ) {
      processedStyles[itemFontStyleParam].value = processedStyles[
        itemFontStyleParam
      ].value.replace('underline', '');
      processedStyles[textDecorationType] = 'underline';
    } else if (processedStyles[itemFontStyleParam].style.underline === false) {
      processedStyles[textDecorationType] = 'none';
    }
  };

  if (utils.isMobile()) {
    if (processedStyles.isSlideshowFont) {
      if (!utils.isUndefined(processedStyles.itemFontSlideshow)) {
        setTextUnderline('itemFontSlideshow', 'textDecorationTitle');
      }
      if (!utils.isUndefined(processedStyles.itemDescriptionFontSlideshow)) {
        setTextUnderline('itemDescriptionFontSlideshow', 'textDecorationDesc');
      }
    } else {
      if (!utils.isUndefined(processedStyles.itemFont)) {
        setTextUnderline('itemFont', 'textDecorationTitle');
      }
      if (!utils.isUndefined(processedStyles.itemDescriptionFont)) {
        setTextUnderline('itemDescriptionFont', 'textDecorationDesc');
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
  if (
    !hasHoverPlacement(processedStyles.titlePlacement) &&
    processedStyles.hoveringBehaviour !== INFO_BEHAVIOUR_ON_HOVER.NEVER_SHOW
  ) {
    processedStyles.hoveringBehaviour = INFO_BEHAVIOUR_ON_HOVER.APPEARS;
  }

  if (
    processedStyles.imageLoadingMode === LOADING_MODE.COLOR &&
    processedStyles.imageLoadingWithColorMode ===
      LOADING_WITH_COLOR_MODE.MAIN_COLOR
  ) {
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
      // add galleryMargin to allow the shadow to be seen
      processedStyles.galleryMargin = Math.max(
        processedStyles.galleryMargin,
        (processedStyles.itemShadowSize || 0) +
          (processedStyles.itemShadowBlur || 0)
      );
    }
  }

  if (processedStyles.oneRow) {
    // if oneRow is true, use horizontal layouts only
    processedStyles.isVertical = false;
    // processedStyles.scrollAnimation = SCROLL_ANIMATIONS.NO_EFFECT;
  } else {
    processedStyles.slideshowLoop = false; // allow slideshowLoop only for horizontal layouts
  }

  if (
    !processedStyles.oneRow ||
    processedStyles.groupSize > 1 ||
    !processedStyles.cubeImages
  ) {
    processedStyles.slideAnimation = SLIDE_ANIMATIONS.SCROLL;
  }

  if (processedStyles.imageMargin > 0) {
    if (utils.isMobile()) {
      processedStyles.imageMargin = Math.min(processedStyles.imageMargin, 50); // limit mobile spacing to 50px (25 on each side)
    }
    // processedStyles.imageMargin /= 2;
  }

  if (processedStyles.loadMoreButtonFont && utils.isMobile()) {
    processedStyles.loadMoreButtonFont.value = processedStyles.loadMoreButtonFont.value.replace(
      /^font\s*:\s*/,
      ''
    );
    processedStyles.loadMoreButtonFont.value = processedStyles.loadMoreButtonFont.value.replace(
      /;$/,
      ''
    );
    if (processedStyles.loadMoreButtonFont.value.indexOf('underline') > -1) {
      processedStyles.loadMoreButtonFont.value = processedStyles.loadMoreButtonFont.value.replace(
        'underline',
        ''
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
    // If toggle is for Items per row, fill the fixedColumns with the number of items
    // If toggle is responsive, make fixedColumns to be 0 or undefined;
    // Show the new controls only on Vertical scroll (one ow is false)
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

  // TODO this needs to split, need to leave the wixStyles assign in the statics section
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

  // returned to the statics because it was the definition of the object.
  // processedStyles.sharpParams = {
  //   quality: 90,
  //   usm: {}
  // };

  if (processedStyles.forceMobileCustomButton) {
    processedStyles.targetItemSize = Math.round(30 * 8.5 + 150);
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

  // in case a special gallery size was specified, use it
  if (
    processedStyles.gallerySizeType === GALLERY_SIZE_TYPE.PIXELS &&
    processedStyles.gallerySizePx > 0
  ) {
    processedStyles.targetItemSize = processedStyles.gallerySizePx;
  } else if (
    processedStyles.gallerySizeType === GALLERY_SIZE_TYPE.RATIO &&
    processedStyles.gallerySizeRatio > 0
  ) {
    processedStyles.targetItemSize =
      ((window && window.innerWidth) || 980) *
      (processedStyles.gallerySizeRatio / 100);
  }

  processedStyles.textBoxHeight = getTextBoxAboveOrBelowHeight(
    processedStyles,
    customExternalInfoRendererExists
  );
  processedStyles.externalInfoHeight = getHeightFromStyleParams(
    processedStyles,
    processedStyles.textBoxHeight
  );

  processedStyles.externalInfoWidth = getTextBoxRightOrLeftWidth(
    processedStyles,
    customExternalInfoRendererExists
  );

  // Handle case of autoplay on ios devices
  if (
    processedStyles.videoPlay === 'auto' &&
    processedStyles.itemClick === 'nothing' &&
    utils.isiOS()
  ) {
    processedStyles.videoPlay = 'onClick';
  }

  return processedStyles;
}

function getHeightFromStyleParams(styleParams, textBoxHeight) {
  let additionalHeight = textBoxHeight;
  if (
    textBoxHeight > 0 &&
    hasVerticalPlacement(styleParams.titlePlacement) &&
    styleParams.imageInfoType === INFO_TYPE.SEPARATED_BACKGROUND
  ) {
    additionalHeight += styleParams.textImageSpace;
    additionalHeight += styleParams.textBoxBorderWidth * 2;
  }
  return additionalHeight;
}

function getTextBoxRightOrLeftWidth(
  styleParams,
  customExternalInfoRendererExists
) {
  if (
    !shouldShowTextRightOrLeft(styleParams, customExternalInfoRendererExists)
  ) {
    return 0;
  }
  const {
    targetItemSize,
    calculateTextBoxWidthMode,
    textBoxWidth,
    textBoxWidthPercent,
  } = styleParams;
  let width = 0;
  if (
    calculateTextBoxWidthMode === TEXT_BOX_WIDTH_CALCULATION_OPTIONS.PERCENT
  ) {
    width = Math.min(100, Math.max(0, textBoxWidthPercent)) / 100;
  } else {
    width = Math.min(targetItemSize, textBoxWidth);
  }
  return width;
}

function shouldShowTextRightOrLeft(
  styleParams,
  customExternalInfoRendererExists
) {
  const { oneRow, isVertical, groupSize, titlePlacement } = styleParams;

  const allowedByLayoutConfig = !oneRow && isVertical && groupSize === 1;

  return (
    allowedByLayoutConfig &&
    hasHorizontalPlacement(titlePlacement) &&
    customExternalInfoRendererExists
  );
}

function getTextBoxAboveOrBelowHeight(
  styleParams,
  customExternalInfoRendererExists
) {
  if (
    !shouldShowTextBoxAboveOrBelow(
      styleParams,
      customExternalInfoRendererExists
    )
  ) {
    return 0;
  }
  return styleParams.textBoxHeight;
}

function shouldShowTextBoxAboveOrBelow(
  styleParams,
  customExternalInfoRendererExists
) {
  return (
    hasVerticalPlacement(styleParams.titlePlacement) &&
    customExternalInfoRendererExists
  );
}

function isSlideshowFont(styles) {
  const galleryLayout = styles.galleryLayout;
  if (galleryLayout === LAYOUTS.SLIDESHOW) {
    return true;
  }
  if (hasVerticalPlacement(styles.titlePlacement)) {
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

export default processLayouts;
