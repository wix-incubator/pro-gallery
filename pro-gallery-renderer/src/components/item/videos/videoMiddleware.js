import * as actions from '../../../constants/galleryTypes';
import videoPlayModes from './videoPlayModes';
export default ({videoQueue, utils}) => store => next => action => {
  const {
    type,
    payload
  } = action;
  const {gallery: {videoPlayMode}} = store.getState();

  // This doesn't affect autoplay
  switch (type) {
    case actions.VIDEO_ADDED:
      videoQueue.addItem(payload);
      break;
    case actions.VIDEO_REMOVED:
      videoQueue.removeItem(payload);
      break;
  }

  next(action);

  // Auto-play handling
  const isAutoPlay = videoPlayMode === videoPlayModes.autoPlay;
  let indexToPlay = null;
  if (isAutoPlay) {
    switch (type) {
      case actions.NAVIGATION_IN:
        indexToPlay = utils.isEditor() ? -1 : videoQueue.next();
        break;
      case actions.VIDEO_ENDED:
        indexToPlay = videoQueue.next();
        break;
      case actions.EDITOR_MODE_CHANGED:
      case actions.GALLERY_WINDOW_LAYOUT_CHANGED: {
        const nextIdx = utils.isEditor() ? -1 :
          videoQueue.isCurrentVideoVisible() ? videoQueue.current() : videoQueue.next();
        indexToPlay = nextIdx;
        break;
      }
      case actions.VIDEO_ADDED:
        indexToPlay = videoQueue.current();
        break;
      default:
        break;
    }
  }

  if (indexToPlay !== null) {
    store.dispatch({type: actions.SET_VIDEO_PLAY_INDEX, payload: indexToPlay});
  }
};
