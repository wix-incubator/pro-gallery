import { INPUT_TYPES } from '../utils/constants.js';
import { default as GALLERY_CONSTS } from '../../common/constants/index.js';
import optionsMap from '../../core/helpers/optionsMap.js';

export default {
  title: 'Thumbnails margin to gallery',
  isRelevant: (options) =>
    options[optionsMap.layoutParams.structure.scrollDirection] ===
      GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].HORIZONTAL &&
    options[optionsMap.layoutParams.thumbnails.enable],
  isRelevantDescription: 'Set "Gallery preset" to "Thumbnail".',
  type: INPUT_TYPES.NUMBER,
  default: 0,
  description: `Set the spacing between the thumbnails and the gallery itself.
  `,
};
