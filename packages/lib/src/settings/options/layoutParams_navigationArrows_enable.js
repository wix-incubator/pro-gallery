import { INPUT_TYPES } from '../utils/constants.js';
import { default as GALLERY_CONSTS } from '../../common/constants/index.js';
import { default as layoutParams_structure_scrollDirection } from './layoutParams_structure_scrollDirection.js';
import optionsMap from '../../core/helpers/optionsMap.js';

export default {
  title: 'Show Navigation Arrows',
  description: `Choose if you want to have navigation arrows in a sliding gallery`,
  isRelevant: (options) =>
    layoutParams_structure_scrollDirection.isRelevant(options) &&
    options[optionsMap.layoutParams.structure.scrollDirection] ===
      GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].HORIZONTAL,
  isRelevantDescription: 'Set a Horizontal gallery ("Scroll Direction" as "Horizontal").',
  type: INPUT_TYPES.BOOLEAN,
  default: true,
};
