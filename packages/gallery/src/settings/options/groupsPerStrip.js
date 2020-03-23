import { GALLERY_CONSTS, INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Groups per Row',
  isRelevant: (styleParams)  => !styleParams.oneRow && !styleParams.isVertical,
  type: INPUT_TYPES.NUMBER,
  default: 0,
  min:0,
  max: 10,
  description: `Set the number of groups per row in the gallery (relevant only to galleries with vertical scroll).
  `,
}