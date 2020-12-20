import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';

export default {
  title: 'Scroll Animation',
  description: `Choose the type of animation to be used when items appear while scrolling verticaly through the gallery`,
  isRelevantDescription:
    'set a vertical scrolled gallery, set "Slide Animation" to "Scroll".',
  isRelevant: (sp) =>
    !sp.oneRow || sp.slideAnimation === GALLERY_CONSTS.slideAnimations.SCROLL,
  options: createOptions('scrollAnimations'),
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS.scrollAnimations.NO_EFFECT,
};
