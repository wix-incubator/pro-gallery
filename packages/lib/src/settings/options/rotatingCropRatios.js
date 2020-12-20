import { INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Repeating Crop Ratios',
  description: `Crop each image according to the corresponding crop ratio as indicated in this string. This will create a pattern of cropped images`,
  isRelevantDescription: 'set "Crop Images" to "true".',
  isRelevant: (styleParams) => styleParams.cubeImages,
  type: INPUT_TYPES.TEXT,
  default: '',
};
