import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';

export default {
  title: 'Text alignment',
  isRelevant: () => true,
  isRelevantDescription: 'Always relevant.',
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS.galleryTextAlign.CENTER,
  options: createOptions('galleryTextAlign'),
  description: `This option effects the slideshow Play Button and slideshow number location.`,
};
