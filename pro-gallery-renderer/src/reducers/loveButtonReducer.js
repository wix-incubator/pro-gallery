import { TOGGLE_LOVE } from '../constants/actionTypes.js';
import _ from 'lodash';

const initialState = {
  isLoved: false,
  count: 0,
};

export default function loveButtonReducer(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_LOVE: {
      const newCount = action.isLoved ? state.count + 1 : state.count - 1;
      return _.merge({}, state, { isLoved: action.isLoved, count: newCount });
    }
    default:
      return state;
  }
}
