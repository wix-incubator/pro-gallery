import { INPUT_TYPES } from '../utils/constants';

export default {
  title: 'One Row',
  description: `Choose between a vertical to horizontal scrolled gallery. Note that this option will affect
  the availability of many other options`,
  isRelevant: () => true,
  isRelevantDescription: 'Always relevant',
  type: INPUT_TYPES.BOOLEAN,
  default: false,
};
