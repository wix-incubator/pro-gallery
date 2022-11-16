//NEW STYPEPARAMS METHOD
import { INPUT_TYPES } from '../utils/constants';
import { default as layoutParams_navigationArrows_enable } from './layoutParams_navigationArrows_enable';
import optionsMap from '../../core/helpers/optionsMap';

export default {
  title: 'Navigation Arrows Size',
  isRelevant: (options) =>
    layoutParams_navigationArrows_enable.isRelevant(options) &&
    options[optionsMap.layoutParams.navigationArrows.enable],
  isRelevantDescription:
    'Set a Horizontal gallery ("Scroll Direction" as "Horizontal") and set "Show Navigation Arrows" to "true".',
  type: INPUT_TYPES.NUMBER,
  min: 8,
  max: 80,
  default: 23,
  description: `Set the size of the navigation arrows in pixels.
  `,
};
