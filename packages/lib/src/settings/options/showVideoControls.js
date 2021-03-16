import { INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Show Video Controls',
  description: `Choose whether to enable or disable controls for videos in the gallery`,
  isRelevant: () => true,
  isRelevantDescription: 'Always relevant.',
  type: INPUT_TYPES.BOOLEAN,
  default: false,
};
