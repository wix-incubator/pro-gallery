import React from 'react';
import GalleryView from './galleryView.js';
import SlideshowView from './slideshowView.js';
import { addLayoutStyles } from '../helpers/layoutHelper';
import { ItemsHelper } from '../helpers/itemsHelper';
import dimensionsHelper from '../helpers/dimensionsHelper';
import { scrollToItemImp } from '../helpers/scrollHelper';
import window from '../../utils/window/windowWrapper';
import ScrollIndicator from './galleryScrollIndicator';
import { Layouter } from 'pro-layouts';
import { cssScrollHelper } from '../helpers/cssScrollHelper.js';
import { createCssLayouts } from '../helpers/cssLayoutsHelper.js';
import utils from '../../utils';
import { isEditMode, isSEOMode } from '../../utils/window/viewModeWrapper';
import EVENTS from '../../constants/events';
import {
  extractContextFields,
  GalleryProvider,
} from '../../context/GalleryContext';
import VideoScrollHelper from '../helpers/videoScrollHelper.js';
import { URL_TYPES, URL_SIZES } from '../../constants/urlTypes';

export class GalleryContainer extends React.Component {
  constructor(props) {
    super(props);
    if (utils.isVerbose()) {
      console.count('[OOISSR] galleryContainerNew constructor', window.isMock);
    }
    this.getMoreItemsIfNeeded = this.getMoreItemsIfNeeded.bind(this);
    this.enableScrollPreload = this.enableScrollPreload.bind(this);
    this.toggleLoadMoreItems = this.toggleLoadMoreItems.bind(this);
    this.scrollToItem = this.scrollToItem.bind(this);
    this._scrollingElement = this.getScrollingElement();
    this.duplicateGalleryItems = this.duplicateGalleryItems.bind(this);
    this.eventsListener = this.eventsListener.bind(this);
    this.onGalleryScroll = this.onGalleryScroll.bind(this);
    this.setPlayingIdxState = this.setPlayingIdxState.bind(this);

    const initialState = {
      pgScroll: 0,
      showMoreClickedAtLeastOnce: false,
      initialGalleryHeight: undefined,
      needToHandleShowMoreClick: false,
      currentHover: -1,
      gotFirstScrollEvent: false,
      playingVideoIdx: -1,
      nextVideoIdx: -1,
    };

    this.items = [];
    this.itemsDimensions = {};
    this.preloadedItems = {};
    this.layoutCss = [];
    this.state = initialState;
    const videoScrollHelperConfig = {
      setPlayingVideos: isEditMode() ? () => {} : this.setPlayingIdxState,
    };
    this.videoScrollHelper = new VideoScrollHelper(videoScrollHelperConfig);

    if (utils.isSSR()) {
      this.initialGalleryState = this.reCreateGalleryExpensively(
        props,
        initialState,
      );
      try {
        this.galleryInitialStateJson = JSON.stringify(this.initialGalleryState);
      } catch (e) {
        //todo - report to sentry
        this.galleryInitialStateJson = null;
      }
    } else {
      try {
        if (!utils.shouldDebug('no_hydrate')) {
          const state = JSON.parse(
            window.document.querySelector(
              `#pro-gallery-${props.domId} #ssr-state-to-hydrate`,
            ).innerHTML,
          );
          this.reCreateGalleryFromState({
            items: props.items,
            styles: state.styles,
            container: state.container,
            gotFirstScrollEvent: initialState.gotFirstScrollEvent,
          });
          this.initialGalleryState = state;
        } else {
          this.initialGalleryState = {}; //this will cause a flicker between ssr and csr
        }
      } catch (e) {
        //hydrate phase did not happen - do it all over again
        this.initialGalleryState = {};
        try {
          const galleryState = this.reCreateGalleryExpensively(props);
          if (Object.keys(galleryState).length > 0) {
            this.initialGalleryState = galleryState;
          }
        } catch (_e) {
          //
        }
      }
    }

    this.state = {
      ...initialState,
      ...this.initialGalleryState,
    };
  }

