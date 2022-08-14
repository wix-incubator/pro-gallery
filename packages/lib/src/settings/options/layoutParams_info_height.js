import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';

export default {
  title: 'Text Box Height (Pixels)',
  description: `Set the text box Height when the texts are above or below the item`,
  isRelevantDescription:
    'First set a Vertical gallery ("Scroll Direction" as "Vertical").\nThen set "Layout Orientation" to "Columns".\nThen set "Max Group Size" to "1".\nThen set "Texts Placement" to "Show Below" or "Show Above".',
  isRelevant: (options) =>
    ((options.isVertical &&
      options.scrollDirection === GALLERY_CONSTS.scrollDirection.VERTICAL) ||
      options.scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL) &&
    options.groupSize === 1 &&
    GALLERY_CONSTS.hasExternalVerticalPlacement(options.titlePlacement),
  type: INPUT_TYPES.NUMBER,
  default: 200,
  min: 0,
  max: 1000,
};
