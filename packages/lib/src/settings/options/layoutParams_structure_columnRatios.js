import { INPUT_TYPES } from '../utils/constants.js';
import { default as GALLERY_CONSTS } from '../../common/constants/index.js';
import optionsMap from '../../core/helpers/optionsMap.js';

export default {
  title: 'Repeating Column ratios (to the gallery width)',
  description: `Set the width of each column, proportional to the width of the gallery`,
  isRelevant: (options) =>
    options[optionsMap.layoutParams.structure.layoutOrientation] ===
    GALLERY_CONSTS[optionsMap.layoutParams.structure.layoutOrientation].VERTICAL,
  isRelevantDescription: 'Set "Layout Orientation" to "Columns".',
  type: INPUT_TYPES.TEXT, //v5 TODO not the right input method?
  default: '',
};
