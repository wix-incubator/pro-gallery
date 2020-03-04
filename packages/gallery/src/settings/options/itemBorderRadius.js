import { GALLERY_CONSTS, INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Item Border Radius',
  description: `Set the border radius for each item in the gallery.`,
  isRelevant: (styleParams) => styleParams.cubeType !== GALLERY_CONSTS.cubeType.FIT,
  type: INPUT_TYPES.NUMBER,
  default: 0,
}