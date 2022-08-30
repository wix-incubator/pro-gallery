import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';

export default {
  title: 'Scroll Animation',
  description: `Choose the type of animation to be used when items appear while scrolling vertically through the gallery`,
  isRelevantDescription:
    'To enable "Scroll Animation" either set a Vertical gallery ("Scroll Direction" as "Vertical")\nor set a Horizontal gallery ("Scroll Direction" as "Horizontal") with "Slide Animation" set to "Scroll".',
  isRelevant: (sp) => {
    const isSingleVerticalItemRendered = sp.layoutParams.repeatingGroupTypes
      ? sp.layoutParams.repeatingGroupTypes === '1'
      : sp.groupTypes === '1';
    return (
      sp.scrollDirection === GALLERY_CONSTS.scrollDirection.VERTICAL ||
      (sp.scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL &&
        sp.slideAnimation === GALLERY_CONSTS.slideAnimations.SCROLL &&
        !isSingleVerticalItemRendered)
    );
  },
  options: createOptions('scrollAnimations'),
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS.scrollAnimations.NO_EFFECT,
};
