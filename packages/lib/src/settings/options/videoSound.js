import { INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Play Video with Sound',
  isRelevant: () => true,
  type: INPUT_TYPES.BOOLEAN,
  default: false,
  description: `Videos are muted in gallery view by default. Enable to play videos with sound. In Expand Mode, the video will always play with the sound on.`,
};
