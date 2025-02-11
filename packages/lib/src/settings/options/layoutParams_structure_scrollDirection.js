import { INPUT_TYPES } from '../utils/constants.js';
import { default as GALLERY_CONSTS } from '../../common/constants/index.js';
import { createOptions } from '../utils/utils.js';
import optionsMap from '../../core/helpers/optionsMap.js';

export default {
  title: 'Scroll Direction',
  isRelevant: () => true,
  isRelevantDescription: 'Always relevant.',
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].VERTICAL,
  get options() {
    return createOptions(optionsMap.layoutParams.structure.scrollDirection);
  },
  description: `Toggle between two types of galleries. Vertical and Horizontal. Notice that many options are available only for a specific scroll direction.`,
};
