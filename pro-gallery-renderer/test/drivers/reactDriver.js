'use strict';
import {Layouter} from 'pro-gallery-layouter';
import GalleryItem from '../../src/components/item/galleryItem';
import {testImages} from '../images-mock.js';
import {mount} from 'enzyme';
import {GalleryContainer} from '../../src/components/gallery/galleryContainer.js'; //import GalleryContainer before the connect (without redux)
import _ from 'lodash';
import configureStore from 'redux-mock-store';
import {Consts} from 'photography-client-lib';
import React from 'react';

const mockStore = configureStore();


class galleryDriver {

  constructor() {
    this.initDefaults();
    window.isTest = true;
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
    };

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
      titlePlacement: Consts.placements.SHOW_ON_HOVER,
    };

    this.scroll = {
      top: 0,
      base: 0,
      isInfinite: true
    };

    this.items = _.cloneDeep(testImages);

    this.actions = {
      toggleInfiniteScroll: _.noop,
      toggleFullscreen: _.noop,
      pauseAllVideos: _.noop,
      setWixHeight: _.noop,
      scrollToItem: _.noop,
      toggleShare: _.noop
    };

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
    };
  }

  get get() {
    return {
      container: this.container,
      styleParams: this.styleParams,
      scroll: this.scroll,
      items: this.items,
      actions: this.actions,
      layoutParams: this.layoutParams,
      galleryStructure: this.galleryStructure,
      galleryConfig: this.galleryConfig,
      state: () => this.wrapper.state(),
      instance: () => this.wrapper.instance(),
      props: () => this.wrapper.props()
    };
  }

  get mount() {
    const res = (Component, props) => {
      this.wrapper = mount(<Component
        {...props}
      />);
      return this;
    };
    res.galleryContainer = props => {
      const defaultProps = this.props.galleryContainer();
      props = _.merge(defaultProps, (props || {}));
      this.wrapper = mount(
        <GalleryContainer
          store={mockStore({})}
          actions={{}}
          {...props}
        />
      );
      return this;
    };
    return res;
  }

  get set() {
    return {
      state: (state, callback) => {
        return this.wrapper.setState(state, callback);
      },
      props: (props, callback) => {
        return this.wrapper.setProps(props, callback);
      }
    };
  }

  get find() {
    return {
      hook: str => {
        return this.wrapper.find({'data-hook': str});
      },
      id: str => {
        return this.wrapper.find(`#${str}`);
      },
      class: str => {
        return this.wrapper.find(`.${str}`);
      },
      selector: str => {
        return this.wrapper.find(str);
      },

    };
  }

  get props() {
    return {
      galleryContainer: () => {
        const layout = {
          width: window.innerWidth,
          height: window.innerHeight
        };

        return {
          wixInit: true,
          items: this.items,
          totalItemsCount: this.items.length,
          layout
        };
      },

      galleryView: galleryViewProps => {

        if (typeof (galleryViewProps) === 'undefined') {
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

        const layoutParams = {
          items: galleryViewProps.items,
          container: galleryViewProps.container,
          styleParams: galleryViewProps.styleParams
        };

        const galleryStructure = GalleryContainer.convertToGalleryItems(new Layouter(layoutParams));

        return {
          totalItemsCount: galleryViewProps.totalItemsCount || 100,
          renderedItemsCount: galleryViewProps.renderedItemsCount || 20,
          items: galleryViewProps.items,
          galleryStructure,
          scroll: galleryViewProps.scroll,
          container: galleryViewProps.container,
          styleParams: galleryViewProps.styleParams,
          actions: galleryViewProps.actions,
          store: mockStore({})
        };

      },

      itemView: (itemDto, galleryConfig) => {

        const newGalleryConfig = galleryConfig || this.get.galleryConfig;

        const galleryItem = new GalleryItem({dto: itemDto});
        return _.merge(galleryItem.renderProps(newGalleryConfig), {config: newGalleryConfig, visible: true});

      }
    };
  }

}

export default galleryDriver;
