import {
  hasExternalVerticalPlacement,
  hasExternalHorizontalPlacement,
} from '../../common/constants/layoutParams_info_placement.js';
import { default as GALLERY_CONSTS } from '../../common/constants/index.js';
import optionsMap from './optionsMap.js';

const processTextDimensions = (options, customExternalInfoRendererExists) => {
  let _options = { ...options };

  _options[optionsMap.layoutParams.info.height] = getTextBoxAboveOrBelowHeight(
    _options,
    customExternalInfoRendererExists
  );

  _options.externalInfoHeight = getHeightFromOptions(_options, _options[optionsMap.layoutParams.info.height]);

  _options.externalInfoWidth = getTextBoxRightOrLeftWidth(_options, customExternalInfoRendererExists);
  return _options;
};

function getHeightFromOptions(options, infoHeight) {
  let additionalHeight = infoHeight;
  if (
    infoHeight > 0 &&
    hasExternalVerticalPlacement(options[optionsMap.layoutParams.info.placement]) &&
    options[optionsMap.layoutParams.info.layout] ===
      GALLERY_CONSTS[optionsMap.layoutParams.info.layout].SEPARATED_BACKGROUND
  ) {
    additionalHeight += options[optionsMap.layoutParams.info.spacing];
    additionalHeight += options[optionsMap.layoutParams.info.border.width] * 2;
  }
  return additionalHeight;
}

function getTextBoxRightOrLeftWidth(options, customExternalInfoRendererExists) {
  if (!shouldShowTextRightOrLeft(options, customExternalInfoRendererExists)) {
    return 0;
  }
  let width = 0;
  if (
    options[optionsMap.layoutParams.info.sizeUnits] === GALLERY_CONSTS[optionsMap.layoutParams.info.sizeUnits].PERCENT
  ) {
    width = Math.min(100, Math.max(0, options[optionsMap.layoutParams.info.width])) / 100;
  } else {
    width = options[optionsMap.layoutParams.info.width];
  }
  return width;
}

function shouldShowTextRightOrLeft(options, customExternalInfoRendererExists) {
  const allowedByLayoutConfig =
    options[optionsMap.layoutParams.structure.scrollDirection] ===
      GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].VERTICAL &&
    options[optionsMap.layoutParams.structure.layoutOrientation] ===
      GALLERY_CONSTS[optionsMap.layoutParams.structure.layoutOrientation].VERTICAL &&
    options[optionsMap.layoutParams.groups.groupSize] === 1;

  return (
    allowedByLayoutConfig &&
    hasExternalHorizontalPlacement(options[optionsMap.layoutParams.info.placement]) &&
    customExternalInfoRendererExists
  );
}

function getTextBoxAboveOrBelowHeight(options, customExternalInfoRendererExists) {
  if (!shouldShowTextBoxAboveOrBelow(options, customExternalInfoRendererExists)) {
    return 0;
  }
  return options[optionsMap.layoutParams.info.height];
}

function shouldShowTextBoxAboveOrBelow(options, customExternalInfoRendererExists) {
  return (
    hasExternalVerticalPlacement(options[optionsMap.layoutParams.info.placement]) && customExternalInfoRendererExists
  );
}

export default processTextDimensions;
/* eslint-enable prettier/prettier */
