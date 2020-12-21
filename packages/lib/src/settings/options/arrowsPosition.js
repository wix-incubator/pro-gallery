import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';

export default {
  title: 'Navigation Arrows Position',
  isRelevant: (styleParams) => styleParams.oneRow && styleParams.showArrows,
  isRelevantDescription:
    'Set a Horizontal gallery ("Scroll Direction" as "Horizontal") and set "Show Navigation Arrows" to "true".',
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS.arrowsPosition.ON_GALLERY,
  options: createOptions('arrowsPosition'),
  description: `Set the position of the navigation arrows in sliders. You can choose to position the arrows on the gallery (ON_GALLERY)
  or outside the gallery (OUTSIDE_GALLERY- in these case the gallery will margins from both sides to make room for the arrows);
  `,
};
