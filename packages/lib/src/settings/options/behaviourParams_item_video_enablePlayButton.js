import { INPUT_TYPES } from '../utils/constants.js';

export default {
  title: 'Video Play Button',
  isRelevant: () => true,
  isRelevantDescription: 'Always relevant.',
  type: INPUT_TYPES.BOOLEAN,
  default: true, //one source
  description: `Show videos without a play button. Notice that disabling this option will display videos without any indication that they are playable`,
};
