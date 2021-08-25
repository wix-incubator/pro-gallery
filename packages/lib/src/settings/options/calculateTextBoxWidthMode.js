import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';

export default {
  title: 'Text Box Width Units',
  description: `Set the text box width in pixels or as a percent from the column width.`,
  isRelevantDescription:
    'First set a Vertical gallery ("Scroll Direction" as "Vertical").\nThen set "Layout Orientation" to "Columns".\nThen set "Max Group Size" to "1".\nThen set "Texts Placement" to "Show on The Left" or "Show on The Right".',
  isRelevant: (options) =>
    options.isVertical &&
    options.groupSize === 1 &&
    options.scrollDirection === GALLERY_CONSTS.scrollDirection.VERTICAL &&
    (options.titlePlacement === GALLERY_CONSTS.placements.SHOW_ON_THE_LEFT ||
      options.titlePlacement === GALLERY_CONSTS.placements.SHOW_ON_THE_RIGHT),
  type: INPUT_TYPES.OPTIONS,
  options: createOptions('textBoxWidthCalculationOptions'),
  default: GALLERY_CONSTS.textBoxWidthCalculationOptions.PERCENT,
};
