import {
  SET_ITEMS,
  SET_RENDERED_ITEMS_COUNT,
  GALLERY_WINDOW_LAYOUT_CHANGED,
  TOGGLE_ISINVIEW,
  SET_VIDEO_PLAY_INDEX,
} from '../constants/galleryTypes.js';

import videoActions from '../constants/videoActionTypes';

import { PLAY_VIDEO, PAUSE_VIDEO } from '../actions/itemViewActions.js';
import initialState from './initialState.js';

import _ from 'lodash';

export default function galleryReducer(state = initialState.gallery, action) {
  switch (action.type) {
    case videoActions.videoModeChanged: {
      const newVideoPlayMode = action.payload;
      const { videoPlayMode } = state;
      if (videoPlayMode !== newVideoPlayMode) {
        state = { ...state, videoPlayMode: newVideoPlayMode };
      }

      break;
    }
    case SET_ITEMS:
      return _.merge({}, state, { items: action.items });
    case SET_RENDERED_ITEMS_COUNT:
      return _.merge({}, state, { renderedItemsCount: action.count });
    case GALLERY_WINDOW_LAYOUT_CHANGED: {
      const documentHeight = { documentHeight: action.documentHeight };
      return _.merge({}, state, documentHeight);
    }
    case SET_VIDEO_PLAY_INDEX:
      if (state.isInView) {
        state = {
          ...state,
          videoIndexPlay: action.payload,
          lastVideoPlayed: action.payload,
        };
      }
      break;
    case PLAY_VIDEO:
      if (state.isInView) {
        return _.merge({}, state, {
          videoIndexPlay: action.idx,
          lastVideoPlayed: action.idx,
        });
      }
      break;
    case PAUSE_VIDEO:
      return _.merge({}, state, { videoIndexPlay: -1 });
    case TOGGLE_ISINVIEW:
      return _.merge({}, state, { isInView: action.toggle });
    default:
      return state;
  }

  return state;
}
