import { INPUT_TYPES } from './utils/constants';
import { always } from './utils/utils';

export default {
  title: 'Show Title',
  description: `Show the title in the item info. This style param can be set in all layouts.
  Notice that the placement of the texts(title and description) can be set too(see Style Param: "titlePlacement").`,
  isRelevant: always,
  type: INPUT_TYPES.BOOLEAN,
  default: false,
}