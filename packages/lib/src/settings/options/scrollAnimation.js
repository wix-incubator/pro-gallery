import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';

export default {
  title: 'Scroll Animation',
  description: `Choose the type of animation to be used when items appear while scrolling verticaly through the gallery`,
  isRelevant: () => true,
  options: createOptions('scrollAnimations'),
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS.scrollAnimations.NO_EFFECT,
};
