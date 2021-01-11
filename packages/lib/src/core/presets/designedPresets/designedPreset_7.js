import LAYOUTS from '../../../common/constants/layout';
import PLACEMENTS from '../../../common/constants/placements';
import { calcTargetItemSize } from '../../helpers/layoutHelper';

export const fixedStyles = {
  galleryLayout: LAYOUTS.DESIGNED_PRESET_7,
  isVertical: true,
  groupSize: 1,
  cubeImages: true,
  cubeRatio: '100%/100%',
  fixedColumns: 1,
  imageMargin: 80,
  galleryMargin: 150,
  gridStyle: 1,
  titlePlacement: PLACEMENTS.SHOW_ON_THE_RIGHT,
};

export const createStyles = (styles) => {
  return {
    ...styles,
    ...fixedStyles,
    targetItemSize: calcTargetItemSize(styles),
  };
};
