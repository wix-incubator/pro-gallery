import {GALLERY_CONSTS, INPUT_TYPES} from '../utils/constants';
import { hasHorizontalPlacement } from '../../common/constants/placements';

export default {
  title: 'Text Box Width (pixels)',
  description: `Set the text box width when on the right side or on the left side.`,
  isRelevant: (styleParams) => (styleParams.isVertical &&
    styleParams.groupSize === 1 &&
    !styleParams.oneRow) &&
    styleParams.calculateTextBoxWidthMode === GALLERY_CONSTS.textBoxWidthCalculationOptions.MANUAL &&
    hasHorizontalPlacement(styleParams.titlePlacement) &&
    (styleParams.allowTitle || styleParams.allowDescription),
  type: INPUT_TYPES.NUMBER,
  default: 200,
  min: 0,
  max: 1000
}
