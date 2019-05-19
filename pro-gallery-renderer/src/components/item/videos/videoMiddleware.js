import * as types from '../../../constants/galleryTypes';
import { PLAY_VIDEO, PAUSE_VIDEO } from '../../../actions/itemViewActions.js';
import videoPlayModes from './videoPlayModes';

export default ({ videoQueue, utils }) => store => {
  const playVideo = i => {
    store.dispatch({ type: types.SET_VIDEO_PLAY_INDEX, payload: i });
  };

  const playCurrentVideo = () => {
    playVideo(videoQueue.current());
  };

  const playNextVideo = () => {
    playVideo(videoQueue.next());
  };

  const stopPlaying = () => {
    playVideo(-1);
  };

  return next => action => {
    const { type, payload } = action;
    const {
      gallery: { videoPlayMode },
    } = store.getState();
    // This doesn't affect autoplay
    switch (type) {
      case types.VIDEO_ADDED:
        videoQueue.addItem(payload);
        break;
      case types.VIDEO_REMOVED:
        videoQueue.removeItem(payload);
        break;
    }

    next(action);

    // Auto-play handling
    const isAutoPlay =
      videoPlayMode === videoPlayModes.autoPlay ||
      videoPlayMode === videoPlayModes.refactoredAutoPlay;
    let indexToPlay = null;
    if (utils.isEditor() && payload !== -1) {
      stopPlaying();
    } else if (isAutoPlay) {
      switch (type) {
        case types.NAVIGATION_IN:
        case types.VIDEO_ENDED:
          playNextVideo();
          break;
        case types.EDITOR_MODE_CHANGED:
        case types.GALLERY_WINDOW_LAYOUT_CHANGED:
          indexToPlay = videoQueue.isCurrentVideoVisible()
            ? playCurrentVideo()
            : playNextVideo();
          break;
        case types.VIDEO_ADDED:
          playCurrentVideo();
          break;
        case types.VIDEO_MODE_CHANGED:
          if (utils.isPreview()) {
            videoQueue.isCurrentVideoVisible()
              ? playCurrentVideo()
              : playNextVideo();
          }
          break;
        default:
          break;
      }
    }
  };
};
