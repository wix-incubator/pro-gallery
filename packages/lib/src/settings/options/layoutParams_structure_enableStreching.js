import { INPUT_TYPES } from '../utils/constants.js';

export default {
  title: 'Enable streching images over their maximum original dimensions',
  description: `The gallery will strech small images to fit the item's container, when set to true
  the gallery will use the original image dimensions if it is too small for the container`,
  isRelevant: () => true,
  isRelevantDescription: 'Always true',
  type: INPUT_TYPES.BOOLEAN,
  default: true,
};
