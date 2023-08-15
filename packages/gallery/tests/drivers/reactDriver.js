import { Layouter, GalleryItem, ItemsHelper } from 'pro-layouts';
import { window, addOldOptions, defaultOptions } from 'pro-gallery-lib';
import { testImages } from './mocks/images-mock.js';
import { render, act } from '@testing-library/react';
import { GalleryContainer } from '../../src/components/gallery/proGallery/galleryContainer'; //import GalleryContainer before the connect (without redux)
import React from 'react';
import ProGallery from '../../src/components/gallery';
import _ from 'lodash';

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
      width: 1000,
      height: 500,
      viewMode: 'site',
      bounds: {
        visibleTop: 0,
        visibleBottom: 1000,
        renderedTop: 0,
        renderedBottom: 3000,
      },
    };

    this.options = { ...defaultOptions, targetItemSize: 320 };

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
      scrollToGroup: () => new Promise((res) => res()),
    };

    this.layoutParams = {
      items: this.items,
      container: this.container,
      styleParams: this.options,
      gotScrollEvent: true,
    };

    this.galleryStructure = ItemsHelper.convertToGalleryItems(new Layouter(this.layoutParams));

    this.customComponents = {
      customHoverRenderer: () => {},
      customInfoRenderer: () => {},
    };

    this.galleryConfig = {
      container: this.get.container,
      scroll: this.get.scroll,
      options: this.get.options,
      actions: this.get.actions,
      customComponents: this.customComponents,
    };
  }

  get get() {
    return {
      container: this.container,
      options: this.options,
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
      props.options = { ...addOldOptions(props.options), ...props.options };
      props.galleryConfig &&
        (props.galleryConfig.options = {
          ...addOldOptions(props.galleryConfig.options),
          ...props.galleryConfig.options,
        });
      const { container, unmount } = render(<Component {...props} />);
      this.wrapper = container;
      this.unmountWrapper = unmount;
      return this;
    };
    res.galleryContainer = (props) => {
      const defaultProps = this.props.galleryContainer();
      props = Object.assign(defaultProps, props || {});
      props.options = { ...addOldOptions(props.options), ...props.options };
      const { container, unmount } = render(<GalleryContainer actions={{}} {...props} />);
      this.wrapper = container;
      this.unmountWrapper = unmount;
      return this;
    };
    res.proGallery = (props) => {
      const div = document.createElement('div');
      div.setAttribute('id', 'testing-container');
      document.body.appendChild(div);
      props.options = { ...addOldOptions(props.options), ...props.options };
      // this.wrapper = render(<ProGallery {...props} />, {
      //   attachTo: document.getElementById('testing-container'),
      // });
      const { container, unmount } = render(<ProGallery {...props} />);
      this.wrapper = container;
      this.unmountWrapper = unmount;
    };
    return res;
  }
  get trigger() {
    return {
      scroll: () => document.dispatchEvent(new CustomEvent('scroll')),
      click: (wrapper) => act(() => wrapper.click())
    };
  }
  get detach() {
    return {
      proGallery: () => {
        this.unmountWrapper();
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
        // return queryHelpers.queryAllByAttribute.bind(null, )
        return this.wrapper.querySelectorAll(`[data-hook="${str}"]`);
      },
      tag: (str) => {
        return this.wrapper.querySelectorAll(`${str}`);
      },
      id: (str) => {
        return this.wrapper.querySelectorAll(`#${str}`);
      },
      class: (str) => {
        return this.wrapper.querySelectorAll(`.${str}`);
      },
      selector: (str) => {
        return this.wrapper.querySelectorAll(str);
      },
      // getByTestId: (str) => {
      //   return this.wrapper.getByTestId(str);
      // }
    };
  }

  get images() {
    return _.uniqBy(Array.from(this.find.hook('gallery-item-image-img')), ({ props }) => props.src);
  }

  getContainer() {
    const id = this.wrapper.props().id || 'default-dom-id';
    return this.find.selector(`#pro-gallery-container-${id}`);
  }

  get text() {
    return this.wrapper.text();
  }

  async update(ms = 0) {
    await sleep(ms);
    // this.wrapper.update();
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
          customComponents: this.customComponents,
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
            options: this.options,
            actions: this.actions,
            customComponents: this.customComponents,
          };
        }

        const layoutParams = {
          items: galleryViewProps.items,
          container: galleryViewProps.container,
          styleParams: galleryViewProps.options,
        };

        const galleryStructure = ItemsHelper.convertToGalleryItems(new Layouter(layoutParams));

        return {
          totalItemsCount: galleryViewProps.totalItemsCount || 100,
          renderedItemsCount: galleryViewProps.renderedItemsCount || 20,
          items: galleryViewProps.items,
          galleryStructure,
          scroll: galleryViewProps.scroll,
          container: galleryViewProps.container,
          getVisibleItems: (items) => items,
          options: galleryViewProps.options,
          actions: galleryViewProps.actions,
          convertToGalleryItems: ItemsHelper.convertToGalleryItems,
          convertDtoToLayoutItem: ItemsHelper.convertDtoToLayoutItem,
          customComponents: galleryViewProps.customComponents,
          virtualizationSettings: galleryViewProps.virtualizationSettings,
        };
      },

      groupView: () => {
        const galleryViewProps = this.props.galleryView();
        return Object.assign(galleryViewProps, {
          rendered: true,
          visible: true,
          items: galleryViewProps.items.map((item) => new GalleryItem({ dto: item })),
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
          customComponents: {},
        });
      },

      textView: (itemDto, galleryConfig) => {
        const newGalleryConfig = galleryConfig || this.get.galleryConfig;
        const galleryItem = new GalleryItem({ dto: itemDto });
        const itemViewPropsObj = Object.assign(galleryItem.renderProps(newGalleryConfig), {
          config: newGalleryConfig,
          visible: true,
          imageDimensions: {
            marginLeft: 0,
            marginTop: 0,
          },
        });
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
