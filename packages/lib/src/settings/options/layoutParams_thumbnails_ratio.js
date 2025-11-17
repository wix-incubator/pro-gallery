import optionsMap from '../../core/helpers/optionsMap.js';
import { INPUT_TYPES } from '../utils/constants.js';

export default {
  title: 'Thumbnail Ratio',
  isRelevant: (options) => options[optionsMap.layoutParams.thumbnails.enable],
  isRelevantDescription: 'Enable thumbnails to see this option.',
  type: INPUT_TYPES.NUMBER,
  default: 1,
  min: 0.1,
  max: 10,
  step: 0.01,
  description: `Set the aspect ratio (width/height) of thumbnails. A ratio of 1 creates square thumbnails (1:1). 
  For example, a ratio of 0.75 creates 3:4 thumbnails (portrait), and 1.333 creates 4:3 thumbnails (landscape).
  This allows thumbnails to match the main gallery aspect ratio.`,
};
