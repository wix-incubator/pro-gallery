// NEW STYPEPARAMS METHOD
import { INPUT_TYPES } from '../utils/constants';
// import { default as GALLERY_CONSTS } from '../../common/constants';
import optionsMap from '../../core/helpers/optionsMap';

export default {
  title: 'Groups per Row',
  isRelevant: (options) =>
    options[optionsMap.layoutParams.structure.galleryLayout] === 'VERTICAL' && // NEW STYPEPARAMS METHOD CHANGE CONST // Change to the isRelevant of layoutOrientation
    options[optionsMap.layoutParams.structure.layoutOrientation] ===
      'HORIZONTAL' &&
    options[optionsMap.layoutParams.structure.responsiveMode] ===
      'SET_ITEMS_PER_ROW',
  isRelevantDescription:
    'Set a Vertical gallery ("Scroll Direction" as "Vertical"), set "Layout Orientation" to "Rows" and set "Responsive Type" to "Set Items Per Row".',
  type: INPUT_TYPES.NUMBER,
  default: 0,
  min: 0,
  max: 10,
  description: `Set the number of groups per row in the gallery (relevant only to galleries with vertical scroll).
  `,
};
