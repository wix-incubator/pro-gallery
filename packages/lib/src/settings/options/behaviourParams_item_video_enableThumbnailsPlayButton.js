import { INPUT_TYPES } from '../utils/constants.js';

export default {
  title: 'Video Play Button on thumbnails',
  isRelevant: () => true,
  isRelevantDescription: 'Always relevant.',
  type: INPUT_TYPES.BOOLEAN,
  default: false, //one source
  description: `Show video play button on thumbnails in a thumbnail gallery`,
};