  componentDidMount() {
    this.loadItemsDimensionsIfNeeded();
    const onGalleryCreated = () => {
      this.getMoreItemsIfNeeded(0);
      this.handleNewGalleryStructure();
      this.eventsListener(EVENTS.APP_LOADED, {});
    };
    const galleryState = this.reCreateGalleryExpensively(this.props);
    if (Object.keys(galleryState).length > 0) {
      this.setState(galleryState, () => {
        onGalleryCreated();
      });
    } else {
      onGalleryCreated();
    }
    this.videoScrollHelper.initializePlayState();
  }

  componentWillReceiveProps(nextProps) {
    const reCreateGallery = () => {
      const galleryState = this.reCreateGalleryExpensively(nextProps);
      if (Object.keys(galleryState).length > 0) {
        this.setState(galleryState, () => {
          this.handleNewGalleryStructure();
        });
      }
    };

    const getSignificantProps = props => {
      const { domId, styles, container, items } = props;
      return { domId, styles, container, items };
    };

    if (this.reCreateGalleryTimer) {
      clearTimeout(this.reCreateGalleryTimer);
    }

    let hasPropsChanged = true;
    try {
      const currentSignificatProps = getSignificantProps(this.props);
      const nextSignificatProps = getSignificantProps(nextProps);
      hasPropsChanged =
        JSON.stringify(currentSignificatProps) !==
        JSON.stringify(nextSignificatProps);
    } catch (e) {
      console.error('Cannot compare props', e);
    }

    if (hasPropsChanged) {
      if (utils.isVerbose()) {
        console.log(
          'New props arrived',
          utils.printableObjectsDiff(this.props, nextProps),
        );
      }

      reCreateGallery();

      if (!!nextProps.currentIdx && nextProps.currentIdx > 0) {
        this.scrollToItem(nextProps.currentIdx, false, true, 0);
      }

      if (this.props.isInDisplay !== nextProps.isInDisplay) {
        this.handleNavigation(nextProps.isInDisplay);
      }
    } else {
      //this is a hack, because in fullwidth, new props arrive without any changes
      this.reCreateGalleryTimer = setTimeout(reCreateGallery, 1000);
    }
  }

  loadItemsDimensionsIfNeeded() {
    if (utils.isSSR()) {
      return;
    }
    if (
      !(
        this.galleryStructure &&
        this.galleryStructure.galleryItems &&
        this.galleryStructure.galleryItems.length > 0
      )
    ) {
      return;
    }

    const { galleryItems } = this.galleryStructure;

    const itemsWithoutDimensions = galleryItems.filter(item => {
      try {
        return item.isVisible && item.isDimensionless && !item.isPreloaded;
      } catch (e) {
        return false;
      }
    });

    if (!itemsWithoutDimensions.length) {
      return;
    }

    const preloadItem = (item, onload) => {
      if (!item || !item.itemId || !item.isGalleryItem) {
        return;
      }
      try {
        const id = item.itemId;
        if (this.itemsDimensions[id]) {
          return; //already measured
        }
        if (typeof this.preloadedItems[id] !== 'undefined') {
          return;
        }
        this.preloadedItems[id] = new Image();
        if (utils.isVerbose()) {
          console.log('Preloading item #' + item);
        }

        if (typeof item.preload_url === 'string') {
          this.preloadedItems[id].src = item.preload_url;
        } else {
          this.preloadedItems[id].src = item.createUrl(
            URL_SIZES.PRELOAD,
            URL_TYPES.LOW_RES,
          );
        }

        if (typeof onload === 'function') {
          this.preloadedItems[id].onload = e => {
            onload(e);
          };
        }

        return this.preloadedItems[id];
      } catch (e) {
        console.error('Could not preload item', item, e);
        return;
      }
    };

    const throttledReCreateGallery = utils.throttle(() => {
      const { items, styles, container, watermarkData } = this.props;
      const params = {
        items,
        styles,
        container,
        watermarkData,
        itemsDimensions: this.itemsDimensions,
      };

      const newState = this.reCreateGalleryExpensively(params, this.state);
      if (Object.keys(newState).length > 0) {
        this.setState(newState, () => {
          this.handleNewGalleryStructure();
        });
      }
    }, 2500);

    itemsWithoutDimensions.forEach((item, idx) => {
      item.isPreloaded = true;
      preloadItem(item, e => {
        try {
          if (utils.isVerbose()) {
            console.log('item loaded event', idx, e);
          }
          const ele = e.srcElement;
          const _item = this.items.find(itm => itm.itemId === item.itemId);
          if (_item) {
            const itemDim = {
              width: ele.width,
              height: ele.height,
              measured: true,
            };

            Object.assign(_item, itemDim);
            if (typeof _item.metaData === 'object') {
              Object.assign(_item.metaData, itemDim);
            }
            this.itemsDimensions[_item.itemId] = itemDim;

            //rebuild the gallery after every dimension update
            // if (Object.keys(this.itemsDimensions).length > 0) {
            throttledReCreateGallery();
            // }
          }
        } catch (_e) {
          console.error('Could not calc element dimensions', _e);
        }
      });
    });
  }

