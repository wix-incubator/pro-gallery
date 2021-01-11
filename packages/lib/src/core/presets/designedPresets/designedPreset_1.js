import LAYOUTS from '../../../common/constants/layout';
// import DESIGNED_PRESETS from '../../../common/constants/designedPreset';
import defaultStyles from '../../../common/defaultStyles';
import { calcTargetItemSize } from '../../helpers/layoutHelper';

export const fixedStyles = {
  galleryLayout: LAYOUTS.DESIGNED_PRESET,
  // designedPreset: DESIGNED_PRESETS.DESIGNED_PRESET_1,
  rotatingGroupTypes: '1,2v,2v',
  cubeImages: true,
  cubeRatio: '50%/100%',
  imageMargin: 0,
  gridStyle: 1,
  scrollDirection: 1,
};

export const createStyles = (styles) => {
  // eslint-disable-next-line no-debugger
  // debugger;
  return {
    // ...styles,
    ...defaultStyles,
    ...fixedStyles,
    targetItemSize: calcTargetItemSize(styles),
  };
};
