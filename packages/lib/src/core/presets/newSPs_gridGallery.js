//NEW STYPEPARAMS METHOD
import {
  calcTargetItemSize,
  processNumberOfImagesPerRow,
  processNumberOfImagesPerCol,
  removeBordersIfNeeded,
} from '../helpers/newSPs_layoutHelper';
import optionsMap from '../helpers/optionsMap';
import { GALLERY_CONSTS } from '../..';

const fixToGrid = (options) => {
  let presetOptions = { ...options };
  presetOptions[optionsMap.layoutParams.structure.galleryLayout] =
    GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID;
  presetOptions[optionsMap.layoutParams.crop.enable] = true;
  presetOptions[optionsMap.layoutParams.structure.layoutOrientation] =
    GALLERY_CONSTS[
      optionsMap.layoutParams.structure.layoutOrientation
    ].VERTICAL;
  presetOptions[optionsMap.layoutParams.groups.groupSize] = 1;
  presetOptions[optionsMap.layoutParams.thumbnails.enable] = false;
  presetOptions[optionsMap.layoutParams.groups.allowedGroupTypes] = [
    GALLERY_CONSTS[optionsMap.layoutParams.groups.allowedGroupTypes]['1'],
  ];
  presetOptions[optionsMap.behaviourParams.gallery.horizontal.loop] = false;
  presetOptions[optionsMap.layoutParams.crop.enableSmartCrop] = false;
  // presetOptions.galleryType = 'Columns';
  presetOptions[optionsMap.layoutParams.targetItemSize.value] = 0;
  presetOptions[
    optionsMap.behaviourParams.gallery.horizontal.blockScroll
  ] = false;
  presetOptions[optionsMap.layoutParams.crop.cropOnlyFill] = false;
  presetOptions[optionsMap.layoutParams.targetItemSize.minimum] = 50;
  presetOptions[optionsMap.behaviourParams.gallery.horizontal.slideAnimation] =
    GALLERY_CONSTS[
      optionsMap.behaviourParams.gallery.horizontal.slideAnimation
    ].SCROLL;
  presetOptions[optionsMap.layoutParams.groups.density] = 0;
  return presetOptions;
};

export const fixedOptions = fixToGrid({});

export const createOptions = (options) => {
  let res = { ...options };
  res = fixToGrid(res);
  res[optionsMap.layoutParams.targetItemSize.value] = calcTargetItemSize(
    res,
    Math.round(res[optionsMap.layoutParams.targetItemSize.value] * 8.5 + 150)
  );
  res = processNumberOfImagesPerRow(res);
  res = processNumberOfImagesPerCol(res);
  res = removeBordersIfNeeded(res);
  return res;
};
