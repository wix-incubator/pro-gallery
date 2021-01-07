import LAYOUTS from '../../../common/constants/layout';
import { calcTargetItemSize } from '../../helpers/layoutHelper';

export const fixedStyles = {
  galleryLayout: LAYOUTS.DESIGNED_PRESET_2,
  rotatingGroupTypes: '1,2v,2v,2v,2v,1',
  cubeImages: true,
  cubeRatio: '50%/100%',
  groupsPerStrip: 3,
  imageMargin: '2',
  gridStyle: '1',
  overlayBackground: 'rgba(8,8,8,0.53)',
};

export const createStyles = (styles) => {
  return {
    ...styles,
    ...fixedStyles,
    targetItemSize: calcTargetItemSize(styles),
  };
};
