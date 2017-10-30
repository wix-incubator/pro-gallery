'use strict';
import {Layouter, Item} from 'pro-gallery-layouter';
import GalleryItem from '../item/galleryItem';
import {testImages} from '../test/images-mock.js';
import {createStore, applyMiddleware} from 'redux'
import { mount} from 'enzyme';
import {GalleryContainer} from './galleryContainer.js'; //import GalleryContainer before the connect (without redux)
import _ from 'lodash';
import React from 'react';
import configureStore from 'redux-mock-store';
import { utils } from '../../utils/index.js';
import consts from '../consts.js';

const mockStore = configureStore();


class galleryDriver {

  constructor() {
    this.initDefaults();
    this.overrideUtilsForTests();
  }

  overrideUtilsForTests() {
    utils.isInWix = () => {
      return true;
    }
    utils.isMobile = () => {
      return false;
    }
    utils.isTouch = () => {
      return false;
    }
    utils.isInWix = () => {
      return true;
    }
    utils.getScreenWidth = () => {
      return 1024;
    }
    utils.getScreenHeight = () => {
      return 768;
    }
    utils.isTest = () => {
      return true;
    }
    utils.isVerbose = () => {
      return false;
    }
  }

  initDefaults() {
    //override utils functions

    this.container = {
      maxGalleryWidth: 1000,
      galleryWidth: 1000,
      galleryHeight: 500,
      viewMode: 'site',
      bounds: {
        visibleTop: 0,
        visibleBottom: 1000,
        renderedTop: 0,
        renderedBottom: 3000
      },
    }

    this.styleParams = {
      gotStyleParams: true,
      selectedLayout: 0,
      isVertical: false,
      gallerySize: 320,
      minItemSize: 120,
      groupSize: 3,
      chooseBestGroup: true,
      groupTypes: '1,2h,2v,3t,3b,3l,3r',
      cubeImages: false,
      smartCrop: false,
      fullscreen: true,
      allowSocial: true,
      allowDownload: false,
      allowTitle: false,
      allowDescription: false,
      loveButton: true,
      loveCounter: true,
      videoLoop: true,
      videoSpeed: 1,
      videoPlay: 'hover',
      sharpParams: {
        quality: 90,
        usm: {}// do not apply usm - {usm_r: 0.66, usm_a: 1.00, usm_t: 0.01},
      },
      collageAmount: 0.8,
      collageDensity: 0.8,
      imageMargin: 5,
      viewMode: 'preview',
      galleryHorizontalAlign: 0,
      galleryVerticalAlign: 0,
      enableInfiniteScroll: true,
      itemClick: 'expand',
      cubeRatio: 1, //determine the ratio of the images when using grid (use 1 for squares grid)
      fixedColumns: 0, //determine the number of columns regardless of the screen size (use 0 to ignore)
      oneRow: false, //render the gallery as a single row with horizontal scroll
      showArrows: false,
      isSlideshow: false,
      hasThumbnails: false,
      galleryThumbnailsAlignment: 'bottom',
      thumbnailSpacings: 0,
      titlePlacement: consts.placements.SHOW_ON_HOVER,
    };

    this.scroll = {
      top: 0,
      base: 0,
      isInfinite: true
    }

    this.items = _.cloneDeep(testImages);

    this.actions = {
      toggleInfiniteScroll: _.noop,
      toggleFullscreen: _.noop,
      pauseAllVideos: _.noop,
      setWixHeight: _.noop,
      scrollToItem: _.noop
    }

    this.layoutParams = {
      items: this.items,
      container: this.container,
      styleParams: this.styleParams,
      gotScrollEvent: true
    };

    this.galleryStructure = GalleryContainer.convertToGalleryItems(new Layouter(this.layoutParams));

    this.galleryConfig = {
      scroll: this.get.scroll,
      styleParams: this.get.styleParams,
      actions: this.get.actions
    }
  }

  get get () {
    return {
      container: this.container,
      styleParams: this.styleParams,
      scroll: this.scroll,
      items: this.items,
      actions: this.actions,
      layoutParams: this.layoutParams,
      galleryStructure: this.galleryStructure,
      galleryConfig: this.galleryConfig
    }
  }

  get mount () {
    return {
      galleryContainer: (props) => {

          const defaultProps = this.create.galleryContainerProps()
          props = _.merge(defaultProps, (props || {}));
          var root = mount(
            <GalleryContainer
              store={mockStore({})}
              actions={{}}
              {...props}
            />
          );
        return root;
      }
    }
  }

  get create () {
    return {
      galleryContainerProps: () => {
        const layout = {
          width: window.innerWidth,
          height: window.innerHeight
        };

        return {
          wixInit: true,
          items: this.items,
          totalItemsCount: this.items.length,
          layout
        }
      },

      galleryViewProps: (galleryViewProps) => {

        if (typeof(galleryViewProps) == 'undefined') {
          galleryViewProps = {
            totalItemsCount: 100,
            renderedItemsCount: 20,
            items: this.items,
            galleryStructure: this.galleryStructure,
            scroll: this.scroll,
            container: this.container,
            styleParams: this.styleParams,
            actions: this.actions,
          };
        }

        var layoutParams = {
          items: galleryViewProps.items,
          container: galleryViewProps.container,
          styleParams: galleryViewProps.styleParams
        };

        galleryStructure = GalleryContainer.convertToGalleryItems(new Layouter(layoutParams));

        return {
          totalItemsCount: galleryViewProps.totalItemsCount || 100,
          renderedItemsCount: galleryViewProps.renderedItemsCount || 20,
          items: galleryViewProps.items,
          galleryStructure: galleryStructure,
          scroll: galleryViewProps.scroll,
          container: galleryViewProps.container,
          styleParams: galleryViewProps.styleParams,
          actions: galleryViewProps.actions,
          store: mockStore({})
        }

      },

      itemViewProps: (itemDto, galleryConfig) => {

        var newGalleryConfig = galleryConfig || this.get.galleryConfig;

        let galleryItem = new GalleryItem({dto: itemDto});
        return _.merge(galleryItem.renderProps(newGalleryConfig), {config: newGalleryConfig, visible: true});

      }
    }
  }

}

export default galleryDriver;

