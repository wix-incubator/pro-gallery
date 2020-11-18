import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';

export default {
  title: 'Scroll Direction',
  isRelevant: () => true,
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS.scrollDirection.VERTICAL,
  options: createOptions('scrollDirection'),
  description: `Toggle between two types of galleries. Vertical and Horizontal. Notice that many options are available only for a specific scroll direction.`,
};
