import { GALLERY_CONSTS, INPUT_TYPES } from '../utils/constants';
import { createOptions } from '../utils/utils';

export default {
  title: 'Text alignment',
  isRelevant: (styleParams)  => styleParams.allowTitle || styleParams.allowDescription,
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS.galleryTextAlign.CENTER,
  options: createOptions('galleryTextAlign'),
  description: `This option sets the alignment (left, right or center) of each item in the gallery.
  `,
}