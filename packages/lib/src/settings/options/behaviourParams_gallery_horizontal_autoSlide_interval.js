import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';

export default {
  title: 'Time Between Images',
  description: `Set an interval time when using autoSlide. `,
  min: 2,
  max: 30,
  isRelevant: (options) =>
    options.scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL &&
    options.behaviourParams.gallery.horizontal.autoSlide.behaviour ===
      GALLERY_CONSTS.autoSlideBehaviour.INTERVAL,
  type: INPUT_TYPES.NUMBER,
  isRelevantDescription:
    'Set a Horizontal gallery ("Scroll Direction" as "Horizontal") and set "Auto slide Behaviour" to "INTERVAL".',
  default: 4,
};
