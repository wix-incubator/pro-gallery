import { INPUT_TYPES } from '../utils/constants.js';
import { default as behaviourParams_item_overlay_hoveringBehaviour } from './behaviourParams_item_overlay_hoveringBehaviour.js';
import optionsMap from '../../core/helpers/optionsMap.js';
import { GALLERY_CONSTS } from '../../index.js';
export default {
  title: 'Overlay Background Color',
  isRelevantDescription:
    'First set a Vertical gallery ("Scroll Direction" as "Vertical").\nThen set "Crop Images" to "false" or set "Crop Type" to anything but "Fit".\nThen set "Choose info layout" to "Attached Background" or set "Texts Placement" to "Show On Hover".\nThen set "Enable Item Shadow" to "true".',
  isRelevant: (options) =>
    behaviourParams_item_overlay_hoveringBehaviour.isRelevant(options) &&
    options[optionsMap.behaviourParams.item.overlay.hoveringBehaviour] !==
      GALLERY_CONSTS[optionsMap.behaviourParams.item.overlay.hoveringBehaviour].NEVER_SHOW,
  type: INPUT_TYPES.COLOR_PICKER,
  default: 'rgba(8, 8 ,8, 0.75)', //one source
};
