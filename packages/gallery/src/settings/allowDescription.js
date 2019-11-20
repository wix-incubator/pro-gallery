import {  INPUT_TYPES } from './utils/constants';
import { always } from './utils/utils';

export default {
  title: 'Allow description',
  description: 'Choose if you want description to show or not',
  isRelevant: always,
  type: INPUT_TYPES.BOOLEAN,
  default: false,
}