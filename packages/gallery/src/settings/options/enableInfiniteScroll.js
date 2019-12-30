import { INPUT_TYPES } from '../utils/constants';
import { isInPreset } from '../../components/helpers/layoutHelper';
import SCROLL_DIRECTION from '../../common/constants/scrollDirection';

export default {
  title: 'Use Infinite Scroll',
  description: `Choose Whether you want to have infinite scroll option or not. When this option is set to false the gallery will have
  a "Load More". Note that the consumer will have to add the new items when the gallery requests more ("NEED_MORE_ITEMS" event will be emited).`,
  isRelevant: (styleParams) => !isInPreset(styleParams,'enableInfiniteScroll') && styleParams.scrollDirection === SCROLL_DIRECTION.VERTICAL,
  type: INPUT_TYPES.BOOLEAN,
  default: true,
}