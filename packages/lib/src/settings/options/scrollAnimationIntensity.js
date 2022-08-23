import { INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Scroll Animation Intensity',
  isRelevant: (sp) => sp.scrollAnimation !== 'NO_EFFECT',
  isRelevantDescription: 'Set any scroll animation',
  type: INPUT_TYPES.NUMBER,
  min: 0,
  max: 100,
  default: 25,
  description: `Set the intensity of the scrollAnimation. SEtting a higher number with make the scroll animation start later and be more visible`,
};
