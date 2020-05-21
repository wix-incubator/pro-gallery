import { INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Floating Images',
  isRelevant: ()  => true,
  type: INPUT_TYPES.NUMBER,
  min: 0,
  max: 1,
  step: 0.1,
  default: 0,
  description: `Set a random offset to each image, in the boundaries of the margin.
  `,
}
