import { INPUT_TYPES } from './utils/constants';
import { always } from './utils/utils';

export default {
  title: 'Allow title',
  description: 'Choose whether you want to show title or not',
  isRelevant: always,
  type: INPUT_TYPES.BOOLEAN,
  default: false,
}