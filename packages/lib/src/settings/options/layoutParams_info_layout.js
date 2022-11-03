//NEW STYPEPARAMS METHOD
import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';
import optionsMap from '../../core/helpers/optionsMap';

export default {
  title: 'Choose info layout',
  description: `Choose the layout you want for your texts, you can choose to separate the texts and the items
  so you can style them separately.`,
  isRelevantDescription:
    'Set "Max Group Size" to "1", set "Layout Orientation" to "Columns" and set "Texts Placement" to anything but "Show On Hover".',
  isRelevant: (options) =>
    options[optionsMap.layoutParams.groups.groupSize] === 1 &&
    options[optionsMap.layoutParams.structure.layoutOrientation] ===
      GALLERY_CONSTS[optionsMap.layoutParams.structure.layoutOrientation]
        .VERTICAL &&
    !GALLERY_CONSTS.hasHoverPlacement(
      options[optionsMap.layoutParams.info.placement]
    ),
  options: createOptions('layoutParams_info_layout'),
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS.layoutParams_info_layout.NO_BACKGROUND,
};
