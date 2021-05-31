import { INPUT_TYPES } from '../utils/constants';
import { default as GALLERY_CONSTS } from '../../common/constants';
import { createOptions } from '../utils/utils';

export default {
  title: 'Load More Behaviour',
  isRelevant: (sp) =>
    sp.scrollDirection === GALLERY_CONSTS.scrollDirection.VERTICAL &&
    !sp.enableInfiniteScroll,
  isRelevantDescription:
    'Set a Vertical gallery ("Scroll Direction" as "Vertical") and set "Enable load more button" to "true".',
  type: INPUT_TYPES.OPTIONS,
  default: GALLERY_CONSTS.loadMoreAmount.ALL,
  options: createOptions('loadMoreAmount'),
  description: `Choose whether clicking the 'load more' button toggle an infinite scroll behaviour or adds a few more items and keep the button at the bottom.`,
};
