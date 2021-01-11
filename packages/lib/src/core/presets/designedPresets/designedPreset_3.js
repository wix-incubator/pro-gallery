import LAYOUTS from '../../../common/constants/layout';
// import DESIGNED_PRESETS from '../../../common/constants/designedPreset';
import { calcTargetItemSize } from '../../helpers/layoutHelper';
import defaultStyles from '../../../common/defaultStyles';

export const fixedStyles = {
  galleryLayout: LAYOUTS.DESIGNED_PRESET,
  // designedPreset: DESIGNED_PRESETS.DESIGNED_PRESET_3,
  rotatingGroupTypes: '2h',
  cubeImages: true,
  cubeRatio: '50%/100%',
  smartCrop: true,
  rotatingCropRatios: '3:4,4:3',
  imageMargin: 50,
  galleryMargin: 50,
  gridStyle: 1,
  scrollDirection: 1,
};

export const createStyles = (styles) => {
  return {
    // ...styles,
    ...defaultStyles,
    ...fixedStyles,
    targetItemSize: calcTargetItemSize(styles),
  };
};
