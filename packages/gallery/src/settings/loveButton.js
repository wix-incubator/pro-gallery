import { INPUT_TYPES } from './utils/constants';
import { always } from './utils/utils';

export default {
  title: 'Love button',
  description: 'Choose whether you want to show love button or not',
  isRelevant: always,
  type: INPUT_TYPES.BOOLEAN,
  default: false,
}