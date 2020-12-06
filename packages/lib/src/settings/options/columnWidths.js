import { INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Fixed Column Widths',
  description: `Set the width of each column. The real width will be proportional to the width of the gallery`,
  isRelevant: (styleParams) =>
    styleParams.isVertical && styleParams.gridStyle === 1,
  type: INPUT_TYPES.TEXT,
  default: '',
};
