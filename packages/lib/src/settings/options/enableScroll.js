import { INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Enable Scroll',
  description: `This option decides if there will be any scrolling in a sliding gallery`,
  isRelevantDescription:
    'Set a Horizontal gallery ("Scroll Direction" as "Horizontal").',
  isRelevant: (styleParams) => styleParams.oneRow,
  type: INPUT_TYPES.BOOLEAN,
  default: true,
};
