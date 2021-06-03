import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';

export default {
  title: 'Slide Transition',
  description: `Choose the kind of transition you want to have when moving to the next item by clicking the arrows in horizontal layouts`,
  isRelevantDescription:
    'To enable this set "Scroll Direction" to "Horizontal" and "Slide Animation" to "Scroll".',
  isRelevant: (sp) =>
    sp.scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL &&
    sp.slideAnimation === GALLERY_CONSTS.slideAnimations.SCROLL,
  options: createOptions('slideTransition'),
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS.slideTransition.linear,
};
