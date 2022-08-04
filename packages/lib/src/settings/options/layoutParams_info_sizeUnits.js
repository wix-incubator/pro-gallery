import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';

export default {
  title: 'Text Box Width Units',
  description: `Set the text box width in pixels or as a percent from the column width and height.`,
  isRelevant: (options) =>
    options.isVertical &&
    options.groupSize === 1 &&
    options.scrollDirection === GALLERY_CONSTS.scrollDirection.VERTICAL &&
    GALLERY_CONSTS.hasExternalHorizontalPlacement(options.titlePlacement),
  type: INPUT_TYPES.OPTIONS,
  options: createOptions('textBoxWidthCalculationOptions'),
  default: GALLERY_CONSTS.textBoxWidthCalculationOptions.PERCENT,
};
