import { INPUT_TYPES } from '../utils/constants.js';
import { default as GALLERY_CONSTS } from '../../common/constants/index.js';
import { createOptions } from '../utils/utils.js';
import optionsMap from '../../core/helpers/optionsMap.js';

export default {
  title: 'Navigation arrows styling',
  isRelevant: (options) => {
    return (
      options[optionsMap.layoutParams.structure.scrollDirection] ===
        GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].HORIZONTAL &&
      options[optionsMap.layoutParams.navigationArrows.enable]
    );
  },
  isRelevantDescription:
    'Set a Horizontal gallery ("Scroll Direction" as "Horizontal") and set "Show Navigation Arrows" to "true".',
  type: INPUT_TYPES.OPTIONS,
  get options() {
    return createOptions(optionsMap.layoutParams.navigationArrows.container.type);
  },
  default: GALLERY_CONSTS[optionsMap.layoutParams.navigationArrows.container.type].SHADOW,
  description: `Choose the type of styling the arrows.
  `,
};
