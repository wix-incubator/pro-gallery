import {  INPUT_TYPES } from './utils/constants';
import { always } from './utils/utils';

export default {
  title: 'Show Description',
  description: 'Show the description in the info section',
  isRelevant: always,
  type: INPUT_TYPES.BOOLEAN,
  default: false,
}