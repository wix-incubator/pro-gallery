import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';

export default {
  title: 'Choose info layout',
  description: `Choose the layout you want for your texts, you can choose to separate the texts and the items
  so you can style them separately.`,
  isRelevantDescription:
    'Set "Max Group Size" to "1", set "Layout Orientation" to "Columns" and set "Texts Placement" to anything but "Show On Hover".',
  isRelevant: (options) =>
    options.groupSize === 1 &&
    options.isVertical &&
    options.titlePlacement !== GALLERY_CONSTS.placements.SHOW_ON_HOVER,
  options: createOptions('infoType'),
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS.infoType.NO_BACKGROUND,
};
