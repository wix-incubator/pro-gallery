import optionsMap from '../../core/helpers/optionsMap.js';
import { INPUT_TYPES } from '../utils/constants.js';

export default {
  title: 'Smart Crop',
  description: `When set to true, items will be cropped according to their original size ratio`,
  isRelevant: (options) => options[optionsMap.layoutParams.crop.enable],
  isRelevantDescription: 'Set "Crop Images" to "true".',
  type: INPUT_TYPES.BOOLEAN,
  default: false,
};
