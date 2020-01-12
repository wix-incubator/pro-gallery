import { INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Show Title',
  description: `Allow a title to appear with each item.
  Note that the placement of the texts (title and description) can also be changed with the option - "titlePlacement".`,
  isRelevant: () => true,
  type: INPUT_TYPES.BOOLEAN,
  default: false,
}