import { INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Scroll Duration',
  isRelevant: ({ oneRow }) => !!oneRow,
  isRelevantDescription: 'set a Horizontal scrolled gallery.',
  type: INPUT_TYPES.NUMBER,
  default: 400,
  description: `The time in milliseconds it takes to scroll to the next item`,
};
