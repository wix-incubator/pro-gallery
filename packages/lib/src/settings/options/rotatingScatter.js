import { INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Repeating Scatter',
  isRelevant: () => true,
  isRelevantDescription: 'Always relevant.',
  type: INPUT_TYPES.TEXT,
  default: '',
  description: `Set a repeating fixed offset to each image, in the boundaries of the margin.
  `,
};
