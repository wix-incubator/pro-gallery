import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';

export default {
  title: 'Text Box Width Units',
  description: `Set the text box width in pixels or as a percent from the column width.`,
  isRelevantDescription:
    'set a Vertical scrolled gallery, set "Layout Orientation" to Columns, set "Max Group Size" to "1", set "Texts Placement" to "Show on The Left" or "Show on The Right".',
  isRelevant: (styleParams) =>
    styleParams.isVertical &&
    styleParams.groupSize === 1 &&
    !styleParams.oneRow &&
    (styleParams.titlePlacement ===
      GALLERY_CONSTS.placements.SHOW_ON_THE_LEFT ||
      styleParams.titlePlacement ===
        GALLERY_CONSTS.placements.SHOW_ON_THE_RIGHT),
  type: INPUT_TYPES.OPTIONS,
  options: createOptions('textBoxWidthCalculationOptions'),
  default: GALLERY_CONSTS.textBoxWidthCalculationOptions.PERCENT,
};
