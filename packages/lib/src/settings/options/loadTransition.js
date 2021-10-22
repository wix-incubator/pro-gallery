import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';

export default {
  title: 'Image Load Transition',
  description: `Set the type of transition used when image are loading and changing resolution`,
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS.loadTransition.NO_EFFECT,
  options: createOptions('loadTransition'),
  isRelevant: () => true,
};
