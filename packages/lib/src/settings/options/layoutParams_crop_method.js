import { INPUT_TYPES } from '../utils/constants.js';
import { default as GALLERY_CONSTS } from '../../common/constants/index.js';
import { createOptions } from '../utils/utils.js';
import optionsMap from '../../core/helpers/optionsMap.js';

export default {
  title: 'Cropping Method',
  isRelevant: (options) => options[optionsMap.layoutParams.crop.enable],
  isRelevantDescription: 'Set "Crop Images" to "true".',
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS[optionsMap.layoutParams.crop.method].FILL, //one source
  get options() {
    return createOptions(optionsMap.layoutParams.crop.method);
  },
  description: `Choose between croping the image to fill it's container ("fill") or fiting the whole image ("fit").
  `,
};
