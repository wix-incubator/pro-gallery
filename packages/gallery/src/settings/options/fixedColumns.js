import { INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Fixed Columns',
  description: `Set a fixed number of columns in the gallery. Note that this option relies on the options isVertical (set to "true")
  and oneRow (set to "false").`,
  isRelevant: (styleParams) => !styleParams.oneRow && styleParams.isVertical,
  type: INPUT_TYPES.NUMBER,
  default: 0,
}