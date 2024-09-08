import { calcTargetItemSize, removeBordersIfNeeded } from '../helpers/layoutHelper';
import optionsMap from '../helpers/optionsMap';
import { GALLERY_CONSTS } from '../..';

const fixToThumbnail = (options) => {
  let presetOptions = { ...options };
  presetOptions[optionsMap.layoutParams.structure.galleryLayout] =
    GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].THUMBNAIL;
  presetOptions[optionsMap.layoutParams.crop.ratios] = ['100%/100%'];
  presetOptions[optionsMap.layoutParams.structure.responsiveMode] =
    GALLERY_CONSTS[optionsMap.layoutParams.structure.responsiveMode].SET_ITEMS_PER_ROW;
  presetOptions[optionsMap.layoutParams.crop.enable] = true;
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
  presetOptions[optionsMap.layoutParams.structure.numberOfGridRows] = 1;
  presetOptions[optionsMap.layoutParams.crop.enableSmartCrop] = false;
  presetOptions[optionsMap.layoutParams.thumbnails.enable] = true;
  presetOptions[optionsMap.behaviourParams.gallery.horizontal.enableScrollSnap] = true;
  presetOptions[optionsMap.layoutParams.crop.cropOnlyFill] = false;
  presetOptions[optionsMap.layoutParams.structure.scatter.randomScatter] = 0;
  presetOptions[optionsMap.layoutParams.structure.scatter.manualScatter] = '';
  presetOptions[optionsMap.layoutParams.structure.itemSpacing] = 0;
  presetOptions[optionsMap.layoutParams.targetItemSize.value] = 550;

  return presetOptions;
};
export const fixedOptions = fixToThumbnail({});

export const createOptions = (options) => {
  let res = { ...options };
  res = fixToThumbnail(res);
  res.targetItemSize = calcTargetItemSize(res);
  res = removeBordersIfNeeded(res);
  return res;
};
