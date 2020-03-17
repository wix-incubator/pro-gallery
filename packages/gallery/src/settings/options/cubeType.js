import { GALLERY_CONSTS, INPUT_TYPES } from '../utils/constants';
import { createOptions } from '../utils/utils';

export default {
  title: 'Crop Type',
  isRelevant: (styleParams)  => styleParams.cubeImages,
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS.cubeType.CROP,
  options: createOptions('cubeType'),
  description: `Choose between croping the image to fill it's container ("fill") or fiting the whole image ("fit").
  `,
}