  handleNavigation(isInDisplay) {
    if (isInDisplay) {
      this.videoScrollHelper.trigger.INIT_SCROLL();
    } else {
      this.videoScrollHelper.stop();
    }
  }

  handleNewGalleryStructure() {
    //should be called AFTER new state is set
    const {
      container,
      needToHandleShowMoreClick,
      initialGalleryHeight,
    } = this.state;
    const partialStyleParams = utils.pick(this.state.styles, [
      'isSlideshow',
      'slideshowInfoSize',
      'galleryThumbnailsAlignment',
      'thumbnailSize',
      'isSlider',
      'galleryWidth',
      'isInAdi',
      'oneRow',
      'enableInfiniteScroll',
    ]);
    const numOfItems = this.state.items.length;
    const layoutHeight = this.layout.height;
    const layoutItems = this.layout.items;
    const isInfinite = this.containerInfiniteGrowthDirection() === 'vertical';
    let updatedHeight = false;
    const needToUpdateHeightNotInfinite =
      !isInfinite && needToHandleShowMoreClick;
    if (needToUpdateHeightNotInfinite) {
      const showMoreContainerHeight = 138; //according to the scss
      updatedHeight =
        container.height +
        (initialGalleryHeight -
          showMoreContainerHeight * utils.getViewportScaleRatio());
    }

    const onGalleryChangeData = {
      numOfItems,
      container,
      partialStyleParams,
      layoutHeight,
      layoutItems,
      isInfinite,
      updatedHeight,
    };
    this.eventsListener(EVENTS.GALLERY_CHANGE, onGalleryChangeData);

    if (needToHandleShowMoreClick) {
      this.setState({ needToHandleShowMoreClick: false });
    }
  }

