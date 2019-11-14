import React from 'react';
import GalleryView from './galleryView';
import SlideshowView from './slideshowView';
import { addLayoutStyles } from '../helpers/layoutHelper';
import { ItemsHelper } from '../helpers/itemsHelper';
import dimensionsHelper from '../helpers/dimensionsHelper';
import { scrollToItemImp } from '../helpers/scrollHelper';
import window from '../../common/window/windowWrapper';
import ScrollIndicator from './galleryScrollIndicator';
import { Layouter } from 'pro-layouts';
import { cssScrollHelper } from '../helpers/cssScrollHelper.js';
import { createCssLayouts } from '../helpers/cssLayoutsHelper.js';
import utils from '../../common/utils';
import { isEditMode, isSEOMode } from '../../common/window/viewModeWrapper';
import EVENTS from '../../common/constants/events';
import VideoScrollHelper from '../helpers/videoScrollHelper.js';
import { URL_TYPES, URL_SIZES } from '../../common/constants/urlTypes';
import checkNewGalleryProps from './helpers/isNew';

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
      gotFirstScrollEvent: false,
      playingVideoIdx: -1,
      nextVideoIdx: -1,
      viewComponent: null
    };

    this.state = initialState;

    this.items = [];
    this.itemsDimensions = {};
    this.preloadedItems = {};
    this.layoutCss = [];
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
    this.scrollToItem(this.props.currentIdx, false, true, 0);
    const onGalleryCreated = () => {
      this.getMoreItemsIfNeeded(0);
      this.handleNewGalleryStructure();
      this.eventsListener(EVENTS.APP_LOADED, {});
    };
    const galleryState = this.reCreateGalleryExpensively(this.props);
    if (Object.keys(galleryState).length > 0) {
      utils.isVerbose() && console.warn('Pro Gallery changed after mount', utils.printableObjectsDiff(this.state, galleryState));
      this.setState(galleryState, () => {
        onGalleryCreated();
      });
    } else {
      onGalleryCreated();
    }
    this.videoScrollHelper.initializePlayState();

    this.currentHoverChangeEvent = window.document.createEvent('CustomEvent'); // MUST be 'CustomEvent'
    this.currentHoverChangeEvent.initCustomEvent('current_hover_change', false, false, null);
    if (this.props.galleryId) {
      this.currentHoverChangeEvent.galleryId = this.props.galleryId;
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.currentHoverChangeEvent.galleryId && nextProps.galleryId) {
      this.currentHoverChangeEvent.galleryId = nextProps.galleryId;
    }
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
      // this.reCreateGalleryTimer = setTimeout(reCreateGallery, 1000);
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

    const debouncedReCreateGallery = utils.debounce(() => {
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
    }, 500);

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
            debouncedReCreateGallery();
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
    const styleParams = this.state.styles;
    const numOfItems = this.items.length;
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
          showMoreContainerHeight);
    }

    const onGalleryChangeData = {
      numOfItems,
      container,
      styleParams,
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

  reCreateGalleryFromState({ items, styles, container, gotFirstScrollEvent }) {

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

  createCssLayoutsIfNeeded(layoutParams, isApproximateWidth = false) {
    this.layoutCss = createCssLayouts({
      layoutParams,
      isApproximateWidth,
      isMobile: utils.isMobile(),
      galleryDomId: this.props.domId,
      galleryItems: isApproximateWidth? null : this.galleryStructure.galleryItems,
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

    let _styles, _container;

    const isNew = checkNewGalleryProps(
      { items, styles, container, watermarkData, itemsDimensions },
      {...state, items: this.items},
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
      this.items = this.items.map((item,index) =>
      {
        const metaData = Object.assign(
          {},
          items[index].metaData,
          );
        return Object.assign(item, {metaData}, { ...this.itemsDimensions[item.itemId] })
      }
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
        dimensionsHelper.getGalleryDimensions(),
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

      const isApproximateWidth = dimensionsHelper.isUnknownWidth() && !_styles.oneRow; //FAKE SSR
      this.createCssLayoutsIfNeeded(layoutParams, isApproximateWidth, isNew);

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

  scrollToItem(itemIdx, fixedScroll, isManual, durationInMS = 0, scrollMarginCorrection) {
    if (itemIdx >= 0) {
      const scrollingElement = this._scrollingElement;
      const horizontalElement = scrollingElement.horizontal();
      return scrollToItemImp({
        scrollMarginCorrection,
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
        items,
        isUnknownWidth: dimensionsHelper.isUnknownWidth(),
        styleParams,
        galleryDomId,
        allowPreloading,
      });
    } else {
      return [];
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
      this.currentHoverChangeEvent.currentHoverIdx = eventData;
      window.dispatchEvent(this.currentHoverChangeEvent);
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

    const ViewComponent = this.state.styles.oneRow ? SlideshowView : GalleryView;

    if (utils.isVerbose()) {
      console.count('PROGALLERY [COUNTS] - GalleryContainer (render)');
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
          isUnknownWidth={dimensionsHelper.isUnknownWidth()}
          scrollingElement={this._scrollingElement}
          totalItemsCount={this.props.totalItemsCount} //the items passed in the props might not be all the items
          renderedItemsCount={this.props.renderedItemsCount}
          items={this.items}
          itemsLoveData={this.props.itemsLoveData}
          galleryStructure={this.galleryStructure}
          styleParams={this.state.styles}
          container={this.state.container}
          watermark={this.props.watermarkData}
          settings={this.props.settings}
          gotScrollEvent={true}
          scroll={{}} //todo: remove after refactor is 100%
          displayShowMore={displayShowMore}
          domId={this.props.domId}
          currentIdx={this.props.currentIdx || 0}
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
        {/* {console.log('scrollCss', this.scrollCss)} */}
        <div data-key="items-styles" key="items-styles" style={{display: 'none'}}>
          {this.layoutCss.map((css, idx) => (
            <style data-key={`layoutCss-${idx}`} key={`layoutCss-${idx}`}>
              {css}
            </style>
          ))}
          {(this.scrollCss || []).map((scrollCss, idx) => (
            <style data-key={`scrollCss_${idx}`} key={`scrollCss_${idx}`}>{scrollCss}</style>
          ))}
          {ssrDisableTransition && <style>{ssrDisableTransition}</style>}
        </div>
      </div>
    );
  }
}

export default GalleryContainer;
