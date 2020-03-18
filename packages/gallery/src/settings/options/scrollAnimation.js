import { INPUT_TYPES, GALLERY_CONSTS } from '../utils/constants';
import { createOptions } from '../utils/utils';

export default {
  title: 'Scroll Animation',
  description: `Choose the type of animation to be used when items appear while scrolling verticaly through the gallery`,
  isRelevant: (styleParams) => !styleParams.oneRow,
  options: createOptions('scrollAnimations'),
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS.scrollAnimations.NO_EFFECT,
}