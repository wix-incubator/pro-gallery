import { INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Show Navigation Arrows',
  description: `Choose if you want to have navigation arrows in a sliding gallery`,
  isRelevant: (styleParams) => styleParams.oneRow,
  isRelevantDescription:
    'Set a Horizontal gallery ("Scroll Direction" as "Horizontal").',
  type: INPUT_TYPES.BOOLEAN,
  default: true,
};
