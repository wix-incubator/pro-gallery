import PLACEMENTS, {
  hasVerticalPlacement,
  hasHoverPlacement,
  hasHorizontalPlacement,
} from '../../common/constants/placements';
import INFO_BEHAVIOUR_ON_HOVER from '../../common/constants/infoBehaviourOnHover';
import INFO_TYPE from '../../common/constants/infoType';
import TEXT_BOX_WIDTH_CALCULATION_OPTIONS from '../../common/constants/textBoxWidthCalculationOptions';
import LAYOUTS from '../../common/constants/layout';
import { default as GALLERY_CONSTS } from '../../common/constants/index';

function addCalculatedInfoStyles(styles, customExternalInfoRendererExists) {
  const {
    textBoxWidthPercent,
    textBoxWidth,
    calculateTextBoxWidthMode,
    imageInfoType,
    textBoxBorderWidth,
    textImageSpace,
    textBoxHeight,
    targetItemSize,
    isVertical,
    groupSize,
    scrollDirection,
    isSlider,
    isColumns,
    titlePlacement,
    hoveringBehaviour,
    galleryLayout,
  } = styles;
  const processedStyles = styles;

  const isDesignedPreset = galleryLayout === LAYOUTS.DESIGNED_PRESET; //change this to a param coming from the presets. (of designed presets.), but I must understand why we need this anyway.

  if (
    (!isVertical ||
      groupSize > 1 ||
      (scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL &&
        !isDesignedPreset)) &&
    !isSlider &&
    !isColumns
  ) {
    // Dont allow titlePlacement to be above / below / left / right
    processedStyles.titlePlacement = PLACEMENTS.SHOW_ON_HOVER;
  }

  // to_wrapper
  if (
    !hasHoverPlacement(titlePlacement) &&
    hoveringBehaviour !== INFO_BEHAVIOUR_ON_HOVER.NEVER_SHOW
  ) {
    processedStyles.hoveringBehaviour = INFO_BEHAVIOUR_ON_HOVER.APPEARS;
  }

  processedStyles.textBoxHeight = getTextBoxAboveOrBelowHeight(
    titlePlacement,
    textBoxHeight,
    customExternalInfoRendererExists
  );

  processedStyles.externalInfoHeight = getHeightFromStyleParams(
    titlePlacement,
    textImageSpace,
    textBoxBorderWidth,
    imageInfoType,
    processedStyles.textBoxHeight
  );

  processedStyles.externalInfoWidth = getTextBoxRightOrLeftWidth(
    {
      scrollDirection,
      isVertical,
      groupSize,
      titlePlacement,
      targetItemSize,
      calculateTextBoxWidthMode,
      textBoxWidth,
      textBoxWidthPercent,
    },
    customExternalInfoRendererExists
  );
}

function getHeightFromStyleParams(
  titlePlacement,
  textImageSpace,
  textBoxBorderWidth,
  imageInfoType,
  textBoxHeight
) {
  let additionalHeight = textBoxHeight;
  if (
    textBoxHeight > 0 &&
    hasVerticalPlacement(titlePlacement) &&
    imageInfoType === INFO_TYPE.SEPARATED_BACKGROUND
  ) {
    additionalHeight += textImageSpace;
    additionalHeight += textBoxBorderWidth * 2;
  }
  return additionalHeight;
}

function getTextBoxRightOrLeftWidth(
  {
    scrollDirection,
    isVertical,
    groupSize,
    titlePlacement,
    targetItemSize,
    calculateTextBoxWidthMode,
    textBoxWidth,
    textBoxWidthPercent,
  },
  customExternalInfoRendererExists
) {
  if (
    !shouldShowTextRightOrLeft(
      scrollDirection,
      isVertical,
      groupSize,
      titlePlacement,
      customExternalInfoRendererExists
    )
  ) {
    return 0;
  }
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

function shouldShowTextRightOrLeft({
  scrollDirection,
  isVertical,
  groupSize,
  titlePlacement,
  customExternalInfoRendererExists,
}) {
  const allowedByLayoutConfig =
    scrollDirection === GALLERY_CONSTS.scrollDirection.VERTICAL &&
    isVertical &&
    groupSize === 1;

  return (
    allowedByLayoutConfig &&
    hasHorizontalPlacement(titlePlacement) &&
    customExternalInfoRendererExists
  );
}

function getTextBoxAboveOrBelowHeight(
  titlePlacement,
  textBoxHeight,
  customExternalInfoRendererExists
) {
  if (
    hasVerticalPlacement(titlePlacement) &&
    customExternalInfoRendererExists
  ) {
    return textBoxHeight;
  }
  return 0;
}

export default addCalculatedInfoStyles;
