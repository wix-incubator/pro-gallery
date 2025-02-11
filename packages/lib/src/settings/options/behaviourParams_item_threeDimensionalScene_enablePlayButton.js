import { INPUT_TYPES } from '../utils/constants.js';

export default {
  title: '3d Play Button',
  isRelevant: () => true,
  isRelevantDescription: 'Always relevant.',
  type: INPUT_TYPES.BOOLEAN,
  default: false, //one source
  description: `Show 3d items with a play button.`,
};
