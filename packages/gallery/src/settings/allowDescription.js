import { INPUT_TYPES } from './utils/constants';
import { always } from './utils/utils';

export default {
  title: 'Show Description',
  description: `Allow a description to appear with each item. This option can be set in all layouts.
  Note that the placement of the texts (title and description) can also be changed in some layouts that have the option - "titlePlacement".` ,
  isRelevant: always,
  type: INPUT_TYPES.BOOLEAN,
  default: false,
}