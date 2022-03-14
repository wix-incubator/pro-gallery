import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
export default {
  title: 'Slideshow Info Section Size',
  description: `Set the size of the info section in slideshow. the item's height will be adjusted accordingly`,
  isRelevant: (sp) => GALLERY_CONSTS.isLayout('SLIDESHOW')(sp),
  isRelevantDescription: 'Set "Gallery preset" to "Slideshow".',
  type: INPUT_TYPES.NUMBER,
  default: 200,
};
