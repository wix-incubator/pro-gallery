import { INPUT_TYPES } from '../utils/constants';
import { createOptions } from '../utils/utils';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { default as layoutParams_navigationArrows_mouseCursorContainerMaxWidth } from './layoutParams_navigationArrows_mouseCursorContainerMaxWidth';

export default {
  title: 'Click Action',
  isRelevant: (options) =>
    !(
      options.layoutParams_navigationArrows_mouseCursorContainerMaxWidth ===
        100 &&
      layoutParams_navigationArrows_mouseCursorContainerMaxWidth.isRelevant(
        options
      )
    ),
  isRelevantDescription:
    'its always relevant except if arrow position is set to mouse cursor and the mouse cursor container max width is 100 (clicks will navigate to the next item)',
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS.itemClick.NOTHING,
  options: createOptions('itemClick'),
  description: `Specifies what happens when an item is clicked. To enable the 'expand' or 'fullscreen' options, make sure you're using the ExpandableProGallery component`,
};
