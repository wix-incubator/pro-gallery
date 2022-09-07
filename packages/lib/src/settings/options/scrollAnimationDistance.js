import { INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Scroll Animation Distance',
  isRelevant: (sp) =>
    sp.scrollAnimation !== 'NO_EFFECT' ||
    sp.exitScrollAnimation !== 'NO_EFFECT',
  type: INPUT_TYPES.NUMBER,
  min: 0,
  max: 1000,
  default: 200,
  description: `Choose the distance of scroll to display the animation. The bigger the distance, the more visible the animation will be`,
};
