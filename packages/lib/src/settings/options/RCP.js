import { INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Prevent Right Click',
  isRelevant: () => true,
  type: INPUT_TYPES.BOOLEAN,
  default: true,
  description: `Prevent the native context menu from appearing when right clicking over images / videos`,
}