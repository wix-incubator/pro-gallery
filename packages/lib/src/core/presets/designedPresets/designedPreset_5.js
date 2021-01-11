import LAYOUTS from '../../../common/constants/layout';
import { calcTargetItemSize } from '../../helpers/layoutHelper';

export const fixedStyles = {
  galleryLayout: LAYOUTS.DESIGNED_PRESET_5,
  rotatingGroupTypes: '2v',
  cubeImages: true,
  rotatingCropRatios: '25%/40%,25%/60%,25%/60%,25%/40%',
  imageMargin: 2,
  gridStyle: 1,
  scrollDirection: 1,
  overlayBackground: 'rgba(8,8,8,0.53)',
};

export const createStyles = (styles) => {
  return {
    ...styles,
    ...fixedStyles,
    targetItemSize: calcTargetItemSize(styles),
  };
};
