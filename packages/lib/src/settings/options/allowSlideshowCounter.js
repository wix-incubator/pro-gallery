import { INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Show Slideshow Counter',
  isRelevant: (sp) => sp.oneRow && sp.isAutoSlideshow,
  isRelevantDescription:
    'Set a Horizontal gallery ("Scroll Direction" as "Horizontal") and set "Auto Slide" to "true"',
  type: INPUT_TYPES.BOOLEAN,
  default: false,
  description: `Display an index of the current slide`,
};
