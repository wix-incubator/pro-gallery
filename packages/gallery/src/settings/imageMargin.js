import { INPUT_TYPES } from './utils/constants';
import { imageMargin } from './utils/utils';

export default {
  title: 'Spacing Between Items',
  description: `Set the margin between items and control the spacing between them.
    This Style Param is not relevant to some layouts and will not affect them(Slideshow, Thumbnails).`,
  isRelevant: imageMargin,
  type: INPUT_TYPES.NUMBER,
  default: 10,
}