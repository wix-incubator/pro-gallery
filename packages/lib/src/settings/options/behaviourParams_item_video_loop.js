import { INPUT_TYPES } from '../utils/constants.js';

export default {
  title: 'Loop Videos',
  description: `When true videos will be played in a loop`,
  isRelevant: () => true,
  isRelevantDescription: 'Always relevant.',
  type: INPUT_TYPES.BOOLEAN,
  default: true,
};
