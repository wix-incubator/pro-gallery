import { INPUT_TYPES } from '../utils/constants.js';
import { default as GALLERY_CONSTS } from '../../common/constants/index.js';
import optionsMap from '../../core/helpers/optionsMap.js';
import { default as cropMethod } from './layoutParams_crop_method.js';
export default {
  title: 'Item Border Color',
  description: `Set the border color for each item in the gallery.`,
  isRelevantDescription: 'Set "Crop Type" to anything but "Fit".',
  isRelevant: (options) =>
    cropMethod.isRelevant(options) &&
    options[optionsMap.layoutParams.crop.method] !== GALLERY_CONSTS[optionsMap.layoutParams.crop.method].FIT,
  type: INPUT_TYPES.COLOR_PICKER,
  default: 'rgba(208, 208 ,208, 1)',
};
