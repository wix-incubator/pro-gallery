import { INPUT_TYPES } from '../utils/constants.js';
import { default as GALLERY_CONSTS } from '../../common/constants/index.js';
import { createOptions } from '../utils/utils.js';
import optionsMap from '../../core/helpers/optionsMap.js';

export default {
  title: 'Slideshow Info alignment',
  isRelevant: () => true,
  isRelevantDescription: 'Always relevant.',
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS[optionsMap.behaviourParams.gallery.horizontal.slideshowInfo.buttonsAlignment].CENTER, //one source
  get options() {
    return createOptions(optionsMap.behaviourParams.gallery.horizontal.slideshowInfo.buttonsAlignment);
  },
  description: `This option effects the slideshow Play Button and slideshow number location.`,
};
