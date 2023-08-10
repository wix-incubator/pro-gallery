import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';
import { default as layoutParams_navigationArrows_position } from './layoutParams_navigationArrows_position';
import optionsMap from '../../core/helpers/optionsMap';

export default {
  title: 'Navigation Arrows Vertical Position',
  isRelevant: (options) =>
    layoutParams_navigationArrows_position.isRelevant(options) &&
    (options[optionsMap.layoutParams.navigationArrows.position] ===
      GALLERY_CONSTS[optionsMap.layoutParams.navigationArrows.position].ON_GALLERY ||
      options[optionsMap.layoutParams.navigationArrows.position] ===
        GALLERY_CONSTS[optionsMap.layoutParams.navigationArrows.position].OUTSIDE_GALLERY),
  isRelevantDescription:
    layoutParams_navigationArrows_position.isRelevantDescription +
    ' and make sure arrow position is set to "on gallery" or "outside gallery"',
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS[optionsMap.layoutParams.navigationArrows.verticalAlignment].ITEM_CENTER,
  get options() {
    return createOptions('layoutParams_navigationArrows_verticalAlignment');
  },
  description: `Set the vertical position of the navigation arrows in sliders. You can choose to position the arrows on the center of the whole item, the center of the image or the center of the info`,
};
