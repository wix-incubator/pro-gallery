import { INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Show Slideshow Counter',
  isRelevant: (sp) => sp.oneRow && sp.isAutoSlideshow,
  type: INPUT_TYPES.BOOLEAN,
  default: false,
  description: `Display an index of the current slide`,
};
