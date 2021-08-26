import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';

export default {
  title: 'Time Between Images',
  description: `Set an interval time when using autoSlide, to have an auto sliding gallery. `,
  min: 2,
  max: 30,
  isRelevant: (options) =>
    options.isAutoSlideshow &&
    options.scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL &&
    options.autoSlideshowType ===
      GALLERY_CONSTS.autoSlideshowTypes.INTERVAL,
  type: INPUT_TYPES.NUMBER,
  isRelevantDescription:
    'Set a Horizontal gallery ("Scroll Direction" as "Horizontal") and set "Auto Slide" to "true".',
  default: 4,
};
