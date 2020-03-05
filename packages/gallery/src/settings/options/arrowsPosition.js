import { GALLERY_CONSTS, INPUT_TYPES } from '../utils/constants';
import { createOptions } from '../utils/utils';

export default {
  title: 'Navigation Arrows Position',
  isRelevant: (styleParams)  => styleParams.oneRow,
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS.arrowsPosition.ON_GALLERY,
  options: createOptions('arrowsPosition'),
  description: `Set the position of the navigation arrows in sliders. You can choose to position the arrows on the gallery (ON_GALLERY)
  or outside the gallery (OUTSIDE_GALLERY- in these case the gallery will margins from both sides to make room for the arrows);
  `,
}