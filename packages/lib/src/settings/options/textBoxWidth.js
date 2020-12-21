import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';

export default {
  title: 'Text Box Width (pixels)',
  description: `Set the text box width when on the right side or on the left side.`,
  isRelevantDescription:
    'Set a Vertical gallery ("Scroll Direction" as "Vertical") and set "Layout Orientation" to "Columns" and set "Max Group Size" to "1" and set "Texts Placement" to "Show on the Right" or "Show on the Left" and set "Text Box Width Units" to "Manual"',
  isRelevant: (styleParams) =>
    styleParams.isVertical &&
    styleParams.groupSize === 1 &&
    !styleParams.oneRow &&
    styleParams.calculateTextBoxWidthMode ===
      GALLERY_CONSTS.textBoxWidthCalculationOptions.MANUAL &&
    GALLERY_CONSTS.hasHorizontalPlacement(styleParams.titlePlacement),
  type: INPUT_TYPES.NUMBER,
  default: 200,
  min: 0,
  max: 1000,
};
