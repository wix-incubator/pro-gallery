import { INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Show Navigation Arrows',
  description: `Choose if you want to have navigation arrows in a sliding gallery`,
  isRelevant: (styleParams) => styleParams.oneRow,
  type: INPUT_TYPES.BOOLEAN,
  default: true,
}