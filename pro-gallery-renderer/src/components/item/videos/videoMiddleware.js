import * as types from '../../constants/galleryTypes';
import videoPlayModes from '../videoPlayModes';
export default ({ videoQueue, utils }) => store => next => action => {
  const {
    type,
    payload
  } = action;
  const { gallery: { videoPlayMode } } = store.getState();

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
  const isAutoPlay = videoPlayMode === videoPlayModes.autoPlay;
  let indexToPlay = null;
  if (isAutoPlay) {
    switch (type) {
      case types.NAVIGATION_IN:
        indexToPlay = utils.isEditor() ? -1 : videoQueue.next();
        break;
      case types.VIDEO_ENDED:
        indexToPlay = videoQueue.next();
        break;
      case types.EDITOR_MODE_CHANGED:
      case types.GALLERY_WINDOW_LAYOUT_CHANGED:
        const nextIdx = utils.isEditor() ? -1 :
          videoQueue.isCurrentVideoVisible() ? videoQueue.current() : videoQueue.next();
        indexToPlay = nextIdx
        break;
      case types.VIDEO_ADDED:
        indexToPlay = videoQueue.current();
        break;
      default:
        break;
    }
  }

  if (indexToPlay !== null) {
    store.dispatch({ type: types.SET_VIDEO_PLAY_INDEX, payload: indexToPlay });
  }
}
