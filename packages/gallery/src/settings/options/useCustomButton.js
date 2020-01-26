import { INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Buy Now Button',
  description: `
  Choose if you want to have a "Buy Now" for each item (you can edit the text on the button using the "customButtonText" option).`,
  isRelevant: () => true,
  type: INPUT_TYPES.BOOLEAN,
  default: false,
}