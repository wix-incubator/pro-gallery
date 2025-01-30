import { default as GALLERY_CONSTS } from '../../common/constants/index.js';
import optionsMap from '../../core/helpers/optionsMap.js';
import { INPUT_TYPES } from '../utils/constants.js';

export default {
  title: 'Gallery Ratio',
  description: `This option allows horizontally scrolled galleries to link their height to the width of the gallery by the provided ratio`,
  isRelevant: (options) => {
    return (
      options[optionsMap.layoutParams.structure.scrollDirection] ===
      GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].HORIZONTAL
    );
  },
  isRelevantDescription: 'Set a Horizontal gallery ("Scroll Direction" as "Horizontal")',
  default: 0,
  type: INPUT_TYPES.NUMBER,
};
