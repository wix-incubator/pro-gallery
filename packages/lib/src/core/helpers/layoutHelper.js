/* eslint-disable prettier/prettier */
import utils from '../../common/utils';
import window from '../../common/window/windowWrapper';
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
import ARROWS_POSITION from '../../common/constants/arrowsPosition';
import { default as GALLERY_CONSTS } from '../../common/constants/index';

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

export const processNumberOfImagesPerRow = (styles) => {
  //This will be used in the masonry and grid presets
  if (
    styles.scrollDirection === GALLERY_CONSTS.scrollDirection.VERTICAL || //relevant for grid, in Masonry its fixed to !oneRow
      styles.isVertical //relevant for masonry, in grid its fixed to true.
  ) {
    const res = {}

    res.fixedColumns =
      String(styles.gridStyle) === '1'
        ? Number(styles.numberOfImagesPerRow)
        : 0;
    res.groupTypes = '1';
    res.groupSize = 1;
    res.collageAmount = 0;
    res.collageDensity = 0;
    // }
    return res;
  } else {
    return {};
  }
}

export const processNumberOfImagesPerCol = (styles) => {
    //This will be used in the grid preset
  if (
    !utils.isUndefined(styles.numberOfImagesPerCol) &&
    styles.scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL
  ) {
    const res = {}
    res.fixedColumns = 0;
    switch (styles.numberOfImagesPerCol) {
      case 1:
      default:
        res.groupTypes = '1';
        res.groupSize = 1;
        res.collageAmount = 0;
        res.collageDensity = 0;
        break;
      case 2:
        res.groupTypes = '2v';
        res.groupSize = 2;
        res.collageAmount = 1;
        res.collageDensity = 1;
        break;
      case 3:
        res.groupTypes = '3v';
        res.groupSize = 3;
        res.collageAmount = 1;
        res.collageDensity = 1;
        break;
    }
    return res
  } else {
    return {};
  }

}

function processLayouts(styles, customExternalInfoRendererExists) {
  const processedStyles = styles;

  const isDesignedPreset =
    processedStyles.galleryLayout === LAYOUTS.DESIGNED_PRESET;

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
    if (isSlideshowFont(processedStyles)) {
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
      (processedStyles.scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL && !isDesignedPreset)) &&
    !processedStyles.isSlider &&
    !processedStyles.isColumns
  ) {
    // Dont allow titlePlacement to be above / below / left / right
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
    if (processedStyles.scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL) {
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

  if (processedStyles.arrowsPosition === ARROWS_POSITION.OUTSIDE_GALLERY) {
    processedStyles.arrowsPadding = 0;
  }

  if (processedStyles.scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL) {
    // in horizontal galleries allow only horizontal orientation
    processedStyles.isVertical = false;
    // processedStyles.scrollAnimation = SCROLL_ANIMATIONS.NO_EFFECT;
  } else {
    processedStyles.slideshowLoop = false; // allow slideshowLoop only for horizontal layouts
  }

  if (
    processedStyles.scrollDirection === GALLERY_CONSTS.scrollDirection.VERTICAL ||
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
    processedStyles.loadMoreButtonFont.value =
      processedStyles.loadMoreButtonFont.value.replace(/^font\s*:\s*/, '');
    processedStyles.loadMoreButtonFont.value =
      processedStyles.loadMoreButtonFont.value.replace(/;$/, '');
    if (processedStyles.loadMoreButtonFont.value.indexOf('underline') > -1) {
      processedStyles.loadMoreButtonFont.value =
        processedStyles.loadMoreButtonFont.value.replace('underline', '');
      processedStyles.textDecorationLoadMore = 'underline';
    } else {
      processedStyles.textDecorationLoadMore = 'none';
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
  const { scrollDirection, isVertical, groupSize, titlePlacement } = styleParams;

  const allowedByLayoutConfig = scrollDirection === GALLERY_CONSTS.scrollDirection.VERTICAL && isVertical && groupSize === 1;

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
/* eslint-enable prettier/prettier */
