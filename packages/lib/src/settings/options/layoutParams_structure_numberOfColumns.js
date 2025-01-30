import { INPUT_TYPES } from '../utils/constants.js';
import { default as GALLERY_CONSTS } from '../../common/constants/index.js';
import optionsMap from '../../core/helpers/optionsMap.js';

export default {
  title: 'Number of Images Per Row/ Number of Columns',
  isRelevantDescription:
    'Set a Vertical gallery ("Scroll Direction" as "Vertical"), set "Layout Orientation" to "Column" and set "Max Group Size" to be "1".',
  isRelevant: (options) =>
    options[optionsMap.layoutParams.structure.scrollDirection] ===
      GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].VERTICAL &&
    options[optionsMap.layoutParams.structure.layoutOrientation] ===
      GALLERY_CONSTS[optionsMap.layoutParams.structure.layoutOrientation].VERTICAL &&
    options[optionsMap.layoutParams.structure.responsiveMode] ===
      GALLERY_CONSTS[optionsMap.layoutParams.structure.responsiveMode].SET_ITEMS_PER_ROW,
  type: INPUT_TYPES.NUMBER,
  default: 3,
  description: `This sets the number of items per row in the gallery. Note that this option relies on a number of options, the gallery must be
    a vertical scrolled gallery (scrollDirection = 1), layout orientation (isVertical) must be set to "true" and gridStyle must be set to "1" for this option to have an effect. Currently the only supporting
    layouts are Grid and Masonry
  `,
};
