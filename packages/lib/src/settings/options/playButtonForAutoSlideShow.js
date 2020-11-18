import { INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Auto Slide Play/Pause Button',
  isRelevant: (sp) => sp.oneRow && sp.isAutoSlideshow,
  type: INPUT_TYPES.BOOLEAN,
  default: false,
  description: `Show a play/pause button to toggle the slides transitions in auto slide`,
};
