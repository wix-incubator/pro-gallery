import { INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Repeating Column Widths',
  description: `Set the width of each column. The real width will be proportional to the width of the gallery`,
  isRelevant: (options) => options.isVertical,
  isRelevantDescription: 'Set "Layout Orientation" to "Columns".',
  type: INPUT_TYPES.TEXT,
  default: '',
};
