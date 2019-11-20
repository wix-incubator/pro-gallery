import { GALLERY_CONSTS, INPUT_TYPES } from './utils/constants';
import { createOptions, always } from './utils/utils';

export default {
  title: 'Click Action',
  description: 'Specifies what happens when an item is clicked',
  isRelevant: always,
  type: INPUT_TYPES.BOOLEAN,
  default: GALLERY_CONSTS.itemClick.EXPAND,
  options: createOptions('itemClick')
}