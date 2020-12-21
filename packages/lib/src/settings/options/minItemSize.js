import { INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Minimum Item Size',
  description: `Set a minimum item size for items in a group. Note that the size passed to this option is a target size and the gallery will
  try to get as close as possible`,
  type: INPUT_TYPES.NUMBER,
  isRelevant: (styleParams) => styleParams.groupSize > 1,
  isRelevantDescription: 'Set "Max Group Size" to be greater than "1"',
  default: 120,
};
