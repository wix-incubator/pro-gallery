import { INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Randomly Scatter Items',
  isRelevant: () => true,
  isRelevantDescription: 'Always relevant.',
  type: INPUT_TYPES.NUMBER,
  min: 0,
  max: 100,
  step: 1,
  default: 0,
  description: `Set a random offset to each image, in the boundaries of the margin.
  `,
};
