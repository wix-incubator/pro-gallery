//NEW STYPEPARAMS METHOD
import { calcTargetItemSize } from '../helpers/newSPs_layoutHelper';
import optionsMap from '../helpers/optionsMap';
import { GALLERY_CONSTS } from '../..';

const fixToAlternate = (options) => {
  let presetOptions = { ...options };
  presetOptions[optionsMap.layoutParams.structure.galleryLayout] =
    GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].ALTERNATE;
  presetOptions[optionsMap.layoutParams.crop.method] =
    GALLERY_CONSTS[optionsMap.layoutParams.crop.method].FILL;
  presetOptions[optionsMap.layoutParams.crop.enable] = true;
  presetOptions[optionsMap.layoutParams.crop.ratios] = [1];
  presetOptions[optionsMap.layoutParams.info.placement] =
    GALLERY_CONSTS[optionsMap.layoutParams.info.placement].OVERLAY;
  presetOptions[optionsMap.layoutParams.structure.scrollDirection] =
    GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].VERTICAL;
  presetOptions[optionsMap.layoutParams.structure.responsiveMode] =
    GALLERY_CONSTS[
      optionsMap.layoutParams.structure.responsiveMode
    ].SET_ITEMS_PER_ROW;
  presetOptions[optionsMap.layoutParams.structure.gallerySpacing] = 0;
  presetOptions[optionsMap.layoutParams.structure.layoutOrientation] =
    GALLERY_CONSTS[
      optionsMap.layoutParams.structure.layoutOrientation
    ].VERTICAL;
  presetOptions[optionsMap.layoutParams.groups.groupSize] = 3;
  presetOptions[optionsMap.layoutParams.groups.density] = 0.48;
  presetOptions[optionsMap.layoutParams.groups.allowedGroupTypes] = [
    GALLERY_CONSTS[optionsMap.layoutParams.groups.allowedGroupTypes]['1'],
    GALLERY_CONSTS[optionsMap.layoutParams.groups.allowedGroupTypes]['2h'],
    GALLERY_CONSTS[optionsMap.layoutParams.groups.allowedGroupTypes]['2v'],
    GALLERY_CONSTS[optionsMap.layoutParams.groups.allowedGroupTypes]['3t'],
    GALLERY_CONSTS[optionsMap.layoutParams.groups.allowedGroupTypes]['3b'],
    GALLERY_CONSTS[optionsMap.layoutParams.groups.allowedGroupTypes]['3l'],
    GALLERY_CONSTS[optionsMap.layoutParams.groups.allowedGroupTypes]['3r'],
    GALLERY_CONSTS[optionsMap.layoutParams.groups.allowedGroupTypes]['3v'],
    GALLERY_CONSTS[optionsMap.layoutParams.groups.allowedGroupTypes]['3h'],
  ];
  presetOptions[optionsMap.layoutParams.targetItemSize.value] = 86;
  presetOptions[optionsMap.layoutParams.targetItemSize.minimum] = 50;
  presetOptions[optionsMap.layoutParams.groups.groupByOrientation] = true;
  presetOptions[optionsMap.layoutParams.groups.repeatingGroupTypes] = [
    GALLERY_CONSTS[optionsMap.layoutParams.groups.allowedGroupTypes]['1'],
    GALLERY_CONSTS[optionsMap.layoutParams.groups.allowedGroupTypes]['2h'],
    GALLERY_CONSTS[optionsMap.layoutParams.groups.allowedGroupTypes]['1'],
    GALLERY_CONSTS[optionsMap.layoutParams.groups.allowedGroupTypes]['2h'],
  ];
  presetOptions[optionsMap.layoutParams.crop.enableSmartCrop] = false;
  presetOptions[optionsMap.layoutParams.structure.scatter.randomScatter] = 0;
  presetOptions[optionsMap.layoutParams.structure.scatter.manualScatter] = '';
  presetOptions[optionsMap.layoutParams.structure.numberOfColumns] = 1;
  presetOptions[optionsMap.layoutParams.groups.numberOfGroupsPerRow] = 0;
  presetOptions[optionsMap.layoutParams.structure.groupsOrder] =
    GALLERY_CONSTS[optionsMap.layoutParams.structure.groupsOrder].BY_HEIGHT;
  // presetOptions.rotatingCropRatios = ''; //merged with crop.ratio(s) in the new method
  // presetOptions.slideshowLoop = false; //ALTERNATE is strictly vertical, this is irrelevant.

  return presetOptions;
};
export const fixedOptions = fixToAlternate({});

export const createOptions = (options) => {
  let res = { ...options };
  res = fixToAlternate(res);
  res[optionsMap.layoutParams.targetItemSize.value] = calcTargetItemSize(res);
  return res;
};
