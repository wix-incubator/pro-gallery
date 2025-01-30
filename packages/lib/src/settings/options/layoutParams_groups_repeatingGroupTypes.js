import { INPUT_TYPES } from '../utils/constants.js';
import { createOptions } from '../utils/utils.js';
import optionsMap from '../../core/helpers/optionsMap.js';
export default {
  title: 'Repeating Group Types',
  description: `Choose the order of group types to appear in rotation in a collage gallery. Note that
  the groupSize must support the groups specified (if groupSize set to 2, you cannot use groups of 3)`,
  isRelevant: (options) => options[optionsMap.layoutParams.groups.groupSize] > 1,
  isRelevantDescription: 'Set "Max Group Size" to be greater than "1".',
  type: INPUT_TYPES.MULTIREPEAT,
  get options() {
    return createOptions(optionsMap.layoutParams.groups.allowedGroupTypes);
  },
  default: [],
};
