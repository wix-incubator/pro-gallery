import LAYOUTS from '../../common/constants/layout';
import { calcTargetItemSize } from '../helpers/layoutHelper';

export const fixedStyles = {
  galleryLayout: LAYOUTS.DESIGNED_PRESET,
};

export const createStyles = (styles) => {
  return {
    ...styles,
    ...fixedStyles,
    targetItemSize: calcTargetItemSize(
      styles,
      Math.round(styles.gallerySize * 9 + 100)
    ),
  };
};
