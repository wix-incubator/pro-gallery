import { INPUT_TYPES } from '../utils/constants';

export default {
  title: 'One Row',
  description: `Choose between a vertical to horizontal scrolled gallery. Note that this option will affect
  the availability of many other options`,
  isRelevant: () => {
    console.error('oneRow is deprecated. use scrollDirection instead');
    return true;
  },
  isRelevantDescription: 'Always relevant.',
  type: INPUT_TYPES.BOOLEAN,
  default: undefined, //This value is deprecated and the default for it is now undefined
};
