import { INPUT_TYPES } from '../utils/constants.js';
import { default as GALLERY_CONSTS } from '../../common/constants/index.js';
import { createOptions } from '../utils/utils.js';
import optionsMap from '../../core/helpers/optionsMap.js';

export default {
  title: 'Fitted Image Position',
  description: `image alignment when crop method is FIT`,
  isRelevant: (options) =>
    options[optionsMap.layoutParams.crop.enable] &&
    options[optionsMap.layoutParams.crop.method] === GALLERY_CONSTS[optionsMap.layoutParams.crop.method].FIT,
  isRelevantDescription: 'Set `Crop Images` to true and `Crop Method` to FIT',
  type: INPUT_TYPES.OPTIONS,
  get options() {
    return createOptions('layoutParams_crop_alignment');
  },
  default: GALLERY_CONSTS[optionsMap.layoutParams.crop.alignment].CENTER,
};
