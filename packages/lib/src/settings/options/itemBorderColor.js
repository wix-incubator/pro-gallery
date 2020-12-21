import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';

export default {
  title: 'Item Border Color',
  description: `Set the border color for each item in the gallery.`,
  isRelevantDescription: 'Set "Crop Type" to anything but "Fit"',
  isRelevant: (styleParams) =>
    styleParams.cubeType !== GALLERY_CONSTS.cubeType.FIT,
  type: INPUT_TYPES.COLOR_PICKER,
  default: 'rgba(208, 208 ,208, 1)',
};
