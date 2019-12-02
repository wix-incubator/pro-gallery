import { INPUT_TYPES } from './utils/constants';
import { always } from './utils/utils';

export default {
  title: 'Show Title',
  description: 'Show the title in the item info',
  isRelevant: always,
  type: INPUT_TYPES.BOOLEAN,
  default: false,
}