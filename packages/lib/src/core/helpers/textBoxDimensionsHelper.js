import {
  hasExternalVerticalPlacement,
  hasExternalHorizontalPlacement,
} from '../../common/constants/placements';
import INFO_TYPE from '../../common/constants/infoType';
import TEXT_BOX_WIDTH_CALCULATION_OPTIONS from '../../common/constants/textBoxWidthCalculationOptions';
import { default as GALLERY_CONSTS } from '../../common/constants';

const processTextDimensions = (options, customExternalInfoRendererExists) => {
  let _options = { ...options };

  _options.textBoxHeight = getTextBoxAboveOrBelowHeight(
    _options,
    customExternalInfoRendererExists
  );

  _options.externalInfoHeight = getHeightFromOptions(
    _options,
    _options.textBoxHeight
  );

  _options.externalInfoWidth = getTextBoxRightOrLeftWidth(
    _options,
    customExternalInfoRendererExists
  );
  return _options;
};

function getHeightFromOptions(options, textBoxHeight) {
  let additionalHeight = textBoxHeight;
  if (
    textBoxHeight > 0 &&
    hasExternalVerticalPlacement(options.titlePlacement) &&
    options.imageInfoType === INFO_TYPE.SEPARATED_BACKGROUND
  ) {
    additionalHeight += options.textImageSpace;
    additionalHeight += options.textBoxBorderWidth * 2;
  }
  return additionalHeight;
}

function getTextBoxRightOrLeftWidth(options, customExternalInfoRendererExists) {
  if (!shouldShowTextRightOrLeft(options, customExternalInfoRendererExists)) {
    return 0;
  }
  const { calculateTextBoxWidthMode, textBoxWidth, textBoxWidthPercent } =
    options;
  let width = 0;
  if (
    calculateTextBoxWidthMode === TEXT_BOX_WIDTH_CALCULATION_OPTIONS.PERCENT
  ) {
    width = Math.min(100, Math.max(0, textBoxWidthPercent)) / 100;
  } else {
    width = textBoxWidth;
  }
  return width;
}

function shouldShowTextRightOrLeft(options, customExternalInfoRendererExists) {
  const { scrollDirection, isVertical, groupSize, titlePlacement } = options;

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
  options,
  customExternalInfoRendererExists
) {
  if (
    !shouldShowTextBoxAboveOrBelow(options, customExternalInfoRendererExists)
  ) {
    return 0;
  }
  return options.textBoxHeight;
}

function shouldShowTextBoxAboveOrBelow(
  options,
  customExternalInfoRendererExists
) {
  return (
    hasExternalVerticalPlacement(options.titlePlacement) &&
    customExternalInfoRendererExists
  );
}

export default processTextDimensions;
/* eslint-enable prettier/prettier */
