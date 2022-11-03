//NEW STYPEPARAMS METHOD
import {
  calcTargetItemSize,
  processNumberOfImagesPerRow,
  processGridStyle,
} from '../helpers/newSPs_layoutHelper';
import { featureManager } from '../helpers/versionsHelper';
import optionsMap from '../helpers/optionsMap';

import { GALLERY_CONSTS } from '../..';
const fixToMasonry = (options) => {
  let presetOptions = { ...options };
  presetOptions[optionsMap.layoutParams.structure.galleryLayout] =
    GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].MASONRY;
  presetOptions[optionsMap.layoutParams.crop.enable] = false;
  presetOptions[optionsMap.layoutParams.structure.scrollDirection] =
    GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].VERTICAL;
  presetOptions[optionsMap.layoutParams.groups.groupSize] = 1;
  presetOptions[optionsMap.layoutParams.groups.allowedGroupTypes] = [
    GALLERY_CONSTS[optionsMap.layoutParams.groups.allowedGroupTypes]['1'],
  ];
  presetOptions[optionsMap.behaviourParams.gallery.horizontal.loop] = false;
  presetOptions[
    optionsMap.behaviourParams.gallery.horizontal.blockScroll
  ] = false;
  presetOptions[optionsMap.layoutParams.crop.cropOnlyFill] = false;
  return presetOptions;
};
export const fixedOptions = fixToMasonry({});

export const createOptions = (options) => {
  let res = { ...options };
  res = fixToMasonry(res);
  const isVerticalOrientation =
    res[optionsMap.layoutParams.structure.layoutOrientation] ===
    GALLERY_CONSTS[optionsMap.layoutParams.structure.layoutOrientation]
      .VERTICAL;
  res[optionsMap.layoutParams.targetItemSize.value] = calcTargetItemSize(
    res,
    isVerticalOrientation
      ? res[optionsMap.layoutParams.targetItemSize.value] * 8 + 200
      : res[optionsMap.layoutParams.targetItemSize.value] * 5 + 200
  );
  if (featureManager.supports.fixedColumnsInMasonry) {
    res = processNumberOfImagesPerRow(res);
  }
  res = processGridStyle(res);
  return res;
};