  isNew({ items, styles, container, watermarkData, itemsDimensions }, state) {
    const reason = {
      items: '',
      itemsMetadata: '',
      itemsAdded: '',
      styles: '',
      container: '',
    };

    const containerHadChanged = _container => {
      if (!state.styles || !state.container) {
        reason.container = 'no old container or styles. ';
        return true; //no old container or styles (style may change container)
      }
      if (!_container) {
        reason.container = 'no new container.';
        return false; // no new continainer
      }
      const containerHasChanged = {
        height:
          !state.styles.oneRow && state.styles.enableInfiniteScroll
            ? false
            : !!_container.height &&
              _container.height !== this.props.container.height,
        width:
          !state.container ||
          (dimensionsHelper.isFullWidth(_container) &&
            window.innerWidth !== state.container.windowWidth) ||
          (!!_container.width &&
            _container.width !== this.props.container.width),
        scrollBase:
          !!_container.scrollBase &&
          _container.scrollBase !== this.props.container.scrollBase,
        documentHeight:
          !state.container ||
          window.document.body.scrollHeight !== state.container.documentHeight,
      };
      return Object.keys(containerHasChanged).reduce((is, key) => {
        if (containerHasChanged[key]) {
          reason.container += `container.${key} has changed. `;
        }
        return is || containerHasChanged[key];
      }, false);
    };

    const stylesHaveChanged = _styles => {
      if (!_styles) {
        reason.styles = 'no new styles.';
        return false; //no new styles - use old styles
      }
      if (!state.styles) {
        reason.styles = 'no old styles.';
        return true; //no old styles
      }
      try {
        const wasChanged =
          JSON.stringify(_styles) !== JSON.stringify(this.props.styles);
        if (wasChanged) {
          reason.styles = 'styles were changed.';
        }
        return wasChanged;
      } catch (e) {
        console.error('Could not compare styles', e);
        return false;
      }
    };

    const itemsWereAdded = _items => {
      const existingItems = this.items;
      if (_items === this.items) {
        reason.itemsAdded = 'items are the same object.';
        return false; //it is the exact same object
      }
      if (!_items) {
        reason.itemsAdded = 'new items do not exist.';
        return false; // new items do not exist (use old items)
      }
      if (!state.items || !existingItems) {
        reason.itemsAdded = 'old items do not exist.';
        return false; // old items do not exist (it is not items addition)
      }
      if (existingItems.length >= _items.length) {
        reason.itemsAdded = 'more old items than new items.';
        return false; // more old items than new items
      }
      const idsNotChanged = existingItems.reduce((is, _item, idx) => {
        //check that all the existing items exist in the new array
        return is && _item.id === _items[idx].itemId;
      }, true);

      if (!idsNotChanged) {
        reason.itemsAdded = 'items ids were changed. ';
      }
      return idsNotChanged;
    };

    const itemsHaveChanged = newItems => {
      const existingItems = this.items;
      if (newItems === this.items) {
        reason.items = 'items are the same object.';
        return false; //it is the exact same object
      }
      if (!newItems) {
        reason.items = 'new items do not exist.';
        return false; // new items do not exist (use old items)
      }
      if (!state.items || !existingItems) {
        reason.items = 'old items do not exist.';
        return true; // old items do not exist
      }
      if (existingItems.length !== newItems.length) {
        reason.items = 'more new items than old items (or vice versa).';
        return true; // more new items than old items (or vice versa)
      }
      return newItems.reduce((is, newItem, idx) => {
        //check that all the items are identical
        const existingItem = existingItems[idx];
        try {
          const itemsChanged =
            is ||
            !newItem ||
            !existingItem ||
            newItem.itemId !== existingItem.itemId ||
            newItem.mediaUrl !== existingItem.mediaUrl;
          if (itemsChanged) {
            reason.items = `items #${idx} id was changed.`;
          }
          return itemsChanged;
        } catch (e) {
          reason.items = 'an error occured';
          return true;
        }
      }, false);
    };

    const itemsMetadataWasChanged = newItems => {
      const existingItems = this.items;

      if (!newItems) {
        reason.itemsMetadata = 'new items do not exist.';
        return false; // new items do not exist (use old items)
      }
      if (!state.items || !existingItems) {
        reason.itemsMetadata = 'old items do not exist.';
        return true; // old items do not exist
      }

      return newItems.reduce((is, newItem, idx) => {
        //check that all the items are identical
        const existingItem = existingItems[idx];
        try {
          const itemsChanged =
            is ||
            JSON.stringify(newItem.metaData) !==
              JSON.stringify(existingItem.metaData);
          if (itemsChanged) {
            reason.itemsMetadata = `item #${idx} data was changed.`;
          }
          return itemsChanged;
        } catch (e) {
          reason.itemsMetadata = 'an error occured.';
          return true;
        }
      }, false);
    };

    const isNew = {
      items: itemsHaveChanged(items),
      addedItems: itemsWereAdded(items),
      itemsMetadata: itemsMetadataWasChanged(items),
      styles: stylesHaveChanged(styles),
      container: containerHadChanged(container),
      itemsDimensions: !!itemsDimensions,
      watermark: !!watermarkData && watermarkData !== this.props.watermarkData,
    };

    isNew.str = Object.entries(isNew)
      .map(([key, is]) => (is ? key : ''))
      .filter(str => !!str)
      .join('|');
    isNew.any = isNew.str.length > 0;
    isNew.reason = reason;

    // if (!isNew.any) {
    //   console.count('Tried recreating gallery with no new params');
    // } else {
    //   console.count('Recreating gallery with new params');
    // }

    return isNew;
  }

