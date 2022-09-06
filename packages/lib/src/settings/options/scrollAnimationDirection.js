import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';

export default {
  title: 'Scroll Animation Direction',
  isRelevant: (sp) => sp.scrollAnimation !== 'NO_EFFECT',
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS.scrollAnimationDirection.IN,
  options: createOptions('scrollAnimationDirection'),
  description: `Choose the direction from / to animate the items`,
};
