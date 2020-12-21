import { INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Spacing Between Items',
  description: `Set the margin between items.
    This option is not relevant to some layouts: Slideshow, Thumbnails.`,
  isRelevant: () => true,
  isRelevantDescription: 'Always relevant',
  type: INPUT_TYPES.NUMBER,
  default: 10,
};
