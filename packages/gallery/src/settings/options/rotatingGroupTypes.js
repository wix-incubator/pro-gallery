import { INPUT_TYPES } from '../utils/constants';
import { createOptions } from '../utils/utils';

export default {
  title: 'Rotating Group Types',
  description: `Choose the order of group types to appear in rotation in a collage gallery.`,
  isRelevant: (styleParams) => styleParams.groupSize === 3,
  type: INPUT_TYPES.MULTISELECT,
  options: createOptions('groupTypes'),
  default: '',
}