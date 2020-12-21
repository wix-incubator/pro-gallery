import { INPUT_TYPES } from '../utils/constants';
import { createOptions } from '../utils/utils';

export default {
  title: 'Repeating Group Types',
  description: `Choose the order of group types to appear in rotation in a collage gallery. Note that
  the groupSize must support the groups specified (if groupSize set to 2, you cannot use groups of 3)`,
  isRelevant: (styleParams) => styleParams.groupSize > 1,
  isRelevantDescription: 'Set "Max Group Size" to be greater than "1"',
  type: INPUT_TYPES.MULTIREPEAT,
  options: createOptions('groupTypes'),
  default: '',
};
