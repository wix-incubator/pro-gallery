import { INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Block Right Click Menu',
  isRelevant: () => true,
  isRelevantDescription: 'Always relevant.',
  type: INPUT_TYPES.BOOLEAN,
  default: true,
  description: `Block the native context menu from appearing when right clicking over images / videos. Set to true to prevent downloading the image easily (notice, the images can still be downloaded in many other ways)`,
};
