import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';

export default {
  title: 'Animation Direction',
  isRelevant: (sp) => sp.scrollAnnimation !== 'NO_EFFECT',
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS.animationDirection.IN,
  options: createOptions('animationDirection'),
  description: `Choose the direction from / to animate the items`,
};
