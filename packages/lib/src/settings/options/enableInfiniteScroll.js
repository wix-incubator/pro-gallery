import { INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Enable load more button',
  description: `Choose Whether you want to load more items on a click of the "Load More" button or load more items automatically on scroll (infinite scroll behaviour).
  Note that the consumer will have to add the new items when the gallery requests more ("NEED_MORE_ITEMS" event will be emitted).`,
  isRelevant: (styleParams) => !styleParams.oneRow,
  isRelevantDescription: 'set a vertical scrolled gallery.',
  type: INPUT_TYPES.BOOLEAN,
  default: true,
};
