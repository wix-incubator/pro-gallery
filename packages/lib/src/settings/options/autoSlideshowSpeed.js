import { INPUT_TYPES } from '../utils/constants';
export default {
  title: 'Sliding speed',
  description: `Set the gallery scroll speed.`,
  min: 2,
  max: 8,
  isRelevant: (styleParams) =>
    styleParams.isAutoSlideshow &&
    styleParams.oneRow &&
    styleParams.slideshowLoop,
  type: INPUT_TYPES.NUMBER,
  isRelevantDescription:
    'Set a Horizontal gallery ("Scroll Direction" as "Horizontal") set "Auto Slide" to "true" and set "Loop Images" to true.',
  default: 2,
};
