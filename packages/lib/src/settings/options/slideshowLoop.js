import { INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Loop Images',
  description: `Choose if you want the items to loop when you reach the last item in a sliding gallery`,
  isRelevant: (styleParams) => styleParams.oneRow,
  isRelevantDescription: 'set a Horizontal scrolled gallery.',
  type: INPUT_TYPES.BOOLEAN,
  default: false,
};
