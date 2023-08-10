import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';
import { default as layoutParams_navigationArrows_enable } from './layoutParams_navigationArrows_enable';
import optionsMap from '../../core/helpers/optionsMap';

export default {
  title: 'Navigation Arrows Position',
  isRelevant: (options) =>
    layoutParams_navigationArrows_enable.isRelevant(options) &&
    options[optionsMap.layoutParams.navigationArrows.enable],
  isRelevantDescription:
    'Set a Horizontal gallery ("Scroll Direction" as "Horizontal") and set "Show Navigation Arrows" to "true".',
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS.layoutParams_navigationArrows_position.ON_GALLERY,
  get options() {
    return createOptions('layoutParams_navigationArrows_position');
  },
  description: `Set the position of the navigation arrows in sliders. You can choose to position the arrows on the gallery (ON_GALLERY)
  ,outside the gallery (OUTSIDE_GALLERY- in these case the gallery will margins from both sides to make room for the arrows), or on the mouse cursor (still in experimental mode).);
  `,
};
