import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';

export default {
  title: 'Auto slide Behaviour',
  isRelevant: (sp) =>
    sp.scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL &&
    sp.groupSize === 1 &&
    sp.isAutoSlideshow,
  isRelevantDescription:
    'Set a Horizontal gallery ("Scroll Direction" as "Horizontal") and set "Auto Slide" to "true".',
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS.autoSlideshowTypes.INTERVAL,
  options: createOptions('autoSlideshowTypes'),
  description: `Choose the type of auto-scrolling to be used when navigation between items, "interval" (time between navigation) or "continues" (Continuous scrolling).`,
};
