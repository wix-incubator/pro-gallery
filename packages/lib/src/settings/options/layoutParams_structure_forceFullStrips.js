import { GALLERY_CONSTS } from 'pro-gallery';
import optionsMap from '../../core/helpers/optionsMap';
import { INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Force Full Strips',
  description: `When set to true, strips will always be full width`,
  isRelevant: (options) =>
    options[optionsMap.layoutParams.structure.scrollDirection] !==
      GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection]
        .VERTICAL &&
    options[optionsMap.layoutParams.structure.layoutOrientation] ===
      GALLERY_CONSTS[optionsMap.layoutParams.structure.layoutOrientation]
        .VERTICAL,
  isRelevantDescription: 'Set "Gallery Orientation" to "Rows".',
  type: INPUT_TYPES.BOOLEAN,
  default: false,
};
