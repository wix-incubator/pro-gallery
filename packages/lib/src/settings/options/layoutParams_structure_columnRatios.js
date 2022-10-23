//NEW STYPEPARAMS METHOD
import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import optionsMap from '../../core/helpers/optionsMap';

export default {
  title: 'Repeating Column ratios (to the gallery width)',
  description: `Set the width of each column, proportional to the width of the gallery`,
  isRelevant: (options) =>
    options[optionsMap.layoutParams.structure.layoutOrientation] ===
    GALLERY_CONSTS[optionsMap.layoutParams.structure.layoutOrientation]
      .VERTICAL,
  isRelevantDescription: 'Set "Layout Orientation" to "Columns".',
  type: INPUT_TYPES.TEXT, //NEW STYPEPARAMS METHOD change the input method for settings here... not the right type
  default: '',
};
