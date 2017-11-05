import LoveButtonReducer from './loveButtonReducer.js';
import {TOGGLE_LOVE} from '../constants/actionTypes.js';
import {expect} from 'chai';
import _ from 'lodash';

describe('love reducer', () => {
  it('should return the initial state', () => {
    expect(LoveButtonReducer(undefined, {})).deep.equal(
      {
        isLoved: false,
        count: 0
      }
        );
  });

  it('should handle TOGGLE_LOVE - love', () => {
    expect(
            LoveButtonReducer({
              isLoved: false,
              count: 4
            }, {
              type: TOGGLE_LOVE,
              isLoved: true
            })
        ).deep.equal(
      {
        isLoved: true,
        count: 5

      }
        );
  });

  it('should handle TOGGLE_LOVE - unlove', () => {
    expect(
            LoveButtonReducer({
              isLoved: true,
              count: 4
            }, {
              type: TOGGLE_LOVE,
              isLoved: false
            })
        ).deep.equal(
      {
        isLoved: false,
        count: 3

      }
        );
  });
});
