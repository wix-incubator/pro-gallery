import {  INPUT_TYPES } from './utils/constants';
import { createOptions, always } from './utils/utils';

export default {
  title: 'Toggle Social',
  description: 'Add a social share icon to each item',
  isRelevant: always,
  type: INPUT_TYPES.BOOLEAN,
  default: false,
  options: createOptions('allowSocial')
}