import { calcTargetItemSize, processNumberOfImagesPerRow, processGridStyle } from '../helpers/layoutHelper.js';
import optionsMap from '../helpers/optionsMap.js';

import { GALLERY_CONSTS } from '../../index.js';

const fixToFlex = (options) => {
  let presetOptions = { ...options };
  presetOptions[optionsMap.layoutParams.structure.galleryLayout] =
    GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].FLEX;
  presetOptions[optionsMap.layoutParams.crop.enable] = false;
  presetOptions[optionsMap.layoutParams.structure.scrollDirection] =
    GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].VERTICAL;
  presetOptions[optionsMap.layoutParams.groups.groupSize] = 1;
  presetOptions[optionsMap.layoutParams.groups.allowedGroupTypes] = [
    GALLERY_CONSTS[optionsMap.layoutParams.groups.allowedGroupTypes]['1'],
  ];
  presetOptions[optionsMap.behaviourParams.gallery.horizontal.loop] = false;
  presetOptions[optionsMap.layoutParams.crop.cropOnlyFill] = false;

  // Enable uniform dimensions - this is the key difference from masonry
  presetOptions[optionsMap.layoutParams.structure.uniformDimensions] = true;

  return presetOptions;
};

export const fixedOptions = fixToFlex({});

export const createOptions = (options) => {
  let res = { ...options };
  res = fixToFlex(res);
  const isVerticalOrientation =
    res[optionsMap.layoutParams.structure.layoutOrientation] ===
    GALLERY_CONSTS[optionsMap.layoutParams.structure.layoutOrientation].VERTICAL;
  const userDefinedTargetItemSizeValue = options[optionsMap.layoutParams.targetItemSize.value];
  res.targetItemSize = calcTargetItemSize(
    res,
    isVerticalOrientation ? userDefinedTargetItemSizeValue * 8 + 200 : userDefinedTargetItemSizeValue * 5 + 200
  );
  res = processNumberOfImagesPerRow(res);
  res = processGridStyle(res);
  return res;
};
