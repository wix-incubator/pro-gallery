//NEW STYPEPARAMS METHOD
import { INPUT_TYPES } from '../utils/constants';
import { default as layoutParams_navigationArrows_enable } from './layoutParams_navigationArrows_enable';
import optionsMap from '../../core/helpers/optionsMap';
export default {
  title: 'Navigation Arrows Color',
  isRelevantDescription:
    'Set a Horizontal gallery ("Scroll Direction" as "Horizontal") and set "Show Navigation Arrows" to "true".',
  isRelevant: (options) =>
    layoutParams_navigationArrows_enable.isRelevant(options) &&
    options[optionsMap.layoutParams.navigationArrows.enable],
  type: INPUT_TYPES.COLOR_PICKER,
  default: 'rgba(0,0,0,0.3)', //NEW STYPEPARAMS METHOD one source
};
