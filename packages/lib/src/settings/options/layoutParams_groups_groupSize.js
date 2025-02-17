import { INPUT_TYPES } from '../utils/constants.js';

export default {
  title: 'Max Group Size',
  isRelevant: () => true,
  isRelevantDescription: 'Always Relevant.',
  type: INPUT_TYPES.NUMBER,
  min: 0,
  max: 3,
  default: 3,
  description: `Choose the max number of items grouping in the gallery, "1" for only one items per group and "3"(max) for up to 3 item per group.
  `,
};
