import { INPUT_TYPES } from '../utils/constants.js';
import { default as GALLERY_CONSTS } from '../../common/constants/index.js';
import optionsMap from '../../core/helpers/optionsMap.js';

export default {
  title: 'Item Border Width',
  description: `Set the border width for each item in the gallery .`,
  isRelevantDescription: 'Set "Crop Method" to anything but "Fit".',
  isRelevant: (options) =>
    options[optionsMap.layoutParams.crop.method] !== GALLERY_CONSTS[optionsMap.layoutParams.crop.method].FIT,
  type: INPUT_TYPES.NUMBER,
  default: 0, //one source
};
