'use strict';

import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import galleryReducers from '../../reducers/index.js';
import GalleryContainer from './galleryContainer.js';
import utils from '../../utils';
import {Wix, logger} from 'photography-client-lib';
import videoActionTypes from '../../constants/videoActionTypes';
import videoPlayModes from '../item/videos/videoPlayModes';
import videoMiddleware from '../item/videos/videoMiddleware';
import {VideoQueue} from '../item/videos/video-queue';
import _ from 'lodash';

export default class ProGallery extends React.Component {

  constructor(props) {
    super();
    this.init(props);
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
            additionalHeight={this.props.additionalHeight}
          />
        </Provider>
      </div>
    );
  }
}
