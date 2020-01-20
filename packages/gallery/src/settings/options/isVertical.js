import { INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Layout Orientation',
  description: `Choose between a vertical to horizontal oriented gallery. Note that this option may affect
  other (e.g: "titlePlacement" - you will not be able to change this option when "isVertical" is "false")`,
  isRelevant: (styleParams) => !styleParams.oneRow,
  type: INPUT_TYPES.BOOLEAN,
  default: 10,
}