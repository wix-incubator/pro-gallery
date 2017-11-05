import {combineReducers} from 'redux';
import LoveButtonReducer from './loveButtonReducer.js';
import GalleryReducer from './galleryReducer.js';
import FullscreenReducer from './fullscreenReducer.js';
import MultishareReducer from './multishareReducer.js';

export default combineReducers({
  loveButton: LoveButtonReducer,
  gallery: GalleryReducer,
  fullscreen: FullscreenReducer,
  multishare: MultishareReducer
});
