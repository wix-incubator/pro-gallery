import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';

export default {
  title: 'Item Border Radius',
  description: `Set the border radius for each item in the gallery.`,
  isRelevantDescription: 'Set "Crop Type" to anything but "Fit".',
  isRelevant: (options) => options.cubeType !== GALLERY_CONSTS.cubeType.FIT,
  type: INPUT_TYPES.NUMBER,
  default: 0,
};
