import { INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Images Per Column',
  description: `This option sets the number of images per a column. This option is currently supported only by Grid layout`,
  type: INPUT_TYPES.NUMBER,
  isRelevant: (styleParams) => styleParams.oneRow,
  isRelevantDescription: 'Set a Horizontal scrolled gallery.',
  default: 1,
};
