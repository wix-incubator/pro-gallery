import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';

export default {
  title: 'Mobile Horizontal Scroll Animations',
  isRelevant: () => true,
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS.mobileSwipeAnimations.CAROUSEL,
  options: createOptions('mobileSwipeAnimations'),
  description: `Animations on mobile horizontal scrolls.`,
}