import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import optionsMap from '../../core/helpers/optionsMap';

export default {
  title: 'Thumbnails Spacings',
  isRelevant: (options) =>
    options[optionsMap.layoutParams.structure.scrollDirection] ===
      GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].HORIZONTAL &&
    options[optionsMap.layoutParams.thumbnails.enable],
  isRelevantDescription: 'Set "Gallery preset" to "Thumbnail".',
  type: INPUT_TYPES.NUMBER,
  default: 4,
  description: `Set the spacing between thumbnails.
  `,
};
