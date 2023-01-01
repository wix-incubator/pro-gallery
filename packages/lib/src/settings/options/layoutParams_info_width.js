import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';

export default {
  title: 'Text Box Width',
  description: `Set the text box width (accourding to the selected unit) from the column width when on the right side or on the left side.`,
  isRelevant: (options) =>
    options.isVertical &&
    options.groupSize === 1 &&
    options.scrollDirection === GALLERY_CONSTS.scrollDirection.VERTICAL && //NEW STYPEPARAMS METHOD change to new sps
    GALLERY_CONSTS.hasExternalHorizontalPlacement(options.titlePlacement),
  isRelevantDescription: `First set a Vertical gallery ("Scroll Direction" as "Vertical").\nThen set "Layout Orientation" to "Columns".\nThen set "Max Group Size" to "1".\nThen set "Texts Placement" to "Show on the Right" or "Show on the Left".`,
  type: INPUT_TYPES.NUMBER,
  default: 50,
  min: 0,
  max: 100,
};
