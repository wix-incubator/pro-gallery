import { INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Crop Ratios',
  description: `Crop each image according to the corresponding crop ratio as indicated in this string. This will create a pattern of cropped images`,
  isRelevantDescription: 'Set "Crop Images" to "true".',
  isRelevant: (options) => options.cubeImages,
  type: INPUT_TYPES.NUMBER,
  default: [1],
};
