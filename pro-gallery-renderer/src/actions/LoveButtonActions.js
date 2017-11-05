import * as actions from '../constants/actionTypes.js';
import {itemActions} from 'photography-client-lib';

export function toggleLove(itemId) {

  itemActions.toggleLove(itemId, 'fullscreen');
  const isLoved = itemActions.isLoved(itemId);

  return {
    isLoved,
    type: actions.TOGGLE_LOVE
  };
}
