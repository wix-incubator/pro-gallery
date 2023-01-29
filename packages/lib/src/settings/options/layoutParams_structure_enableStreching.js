import { INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Enable Images Streching',
  description: `The gallery will strech small images to fit the item's container, when set to true
  the gallery will stretch the image beyond the original image dimensions if it is too small for the container`,
  isRelevant: () => true,
  isRelevantDescription: 'Always true',
  type: INPUT_TYPES.BOOLEAN,
  default: true,
};
