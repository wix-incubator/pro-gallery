import { calcTargetItemSize, removeBordersIfNeeded } from '../helpers/layoutHelper.js';
import optionsMap from '../helpers/optionsMap.js';
import { GALLERY_CONSTS } from '../../index.js';

const fixToSlider = (options) => {
  let presetOptions = { ...options };
  presetOptions[optionsMap.layoutParams.structure.galleryLayout] =
    GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].SLIDER;
  presetOptions[optionsMap.layoutParams.crop.enable] = true;
  presetOptions[optionsMap.layoutParams.structure.scrollDirection] =
    GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].HORIZONTAL;
  presetOptions[optionsMap.layoutParams.structure.layoutOrientation] =
    GALLERY_CONSTS[optionsMap.layoutParams.structure.layoutOrientation].HORIZONTAL;
  presetOptions[optionsMap.layoutParams.groups.groupSize] = 1;
  presetOptions[optionsMap.layoutParams.groups.allowedGroupTypes] = [
    GALLERY_CONSTS[optionsMap.layoutParams.groups.allowedGroupTypes]['1'],
  ];
  presetOptions[optionsMap.layoutParams.structure.numberOfGridRows] = 1;
  presetOptions[optionsMap.layoutParams.crop.enableSmartCrop] = false;
  presetOptions[optionsMap.layoutParams.structure.responsiveMode] =
    GALLERY_CONSTS[optionsMap.layoutParams.structure.responsiveMode].SET_ITEMS_PER_ROW;
  presetOptions[optionsMap.behaviourParams.gallery.horizontal.enableScrollSnap] = true;
  presetOptions[optionsMap.layoutParams.crop.cropOnlyFill] = true;
  presetOptions[optionsMap.behaviourParams.gallery.horizontal.slideAnimation] =
    GALLERY_CONSTS[optionsMap.behaviourParams.gallery.horizontal.slideAnimation].SCROLL;
  return presetOptions;
};
export const fixedOptions = fixToSlider({});

export const createOptions = (options) => {
  let res = { ...options };
  res = fixToSlider(res);
  res.targetItemSize = calcTargetItemSize(res);
  res = removeBordersIfNeeded(res);
  return res;
};
