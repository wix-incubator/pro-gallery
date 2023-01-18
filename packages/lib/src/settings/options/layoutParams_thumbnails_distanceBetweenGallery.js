import { INPUT_TYPES } from '../utils/constants';
// import { default as GALLERY_CONSTS } from '../../common/constants';
// import optionsMap from '../../core/helpers/optionsMap';

export default {
  title: 'Thumbnails distance between gallery',
  isRelevant: () => true,
  // options[optionsMap.layoutParams.structure.scrollDirection] ===
  //   GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection]
  //     .HORIZONTAL && options[optionsMap.layoutParams.thumbnails.enable],
  isRelevantDescription: 'Set "Gallery preset" to "Thumbnail".',
  type: INPUT_TYPES.NUMBER,
  default: 70,
  description: `Set the distance between all the thumnails and the gallery.
  `,
};
