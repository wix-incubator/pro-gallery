import { INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Auto Slide',
  isRelevant: (sp) => !!sp.oneRow,
  isRelevantDescription:
    'Set a Horizontal gallery ("Scroll Direction" as "Horizontal")',
  type: INPUT_TYPES.BOOLEAN,
  default: false,
  description: `When set to true, the gallery will change the current item automatically after a specified interval`,
};
