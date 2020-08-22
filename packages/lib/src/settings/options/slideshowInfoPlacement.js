import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';

export default {
  title: 'Slideshow info Placement',
  isRelevant: (styleParams) => styleParams.oneRow,
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS.slideshowInfoPlacement.ON_THE_BOTTOM,
  options: createOptions('slideshowInfoPlacement'),
  description: `Choose the the placement of the texts in the Slideshow layout.`,
}