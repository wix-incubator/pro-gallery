import { INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Slideshow Info Section Size',
  description: `Set the size of the info section in slideshow. the item's height will be adjusted accordingly`,
  isRelevant: (sp) => sp.isSlideshow,
  type: INPUT_TYPES.NUMBER,
  default: 200,
};
