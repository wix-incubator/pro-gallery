import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';

export default {
  title: 'Slide speed',
  description: `Set the slide speed when using "continuous" auto-scrolling.`,
  min: 100,
  max: 1000,
  isRelevant: (options) =>
    options.isAutoSlideshow &&
    options.scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL &&
    options.autoSlideshowType === GALLERY_CONSTS.autoSlideshowTypes.CONTINUOUS,
  type: INPUT_TYPES.NUMBER,
  isRelevantDescription:
    'Set a Horizontal gallery ("Scroll Direction" as "Horizontal"), set "Auto Slide" to "true", and set "Auto slide behavior" to "continuous"',
  default: 200,
};
