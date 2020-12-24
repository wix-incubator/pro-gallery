import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';

export default {
  title: 'Scroll Animation',
  description: `Choose the type of animation to be used when items appear while scrolling verticaly through the gallery`,
  isRelevantDescription:
    'To enable "Scroll Animation" either set a Vertical gallery ("Scroll Direction" as "Vertical")\nor set a Horizontal gallery ("Scroll Direction" as "Horizontal") with "Slide Animation" set to "Scroll".',
  isRelevant: (sp) =>
    !sp.oneRow ||
    (sp.oneRow && sp.slideAnimation === GALLERY_CONSTS.slideAnimations.SCROLL),
  options: createOptions('scrollAnimations'),
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS.scrollAnimations.NO_EFFECT,
};
