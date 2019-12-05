import { INPUT_TYPES } from './utils/constants';
import { always } from './utils/utils';

export default {
  title: 'Show Description',
  description: `Show the description in the info section. This Style Param can be set in all layouts.
  Notice that the placement of the texts(title and description) can be set too(see Style Param: "titlePlacement").` ,
  isRelevant: always,
  type: INPUT_TYPES.BOOLEAN,
  default: false,
}