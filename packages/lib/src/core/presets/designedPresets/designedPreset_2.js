import LAYOUTS from '../../../common/constants/layout';
// import DESIGNED_PRESETS from '../../../common/constants/designedPreset';
import { calcTargetItemSize } from '../../helpers/layoutHelper';
import defaultStyles from '../../../common/defaultStyles';

export const fixedStyles = {
  galleryLayout: LAYOUTS.DESIGNED_PRESET,
  // designedPreset: DESIGNED_PRESETS.DESIGNED_PRESET_2,
  rotatingGroupTypes: '1,2v,2v,2v,2v,1',
  cubeImages: true,
  cubeRatio: '50%/100%',
  groupsPerStrip: 3,
  imageMargin: '2',
  gridStyle: '1',
};

export const createStyles = (styles) => {
  return {
    // ...styles,
    ...defaultStyles,
    ...fixedStyles,
    targetItemSize: calcTargetItemSize(styles),
  };
};
