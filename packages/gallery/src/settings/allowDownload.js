import { INPUT_TYPES } from './utils/constants';
import { always } from './utils/utils';

export default {
  title: 'Toggle Download',
  description: `Add a download icon to each item. Notice, in iOS devices(iPad, iPod and iPhone) this Style Param is
  not relevant and the download button will not be shown.`,
  isRelevant: always,
  type: INPUT_TYPES.BOOLEAN,
  default: false,
}