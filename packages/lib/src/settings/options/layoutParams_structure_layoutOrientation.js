import { INPUT_TYPES } from '../utils/constants.js';
import { createOptions } from '../utils/utils.js';
import { default as GALLERY_CONSTS } from '../../common/constants/index.js';
import optionsMap from '../../core/helpers/optionsMap.js';

export default {
  title: 'Layout Orientation',
  description: `Choose between a vertical to horizontal oriented gallery. Note that this option may affect
  other (e.g: "titlePlacement" - you will not be able to change this option when "isVertical" is "false")`,
  isRelevant: (options) =>
    options[optionsMap.layoutParams.structure.scrollDirection] ===
    GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].VERTICAL,
  isRelevantDescription: 'Set a Vertical gallery ("Scroll Direction" as "Vertical").',
  get options() {
    return createOptions(optionsMap.layoutParams.structure.layoutOrientation);
  },
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS[optionsMap.layoutParams.structure.layoutOrientation].HORIZONTAL,
};
