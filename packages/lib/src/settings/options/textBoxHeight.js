import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';

export default {
  title: 'Text Box Height (pixels)',
  description: `Set the text box Height when the texts are above or below the item`,
  isRelevantDescription:
    'set a Vertical scrolled gallery, set "Layout Orientation" to "Columns", set "Max Group Size" to "1", set "Texts Placement" to "Show Below" or "Show Above".',
  isRelevant: (styleParams) =>
    styleParams.isVertical &&
    styleParams.groupSize === 1 &&
    !styleParams.oneRow &&
    GALLERY_CONSTS.hasVerticalPlacement(styleParams.titlePlacement),
  type: INPUT_TYPES.NUMBER,
  default: 200,
  min: 0,
  max: 1000,
};
