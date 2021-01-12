import LAYOUTS from '../../../common/constants/layout';
import { calcTargetItemSize } from '../../helpers/layoutHelper';

export const fixedStyles = {
  galleryLayout: LAYOUTS.DESIGNED_PRESET_3,
  groupSize: 1,
  cubeImages: true,
  cubeRatio: '100%/50%',
  rotatingCropRatios: '25%/100%,50%/100%',
  scrollAnimation: 'FADE_IN',
  scrollDirection: 1,
};

export const createStyles = (styles) => {
  return {
    ...styles,
    ...fixedStyles,
    targetItemSize: calcTargetItemSize(styles),
  };
};
