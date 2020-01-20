import { INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Buy Now Button',
  description: `
  Choose if you want to have a custom button for each item`,
  isRelevant: () => true,
  type: INPUT_TYPES.BOOLEAN,
  default: false,
}