  reCreateGalleryFromState({ items, styles, container, gotFirstScrollEvent }) {
    const isFullwidth = dimensionsHelper.isFullWidth(container); //keep this on top, before the container is recalculated

    //update this.items
    this.items = items.map(item => ItemsHelper.convertDtoToLayoutItem(item));
    const layoutParams = {
      items: this.items,
      container,
      styleParams: styles,
      gotScrollEvent: true,
      options: {
        showAllItems: true,
        skipVisibilitiesCalc: true,
        useLayoutStore: false,
        createLayoutOnInit: false,
      },
    };

    this.layouter = new Layouter(layoutParams);
    this.layout = this.layouter.createLayout(layoutParams);
    this.galleryStructure = ItemsHelper.convertToGalleryItems(this.layout, {
      sharpParams: styles.sharpParams,
      resizeMediaUrl: this.props.resizeMediaUrl,
    });
    this.videoScrollHelper.updateGalleryStructure({
      galleryStructure: this.galleryStructure,
      scrollBase: container.scrollBase,
      videoPlay: styles.videoPlay,
      oneRow: styles.oneRow,
    });
    const allowPreloading = isEditMode() || gotFirstScrollEvent;
    this.scrollCss = this.getScrollCssIfNeeded({
      galleryDomId: this.props.domId,
      items: this.galleryStructure.galleryItems,
      styleParams: styles,
      allowPreloading,
    });
    this.createCssLayoutsIfNeeded(layoutParams);
  }

  createCssLayoutsIfNeeded(layoutParams, isApproximation = false, isNew = {}) {
    this.layoutCss = createCssLayouts({
      layoutParams,
      isApproximation,
      isMobile: utils.isMobile(),
      galleryDomId: this.props.domId,
      galleryItems: isApproximation? null : this.galleryStructure.galleryItems,
    });
  }

  reCreateGalleryExpensively(
    { items, styles, container, watermarkData, itemsDimensions },
    curState,
  ) {
    if (utils.isVerbose()) {
      console.count('PROGALLERY [COUNT] reCreateGalleryExpensively');
      console.time('PROGALLERY [TIME] reCreateGalleryExpensively');
    }

    const state = curState || this.state || {};
    const isFullwidth = dimensionsHelper.isFullWidth(container); //keep this on top, before the container is recalculated

    let _styles, _container;

    const isNew = this.isNew(
      { items, styles, container, watermarkData, itemsDimensions },
      state,
    );
    const newState = {};

    if (utils.isVerbose()) {
      console.log('PROGALLERY reCreateGalleryExpensively', isNew, {
        items,
        styles,
        container,
        watermarkData,
      });
    }

    if (
      (isNew.itemsDimensions || isNew.itemsMetadata) &&
      !isNew.items &&
      !isNew.addedItems
    ) {
      //if only the items metadata has changed - use the modified items (probably with the measured width and height)
      this.items = this.items.map(item =>
        Object.assign(item, { ...this.itemsDimensions[item.itemId] }),
      );
      newState.items = this.items.map(item => item.itemId);
    } else if (isNew.items && !isNew.addedItems) {
      this.items = items.map(item =>
        Object.assign(ItemsHelper.convertDtoToLayoutItem(item), {
          ...this.itemsDimensions[item.itemId],
        }),
      );
      newState.items = this.items.map(item => item.itemId);
      this.gettingMoreItems = false; //probably finished getting more items
    } else if (isNew.addedItems) {
      this.items = this.items.concat(
        items.slice(this.items.length).map(item => {
          return ItemsHelper.convertDtoToLayoutItem(item);
        }),
      );
      newState.items = this.items.map(item => item.itemId);
      this.gettingMoreItems = false; //probably finished getting more items
    }

    if (isNew.styles || isNew.container) {
      styles = styles || state.styles;
      container = container || state.container;

      dimensionsHelper.updateParams({
        styles,
        container,
        domId: this.props.domId,
      });
      _styles = addLayoutStyles(styles);
      dimensionsHelper.updateParams({ styles: _styles });
      _container = Object.assign(
        {},
        container,
        dimensionsHelper.getGalleryDimensions(container),
      );
      dimensionsHelper.updateParams({ container: _container });
      newState.styles = _styles;
      newState.container = _container;
    } else {
      _styles = state.styles;
      _container = state.container;
    }
    if (!this.galleryStructure || isNew.any) {
      if (utils.isVerbose()) {
        console.count(
          'PROGALLERY [COUNT] - reCreateGalleryExpensively (isNew)',
        );
      }
      const layoutParams = {
        items: this.items,
        container: _container,
        styleParams: _styles,
        gotScrollEvent: true,
        options: {
          showAllItems: true,
          skipVisibilitiesCalc: true,
          useLayoutStore: false,
        },
      };

      if (this.layouter && isNew.addedItems) {
        layoutParams.options.useExistingLayout = true;
      } else {
        layoutParams.options.createLayoutOnInit = false;
        this.layouter = new Layouter(layoutParams);
      }

      this.layout = this.layouter.createLayout(layoutParams);
      const itemConfig = {
        watermark: watermarkData,
        sharpParams: _styles.sharpParams,
        lastVisibleItemIdx: this.lastVisibleItemIdx,
        resizeMediaUrl: this.props.resizeMediaUrl,
      };
      const existingLayout = this.galleryStructure || this.layout;
      if (isNew.addedItems) {
        this.galleryStructure = ItemsHelper.convertExistingStructureToGalleryItems(
          existingLayout,
          this.layout,
          itemConfig,
        );
      } else {
        this.galleryStructure = ItemsHelper.convertToGalleryItems(
          this.layout,
          itemConfig,
          existingLayout.galleryItems,
        );
      }
      this.videoScrollHelper.updateGalleryStructure({
        galleryStructure: this.galleryStructure,
        scrollBase: _container.scrollBase,
        videoPlay: _styles.videoPlay,
        oneRow: _styles.oneRow,
        cb: this.setPlayingIdxState,
      });
      if (isNew.items) {
        this.loadItemsDimensionsIfNeeded();
      }

      const isApproximation = utils.isSSR() && isFullwidth && !_styles.oneRow;
      this.createCssLayoutsIfNeeded(layoutParams, isApproximation, isNew);

      const allowPreloading =
        isEditMode() ||
        state.gotFirstScrollEvent ||
        state.showMoreClickedAtLeastOnce;

      this.scrollCss = this.getScrollCssIfNeeded({
        galleryDomId: this.props.domId,
        items: this.galleryStructure.galleryItems,
        styleParams: _styles,
        allowPreloading,
      });
    }

    if (utils.isVerbose()) {
      console.log(
        'PROGALLERY [RENDERS] - reCreateGalleryExpensively',
        { isNew },
        { items, styles, container, watermarkData },
      );
      console.timeEnd('PROGALLERY [TIME] reCreateGalleryExpensively');
    }

    if (isNew.any) {
      return newState;
    } else {
      return {};
    }
  }

