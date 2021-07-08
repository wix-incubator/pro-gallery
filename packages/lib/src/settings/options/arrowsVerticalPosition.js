import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';

export default {
  title: 'Navigation Arrows Vertical Position',
  isRelevant: (styleParams) =>
    styleParams.scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL &&
    styleParams.showArrows,
  isRelevantDescription:
    'Set a Horizontal gallery ("Scroll Direction" as "Horizontal") and set "Show Navigation Arrows" to "true".',
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS.arrowsVerticalPosition.ITEM_CENTER,
  options: createOptions('arrowsVerticalPosition'),
  description: `Set the vertical position of the navigation arrows in sliders. You can choose to position the arrows on the center of the whole item, the center of the image or the center of the info`,
};
