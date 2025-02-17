import { INPUT_TYPES } from '../utils/constants.js';
import { default as GALLERY_CONSTS } from '../../common/constants/index.js';
import { createOptions } from '../utils/utils.js';
import optionsMap from '../../core/helpers/optionsMap.js';
import { default as enableLoadMore } from './behaviourParams_gallery_vertical_loadMore_enable.js';

export default {
  title: 'Load More Amount',
  isRelevant: (sp) => enableLoadMore.isRelevant(sp) && sp[optionsMap.behaviourParams.gallery.vertical.loadMore.enable],
  isRelevantDescription:
    'Set a Vertical gallery ("Scroll Direction" as "Vertical") and set "Enable load more button" to "true".',
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS[optionsMap.behaviourParams.gallery.vertical.loadMore.amount].ALL, //one source
  get options() {
    return createOptions(optionsMap.behaviourParams.gallery.vertical.loadMore.amount);
  },
  description: `Choose whether clicking the 'load more' button toggle an infinite scroll behaviour or adds a few more items and keep the button at the bottom.`,
};
