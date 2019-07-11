import { combineReducers } from 'redux';
import GalleryReducer from './galleryReducer.js';
import FullscreenReducer from './fullscreenReducer.js';

export default combineReducers({
  gallery: GalleryReducer,
  fullscreen: FullscreenReducer,
});
