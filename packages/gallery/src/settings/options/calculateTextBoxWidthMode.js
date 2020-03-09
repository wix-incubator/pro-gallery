import {GALLERY_CONSTS, INPUT_TYPES} from '../utils/constants';
import { createOptions } from '../utils/utils';

export default {
  title: 'Text Box Width Units',
  description: `Set the text box width in pixels or as a percent from the column width.`,
  isRelevant: (styleParams) => (styleParams.isVertical &&
    styleParams.groupSize === 1 &&
    !styleParams.oneRow),
  type: INPUT_TYPES.OPTIONS,
  options: createOptions('calculateTextBoxWidthMode'),
  default: GALLERY_CONSTS.textBoxWidthCalculationOptions.PERCENT,
}
