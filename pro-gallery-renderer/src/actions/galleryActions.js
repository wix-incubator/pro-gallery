import {
  GALLERY_WINDOW_LAYOUT_CHANGED,
  VIDEO_ENDED,
  VIDEO_ADDED,
  VIDEO_REMOVED,
  TOGGLE_ISINVIEW,
} from '../constants/galleryTypes.js';

export function videoEnded() {
  return {
    type: VIDEO_ENDED,
  };
}

export function videoAdded(videoData) {
  return {
    payload: videoData,
    type: VIDEO_ADDED,
  };
}

export function videoRemoved(index) {
  return {
    type: VIDEO_REMOVED,
    payload: index,
  };
}

export function galleryWindowLayoutChanged({ documentHeight }) {
  return {
    documentHeight,
    type: GALLERY_WINDOW_LAYOUT_CHANGED,
  };
}

export function toggleIsInView(toggle) {
  return {
    type: TOGGLE_ISINVIEW,
    toggle,
  };
}
