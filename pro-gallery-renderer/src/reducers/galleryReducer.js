import {
  SET_WIX_DATA,
  SET_ITEMS,
  SET_RENDERED_ITEMS_COUNT,
  VIDEO_ENDED,
  VIDEO_ADDED,
  GALLERY_WINDOW_LAYOUT_CHANGED,
  VIDEO_PLAY_MODE,
  NAVIGATION_IN,
  EDITOR_MODE_CHANGED,
  TOGGLE_HOVER_PREVIEW,
  SET_VIDEO_PLAY_INDEX
} from '../constants/galleryTypes.js';

import videoActions from '../constants/videoActionTypes';

import {PLAY_VIDEO, PAUSE_VIDEO} from '../actions/itemViewActions.js';
import initialState from './initialState.js';

import _ from 'lodash';
import {utils} from '../utils/utils';

export default function galleryReducer(state = initialState.gallery, action) {
  switch (action.type) {
    case SET_WIX_DATA:
      if (action.boundingRectAndOffsets) {
        const res = action.boundingRectAndOffsets;
        const scrollBase = res.offsets.y;
        const scrollTop = ((-1) * res.rect.top) / utils.getViewportScaleRatio();
        let maxGalleryWidth;
        if (res && res.rect && !_.isUndefined(res.rect.width)) {
          maxGalleryWidth = res.rect.width;
        }

        return _.merge({}, state, {
          wixInit: true,
          scrollBase,
          scrollTop,
          maxGalleryWidth,
        });

      } else {
        return _.merge({}, state, {
          wixInit: true,
          scrollBase: 0,
        });
      }

    case videoActions.videoModeChanged: {
      const newVideoPlayMode = action.payload;
      const {videoPlayMode} = state;
      if (videoPlayMode !== newVideoPlayMode) {
        state = {...state, videoPlayMode: newVideoPlayMode};
      }

      break;
    }
    case SET_ITEMS:
      return _.merge({}, state, {items: action.items});
    case SET_RENDERED_ITEMS_COUNT:
      return _.merge({}, state, {renderedItemsCount: action.count});
    case GALLERY_WINDOW_LAYOUT_CHANGED: {
      const documentHeight = {documentHeight: action.documentHeight};
      return _.merge({}, state, documentHeight);
    }
    case SET_VIDEO_PLAY_INDEX:
      state = {...state, videoIndexPlay: action.payload};
      break;
    case PLAY_VIDEO:
      return _.merge({}, state, {videoIndexPlay: action.idx});
    case PAUSE_VIDEO:
      return _.merge({}, state, {videoIndexPlay: -1});
    case TOGGLE_HOVER_PREVIEW:
      return _.merge({}, state, {previewHover: action.toggle});
    default:
      return state;
  }

  return state;
}
