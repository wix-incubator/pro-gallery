import LAYOUTS from '../../common/constants/layout';
import { calcTargetItemSize } from '../helpers/layoutHelper';

const fixToEmpty = (styles) => {
  let presetStyles = { ...styles };
  presetStyles.galleryLayout = LAYOUTS.EMPTY;
  return presetStyles;
};
export const fixedStyles = fixToEmpty({});

export const createStyles = (styles) => {
  let res = { ...styles };
  res = fixToEmpty(res);
  res.targetItemSize = calcTargetItemSize(
    res,
    Math.round(res.gallerySize * 9 + 100)
  );
  return res;
};
