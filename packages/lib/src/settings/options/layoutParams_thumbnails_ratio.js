import optionsMap from '../../core/helpers/optionsMap.js';
import { INPUT_TYPES } from '../utils/constants.js';

export default {
  title: 'Thumbnail Ratio',
  isRelevant: (options) => options[optionsMap.layoutParams.thumbnails.enable],
  isRelevantDescription: 'Enable thumbnails to see this option.',
  type: INPUT_TYPES.OPTIONS,
  default: 1,
  get options() {
    return [
      { value: 16 / 9, title: '16:9' },
      { value: 4 / 3, title: '4:3' },
      { value: 1, title: '1:1' },
      { value: 3 / 4, title: '3:4' },
      { value: 9 / 16, title: '9:16' },
    ];
  },
  description: `Set the aspect ratio (width/height) of thumbnails. This allows thumbnails to match the main gallery aspect ratio.`,
};
