import { INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Force Full Strips',
  description: `When set to true, strips will always be full width`,
  isRelevant: (options) => !options.isVertical && !options.oneRow,
  isRelevantDescription: 'Set "Gallery Orientation" to "Rows".',
  type: INPUT_TYPES.BOOLEAN,
  default: false,
};
