import { INPUT_TYPES } from '../utils/constants';
import { createOptions } from '../utils/utils';

export default {
  title: 'Layout Orientation',
  description: `Choose between a vertical to horizontal oriented gallery. Note that this option may affect
  other (e.g: "titlePlacement" - you will not be able to change this option when "isVertical" is "false")`,
  isRelevant: (styleParams) => !styleParams.oneRow,
  isRelevantDescription: 'Set a Vertical scrolled gallery.',
  options: createOptions('isVertical'),
  type: INPUT_TYPES.OPTIONS,
  default: false,
};
