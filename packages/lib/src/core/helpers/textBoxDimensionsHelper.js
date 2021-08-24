import {
  hasExternalVerticalPlacement,
  hasExternalHorizontalPlacement,
} from '../../common/constants/placements';
import INFO_TYPE from '../../common/constants/infoType';
import TEXT_BOX_WIDTH_CALCULATION_OPTIONS from '../../common/constants/textBoxWidthCalculationOptions';
import { default as GALLERY_CONSTS } from '../../common/constants/index';

const processTextDimensions = (styles, customExternalInfoRendererExists) => {
  let _styles = { ...styles };

  _styles.textBoxHeight = getTextBoxAboveOrBelowHeight(
    _styles,
    customExternalInfoRendererExists
  );

  _styles.externalInfoHeight = getHeightFromStyleParams(
    _styles,
    _styles.textBoxHeight
  );

  _styles.externalInfoWidth = getTextBoxRightOrLeftWidth(
    _styles,
    customExternalInfoRendererExists
  );
  return _styles;
};

function getHeightFromStyleParams(styleParams, textBoxHeight) {
  let additionalHeight = textBoxHeight;
  if (
    textBoxHeight > 0 &&
    hasExternalVerticalPlacement(styleParams.titlePlacement) &&
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
  const { scrollDirection, isVertical, groupSize, titlePlacement } =
    styleParams;

  const allowedByLayoutConfig =
    scrollDirection === GALLERY_CONSTS.scrollDirection.VERTICAL &&
    isVertical &&
    groupSize === 1;

  return (
    allowedByLayoutConfig &&
    hasExternalHorizontalPlacement(titlePlacement) &&
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
    hasExternalVerticalPlacement(styleParams.titlePlacement) &&
    customExternalInfoRendererExists
  );
}

export default processTextDimensions;
/* eslint-enable prettier/prettier */
