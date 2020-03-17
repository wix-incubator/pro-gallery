import { GALLERY_CONSTS, INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Choose Best Group',
  isRelevant: (styleParams)  => styleParams.groupSize > 1,
  type: INPUT_TYPES.BOOLEAN,
  default: true,
  description: `When true, the gallery will choose the best way to arrange the groups.
  `,
}