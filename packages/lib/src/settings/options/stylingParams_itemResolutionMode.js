import { INPUT_TYPES } from '../utils/constants.js';
import { default as GALLERY_CONSTS } from '../../common/constants/index.js';
import { createOptions } from '../utils/utils.js';
import optionsMap from '../../core/helpers/optionsMap.js';

export default {
  title: 'Item Resolution Mode',
  isRelevant: () => true,
  isRelevantDescription: 'Always relevant',
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS[optionsMap.stylingParams.itemResolutionMode].SCALED_DOWN, //one source
  get options() {
    return createOptions(optionsMap.stylingParams.itemResolutionMode);
  },
  description: `Set the resolution loading mode for the images in the gallery,
  use "full" option to load the images in full resolution and the "sclaed down" option to load the images in thir container size.`,
};
