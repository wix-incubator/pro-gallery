import { INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Hide Video Play Button',
  isRelevant: () => true,
  type: INPUT_TYPES.BOOLEAN,
  default: false,
  description: `Show videos without a play button. Notice that using this option will display videos without any indication that they are playable`,
};
