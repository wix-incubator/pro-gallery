import { INPUT_TYPES } from '../utils/constants';
import { GALLERY_CONSTS } from 'pro-gallery-lib';

export default {
  title: 'Slidshow side info width',
  description: `Choose the width of the info in case you chose to show it on the side of the slideshow`,
  isRelevant: (styleParams) => styleParams.oneRow &&
    styleParams.slideshowInfoPlacement !== GALLERY_CONSTS.slideshowInfoPlacement.ON_THE_BOTTOM,
  type: INPUT_TYPES.NUMBER,
  default: 300,
  min: 0,
  max: 500
}