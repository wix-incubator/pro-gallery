import { INPUT_TYPES } from '../utils/constants.js';
import { default as GALLERY_CONSTS } from '../../common/constants/index.js';
import { createOptions } from '../utils/utils.js';
import optionsMap from '../../core/helpers/optionsMap.js';

export default {
  title: 'Overlay Hover Animation',
  isRelevantDescription: 'Set "Hover Effect" to anything but "No Change" or "Never Show".',
  isRelevant: (options) =>
    options[optionsMap.behaviourParams.item.overlay.hoveringBehaviour] !==
      GALLERY_CONSTS[optionsMap.behaviourParams.item.overlay.hoveringBehaviour].ALWAYS_SHOW &&
    options[optionsMap.behaviourParams.item.overlay.hoveringBehaviour] !==
      GALLERY_CONSTS[optionsMap.behaviourParams.item.overlay.hoveringBehaviour].NEVER_SHOW,
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS[optionsMap.behaviourParams.item.overlay.hoverAnimation].NO_EFFECT,
  get options() {
    return createOptions(optionsMap.behaviourParams.item.overlay.hoverAnimation);
  },
  description: `Choose the overlay animation effect to be used when hovering over an item`,
};
