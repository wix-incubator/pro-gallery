import { INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Auto Slide',
  isRelevant: (sp) => !!sp.oneRow,
  type: INPUT_TYPES.BOOLEAN,
  default: false,
  description: `When set to true, the gallery will change the current item automatically after a specified interval`,
};
