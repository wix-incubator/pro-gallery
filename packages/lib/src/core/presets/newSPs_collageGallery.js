//NEW STYPEPARAMS METHOD
import { calcTargetItemSize } from '../helpers/newSPs_layoutHelper';
import optionsMap from '../helpers/optionsMap';
import { GALLERY_CONSTS } from '../..';

const fixToCollage = (options) => {
  let presetOptions = { ...options };
  presetOptions[optionsMap.layoutParams.structure.galleryLayout] =
    GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].COLLAGE;
  presetOptions[optionsMap.layoutParams.crop.enable] = true;
  GALLERY_CONSTS[optionsMap.layoutParams.info.placement].OVERLAY;
  presetOptions[optionsMap.layoutParams.groups.groupSize] = 3;
  presetOptions[optionsMap.layoutParams.thumbnails.enable] = false;
  presetOptions[optionsMap.layoutParams.groups.allowedGroupTypes] = [
    GALLERY_CONSTS[optionsMap.layoutParams.groups.allowedGroupTypes]['1'],
    GALLERY_CONSTS[optionsMap.layoutParams.groups.allowedGroupTypes]['2h'],
    GALLERY_CONSTS[optionsMap.layoutParams.groups.allowedGroupTypes]['2v'],
    GALLERY_CONSTS[optionsMap.layoutParams.groups.allowedGroupTypes]['3t'],
    GALLERY_CONSTS[optionsMap.layoutParams.groups.allowedGroupTypes]['3b'],
    GALLERY_CONSTS[optionsMap.layoutParams.groups.allowedGroupTypes]['3l'],
    GALLERY_CONSTS[optionsMap.layoutParams.groups.allowedGroupTypes]['3r'],
  ];
  presetOptions[optionsMap.behaviourParams.gallery.horizontal.loop] = false;
  presetOptions[optionsMap.layoutParams.structure.numberOfGridRows] = 1;
  presetOptions[optionsMap.layoutParams.structure.responsiveMode] =
    GALLERY_CONSTS[
      optionsMap.layoutParams.structure.responsiveMode
    ].FIT_TO_SCREEN;
  presetOptions[optionsMap.layoutParams.structure.numberOfColumns] = 0;
  presetOptions[
    optionsMap.behaviourParams.gallery.horizontal.blockScroll
  ] = false;
  presetOptions[optionsMap.layoutParams.crop.cropOnlyFill] = false;
  presetOptions[optionsMap.behaviourParams.gallery.horizontal.slideAnimation] =
    GALLERY_CONSTS[
      optionsMap.behaviourParams.gallery.horizontal.slideAnimation
    ].SCROLL;
  return presetOptions;
};
export const fixedOptions = fixToCollage({});

export const createOptions = (options) => {
  let res = { ...options };
  res = fixToCollage(res);
  res.targetItemSize = calcTargetItemSize(
    res,
    Math.round(res.targetItemSize * 5 + 500)
  );
  return res;
};
