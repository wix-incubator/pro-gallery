//NEW STYPEPARAMS METHOD

import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';
import optionsMap from '../../core/helpers/optionsMap';

export default {
  title: 'Cropping Method',
  isRelevant: (options) => options[optionsMap.layoutParams.crop.enable],
  isRelevantDescription: 'Set "Crop Images" to "true".',
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS[optionsMap.layoutParams.crop.method].FILL,
  options: createOptions('cubeType'), //NEW STYPEPARAMS METHOD use the new consts when they are exported
  description: `Choose between croping the image to fill it's container ("fill") or fiting the whole image ("fit").
  `,
};
