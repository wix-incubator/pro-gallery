import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';

export default {
  title: 'Slide speed',
  description: `Set the slide speed when using "continuous" auto-scrolling.`,
  min: 2,
  max: 10,
  isRelevant: (styleParams) =>
    styleParams.isAutoSlideshow &&
    styleParams.scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL &&
    styleParams.autoSlideshowType ===
      GALLERY_CONSTS.autoSlideshowTypes.CONTINUOUS,
  type: INPUT_TYPES.NUMBER,
  isRelevantDescription:
    'Set a Horizontal gallery ("Scroll Direction" as "Horizontal"), set "Auto Slide" to "true", and set "Auto slide behavior" to "continuous"',
  default: 4,
};
