import { INPUT_TYPES } from '../utils/constants.js';
import { default as GALLERY_CONSTS } from '../../common/constants/index.js';
import { createOptions } from '../utils/utils.js';
import optionsMap from '../../core/helpers/optionsMap.js';

export default {
  title: 'Gallery Preset',
  description: `Choose from several preset of galleries`,
  isRelevantDescription: 'Always relevant.',
  isRelevant: () => true,
  type: INPUT_TYPES.OPTIONS,
  get options() {
    return createOptions(optionsMap.layoutParams.structure.galleryLayout);
  },
  default: GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].EMPTY,
};
