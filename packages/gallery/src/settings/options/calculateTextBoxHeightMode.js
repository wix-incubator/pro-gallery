import {GALLERY_CONSTS, INPUT_TYPES} from '../utils/constants';

export default {
  title: 'Text Box Height Calculation Type',
  description: `Set the calc type (manual or automatic) to use when calculating the textbox height`,
  isRelevant: (styleParams) => (styleParams.isVertical &&
    styleParams.groupSize === 1 &&
    !styleParams.oneRow) &&
    (styleParams.allowTitle || styleParams.allowDescription),
  type: INPUT_TYPES.TEXT,
  default: GALLERY_CONSTS.textBoxHeightCalculationOptions.AUTOMATIC,
}
