import utils from '../utils/index';
import Wix from '@wix/photography-client-lib/dist/src/sdk/WixSdkWrapper';

import {
  SET_WIX_DATA,
  SET_ITEMS,
  SET_RENDERED_ITEMS_COUNT,
  VIDEO_PLAY_MODE,
  GALLERY_WINDOW_LAYOUT_CHANGED,
  VIDEO_ENDED,
  VIDEO_ADDED,
  VIDEO_REMOVED,
  NAVIGATION_IN,
  EDITOR_MODE_CHANGED,
  TOGGLE_HOVER_PREVIEW,
  TOGGLE_ISINVIEW,
} from '../constants/galleryTypes.js';

export function initWixData() {
  if (utils.isInWix() && !utils.isDemo()) {
    return function (dispatch) {
      Wix.getBoundingRectAndOffsets(res => {
        dispatch({
          type: SET_WIX_DATA,
          boundingRectAndOffsets: res
        });
      });
    };
  } else {
    return {
      type: SET_WIX_DATA
    };
  }
}


// export function setItems(items) {
//     return {
//         items: items,
//         type: SET_ITEMS
//     }
// }
//
//
// export function setRenderedItemsCount(count) {
//     return {
//         count: count,
//         type: SET_RENDERED_ITEMS_COUNT
//     }
// }

export function navigationIn() {
  return {
    type: NAVIGATION_IN
  };
}

export function videoPlayModeChanged(videoPlayMode) {
  return {
    videoPlayMode,
    type: VIDEO_PLAY_MODE
  };
}

export function videoEnded(idx) {
  return {
    type: VIDEO_ENDED
  };
}

export function videoAdded(videoData) {
  return {
    payload: videoData,
    type: VIDEO_ADDED
  };
}

export function videoRemoved(index) {
  return {
    type: VIDEO_REMOVED,
    payload: index
  };
}

export function galleryWindowLayoutChanged({documentHeight}) {
  return {
    documentHeight,
    type: GALLERY_WINDOW_LAYOUT_CHANGED
  };
}

export function editorModeChanged() {
  return {
    type: EDITOR_MODE_CHANGED
  };
}

export function toggleHoverPreview(toggle) {
  return {
    type: TOGGLE_HOVER_PREVIEW,
    toggle
  };
}

export function toggleIsInView(toggle) {
  return {
    type: TOGGLE_ISINVIEW,
    toggle
  };
}
