import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';
import { default as layoutParams_navigationArrows_mouseCursorContainerMaxWidth } from './layoutParams_navigationArrows_mouseCursorContainerMaxWidth';

export default {
  title: 'Navigation Arrows Vertical Position',
  isRelevant: (options) =>
    layoutParams_navigationArrows_mouseCursorContainerMaxWidth.isRelevant(
      options
    ) && layoutParams_navigationArrows_mouseCursorContainerMaxWidth !== 100,
  isRelevantDescription:
    'Set a Horizontal gallery ("Scroll Direction" as "Horizontal") and set "Show Navigation Arrows" to "true".',
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS.arrowsVerticalPosition.ITEM_CENTER,
  options: createOptions('arrowsVerticalPosition'),
  description: `Set the vertical position of the navigation arrows in sliders. You can choose to position the arrows on the center of the whole item, the center of the image or the center of the info`,
};
