import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';

export default {
  title: 'Loop Images',
  description: `Choose if you want the items to loop when you reach the last item in a sliding gallery`,
  isRelevant: (styleParams) => styleParams.galleryLayout === GALLERY_CONSTS.layout.THUMBNAIL || styleParams.galleryLayout === GALLERY_CONSTS.layout.SLIDER || styleParams.galleryLayout === GALLERY_CONSTS.layout.SLIDESHOW,
  type: INPUT_TYPES.BOOLEAN,
  default: false,
}