import { calcTargetItemSize } from '../helpers/layoutHelper';
import { GALLERY_CONSTS } from '../..';
import optionsMap from '../helpers/optionsMap';

const fixToColumn = (options) => {
  let presetOptions = { ...options };
  presetOptions[optionsMap.layoutParams.structure.galleryLayout] =
    GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].COLUMN;
  presetOptions[optionsMap.layoutParams.crop.method] = GALLERY_CONSTS[optionsMap.layoutParams.crop.method].FILL;
  presetOptions[optionsMap.layoutParams.crop.enable] = true;
  presetOptions[optionsMap.layoutParams.crop.ratios] = [0.35];
  presetOptions[optionsMap.layoutParams.structure.scrollDirection] =
    GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].HORIZONTAL;
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

  presetOptions[optionsMap.layoutParams.structure.numberOfColumns] = 0;
  presetOptions[optionsMap.layoutParams.crop.cropOnlyFill] = false;

  presetOptions[optionsMap.behaviourParams.gallery.horizontal.slideAnimation] =
    GALLERY_CONSTS[optionsMap.behaviourParams.gallery.horizontal.slideAnimation].SCROLL;

  //layouter direct API
  presetOptions.fixedColumns = 0;
  //layouter direct API
  return presetOptions;
};
export const fixedOptions = fixToColumn({});

export const createOptions = (options) => {
  let res = { ...options };
  res = fixToColumn(res);
  res.targetItemSize = calcTargetItemSize(res);
  return res;
};
