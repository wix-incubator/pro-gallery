import { INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Loop Videos',
  description: `When true videos will be played in a loop`,
  isRelevant: (styleParams) => true,
  type: INPUT_TYPES.BOOLEAN,
  default: true,
}