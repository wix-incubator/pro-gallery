//NEW STYPEPARAMS METHOD
import {
  calcTargetItemSize,
  fixColumnsIfNeeded,
} from '../helpers/newSPs_layoutHelper';
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
  res = fixColumnsIfNeeded(res);
  res.targetItemSize = calcTargetItemSize(
    res,
    Math.round(res[optionsMap.layoutParams.targetItemSize.value] * 9 + 100)
  );
  console.log(
    '>>>>>>>>>>>>>empty',
    options.layoutParams_groups_numberOfGroupsPerRow
  );
  return res;
};
