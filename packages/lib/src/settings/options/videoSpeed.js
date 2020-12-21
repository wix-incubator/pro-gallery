import { INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Video Play Speed',
  isRelevant: () => true,
  isRelevantDescription: 'Always relevant',
  type: INPUT_TYPES.NUMBER,
  min: 0.1,
  max: 10,
  step: 0.1,
  default: 1,
  description: `The multiplier of the video play speed. x1 is the mormal speed, x2 is double the speed, x0.5 is half the speed etc.`,
};
