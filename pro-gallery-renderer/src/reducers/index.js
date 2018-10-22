import {combineReducers} from 'redux';
import LoveButtonReducer from './loveButtonReducer.js';
import GalleryReducer from './galleryReducer.js';
import FullscreenReducer from './fullscreenReducer.js';

export default combineReducers({
  loveButton: LoveButtonReducer,
  gallery: GalleryReducer,
  fullscreen: FullscreenReducer,
});
