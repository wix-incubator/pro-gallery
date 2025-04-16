import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import optionsMap from '../../core/helpers/optionsMap';

export default {
  title: 'Thumbnails alignment',
  isRelevant: (options) =>
    options[optionsMap.layoutParams.structure.scrollDirection] ===
      GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].HORIZONTAL &&
    options[optionsMap.layoutParams.thumbnails.enable],
  isRelevantDescription:
    'Set a Horizontal gallery ("Scroll Direction" as "Horizontal") and set "Gallery preset" to "Thumbnail".',
  type: INPUT_TYPES.TEXT,
  default: GALLERY_CONSTS[optionsMap.layoutParams.thumbnails.alignment].BOTTOM,
  description: `Set the alignment of the sliding thumbnails relative to the gallery (bottom, top, left and right).`,
};
