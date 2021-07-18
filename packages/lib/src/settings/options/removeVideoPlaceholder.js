import { INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Remove video placeholders ',
  description: `Set to "true" to remove placeholder/poster from video items`,
  isRelevant: () => true,
  isRelevantDescription: 'Always true',
  type: INPUT_TYPES.BOOLEAN,
  default: false,
};
