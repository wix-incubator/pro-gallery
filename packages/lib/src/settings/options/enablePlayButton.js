import { INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Show Video Play Button',
  isRelevant: () => true,
  isRelevantDescription: 'Always relevant.',
  type: INPUT_TYPES.BOOLEAN,
  default: true,
  description: `When false, videos will be showed without a play button. Notice that using this option will display videos without any indication that they are playable`,
};
