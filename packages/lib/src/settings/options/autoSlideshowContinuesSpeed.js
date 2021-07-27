import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';

export default {
  title: 'Scroll speed',
  description: `Set the scroll speed when using "continuous" auto-scrolling.`,
  min: 2,
  max: 10,
  isRelevant: (styleParams) =>
    styleParams.isAutoSlideshow &&
    styleParams.scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL &&
    styleParams.groupSize === 1 &&
    styleParams.autoSlideshowType ===
      GALLERY_CONSTS.autoSlideshowTypes.CONTINUES,
  type: INPUT_TYPES.NUMBER,
  isRelevantDescription:
    'Set a Horizontal gallery ("Scroll Direction" as "Horizontal"), set "Max Group Size" to "1", set "Auto Slide" to "true", and set "Auto slide behavior" to "continuous"',
  default: 4,
};
