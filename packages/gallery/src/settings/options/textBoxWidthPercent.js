import {GALLERY_CONSTS, INPUT_TYPES} from '../utils/constants';

export default {
  title: 'Text Box Width (percent)',
  description: `Set the text box width in percent from the column width when on the right side or on the left side.`,
  isRelevant: (styleParams) => (styleParams.isVertical &&
    styleParams.groupSize === 1 &&
    !styleParams.oneRow) &&
    styleParams.calculateTextBoxWidthMode === GALLERY_CONSTS.textBoxWidthCalculationOptions.PERCENT &&
    (styleParams.allowTitle || styleParams.allowDescription),
  type: INPUT_TYPES.NUMBER,
  default: 50,
  min: 0,
  max: 100
}
