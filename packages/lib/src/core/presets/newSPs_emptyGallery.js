//NEW STYPEPARAMS METHOD
import { calcTargetItemSize } from '../helpers/newSPs_layoutHelper';
import optionsMap from '../helpers/optionsMap';
import { GALLERY_CONSTS } from '../..';

const fixToEmpty = (options) => {
  let presetOptions = { ...options };
  presetOptions[optionsMap.layoutParams.structure.galleryLayout] =
    GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].EMPTY;
  return presetOptions;
};
export const fixedOptions = fixToEmpty({});

export const createOptions = (options) => {
  let res = { ...options };
  res = fixToEmpty(res);
  res.targetItemSize = calcTargetItemSize(
    res,
    Math.round(res.targetItemSize * 9 + 100)
  );
  return res;
};
