import { INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Pause Auto Slide On Hover',
  isRelevant: (sp) => sp.oneRow && sp.isAutoSlideshow,
  isRelevantDescription:
    'Set a Horizontal gallery ("Scroll Direction" as "Horizontal") and set "Auto Slide" to "true".',
  type: INPUT_TYPES.BOOLEAN,
  default: true,
  description: `Pause "Auto Slide" when hovering over the gallery`,
};
