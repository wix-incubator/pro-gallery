import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';
import { default as arrowsPosition } from './arrowsPosition';

export default {
  title: 'Navigation Arrows Vertical Position',
  isRelevant: (options) =>
    arrowsPosition.isRelevant(options) &&
    (options.arrowsPosition === GALLERY_CONSTS.arrowsPosition.ON_GALLERY ||
      options.arrowsPosition === GALLERY_CONSTS.arrowsPosition.OUTSIDE_GALLERY),
  isRelevantDescription:
    arrowsPosition.isRelevantDescription +
    ' and make sure arrow position is set to "on gallery" or "outside gallery"',
  // 'Set a Horizontal gallery ("Scroll Direction" as "Horizontal"), set "Show Navigation Arrows" to "true" and set arrows position to "on gallery" or "outside gallery".',
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS.arrowsVerticalPosition.ITEM_CENTER,
  options: createOptions('arrowsVerticalPosition'),
  description: `Set the vertical position of the navigation arrows in sliders. You can choose to position the arrows on the center of the whole item, the center of the image or the center of the info`,
};
