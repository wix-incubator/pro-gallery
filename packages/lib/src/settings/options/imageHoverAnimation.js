import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';

export default {
  title: 'Image Hover Animation',
  isRelevant: () => true,
  isRelevantDescription: 'Always relevant.',
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS.imageHoverAnimations.NO_EFFECT,
  options: createOptions('imageHoverAnimations'),
  description: `Choose the image animation effect to be used when hovering on each item.
  `,
};
