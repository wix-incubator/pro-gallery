import { INPUT_TYPES } from '../utils/constants.js';

export default {
  title: 'Crop Images',
  description: `When true, the consumer will have the option to either crop the items to fill their containers or to fit
  them inside (the "FIT" option may leave empty margins around the items).`,
  isRelevant: () => true,
  isRelevantDescription: 'Always relevant.',
  type: INPUT_TYPES.BOOLEAN,
  default: false,
};