  getScrollingElement() {
    const horizontal = () =>
      window.document.querySelector(
        `#pro-gallery-${this.props.domId} #gallery-horizontal-scroll`,
      );
    const vertical = this.props.scrollingElement
      ? typeof this.props.scrollingElement === 'function'
        ? this.props.scrollingElement
        : () => this.props.scrollingElement
      : () => window;
    return { vertical, horizontal };
  }

  scrollToItem(itemIdx, fixedScroll, isManual, durationInMS = 0) {
    const scrollingElement = this._scrollingElement;
    const horizontalElement = scrollingElement.horizontal();
    scrollToItemImp({
      isRTL: this.state.styles.isRTL,
      oneRow: this.state.styles.oneRow,
      galleryWidth: this.state.container.galleryWidth,
      galleryHeight: this.state.container.galleryHeight,
      top: 0,
      items: this.galleryStructure.items,
      totalWidth: this.galleryStructure.width,
      itemIdx,
      fixedScroll,
      isManual,
      scrollingElement,
      horizontalElement,
      durationInMS,
    });
  }

  containerInfiniteGrowthDirection(styles = false) {
    const _styles = styles || this.state.styles;
    // return the direction in which the gallery can grow on it's own (aka infinite scroll)
    const { enableInfiniteScroll } = this.props.styles;
    const { showMoreClickedAtLeastOnce } = this.state;
    const { oneRow, loadMoreAmount } = _styles;
    if (oneRow) {
      return 'horizontal';
    } else if (!enableInfiniteScroll) {
      //vertical gallery with showMore button enabled
      if (showMoreClickedAtLeastOnce && loadMoreAmount === 'all') {
        return 'vertical';
      } else {
        return 'none';
      }
    } else {
      return 'vertical';
    }
  }

