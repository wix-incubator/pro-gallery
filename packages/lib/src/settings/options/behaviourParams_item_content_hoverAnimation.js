import { INPUT_TYPES } from '../utils/constants.js';
import { default as GALLERY_CONSTS } from '../../common/constants/index.js';
import { createOptions } from '../utils/utils.js';
import optionsMap from '../../core/helpers/optionsMap.js';

export default {
  title: 'Image Hover Animation',
  isRelevant: () => true,
  isRelevantDescription: 'Always relevant.',
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS[optionsMap.behaviourParams.item.content.hoverAnimation].NO_EFFECT,
  get options() {
    return createOptions(optionsMap.behaviourParams.item.content.hoverAnimation);
  },
  description: `Choose the image animation effect to be used when hovering on each item.
  `,
};
