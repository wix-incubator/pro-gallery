import LAYOUTS from '../../../common/constants/layout';
import GALLERY_SIZE_TYPE from '../../../common/constants/gallerySizeType';
import { calcTargetItemSize } from '../../helpers/layoutHelper';

export const fixedStyles = {
  galleryLayout: LAYOUTS.DESIGNED_PRESET_8,
  minItemSize: 80,
  groupTypes: '2h,3h',
  rotatingGroupTypes: '2h,3h',
  collageDensity: 0,
  cubeImage: true,
  imageMargin: 80,
  galleryMargin: 80,
  gallerySizeType: GALLERY_SIZE_TYPE.RATIO,
};

export const createStyles = (styles) => {
  return {
    ...styles,
    ...fixedStyles,
    targetItemSize: calcTargetItemSize(styles),
  };
};
