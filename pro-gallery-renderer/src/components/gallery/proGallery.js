import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import galleryReducers from '../../reducers/index.js';
import GalleryContainerNew from './galleryContainerNew.js';
import utils from '../../utils';
import videoMiddleware from '../item/videos/videoMiddleware';
import { VideoQueue } from '../item/videos/video-queue';
import window from '../../utils/window/windowWrapper';
import { GalleryComponent } from '../galleryComponent';

export default class ProGallery extends GalleryComponent {
  constructor(props) {
    super();
    if (utils.isVerbose()) {
      console.count('[OOISSR] proGallery constructor', window.isMock);
    }
    const isSSR = !!window.isMock;
    this.canRender = !isSSR || props.allowSSR === true; //do not render if it is SSR
    if (this.canRender) {
      this.init(props);
    }
  }

  init(props) {
    this.domId = props.domId || Math.floor(Math.random() * 10000);
    if (utils.isVerbose()) {
      console.log('[OOISSR] proGallery init', window.isMock);
    }
    const middlewares = [
      thunkMiddleware,
      videoMiddleware({ videoQueue: new VideoQueue(), utils }),
    ];
    this.store = createStore(
      galleryReducers,
      /* { gallery: { videoPlayMode: videoPlayModes.hover } } */ {},
      applyMiddleware(...middlewares),
    );
  }

  render() {
    return (
      this.canRender && (
        <div id={`pro-gallery-${this.domId}`} className="pro-gallery">
          <Provider store={this.store}>
            <GalleryContainerNew
              {...this.props}
              domId={this.domId}
              items={this.props.items || []}
              store={this.store}
              watermarkData={this.props.watermarkData}
              settings={this.props.settings || {}}
              offsetTop={this.props.offsetTop}
              itemsLoveData={
                this.props.itemsLoveData ? this.props.itemsLoveData : {}
              }
            />
          </Provider>
        </div>
      )
    );
  }
}
