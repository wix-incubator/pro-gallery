import { INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Allow Lean Gallery',
  isRelevant: () => true,
  isRelevantDescription: 'Always relevant',
  type: INPUT_TYPES.BOOLEAN,
  default: false,
  description: `Allow rendering CSS gallery for supported galleries`,
};
