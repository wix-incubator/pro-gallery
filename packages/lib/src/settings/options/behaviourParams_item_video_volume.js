import { INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Video Sound Volume',
  isRelevant: () => true,
  isRelevantDescription: 'Always relevant.',
  type: INPUT_TYPES.NUMBER,
  min: 0,
  max: 1,
  step: 0.01,
  default: 0, //one source
  description: `Videos are muted by default in the gallery, assign a decimal value 0-1 to set the initial volume`,
};
