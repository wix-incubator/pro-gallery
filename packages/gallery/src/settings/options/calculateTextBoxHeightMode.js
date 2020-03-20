import { GALLERY_CONSTS, INPUT_TYPES } from '../utils/constants';
import { createOptions } from '../utils/utils';

export default {
  title: 'Text Box Height Calculation Type',
  description: `Set the calc type (manual or automatic) to use when calculating the textbox height`,
  isRelevant: (styleParams) => (styleParams.isVertical &&
    styleParams.groupSize === 1 &&
    !styleParams.oneRow) &&
    (styleParams.titlePlacement === GALLERY_CONSTS.placements.SHOW_ABOVE ||
      styleParams.titlePlacement === GALLERY_CONSTS.placements.SHOW_ABOVE) &&
    (styleParams.allowTitle || styleParams.allowDescription),
  type: INPUT_TYPES.OPTIONS,
  options: createOptions('textBoxHeightCalculationOptions'),
  default: GALLERY_CONSTS.textBoxHeightCalculationOptions.AUTOMATIC,
}
