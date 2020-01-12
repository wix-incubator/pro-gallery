import { INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Allow Download Button',
  description: `Add a download icon to each item. Note, in iOS devices (iPad, iPod and iPhone) this option is
  not relevant and the download button will not be shown.`,
  isRelevant: () => true,
  type: INPUT_TYPES.BOOLEAN,
  default: false,
}