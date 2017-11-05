import {SET_SLIDE} from '../actions/fullscreenActions.js';
import initialState from './initialState.js';

import _ from 'lodash';



export default function fullscreenReducer(state = initialState.fullscreen, action) {

  switch (action.type) {
    case SET_SLIDE:
      return _.merge({}, state, {
        slideIdx: action.slideIdx
      });

    default:
      return state;
  }
}
