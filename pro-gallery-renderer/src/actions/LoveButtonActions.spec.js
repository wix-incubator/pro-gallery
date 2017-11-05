
import * as loveActions from './LoveButtonActions.js';
import * as actions from '../constants/actionTypes.js';
import {itemActions} from 'photography-client-lib';

describe('actions', () => {
  it('should love', () => {
    const expectedAction = {
      isLoved: true,
      type: actions.TOGGLE_LOVE
    };
    itemActions.toggleLove(123, 'origin', false);
    expect(loveActions.toggleLove(123)).toEqual(expectedAction);
    expect(itemActions.isLoved(123)).toEqual(true);
  });

  it('should unlove', () => {
    const expectedAction = {
      isLoved: false,
      type: actions.TOGGLE_LOVE
    };
    itemActions.toggleLove(123, 'origin', true);
    expect(loveActions.toggleLove(123)).toEqual(expectedAction);
    expect(itemActions.isLoved(123)).toEqual(false);
  });

});
