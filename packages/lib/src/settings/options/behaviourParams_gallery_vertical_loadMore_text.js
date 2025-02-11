import { INPUT_TYPES } from '../utils/constants.js';
import { default as enableLoadMore } from './behaviourParams_gallery_vertical_loadMore_enable.js';
import optionsMap from '../../core/helpers/optionsMap.js';

export default {
  title: 'Load More button text',
  isRelevant: (options) =>
    enableLoadMore.isRelevant(options) && options[optionsMap.behaviourParams.gallery.vertical.loadMore.enable],
  isRelevantDescription:
    'Set a Vertical gallery ("Scroll Direction" as "Vertical") and set "Enable load more button" to "true".',
  type: INPUT_TYPES.TEXT,
  default: 'Load More', //one source
  description: 'Set the text of the load more button',
};
