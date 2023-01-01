import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';

export default {
  title: 'Slide speed',
  description: `Set the slide speed when using "continuous" auto-scrolling.`,
  min: 100,
  max: 1000,
  isRelevant: (options) =>
    options.scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL &&
    options.behaviourParams.gallery.horizontal.autoSlide.behaviour ===
      GALLERY_CONSTS.autoSlideBehaviour.CONTINUOUS,
  type: INPUT_TYPES.NUMBER,
  isRelevantDescription:
    'Set a Horizontal gallery ("Scroll Direction" as "Horizontal") and set "Auto slide Behaviour" to "CONTINUOUS".',
  default: 200,
};
