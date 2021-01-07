import LAYOUTS from '../../../common/constants/layout';
import { calcTargetItemSize } from '../../helpers/layoutHelper';

export const fixedStyles = {
  galleryLayout: LAYOUTS.DESIGNED_PRESET_1,
  rotatingGroupTypes: '1,2v,2v',
  cubeImages: true,
  cubeRatio: '50%/100%',
  imageMargin: 0,
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
