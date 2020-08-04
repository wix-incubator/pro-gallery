import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';

export default {
  title: 'Image Placement Animation',
  isRelevant: ()  => true,
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS.imagePlacementAnimations.NO_EFFECT,
  options: createOptions('imagePlacementAnimations'),
  description: `Choose an effect that happens to the image when placed/replaced on the gallery.`,
}