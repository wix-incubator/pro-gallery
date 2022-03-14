import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';

export default {
  title: 'Crop Type',
  isRelevant: (options) => options.cubeImages,
  isRelevantDescription: 'Set "Crop Images" to "true".',
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS.cubeType.CROP,
  options: createOptions('cubeType'),
  description: `Choose between croping the image to fill it's container ("fill") or fiting the whole image ("fit").
  `,
};
