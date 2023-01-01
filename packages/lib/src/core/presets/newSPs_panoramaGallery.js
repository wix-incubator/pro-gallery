//NEW STYPEPARAMS METHOD
import { calcTargetItemSize } from '../helpers/newSPs_layoutHelper';
import optionsMap from '../helpers/optionsMap';
import { GALLERY_CONSTS } from '../..';

const fixToPanorama = (options) => {
  let presetOptions = { ...options };
  presetOptions[optionsMap.layoutParams.structure.galleryLayout] =
    GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].PANORAMA;
  presetOptions[optionsMap.layoutParams.crop.enable] = false;
  presetOptions[optionsMap.layoutParams.structure.scrollDirection] =
    GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].VERTICAL;
  presetOptions[optionsMap.layoutParams.structure.layoutOrientation] =
    GALLERY_CONSTS[
      optionsMap.layoutParams.structure.layoutOrientation
    ].VERTICAL;
  presetOptions[optionsMap.layoutParams.groups.groupSize] = 1;
  presetOptions[optionsMap.layoutParams.groups.allowedGroupTypes] = [
    GALLERY_CONSTS[optionsMap.layoutParams.groups.allowedGroupTypes]['1'],
  ];
  presetOptions[optionsMap.layoutParams.structure.responsiveMode] =
    GALLERY_CONSTS[
      optionsMap.layoutParams.structure.responsiveMode
    ].SET_ITEMS_PER_ROW;
  presetOptions[optionsMap.layoutParams.structure.numberOfColumns] = 1;
  presetOptions[
    optionsMap.behaviourParams.gallery.horizontal.blockScroll
  ] = false;
  presetOptions[optionsMap.layoutParams.crop.cropOnlyFill] = false;
  presetOptions[optionsMap.behaviourParams.gallery.horizontal.loop] = false;
  return presetOptions;
};
export const fixedOptions = fixToPanorama({});

export const createOptions = (options) => {
  let res = { ...options };
  res = fixToPanorama(res);
  res[optionsMap.layoutParams.targetItemSize.value] = calcTargetItemSize(res);
  return res;
};