  setPlayingIdxState(playingVideoIdx, nextVideoIdx) {
    this.setState({
      playingVideoIdx,
      nextVideoIdx,
    });
  }

  onGalleryScroll({ top, left }) {
    this.videoScrollHelper.trigger.SCROLL({
      top,
      left,
    });
  }

  getScrollCssIfNeeded({ galleryDomId, items, styleParams, allowPreloading }) {
    const isSEO = isSEOMode();
    const shouldUseScrollCss = !isSEO;

    if (shouldUseScrollCss) {
      return cssScrollHelper.calcScrollCss({
        galleryDomId,
        items,
        styleParams,
        allowPreloading,
      });
    } else {
      return '';
    }
  }

  toggleLoadMoreItems() {
    this.eventsListener(
      EVENTS.LOAD_MORE_CLICKED,
      this.galleryStructure.galleryItems,
    );
    const showMoreClickedAtLeastOnce = true;
    const needToHandleShowMoreClick = true;
    if (!this.state.gotFirstScrollEvent) {
      //we already called to calcScrollCss with allowPreloading = true
      this.scrollCss = this.getScrollCssIfNeeded({
        galleryDomId: this.props.domId,
        items: this.galleryStructure.galleryItems,
        styleParams: this.state.styles,
        allowPreloading: true,
      });
    }
    //before clicking "load more" at the first time
    if (!this.state.showMoreClickedAtLeastOnce) {
      const initialGalleryHeight = this.state.container.height; //container.height before clicking "load more" at the first time
      this.setState(
        {
          showMoreClickedAtLeastOnce,
          initialGalleryHeight,
          needToHandleShowMoreClick,
        },
        () => {
          this.handleNewGalleryStructure();
        },
      );
    } else {
      //from second click
      this.setState(
        {
          needToHandleShowMoreClick,
        },
        () => {
          this.handleNewGalleryStructure();
        },
      );
    }
  }

  enableScrollPreload() {
    if (!this.state.gotFirstScrollEvent) {
      if (!this.state.showMoreClickedAtLeastOnce) {
        //we already called to calcScrollCss with allowPreloading = true
        this.scrollCss = this.getScrollCssIfNeeded({
          galleryDomId: this.props.domId,
          items: this.galleryStructure.galleryItems,
          styleParams: this.state.styles,
          allowPreloading: true,
        });
      }
      this.setState({
        gotFirstScrollEvent: true,
      });
    }
  }

  duplicateGalleryItems() {
    const galleryState = this.reCreateGalleryExpensively({
      ...this.props,
      items: this.items.concat(
        ...this.items.slice(0, this.props.totalItemsCount),
      ),
    });
    if (Object.keys(galleryState).length > 0) {
      this.setState(galleryState, () => {
        this.handleNewGalleryStructure();
      });
    }
  }

  eventsListener(eventName, eventData) {
    this.videoScrollHelper.handleEvent({
      eventName,
      eventData,
    });
    if (eventName === EVENTS.HOVER_SET) {
      this.setState({ currentHover: eventData });
    }
    if (typeof this.props.eventsListener === 'function') {
      this.props.eventsListener(eventName, eventData);
    }
  }

  getMoreItemsIfNeeded(scrollPos) {
    if (
      this.galleryStructure &&
      this.galleryStructure.galleryItems &&
      this.galleryStructure.galleryItems.length > 0 &&
      !this.gettingMoreItems &&
      this.state.items &&
      this.state.styles &&
      this.state.container
    ) {
      //more items can be fetched from the server
      //TODO - add support for horizontal galleries
      const { oneRow } = this.state.styles;

      const gallerySize = this.galleryStructure[oneRow ? 'width' : 'height'];
      const screenSize = window.screen[oneRow ? 'width' : 'height'];
      const scrollEnd =
        scrollPos + screenSize + (oneRow ? 0 : this.state.container.scrollBase);
      const getItemsDistance = 3 * screenSize;

      // console.log('[RTL SCROLL] getMoreItemsIfNeeded: ', scrollPos);

      if (gallerySize - scrollEnd < getItemsDistance) {
        //only when the last item turns visible we should try getting more items
        if (this.state.items.length < this.props.totalItemsCount) {
          this.gettingMoreItems = true;
          this.eventsListener(EVENTS.NEED_MORE_ITEMS, this.state.items.length);
          setTimeout(() => {
            //wait a bit before allowing more items to be fetched - ugly hack before promises still not working
            this.gettingMoreItems = false;
          }, 2000);
        } else if (this.state.styles.slideshowLoop) {
          this.duplicateGalleryItems();
        }
      }
    }
  }

