import { INPUT_TYPES } from './utils/constants';
import { always } from './utils/utils';

export default {
  title: 'Spacing Between Items',
  description: 'Set the margin of items and control the spacing between items',
  isRelevant: always,
  type: INPUT_TYPES.NUMBER,
  default: 10,
}