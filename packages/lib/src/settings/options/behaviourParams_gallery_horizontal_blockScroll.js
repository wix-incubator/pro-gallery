import { INPUT_TYPES } from '../utils/constants.js';
import { default as GALLERY_CONSTS } from '../../common/constants/index.js';
import optionsMap from '../../core/helpers/optionsMap.js';

export default {
  title: 'Block Horizontal Scroll',
  description: `This option decides if there will be any scrolling in a sliding gallery`,
  isRelevantDescription: 'Set a Horizontal gallery ("Scroll Direction" as "Horizontal").',
  isRelevant: (options) =>
    options[optionsMap.layoutParams.structure.scrollDirection] ===
    GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].HORIZONTAL,
  type: INPUT_TYPES.BOOLEAN,
  default: false, //one source
};
