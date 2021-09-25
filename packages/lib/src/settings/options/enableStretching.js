import { INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Stretch small images',
  description: `The gallery will stretch small images to fit the item's container, when set to false
  the gallery will use the original image dimensions if it is too small for the container`,
  isRelevant: () => true,
  isRelevantDescription: 'Always true',
  type: INPUT_TYPES.BOOLEAN,
  default: true,
};
