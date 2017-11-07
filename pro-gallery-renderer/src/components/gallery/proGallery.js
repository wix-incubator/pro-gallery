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
import {Wix, logger, watermarkApi} from 'photography-client-lib';
import videoActionTypes from '../../constants/videoActionTypes';
import videoPlayModes from '../item/videos/videoPlayModes';
import videoMiddleware from '../item/videos/videoMiddleware';
import {VideoQueue} from '../item/videos/video-queue';
import _ from 'lodash';

class ProGallery extends React.Component {

  constructor(props) {
    super();
    this.init(props);
  }

  init(props) {

    this.items = props.items || require('../../../test/images-mock').testImages;

    const middlewares = [thunkMiddleware, videoMiddleware({videoQueue: new VideoQueue(), utils})];
    this.store = createStore(galleryReducers, /* { gallery: { videoPlayMode: videoPlayModes.hover } } */ {}, applyMiddleware(...middlewares));
    this.initStoreEvents(this.store);
    this.readyPromise = this.initWatermark();

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

  initWatermark() {
    let returnPromise = Promise.resolve(null);
    if (utils.isStoreGallery()) {
      returnPromise = watermarkApi.getWatermarkData().then(watermarkData => {
        this.watermarkData = watermarkData;
      });
    }
    return returnPromise;
  }

  render() {
    return (
      <div className="pro-gallery">
        <Provider store={this.store}>
          <GalleryContainer
            {...this.props}
            items={this.items}
            store={this.store}
            watermarkData={this.watermarkData}
          />
        </Provider>
      </div>
    );
  }
}

export default ProGallery;
