import { INPUT_TYPES } from '../utils/constants';
import { createOptions } from '../utils/utils';
import { default as GALLERY_CONSTS } from '../../common/constants';

export default {
  title: 'Click Action',
  isRelevant: (options) =>
    options.showArrows &&
    options.arrowsPosition !== GALLERY_CONSTS.arrowsPosition.MOUSE_CURSOR,
  isRelevantDescription:
    'set "Arrows Position" to anything but "Mouse Cursor" (ON_GALLERY or OUTSIDE_GALLERY)',
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS.itemClick.NOTHING,
  options: createOptions('itemClick'),
  description: `Specifies what happens when an item is clicked. To enable the 'expand' or 'fullscreen' options, make sure you're using the ExpandableProGallery component`,
};
