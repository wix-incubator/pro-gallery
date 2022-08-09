import { INPUT_TYPES } from '../utils/constants';
import { createOptions } from '../utils/utils';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { default as layoutParams_navigationArrows_mouseCursorContainerMaxWidth } from './layoutParams_navigationArrows_mouseCursorContainerMaxWidth';

export default {
  title: 'Click Action',
  isRelevant: (options) =>
    layoutParams_navigationArrows_mouseCursorContainerMaxWidth.isRelevant(
      options
    ) && layoutParams_navigationArrows_mouseCursorContainerMaxWidth !== 100,
  isRelevantDescription:
    'set "Arrows Position" to anything but "Mouse Cursor" (ON_GALLERY or OUTSIDE_GALLERY)',
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS.itemClick.NOTHING,
  options: createOptions('itemClick'),
  description: `Specifies what happens when an item is clicked. To enable the 'expand' or 'fullscreen' options, make sure you're using the ExpandableProGallery component`,
};
