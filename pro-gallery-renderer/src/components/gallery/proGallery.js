'use strict';

import React from 'react';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import galleryReducers from '../../reducers/index.js';
import {toggleHoverPreview} from '../../actions/galleryActions.js';
import GalleryContainer from './galleryContainer.js';
import GalleryContainerNew from './galleryContainerNew.js';
import utils from '../../utils';
import Wix from 'photography-client-lib/dist/src/sdk/WixSdkWrapper';
import videoActionTypes from '../../constants/videoActionTypes';
import videoMiddleware from '../item/videos/videoMiddleware';
import {VideoQueue} from '../item/videos/video-queue';

export default class ProGallery extends React.Component {

  constructor(props) {
    super();
    const isSSR = !(typeof window !== 'undefined' && typeof document !== 'undefined');
    this.canRender = !isSSR || props.allowSSR === true; //do not render if it is SSR
    if (this.canRender) {
      this.init(props);
    }
  }

  componentDidMount() {
    if (this.store && this.store.dispatch && this.props.forceHover === true) {
      this.store.dispatch(toggleHoverPreview(this.props.forceHover));
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.store && this.store.dispatch && (nextProps.forceHover !== this.props.forceHover)) {
      this.store.dispatch(toggleHoverPreview(nextProps.forceHover));
    }
  }

  init(props) {
    this.domId = Math.floor(Math.random() * 1000000);
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
    const ProGalleryComponent = this.props.useRefactoredProGallery === true ? GalleryContainerNew : GalleryContainer;
    return this.canRender && (
      <div id={`pro-gallery-${this.domId}`} className="pro-gallery">
        <Provider store={this.store}>
          <ProGalleryComponent
            {...this.props}
            domId={this.domId}
            items={this.props.items || require('../../constants/default-images.js').defaultImages}
            store={this.store}
            watermarkData={this.props.watermarkData}
            settings={this.props.settings || {}}
            offsetTop={this.props.offsetTop}
          />
        </Provider>
      </div>
    );
  }
}
