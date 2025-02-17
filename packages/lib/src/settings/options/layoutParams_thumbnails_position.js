import { INPUT_TYPES } from '../utils/constants.js';
import { default as GALLERY_CONSTS } from '../../common/constants/index.js';
import optionsMap from '../../core/helpers/optionsMap.js';

export default {
  title: 'Thumbnails Position',
  isRelevant: (options) => {
    return (
      options[optionsMap.layoutParams.structure.scrollDirection] ===
        GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].HORIZONTAL &&
      options[optionsMap.layoutParams.thumbnails.enable]
    );
  },
  isRelevantDescription: 'Set a Horizontal gallery ("Scroll Direction" as "Horizontal") and enable Thumbnails.',
  type: INPUT_TYPES.TEXT,
  default: GALLERY_CONSTS[optionsMap.layoutParams.thumbnails.position].OUTSIDE_GALLERY,
  description: `Set the position of the navigation panel. On Gallery will make the panel float on the gallery itself while Outside Gallery will have the panel adjecant to it`,
};
