//NEW STYPEPARAMS METHOD
import { INPUT_TYPES } from '../utils/constants';
import { createOptions } from '../utils/utils';
import { default as GALLERY_CONSTS } from '../../common/constants';
import optionsMap from '../../core/helpers/optionsMap';

export default {
  title: 'Layout Orientation',
  description: `Choose between a vertical to horizontal oriented gallery. Note that this option may affect
  other (e.g: "titlePlacement" - you will not be able to change this option when "isVertical" is "false")`,
  isRelevant: (options) =>
    options[optionsMap.layoutParams.structure.scrollDirection] ===
    GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].VERTICAL,
  isRelevantDescription:
    'Set a Vertical gallery ("Scroll Direction" as "Vertical").',
  options: createOptions('isVertical'), //NEW STYPEPARAMS METHOD need to change to the right const
  type: INPUT_TYPES.OPTIONS,
  default: false,
};
