import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';

export default {
  title: 'Slide Animation',
  isRelevant: (sp) => sp.oneRow && sp.groupSize === 1 && sp.cubeImages,
  isRelevantDescription:
    'Set Horizontal scrolled gallery, set "Max Group Size" to "1", set "Crop Images" to true.',
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS.slideAnimations.SCROLL,
  options: createOptions('slideAnimations'),
  description: `Choose the slide animation effect to be used when navigating between items in a slideshow`,
};
