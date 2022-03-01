import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';
import height from './layoutParams_info_height';
import width from './layoutParams_info_width';

export default {
  title: 'Text Box Width Units',
  description: `Set the text box width in pixels or as a percent from the column width and height.`,
  isRelevant: (options) =>
    height.isRelevant(options) || width.isRelevant(options),
  type: INPUT_TYPES.OPTIONS,
  options: createOptions('textBoxWidthCalculationOptions'),
  default: GALLERY_CONSTS.textBoxWidthCalculationOptions.PERCENT,
};
