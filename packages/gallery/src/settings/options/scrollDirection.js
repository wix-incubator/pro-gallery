import { INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Scroll Direction',
  description: `Choose between a vertical to horizontal scrolled gallery. Note that this option will affect
  the availability of many other options`,
  isRelevant: () => true,
  type: INPUT_TYPES.NUMBER,
  default: 0,
}