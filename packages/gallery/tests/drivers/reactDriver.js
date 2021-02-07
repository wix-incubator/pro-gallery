import { Layouter } from 'pro-layouts';
import {
  GALLERY_CONSTS,
  GalleryItem,
  ItemsHelper,
  window,
  utils,
} from 'pro-gallery-lib';
import { testImages } from './mocks/images-mock.js';
import { mount, shallow, configure } from 'enzyme';
import { GalleryContainer } from '../../src/components/gallery/proGallery/galleryContainer'; //import GalleryContainer before the connect (without redux)
import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import ProGallery from '../../src/components/gallery';

configure({ adapter: new Adapter() });

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class galleryDriver {
  constructor() {
    this.initDefaults();
    window.isTest = true;
  }

  initDefaults() {
    //override utils functions
    this.isTesingEnvironment = true;
    this.container = {
      scrollBase: 0,
      maxGalleryWidth: 1000,
      galleryWidth: 1000,
      galleryHeight: 500,
      viewMode: 'site',
      bounds: {
        visibleTop: 0,
        visibleBottom: 1000,
        renderedTop: 0,
        renderedBottom: 3000,
      },
    };

    this.styleParams = {
      gotStyleParams: true,
      selectedLayout: 0,
      isVertical: false,
      isRTL: false,
      targetItemSize: 320,
      minItemSize: 120,
      groupSize: 3,
      chooseBestGroup: true,
      groupTypes: '1,2h,2v,3t,3b,3l,3r',
      cubeImages: false,
      smartCrop: false,
      fullscreen: true,
      videoLoop: true,
      videoSound: false,
      videoSpeed: 1,
      videoPlay: 'hover',
      sharpParams: {
        quality: 90,
        usm: {}, // do not apply usm - {usm_r: 0.66, usm_a: 1.00, usm_t: 0.01},
      },
      collageAmount: 0.8,
      collageDensity: 0.8,
      imageMargin: 5,
      galleryMargin: 1,
      viewMode: 'preview',
      enableInfiniteScroll: true,
      itemClick: 'expand',
      cubeRatio: 1, //determine the ratio of the images when using grid (use 1 for squares grid)
      fixedColumns: 0, //determine the number of columns regardless of the screen size (use 0 to ignore)
      oneRow: false, //render the gallery as a single row with horizontal scroll
      showArrows: true,
      isSlideshow: false,
      isSlider: false,
      hasThumbnails: false,
      thumbnailSize: utils.isMobile() ? 90 : 120,
      galleryThumbnailsAlignment: 'bottom',
      thumbnailSpacings: 0,
      titlePlacement: GALLERY_CONSTS.placements.SHOW_ON_HOVER,
      itemEnableShadow: false,
      itemShadowOpacityAndColor: 'rgba(0, 0, 0, 0.2)',
      itemShadowBlur: 20,
      itemShadowDirection: 135,
      itemShadowSize: 10,
    };

    this.scroll = {
      top: 0,
      base: 0,
      isInfinite: true,
    };

    this.items = [...testImages];

    this.actions = {
      toggleLoadMoreItems: () => {},
      eventsListener: () => {},
      onItemClick: () => {},
      pauseAllVideos: () => {},
      setWixHeight: () => {},
      scrollToItem: () => new Promise((res) => res()),
    };

    this.layoutParams = {
      items: this.items,
      container: this.container,
      styleParams: this.styleParams,
      gotScrollEvent: true,
    };

    this.galleryStructure = ItemsHelper.convertToGalleryItems(
      new Layouter(this.layoutParams)
    );

    this.galleryConfig = {
      container: this.get.container,
      scroll: this.get.scroll,
      styleParams: this.get.styleParams,
      actions: this.get.actions,
    };

    this.customHoverRenderer = () => {};
    this.customInfoRenderer = () => {};
    this.customSlideshowInfoRenderer = () => {};
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
      state: (str) => this.wrapper.state(str),
      instance: () => this.wrapper.instance(),
      props: (str) => this.wrapper.props(str),
      node: () => this.wrapper.getNode(),
      wrapper: () => this.wrapper,
    };
  }

  get mount() {
    const res = (Component, props) => {
      this.wrapper = mount(<Component {...props} />);
      return this;
    };
    res.galleryContainer = (props) => {
      const defaultProps = this.props.galleryContainer();
      props = Object.assign(defaultProps, props || {});
      this.wrapper = mount(<GalleryContainer actions={{}} {...props} />);
      return this;
    };
    res.proGallery = (props) => {
      const div = document.createElement('div');
      div.setAttribute('id', 'testing-container');
      document.body.appendChild(div);
      this.wrapper = mount(<ProGallery {...props} />, {
        attachTo: document.getElementById('testing-container'),
      });
    };
    return res;
  }
  get trigger() {
    return {
      scroll: () => document.dispatchEvent(new CustomEvent('scroll')),
    };
  }
  get detach() {
    return {
      proGallery: () => {
        this.wrapper.detach();
        const div = document.getElementById('testing-container');
        if (div) {
          document.body.removeChild(div);
        }
      },
    };
  }

  get shallow() {
    const res = (Component, props) => {
      this.wrapper = shallow(<Component {...props} />);
      return this;
    };
    return res;
  }

  get set() {
    return {
      state: (state, callback = () => {}) => {
        return this.wrapper.setState(state, callback);
      },
      props: (props, callback = () => {}) => {
        return this.wrapper.setProps(props, callback);
      },
    };
  }

  get find() {
    return {
      hook: (str) => {
        return this.wrapper.find({ 'data-hook': str });
      },
      tag: (str) => {
        return this.wrapper.find(`${str}`);
      },
      id: (str) => {
        return this.wrapper.find(`#${str}`);
      },
      class: (str) => {
        return this.wrapper.find(`.${str}`);
      },
      selector: (str) => {
        return this.wrapper.find(str);
      },
    };
  }

  get text() {
    return this.wrapper.text();
  }

  async update(ms) {
    await sleep(ms);
    this.wrapper.update();
  }

  get props() {
    return {
      galleryContainer: () => {
        const layout = {
          width: window.innerWidth,
          height: window.innerHeight,
        };

        return {
          wixInit: true,
          items: this.items,
          totalItemsCount: this.items.length,
          layout,
          actions: this.actions,
          customHoverRenderer: this.customHoverRenderer,
          customInfoRenderer: this.customInfoRenderer,
          customSlideshowInfoRenderer: this.customSlideshowInfoRenderer,
        };
      },

      galleryView: (galleryViewProps) => {
        if (typeof galleryViewProps === 'undefined') {
          galleryViewProps = {
            totalItemsCount: 100,
            renderedItemsCount: 20,
            items: this.items,
            galleryStructure: this.galleryStructure,
            scroll: this.scroll,
            container: this.container,
            styleParams: this.styleParams,
            actions: this.actions,
            customHoverRenderer: this.customHoverRenderer,
            customInfoRenderer: this.customInfoRenderer,
            customSlideshowInfoRenderer: this.customSlideshowInfoRenderer,
            itemsLoveData: {},
          };
        }

        const layoutParams = {
          items: galleryViewProps.items,
          container: galleryViewProps.container,
          styleParams: galleryViewProps.styleParams,
        };

        const galleryStructure = ItemsHelper.convertToGalleryItems(
          new Layouter(layoutParams)
        );

        return {
          totalItemsCount: galleryViewProps.totalItemsCount || 100,
          renderedItemsCount: galleryViewProps.renderedItemsCount || 20,
          items: galleryViewProps.items,
          galleryStructure,
          scroll: galleryViewProps.scroll,
          container: galleryViewProps.container,
          getVisibleItems: (items) => items,
          styleParams: galleryViewProps.styleParams,
          actions: galleryViewProps.actions,
          itemsLoveData: galleryViewProps.itemsLoveData,
          convertToGalleryItems: ItemsHelper.convertToGalleryItems,
          convertDtoToLayoutItem: ItemsHelper.convertDtoToLayoutItem,
          customHoverRenderer: galleryViewProps.customHoverRenderer,
          customInfoRenderer: galleryViewProps.customInfoRenderer,
          customSlideshowInfoRenderer:
            galleryViewProps.customSlideshowInfoRenderer,
        };
      },

      groupView: () => {
        const galleryViewProps = this.props.galleryView();
        return Object.assign(galleryViewProps, {
          rendered: true,
          visible: true,
          items: galleryViewProps.items.map(
            (item) => new GalleryItem({ dto: item })
          ),
        });
      },

      itemView: (itemDto, galleryConfig) => {
        const newGalleryConfig = galleryConfig || this.get.galleryConfig;

        const galleryItem = new GalleryItem({ dto: itemDto });
        return Object.assign(galleryItem.renderProps(newGalleryConfig), {
          scrollingElement: {
            vertical: () => window,
            horizontal: () => window,
          },
          config: newGalleryConfig,
          visible: true,
          actions: {
            ...this.actions,
            eventsListener: () => {},
          },
        });
      },

      textView: (itemDto, galleryConfig) => {
        const newGalleryConfig = galleryConfig || this.get.galleryConfig;
        const galleryItem = new GalleryItem({ dto: itemDto });
        const itemViewPropsObj = Object.assign(
          galleryItem.renderProps(newGalleryConfig),
          { config: newGalleryConfig, visible: true }
        );
        return Object.assign(itemViewPropsObj, {
          actions: {
            handleItemMouseDown: () => {},
            handleItemMouseUp: () => {},
            setItemLoaded: () => {},
          },
        });
      },
    };
  }
}

export default galleryDriver;
