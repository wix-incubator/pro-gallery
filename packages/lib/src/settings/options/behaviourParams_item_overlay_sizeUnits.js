import { INPUT_TYPES } from '../utils/constants.js';
import { default as GALLERY_CONSTS } from '../../common/constants/index.js';
import { createOptions } from '../utils/utils.js';
import optionsMap from '../../core/helpers/optionsMap.js';

export default {
  title: 'Overlay Size Type',
  description: `choose pixel or percent`,
  isRelevantDescription: 'Set "Hover Effect" to anything but "Never Show".',
  isRelevant: (options) =>
    options[optionsMap.behaviourParams.item.overlay.hoveringBehaviour] !==
    GALLERY_CONSTS[optionsMap.behaviourParams.item.overlay.hoveringBehaviour].NEVER_SHOW,
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS[optionsMap.behaviourParams.item.overlay.sizeUnits].PERCENT,
  get options() {
    return createOptions(optionsMap.behaviourParams.item.overlay.sizeUnits);
  },
};
