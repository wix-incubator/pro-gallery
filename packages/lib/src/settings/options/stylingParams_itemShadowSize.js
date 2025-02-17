import { INPUT_TYPES } from '../utils/constants.js';
import { default as stylingParams_itemEnableShadow } from './stylingParams_itemEnableShadow.js';
import optionsMap from '../../core/helpers/optionsMap.js';

export default {
  title: 'Item Shadow Size',
  isRelevantDescription:
    'First set a Vertical gallery ("Scroll Direction" as "Vertical").\nThen set "Crop Images" to "false" or set "Crop Type" to anything but "Fit".\nThen set "Choose info layout" to "Attached Background" or set "Texts Placement" to "Show On Hover".\nThen set "Enable Item Shadow" to "true".',
  isRelevant: (options) =>
    stylingParams_itemEnableShadow.isRelevant(options) && options[optionsMap.stylingParams.itemEnableShadow],
  type: INPUT_TYPES.NUMBER,
  default: 10, //one source
};
