import { INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Use max dimensions if needed',
  description: `The gallery will strech small images to fit the item's container, when set to true
  the gallery will use the original image dimensions if it is too small for the container`,
  isRelevant: () => true,
  isRelevantDescription: 'Always true',
  type: INPUT_TYPES.BOOLEAN,
  default: false,
};
