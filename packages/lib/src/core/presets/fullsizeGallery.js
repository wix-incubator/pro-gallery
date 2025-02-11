import { calcTargetItemSize } from '../helpers/layoutHelper.js';
import optionsMap from '../helpers/optionsMap.js';
import { GALLERY_CONSTS } from '../../index.js';

const fixToFullsize = (options) => {
  let presetOptions = { ...options };
  presetOptions[optionsMap.layoutParams.structure.galleryLayout] =
    GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].FULLSIZE;
  presetOptions[optionsMap.layoutParams.crop.enable] = true;
  presetOptions[optionsMap.layoutParams.crop.ratios] = ['100%/100%'];
  presetOptions[optionsMap.layoutParams.crop.method] = GALLERY_CONSTS[optionsMap.layoutParams.crop.method].FILL;
  presetOptions[optionsMap.layoutParams.info.placement] =
    GALLERY_CONSTS[optionsMap.layoutParams.info.placement].OVERLAY;
  presetOptions[optionsMap.layoutParams.structure.scrollDirection] =
    GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].HORIZONTAL;
  presetOptions[optionsMap.layoutParams.structure.gallerySpacing] = 0;
  presetOptions[optionsMap.layoutParams.structure.layoutOrientation] =
    GALLERY_CONSTS[optionsMap.layoutParams.structure.layoutOrientation].HORIZONTAL;
  presetOptions[optionsMap.layoutParams.groups.groupSize] = 1;
  presetOptions[optionsMap.layoutParams.groups.allowedGroupTypes] = [
    GALLERY_CONSTS[optionsMap.layoutParams.groups.allowedGroupTypes]['1'],
  ];
  presetOptions[optionsMap.layoutParams.structure.responsiveMode] =
    GALLERY_CONSTS[optionsMap.layoutParams.structure.responsiveMode].SET_ITEMS_PER_ROW;
  presetOptions[optionsMap.layoutParams.structure.numberOfGridRows] = 1;
  presetOptions[optionsMap.layoutParams.crop.enableSmartCrop] = false;
  presetOptions[optionsMap.behaviourParams.gallery.horizontal.enableScrollSnap] = true;
  presetOptions[optionsMap.layoutParams.crop.cropOnlyFill] = true;
  presetOptions[optionsMap.layoutParams.structure.scatter.randomScatter] = 0;
  presetOptions[optionsMap.layoutParams.structure.scatter.manualScatter] = '';
  presetOptions[optionsMap.layoutParams.structure.itemSpacing] = 0;
  return presetOptions;
};
export const fixedOptions = fixToFullsize({});

export const createOptions = (options) => {
  let res = { ...options };
  res = fixToFullsize(res);
  res.targetItemSize = calcTargetItemSize(res);
  return res;
};
