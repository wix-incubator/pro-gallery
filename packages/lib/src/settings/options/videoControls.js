import { INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Video Controls',
  description: `Chosse whether you want to show controls for videos in the gallery`,
  isRelevant: () => true,
  isRelevantDescription: 'Always relevant.',
  type: INPUT_TYPES.BOOLEAN,
  default: false,
};
