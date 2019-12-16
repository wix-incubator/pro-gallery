import { GALLERY_CONSTS, INPUT_TYPES } from './utils/constants';
import { createOptions, always } from './utils/utils';

export default {
  title: 'Click Action',
  isRelevant: always,
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS.itemClick.EXPAND,
  options: createOptions('itemClick'),
  description: `Specifies what happens when an item is clicked. To enable the 'expand' or 'fullscreen' options, make sure you're using the ExpandableProGallery component`,
}