import { INPUT_TYPES } from '../utils/constants.js';
import { default as GALLERY_CONSTS } from '../../common/constants/index.js';
import optionsMap from '../../core/helpers/optionsMap.js';

export default {
  title: 'Crop Only Fill? (find a better name)',
  description: `When using cubeType (FIT), this option let you keep the image original ratio while not creating
  margins between the image and the image container.`,
  isRelevant: (options) =>
    options[optionsMap.layoutParams.crop.enable] &&
    options[optionsMap.layoutParams.crop.method] === GALLERY_CONSTS[optionsMap.layoutParams.crop.method].FIT,
  isRelevantDescription: 'Set "Crop Images" to "true" and set "Crop Type" to "Fit".',
  type: INPUT_TYPES.BOOLEAN,
  default: false,
};
