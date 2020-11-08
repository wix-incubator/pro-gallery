import { INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Fixed Crop Ratios',
  description: `Crop each image according to the corresponding crop ratio as indicated in this string. This will create a pattern of cropped images`,
  isRelevant: (styleParams) => styleParams.cubeImages,
  type: INPUT_TYPES.TEXT,
  default: '',
}