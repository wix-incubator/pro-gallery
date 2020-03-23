import {GALLERY_CONSTS, INPUT_TYPES} from '../utils/constants';

export default {
  title: 'Text Box Width (pixels)',
  description: `Set the text box width when on the right side or on the left side.`,
  isRelevant: (styleParams) => (styleParams.isVertical &&
    styleParams.groupSize === 1 &&
    !styleParams.oneRow) &&
    styleParams.titlePlacement === GALLERY_CONSTS.placements.MANUAL &&
    styleParams.calculateTextBoxWidthMode === GALLERY_CONSTS.textBoxWidthCalculationOptions.MANUAL &&
    (styleParams.titlePlacement === GALLERY_CONSTS.placements.SHOW_ON_THE_LEFT ||
      styleParams.titlePlacement === GALLERY_CONSTS.placements.SHOW_ON_THE_RIGHT) &&
    (styleParams.allowTitle || styleParams.allowDescription),
  type: INPUT_TYPES.NUMBER,
  default: 200,
  min: 0,
  max: 1000
}
