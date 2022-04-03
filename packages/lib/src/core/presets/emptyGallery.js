import LAYOUTS from '../../common/constants/layout';
import { calcTargetItemSize } from '../helpers/layoutHelper';

const fixToEmpty = (options) => {
  let presetOptions = { ...options };
  presetOptions.galleryLayout = LAYOUTS.EMPTY;
  return presetOptions;
};
export const fixedOptions = fixToEmpty({});

export const createOptions = (options) => {
  let res = { ...options };
  res = fixToEmpty(res);
  res.targetItemSize = calcTargetItemSize(
    res,
    Math.round(res.gallerySize * 9 + 100)
  );
  return res;
};
