import { INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Choose Best Group',
  isRelevant: (options) => options.groupSize > 1,
  isRelevantDescription: 'Set "Max Group Size" to be greater than "1".',
  type: INPUT_TYPES.BOOLEAN,
  default: true,
  description: `When true, the gallery will choose the best way to arrange the groups according
  to the proportions of the items.
  `,
};
