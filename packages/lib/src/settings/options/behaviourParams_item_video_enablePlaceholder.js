import { INPUT_TYPES } from '../utils/constants.js';

export default {
  title: 'Enable video placeholders ',
  description: `Set to "false" to remove placeholder/poster from video items`,
  isRelevant: () => true,
  isRelevantDescription: 'Always true',
  type: INPUT_TYPES.BOOLEAN,
  default: true,
};
