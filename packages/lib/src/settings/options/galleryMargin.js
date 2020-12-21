import { INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Gallery Spacing',
  description: `Set the margin between the gallery and it's container.`,
  isRelevantDescription: 'Always relevant',
  isRelevant: () => true,
  type: INPUT_TYPES.NUMBER,
  default: 0,
};
