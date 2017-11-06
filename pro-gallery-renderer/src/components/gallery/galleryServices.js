'use strict';

import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import galleryReducers from '../../reducers/index.js';
import {toggleHoverPreview} from '../../actions/galleryActions.js';
import GalleryContainer from './galleryContainer.js';
import GalleryItem from '../item/galleryItem.js';
import {utils} from '../../utils';
import {Wix, logger, watermarkApi} from 'photography-client-lib';
import '../../utils/rcp';
import {timingMeasure} from '../../utils/performanceUtils';
import videoMiddleware from '../galleryStore/videoMiddleware';
import videoActionTypes from '../../constants/videoActionTypes';
import videoPlayModes from '../videoPlayModes';
import {VideoQueue} from '../../_domain/video-queue';
import {testImages} from 'images-mock';
import _ from 'lodash';

logger.initBiLoadedEventListener('gallery');

class ProGalleryServices {

  constructor() {
    if (!utils.isInWix()) {
      window.photos = testImages;
      this.init();
    } else {
      this.init();
    }
  }
  init() {
    timingMeasure('ProGallery start', 'navigationStart');

    this.gallerySrcTypes = { //gallery source types
      sampleImages: 'sampleImages',
      itemsFromWixCode: 'itemsFromWixCode',
      prerenderedGallery: 'prerenderedGallery',
      albumSetFromBuilder: 'albumSetFromBuilder',
      manuallySetImages: 'manuallySetImages'
    };

    const middlewares = [thunkMiddleware, videoMiddleware({videoQueue: new VideoQueue(), utils})];

    const shouldLogRedux = false;
    if (utils.isDev() && shouldLogRedux) {
      const loggerMiddleware = createLogger({diff: true});
      middlewares.push(loggerMiddleware);
    }

    window.store = this.store = createStore(galleryReducers, /* { gallery: { videoPlayMode: videoPlayModes.hover } } */ {}, applyMiddleware(...middlewares));

    this.initStoreEvents(this.store);

    if (utils.isDev()) {
      console.log('initial store state', this.store.getState());
    }

    const unsubscribe = this.store.subscribe(() => {
      if (utils.isDev()) {
        console.log('store update', this.store.getState());
      }
    });
    this.readyPromise = this.initWatermark();

    $(document).ready(() => {
      this.content = document.getElementById('content');

      //this.galleryScrollEvent = document.createEvent('CustomEvent');  // MUST be 'CustomEvent'
      //this.galleryScrollEvent.initCustomEvent('images_changed', false, false, null);
      this.populateGalleryData();

      this.renderGallery();
    });
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

  updateServerMappingIfNeeded(setId, isDuringPublish, callback) {
    if (!isDuringPublish) {
      callback();
      return;
    }
    if (setId === 'fake_set') {
      callback();
      return;
    }

    // if (window.petri['specs.NewProvisionFlow'] === 'true') {
    //   return;
    // }

    if ((this.mappingUpdatedInstanceId !== Wix.Utils.getInstanceId()) &&
      (utils.getViewModeFromCache() === 'editor' || utils.getViewModeFromCache() === 'preview') &&
      Wix.Utils.getDemoMode() === false) {

      this.mappingUpdatedInstanceId = Wix.Utils.getInstanceId();
      //URL - http://progallery.wix.com/api/v1/albums/map-set-id
      //Body (json) {"instanceId" : "8e3502cb-25ee-4d7f-b8c3-96034fe36911", "compId" : "compId2", "setId": "75cda6bb-c060-4381-930a-beb9a22c027a"}
      const mappingData = {instanceId: Wix.Utils.getInstanceId(), compId: Wix.Utils.getCompId(), setId};
      $.ajax({
        type: 'POST',
        url: '/api/v1/albums/map-set-id',
        data: JSON.stringify(mappingData),
        success: res => {
          console.log('Success in mapping gallery to set', mappingData);
          callback();
        },
        error: err => {
          console.error('Failed to map gallery to set', err);
          callback();
        },
        contentType: 'application/json'
      });
    }
  }

  getImagesFromBuilder() {
    if (utils.isDev()) {
      console.log('Gallery Services - getImagesFromBuilder');
    }

    if (window.document.domain !== 'wix.com') {
      try {
        //noinspection JSAnnotator
        window.document.domain = 'wix.com';
      } catch (e) {
        console.warn('Failed to set wix.com domain');
      }
    }

    //replace the current set of images on the window
    try {
      const activeAlbum = window.parent.parent.activeAlbum;
      const isDuringPublish = _.get(activeAlbum, 'serverStatus.duringUpdate');
      const albumSet = activeAlbum.getSetByGalleryId(Wix.Utils.getCompId()); //getSetByGalleryId is in albums code
      if (albumSet.id) {
        this.updateServerMappingIfNeeded(albumSet.id, isDuringPublish, () => {

          try {
            albumSet.mapSetIdCallback();
          } catch (e) {
            console.log('couldn\'t call mapSetIdCallback', e);
          }

        });
        return albumSet.getSetJson(); ////getSetJson is in albums code
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }

  populateGalleryData() {
    try {
      //replace the current set of images on the window

      let galleryData;
      let galleryDataSrcName;

      const albumSetFromBuilder = this.getImagesFromBuilder();
      if (window.manuallySetImages) {
        galleryData = window.manuallySetImages;
        this.galleryDataSrc = this.gallerySrcTypes.manuallySetImages;
        galleryDataSrcName = 'manuallySetImages';
      } else if (window.itemsFromWixCode) {
        galleryData = {photos: window.itemsFromWixCode};
        this.galleryDataSrc = this.gallerySrcTypes.albumSetFromBuilder;
        galleryDataSrcName = 'itemsFromWixCode';
      } else if (albumSetFromBuilder) {
        galleryData = albumSetFromBuilder;
        this.galleryDataSrc = this.gallerySrcTypes.albumSetFromBuilder;
        galleryDataSrcName = 'albumSetFromBuilder';
      } else if (window.prerenderedGallery) {
        galleryData = {photos: window.prerenderedGallery.items};
        this.galleryDataSrc = this.gallerySrcTypes.prerenderedGallery;
        galleryDataSrcName = 'prerenderedGallery';
      } else {
        //no prerender gallery
        if (utils.isSite() && !utils.isDev()) {
          console.error('prerendered gallery is missing');
          logger.trackBi(logger.biEvents.pro_gallery_error, {errorType: 'prerenderedGalleryMissing'});
        }
        galleryData = (utils.isDev() ? window.sampleImages : window.emptyImages);
        if (galleryData) {
          galleryData.renderedItemsCount = 50;
        }
        this.galleryDataSrc = this.gallerySrcTypes.sampleImages;
        galleryDataSrcName = 'sampleImages/emptyImages';
      }

      if (utils.isDev()) {
        console.log('Populating gallery data from: ' + galleryDataSrcName);
      }

      const _galleryData = window.galleryData = galleryData;
      const _itemsCount = (this.galleryDataSrc === this.gallerySrcTypes.prerenderedGallery) ? window.prerenderedGallery.totalItemsCount : (galleryData && galleryData.photos && galleryData.photos.length);

      if (!this.galleryData) {
        this.galleryData = _galleryData;
        this.itemsCount = _itemsCount;
      }

    } catch (e) {
      console.error('Could not populate gallery data', e);
    }
  }

  itemsToDto(items) {
    return _.map(items, item => {
      item.createdBy = 'itemsToDto';
      return (new GalleryItem({dto: item, watermark: this.watermarkData})).dto;
    });
  }

  getItemsDto() {
    let items = this.galleryData && this.galleryData.photos;
    items = items || [];
    return this.itemsToDto(items);
  }

  getAllItemsDto(callback) {
    this.getAllItemsFromServer(callback);
    return this.itemsToDto(this.galleryData && this.galleryData.photos);
  }

  getAllItemsFromServer(callback) {
    const fetchedItems = this.galleryData && this.galleryData.photos;

    if (_.isUndefined(this.itemsCountToFetch) || this.itemsCountToFetch === false) {
      this.itemsCountToFetch = this.itemsCountToFetch || this.itemsCount;
    }

    const fetchCount = Math.min(1000, this.itemsCountToFetch - fetchedItems.length);
    if (fetchCount <= 0) { //end
      this.itemsCountToFetch = false;
      callback(this.itemsToDto(this.galleryData.photos));
    } else {
      this.getItemsFromServer(fetchedItems.length, fetchedItems.length + fetchCount).done(res => {
        this.addImages(res.items);
        this.getAllItemsFromServer(callback);
      }).fail(err => {
        console.error('failed to get items from server', (err && err.message));
      });
    }
  }

  getItemsFromServer(from, to) {
    let storeParameter = '';
    if (utils.isStoreGallery()) {
      storeParameter = `&isStore=true`;
    }
    return $.ajax({
      url: `${window.infiniteScrollUrl}from/${from}/to/${to}?instance=${window.instance}${storeParameter}`,
      xhrFields: {
        withCredentials: true
      }
    });
  }

  isDisplayingDefaultImages() {
    try {
      const manuallySetImages = window.manuallySetImages;
      const albumSetFromBuilder = this.getImagesFromBuilder();
      const galleryFromVm = window.prerenderedGallery ? {photos: window.prerenderedGallery.items} : false;

      return !(manuallySetImages || galleryFromVm || albumSetFromBuilder);
    } catch (e) {
      console.error('Error checking if displaying default images', e);
      return false;
    }
  }

  setImages(images) {
    if (utils.isDev()) {
      console.log('Gallery Services - setImages', images);
    }

    //update selected images in the current set of images on the window
    if (typeof images !== 'object') {
      console.error('Trying to use addImages with illegal images', images);
    }
    if (!(images.length > 0)) {
      images = [images];
    }
    if (!this.galleryData) {
      this.populateGalleryData();
    }

    try {
      this.galleryData.photos = window.manuallySetImages = images;
      this.itemsCount = this.galleryData.photos.length;
      this.galleryDataSrc = this.gallerySrcTypes.manuallySetImages;
      window.infiniteScrollUrl = ''; //diasble infinite scroll when setting images manually
    } catch (e) {
      console.error('Cannot set new images', e, images, window);
    }

    // if (this.galleryView) {
    //   this.galleryView.renderTrigger = this.galleryView.renderTriggers.ITEMS; //this is a patch, we need to find a better way to control setState without predefined data
    //   this.galleryView.setState({items: this.galleryData.photos});
    // }
    this.renderGallery();
  }

  setAllImagesRemoved() {
    if (utils.isDev()) {
      console.log('Gallery Services - setAllImagesRemoved');
    }

    try {
      this.galleryData.photos = window.manuallySetImages = [];
      this.itemsCount = 0;
      this.galleryDataSrc = this.gallerySrcTypes.manuallySetImages;
    } catch (e) {
      console.error('Cannot set new images', e, window);
    }
    // if (this.galleryView) {
    //   this.galleryView.renderTrigger = this.galleryView.renderTriggers.ITEMS; //this is a patch, we need to find a better way to control setState without predefined data
    //   this.galleryView.totalItemsCount = this.itemsCount;
    //   this.galleryView.setState({items: this.galleryData.photos});
    // }
    this.renderGallery();
  }

  addImages(images, shouldAddToStart) {
    //update selected images in the current set of images on the window

    if (utils.isDev()) {
      console.log('Gallery Services - addImages', images, shouldAddToStart);
    }

    if (typeof images !== 'object') {
      console.error('Trying to use addImages with illegal images', images);
    }
    if (!this.galleryData) {
      this.populateGalleryData();
    }
    if (!(images.length > 0)) {
      images = [images];
    }

    let firstArray = this.galleryData.photos;
    let secondArray = images;

    if (shouldAddToStart) {
      firstArray = images;
      secondArray = this.galleryData.photos;
    }

    try {
      this.setImages(firstArray.concat(secondArray));
    } catch (e) {
      console.error('Cannot add new images', e, images, window);
    }
  }

  reRenderGalleryForAlbums() {

    if (utils.isDev()) {
      console.log('Gallery Services - reRenderGalleryForAlbums');
    }

    this.populateGalleryData();
    // if (this.galleryView) {
    //   this.galleryView.renderTrigger = this.galleryView.renderTriggers.ITEMS; //this is a patch, we need to find a better way to control setState without predefined data
    //   this.galleryView.setState({items: this.galleryData.photos});
    // }
    this.renderGallery();
    //window.dispatchEvent(this.galleryScrollEvent);
  }

  toggleHoverPreviewEvent(toggle) {
    this.store.dispatch(toggleHoverPreview(toggle));
  }

  renderGallery() {
    let renderPromise = this.readyPromise;
    if (!renderPromise) {
      renderPromise = Promise.resolve();
    }

    renderPromise.then(() => {
      if (this.content && this.galleryData && this.galleryData.photos) {
        if (utils.isDev()) {
          console.log('gallery Services renderGallery called', this.galleryData, this.itemsCount, this.store);
        }
        const layout = {
          width: window.innerWidth,
          height: window.innerHeight
        };
        const at = Date.now(); //forces the galleryContainer to reRender even if the itemsCount did not change
        const renderElement = (<Provider store={this.store}>
          <div>
            <GalleryContainer
                at={at}
                items={this.galleryData.photos}
                galleryDataSrc={this.galleryDataSrc}
                totalItemsCount={this.itemsCount}
                store={this.store}
                layout={layout}
                watermarkData={this.watermarkData}
            />
          </div>
        </Provider>);

        render(renderElement,
          this.content,
          () => {
            if (!utils.isSemiNative()) {
              $('#gallery-loader').remove();
            }
          });
      } else {
        //in karma, this file is loaded but there is no document
        //console.error('Missing content element for react');
      }
    });
  }
}

//this should not be accessed by anyone from the outside - everything should be done via post message
const proGalleryServices = window.proGalleryServices = new ProGalleryServices();

window.addEventListener('message', e => {
  if (e && e.data === 'albumSetImagesUpdated') {
    proGalleryServices.reRenderGalleryForAlbums();
  }

  const {type, payload} = e.data;
  switch (type) {
    case 'renderGallery':
      proGalleryServices.renderGallery();
      break;
    case 'imageUpdated':
      proGalleryServices.reRenderGalleryForAlbums();
      break;
    case 'albumSetImagesUpdated':
      console.log('message albumSetImagesUpdated arrived for gallery ', e);
      proGalleryServices.reRenderGalleryForAlbums();
      break;
    case 'previewHoverMode':
      proGalleryServices.toggleHoverPreviewEvent(payload);
      break;
    case 'updateGallery':
      proGalleryServices.setImages(payload.items);
      break;
  }
});
