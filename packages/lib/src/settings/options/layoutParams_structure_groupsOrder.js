//NEW STYPEPARAMS METHOD
import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import optionsMap from '../../core/helpers/optionsMap';

export default {
  title: 'Arrange Items by Columns Order',
  description: `In a columns layout, items will usually arrange by the shortest column. Use this parametr to force a LTR / RTL order (usfull for Grid like layouts)`,
  type: INPUT_TYPES.MULTISELECT,
  isRelevant: (options) =>
    options[optionsMap.layoutParams.structure.scrollDirection] ===
      GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection]
        .VERTICAL &&
    options[optionsMap.layoutParams.structure.layoutOrientation] ===
      GALLERY_CONSTS[optionsMap.layoutParams.structure.layoutOrientation]
        .VERTICAL,
  isRelevantDescription:
    'Set "Gallery Orientation" to "Columns" & "Scroll Direction" to "Vertical".',
  default: 'BY_HEIGHT', //NEW STYPEPARAMS METHOD create and use the right const. this is not a boolean anymore
};
