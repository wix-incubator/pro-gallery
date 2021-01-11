import LAYOUTS from '../../../common/constants/layout';
import PLACEMENTS from '../../../common/constants/placements';
import { calcTargetItemSize } from '../../helpers/layoutHelper';

export const fixedStyles = {
  galleryLayout: LAYOUTS.DESIGNED_PRESET_4,
  isVertical: true,
  groupSize: 1,
  cubeImages: true,
  fixedColumns: 1,
  imageMargin: 0,
  gridStyle: 1,
  titlePlacement: PLACEMENTS.ALTERNATE_HORIZONTAL,
  textBoxWidthPercent: 35,
};

export const createStyles = (styles) => {
  return {
    ...styles,
    ...fixedStyles,
    targetItemSize: calcTargetItemSize(styles),
  };
};
