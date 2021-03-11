import { INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Auto Slide Pause On Hover',
  isRelevant: (sp) => sp.oneRow && sp.isAutoSlideshow,
  isRelevantDescription:
    'Set a Horizontal gallery ("Scroll Direction" as "Horizontal") and set "Auto Slide" to "true".',
  type: INPUT_TYPES.BOOLEAN,
  default: true,
  description: `Pause "Auto Slide" When Hover on the gallery`,
};
