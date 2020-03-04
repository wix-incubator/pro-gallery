import { INPUT_TYPES, GALLERY_CONSTS } from '../utils/constants';

export default {
  title: 'Enable Scroll',
  description: `This option decides if there will be any scrolling in a sliding gallery`,
  isRelevant: (styleParams) => styleParams.oneRow,
  type: INPUT_TYPES.BOOLEAN,
  default: true,
}