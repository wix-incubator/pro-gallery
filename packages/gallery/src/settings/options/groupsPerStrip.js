import { GALLERY_CONSTS, INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Groups per Row',
  isRelevant: (styleParams)  => !styleParams.oneRow,
  type: INPUT_TYPES.NUMBER,
  default: 3,
  min:0,
  max: 10,
  description: `Set the number of groups per row tou want the gallery to have
  `,
}