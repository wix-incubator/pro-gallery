import { GALLERY_CONSTS, INPUT_TYPES } from './constants';
import { createOptions, always } from './utils';

export default {
  title: 'Allow title',
  description: 'Choose weather you want to show title or not',
  isRelevant: always,
  type: INPUT_TYPES.BOOLEAN,
  default: false,
  options: createOptions('allowTitle')
}