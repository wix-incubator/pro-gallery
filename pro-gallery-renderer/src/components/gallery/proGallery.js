'use strict';

import React from 'react';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import galleryReducers from '../../reducers/index.js';
import {toggleHoverPreview} from '../../actions/galleryActions.js';
import GalleryContainer from './galleryContainer.js';
import utils from '../../utils';
import {Wix} from 'photography-client-lib';
import videoActionTypes from '../../constants/videoActionTypes';
import videoMiddleware from '../item/videos/videoMiddleware';
import {VideoQueue} from '../item/videos/video-queue';

export default class ProGallery extends React.Component {

  constructor(props) {
    super();
    this.init(props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.forceHover !== this.props.forceHover) {
      this.store.dispatch(toggleHoverPreview(nextProps.forceHover));
    }
  }

  init(props) {

    const middlewares = [thunkMiddleware, videoMiddleware({videoQueue: new VideoQueue(), utils})];
    this.store = createStore(galleryReducers, /* { gallery: { videoPlayMode: videoPlayModes.hover } } */ {}, applyMiddleware(...middlewares));
    this.initStoreEvents(this.store);

  }

  initStoreEvents(store) {
    if (Wix && Wix.addEventListener) {
      Wix.addEventListener(Wix.Events.STYLE_PARAMS_CHANGE, styleParams => {
        store.dispatch({
          type: videoActionTypes.videoModeChanged,
          payload: styleParams.numbers.videoPlay
        });
      });
    }
  }

  render() {
    return (
      <div className="pro-gallery">
        <Provider store={this.store}>
          <GalleryContainer
            {...this.props}
            items={this.props.items || require('../../../test/images-mock').testImages}
            store={this.store}
            watermarkData={this.props.watermarkData}
            offsetTop={this.props.offsetTop}
          />
        </Provider>
      </div>
    );
  }
}
