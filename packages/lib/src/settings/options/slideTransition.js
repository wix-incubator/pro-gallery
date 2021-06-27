import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';

export default {
  title: 'Slide Transition',
  description: `Choose the kind of transition you want to have when moving to the next item by clicking the arrows in horizontal layouts`,
  isRelevantDescription:
    'To enable this set "Scroll Direction" to "Horizontal" and "Slide Animation" to "Scroll".',
  isRelevant: (sp) =>
    sp.scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL &&
    sp.slideAnimation === GALLERY_CONSTS.slideAnimations.SCROLL,
  type: INPUT_TYPES.TEXT,
  default: GALLERY_CONSTS.slideTransition.ease,
};
