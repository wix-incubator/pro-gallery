//NEW STYPEPARAMS METHOD
import { calcTargetItemSize } from '../helpers/layoutHelper';
import optionsMap from '../helpers/optionsMap';
import { GALLERY_CONSTS } from '../..';

const fixToFullsize = (options) => {
  let presetOptions = { ...options };
  presetOptions[optionsMap.layoutParams.structure.galleryLayout] =
    GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].FULLSIZE;
  presetOptions[optionsMap.layoutParams.crop.enable] = true;
  presetOptions[optionsMap.layoutParams.crop.ratios] = ['100%/100%'];
  presetOptions[optionsMap.layoutParams.crop.method] =
    GALLERY_CONSTS[optionsMap.layoutParams.crop.method].FILL;
  presetOptions[optionsMap.layoutParams.info.placement] =
    GALLERY_CONSTS[optionsMap.layoutParams.info.placement].OVERLAY;
  presetOptions[optionsMap.layoutParams.structure.scrollDirection] =
    GALLERY_CONSTS[
      optionsMap.layoutParams.structure.scrollDirection
    ].HORIZONTAL;
  presetOptions[optionsMap.layoutParams.structure.gallerySpacing] = 0;
  presetOptions[optionsMap.layoutParams.structure.layoutOrientation] =
    GALLERY_CONSTS[
      optionsMap.layoutParams.structure.layoutOrientation
    ].VERTICAL;
  presetOptions[optionsMap.layoutParams.groups.groupSize] = 1;
  presetOptions[optionsMap.layoutParams.groups.allowedGroupTypes] = [
    GALLERY_CONSTS[optionsMap.layoutParams.groups.allowedGroupTypes]['1'],
  ];
  presetOptions[optionsMap.layoutParams.structure.numberOfGridRows] = 1;
  presetOptions[optionsMap.layoutParams.crop.enableSmartCrop] = false;
  presetOptions[optionsMap.layoutParams.thumbnails.enable] = false;
  presetOptions[
    optionsMap.behaviourParams.gallery.horizontal.blockScroll
  ] = false;
  presetOptions[
    optionsMap.behaviourParams.gallery.horizontal.enableScrollSnap
  ] = true;
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
  res[optionsMap.layoutParams.targetItemSize.value] = calcTargetItemSize(res);
  return res;
};
