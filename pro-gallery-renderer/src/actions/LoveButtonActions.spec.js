
import * as loveActions from './LoveButtonActions.js';
import * as actions from '../constants/actionTypes.js';
import {itemActions} from 'photography-client-lib/dist/src/item/itemActions';
import {expect} from 'chai';

describe('actions', () => {
  it('should love', () => {
    const expectedAction = {
      isLoved: true,
      type: actions.TOGGLE_LOVE
    };
    itemActions.toggleLove(123, 'origin', false);
    expect(loveActions.toggleLove(123)).to.deep.equal(expectedAction);
    expect(itemActions.isLoved(123)).to.equal(true);
  });

  it('should unlove', () => {
    const expectedAction = {
      isLoved: false,
      type: actions.TOGGLE_LOVE
    };
    itemActions.toggleLove(123, 'origin', true);
    expect(loveActions.toggleLove(123)).to.deep.equal(expectedAction);
    expect(itemActions.isLoved(123)).to.equal(false);
  });

});
