import {GALLERY_CONSTS, INPUT_TYPES} from '../utils/constants';

export default {
  title: 'Text Box Height (pixels)',
  description: `Set the text box Height when the texts are above or below the item`,
  isRelevant: (styleParams) => (styleParams.isVertical &&
    styleParams.groupSize === 1 &&
    !styleParams.oneRow) &&
    (styleParams.titlePlacement === GALLERY_CONSTS.placements.SHOW_ABOVE ||
      styleParams.titlePlacement === GALLERY_CONSTS.placements.SHOW_ABOVE) &&
    styleParams.calculateTextBoxHeightMode === GALLERY_CONSTS.textBoxHeightCalculationOptions.MANUAL &&
    (styleParams.allowTitle || styleParams.allowDescription),
  type: INPUT_TYPES.NUMBER,
  default: 200,
  min: 0,
  max: 1000
}
