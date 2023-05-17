import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import optionsMap from '../../core/helpers/optionsMap';
import { default as layoutParams_crop_method } from './layoutParams_crop_method';
import { default as layoutParams_info_layout } from './layoutParams_info_layout';
import { default as layoutParams_info_placement } from './layoutParams_info_placement';
export default {
  title: 'Enable Item Shadow',
  isRelevantDescription:
    'Only for vertical galleries. First set "Crop Images" to "false" or set "Crop Type" to anything but "Fit".\nThen set "Choose info layout" to "Attached Background" or set "Texts Placement" to "Show On Hover".',
  isRelevant: (options) =>
    options[optionsMap.layoutParams.structure.scrollDirection] ===
      GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].VERTICAL &&
    !(
      layoutParams_crop_method.isRelevant(options) &&
      options[optionsMap.layoutParams.crop.method] === GALLERY_CONSTS[optionsMap.layoutParams.crop.method].FIT
    ) &&
    ((layoutParams_info_layout.isRelevant(options) &&
      options[optionsMap.layoutParams.info.layout] ===
        GALLERY_CONSTS[optionsMap.layoutParams.info.layout].ATTACHED_BACKGROUND) ||
      (layoutParams_info_placement.isRelevant(options) &&
        options[optionsMap.layoutParams.info.placement] ===
          GALLERY_CONSTS[optionsMap.layoutParams.info.placement].OVERLAY)),
  type: INPUT_TYPES.BOOLEAN,
  default: false, //one source
};
