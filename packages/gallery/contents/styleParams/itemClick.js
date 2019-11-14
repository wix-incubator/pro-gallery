import { GALLERY_CONSTS, INPUT_TYPES } from './constants';
import { createOptions, always } from './utils';

export default {
  title: 'Click Action',
  description: 'Specifies what happens when an item is clicked',
  isRelevant: always,
  type: INPUT_TYPES.BOOLEAN,
  default: GALLERY_CONSTS.itemClick.EXPAND,
  options: createOptions('itemClick')
}