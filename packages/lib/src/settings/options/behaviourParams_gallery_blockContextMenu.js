import { INPUT_TYPES } from '../utils/constants';
// //dummy commit
export default {
  title: 'Allow Right Click Menu',
  isRelevant: () => true,
  isRelevantDescription: 'Always relevant.',
  type: INPUT_TYPES.BOOLEAN,
  default: true, //one source
  description: `Allow the native context menu from appearing when right clicking over images / videos. Set to false to prevent downloading the image easily (notice, the images can still be downloaded in many other ways)`,
};
