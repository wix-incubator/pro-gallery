import { INPUT_TYPES } from '../utils/constants.js';
import { default as GALLERY_CONSTS } from '../../common/constants/index.js';
import optionsMap from '../../core/helpers/optionsMap.js';

export default {
  title: 'Overlay Padding',
  description: `Padding`,
  isRelevantDescription: 'Set "Hover Effect" to anything but "Never Show".',
  isRelevant: (options) =>
    options[optionsMap.behaviourParams.item.overlay.hoveringBehaviour] !==
    GALLERY_CONSTS[optionsMap.behaviourParams.item.overlay.hoveringBehaviour].NEVER_SHOW,
  type: INPUT_TYPES.NUMBER,
  min: 0,
  default: 0,
};
