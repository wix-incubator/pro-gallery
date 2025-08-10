import { INPUT_TYPES } from '../utils/constants.js';
import layoutOrientation from './layoutParams_structure_layoutOrientation.js';

export default {
  title: 'Uniform Dimensions',
  description: `When enabled, all rows (horizontal layout) or groups (vertical layout) will have uniform dimensions. Items will be stretched to fit the uniform size while maintaining proper spacing.`,
  isRelevant: (options) => layoutOrientation.isRelevant(options),
  isRelevantDescription: 'Relevant when Layout Orientation is relevant.',
  type: INPUT_TYPES.BOOLEAN,
  default: false,
};
