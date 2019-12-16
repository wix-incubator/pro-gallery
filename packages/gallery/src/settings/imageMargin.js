import { INPUT_TYPES } from './utils/constants';
import { imageMargin } from './utils/utils';

export default {
  title: 'Spacing Between Items',
  description: `Set the margin between items.
    This option is not relevant to some layouts: Slideshow, Thumbnails.`,
  isRelevant: imageMargin,
  type: INPUT_TYPES.NUMBER,
  default: 10,
}