  canRender() {
    const can = this.state.container && this.state.styles && this.state.items;
    if (!can && utils.isVerbose()) {
      console.log(
        'PROGALLERY [CAN_RENDER] GalleryContainer',
        this.state,
        can,
        this.state.container,
        this.state.styles,
        this.state.items,
      );
    }
    return can;
  }
  render() {
    if (!this.canRender()) {
      return null;
    }

    const { styles } = this.state;
    const ViewComponent = styles.oneRow ? SlideshowView : GalleryView;
    if (utils.isVerbose()) {
      console.time('PROGALLERY [COUNTS] - GalleryContainer (render)');
      console.log(
        'PROGALLERY [RENDER] - GalleryContainer',
        this.state.container.scrollBase,
        { state: this.state, items: this.items },
      );
    }

    const displayShowMore = this.containerInfiniteGrowthDirection() === 'none';
    const findNeighborItem = this.layouter
      ? this.layouter.findNeighborItem
      : (() => {});
    const ssrDisableTransition =
      !!utils.isSSR() &&
      'div.pro-gallery-parent-container * { transition: none !important }';

    return (
      <GalleryProvider
        {...extractContextFields({ ...this.state, ...this.props })}
      >
        <div
          data-key="pro-gallery-inner-container"
          key="pro-gallery-inner-container"
        >
          <ScrollIndicator
            galleryDomId={this.props.domId}
            oneRow={this.state.styles.oneRow}
            isRTL={this.state.styles.isRTL}
            totalWidth={this.galleryStructure.width}
            scrollBase={this.state.container.scrollBase}
            scrollingElement={this._scrollingElement}
            getMoreItemsIfNeeded={this.getMoreItemsIfNeeded}
            enableScrollPreload={this.enableScrollPreload}
            onScroll={this.onGalleryScroll}
          />
          <ViewComponent
            galleryDomId={this.props.domId}
            galleryId={this.props.galleryId}
            isInDisplay={this.props.isInDisplay}
            scrollingElement={this._scrollingElement}
            totalItemsCount={this.props.totalItemsCount} //the items passed in the props might not be all the items
            renderedItemsCount={this.props.renderedItemsCount}
            items={this.items}
            itemsLoveData={this.props.itemsLoveData}
            galleryStructure={this.galleryStructure}
            styleParams={styles}
            container={this.state.container}
            watermark={this.props.watermarkData}
            settings={this.props.settings}
            gotScrollEvent={true}
            scroll={{}} //todo: remove after refactor is 100%
            displayShowMore={displayShowMore}
            domId={this.props.domId}
            currentHover={this.state.currentHover}
            customHoverRenderer={this.props.customHoverRenderer}
            customInfoRenderer={this.props.customInfoRenderer}
            playingVideoIdx={this.state.playingVideoIdx}
            nextVideoIdx={this.state.nextVideoIdx}
            noFollowForSEO={this.props.noFollowForSEO}
            actions={{
              ...this.props.actions, 
              findNeighborItem,
              toggleLoadMoreItems: this.toggleLoadMoreItems,
              eventsListener: this.eventsListener,
              setWixHeight: (() => {}),
              scrollToItem: this.scrollToItem,
              duplicateGalleryItems: this.duplicateGalleryItems,
            }}
            {...this.props.gallery}
          />
          {this.galleryInitialStateJson && (
            <div id="ssr-state-to-hydrate" style={{ display: 'none' }}>
              {this.galleryInitialStateJson}
            </div>
          )}
          <style data-key="scrollCss" key="scrollCss">
            {this.scrollCss}
          </style>
          {this.layoutCss.map((css, idx) => (
            <style data-key={`layoutCss-${idx}`} key={`layoutCss-${idx}`}>
              {css}
            </style>
          ))}
          {ssrDisableTransition && <style>{ssrDisableTransition}</style>}
        </div>
      </GalleryProvider>
    );
  }
}

export default GalleryContainer;
