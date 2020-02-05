import { GALLERY_CONSTS, INPUT_TYPES } from '../utils/constants';
import { createOptions } from '../utils/utils';

export default {
  title: 'Vertical Text Alignment',
  isRelevant: (styleParams)  => styleParams.allowTitle || styleParams.allowDescription,
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS.verticalAlign.CENTER,
  options: createOptions('verticalAlign'),
  description: `Choose the vertical alignment of the texts container in each item.
  `,
}