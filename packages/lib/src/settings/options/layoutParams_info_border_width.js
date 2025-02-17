import { INPUT_TYPES } from '../utils/constants.js';
import { default as GALLERY_CONSTS } from '../../common/constants/index.js';
import optionsMap from '../../core/helpers/optionsMap.js';

export default {
  title: 'Text box border width',
  description: `Set the border width of the texts container for each item.`,
  isRelevantDescription:
    'Set "Texts Placement" to anything but "Show On Hover" and set "Choose info layout" to "Separated Background".',
  isRelevant: (options) =>
    !GALLERY_CONSTS.hasHoverPlacement(options[optionsMap.layoutParams.info.placement]) &&
    options[optionsMap.layoutParams.info.layout] ===
      GALLERY_CONSTS[optionsMap.layoutParams.info.layout].SEPARATED_BACKGROUND,
  type: INPUT_TYPES.NUMBER,
  default: 0,
};
