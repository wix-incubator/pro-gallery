import { GALLERY_CONSTS, INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Item Shadow Blur',
  isRelevant: (styleParams)  => styleParams.itemEnableShadow && !styleParams.oneRow && 
  (!styleParams.cubeImages || !styleParams.cubeType !== GALLERY_CONSTS.cubeType.FIT),
  type: INPUT_TYPES.NUMBER,
  default: 20,
}