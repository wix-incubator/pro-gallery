import { INPUT_TYPES } from '../utils/constants';
import { createOptions } from '../utils/utils';
import { default as GALLERY_CONSTS } from '../../common/constants';

export default {
  title: 'Layout Orientation',
  description: `Choose between a vertical to horizontal oriented gallery. Note that this option may affect
  other (e.g: "titlePlacement" - you will not be able to change this option when "isVertical" is "false")`,
  isRelevant: (styleParams) =>
    styleParams.scrollDirection === GALLERY_CONSTS.scrollDirection.VERTICAL,
  isRelevantDescription:
    'Set a Vertical gallery ("Scroll Direction" as "Vertical").',
  options: createOptions('isVertical'),
  type: INPUT_TYPES.OPTIONS,
  default: false,
};
