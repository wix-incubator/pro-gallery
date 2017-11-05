export const ITEM_VIEW_ACTION = 'ITEM_VIEW_ACTION';
export const PLAY_VIDEO = 'PLAY_VIDEO';
export const PAUSE_VIDEO = 'PAUSE_VIDEO';

export function itemViewAction() {
  return {
    type: ITEM_VIEW_ACTION
  };
}

export function playVideo(idx) {
  return {
    idx,
    type: PLAY_VIDEO
  };
}

export function pauseVideo() {
  return {
    type: PAUSE_VIDEO
  };
}
