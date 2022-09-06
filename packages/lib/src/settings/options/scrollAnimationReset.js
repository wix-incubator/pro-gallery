import { INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Scroll Animation Reset',
  isRelevant: (sp) => sp.scrollAnimation !== 'NO_EFFECT',
  type: INPUT_TYPES.BOOLEAN,
  default: false,
  description: `Return the items to their original state when the scrolling stops`,
};
