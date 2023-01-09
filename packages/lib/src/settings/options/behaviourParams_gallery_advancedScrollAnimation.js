import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';

export default {
  title: 'Advanced Scroll Animation',
  description: `Choose the type of animation to be used when items appear while scrolling through the gallery`,
  isRelevantDescription:
    'To enable "Scroll Animation" either set a Vertical gallery ("Scroll Direction" as "Vertical")\nor set a Horizontal gallery ("Scroll Direction" as "Horizontal") with "Slide Animation" set to "Scroll".',
  isRelevant: (sp) =>
    sp.scrollDirection === GALLERY_CONSTS.scrollDirection.VERTICAL ||
    (sp.scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL &&
      sp.slideAnimation === GALLERY_CONSTS.slideAnimations.SCROLL),
  type: INPUT_TYPES.JSON,
  default: [],
};
