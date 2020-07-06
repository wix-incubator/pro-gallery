import { GALLERY_CONSTS, INPUT_TYPES } from '../utils/constants';
import { createOptions } from '../utils/utils';

export default {
  title: 'Text alignment',
  isRelevant: ()  => true,
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS.galleryTextAlign.CENTER,
  options: createOptions('galleryTextAlign'),
  description: `This option effects the slideshow Play Button and slideshow number location.`,
}
