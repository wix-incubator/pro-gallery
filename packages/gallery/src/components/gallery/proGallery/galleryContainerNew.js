import { Layouter } from 'pro-layouts';
import { GALLERY_CONSTS, dimensionsHelper, ItemsHelper, window, utils, isEditMode, isPrerenderMode, isSEOMode, isPreviewMode, isSiteMode } from 'pro-gallery-lib';
import React from 'react';
import GalleryView from './galleryView';
import SlideshowView from './slideshowView';
import addLayoutStyles from '../../helpers/layoutHelper';
import { scrollToItemImp, scrollToGroupImp } from '../../helpers/scrollHelper';
import ScrollIndicator from './galleryScrollIndicator';
import { cssScrollHelper } from '../../helpers/cssScrollHelper.js';
import { createCssLayouts } from '../../helpers/cssLayoutsHelper.js';
import checkNewGalleryProps from '../../helpers/isNew';
import VideoScrollHelperWrapper from '../../helpers/videoScrollHelperWrapper.js'

export class GalleryContainer extends React.Component {
  constructor(props) {
    super(props);
    if (utils.isVerbose()) {
      console.count('[OOISSR] galleryContainerNew constructor', window.isMock);
    }
    this.getMoreItemsIfNeeded = this.getMoreItemsIfNeeded.bind(this);
    this.setGotFirstScrollIfNeeded = this.setGotFirstScrollIfNeeded.bind(this);
    this.toggleLoadMoreItems = this.toggleLoadMoreItems.bind(this);
    this.scrollToItem = this.scrollToItem.bind(this);
    this.scrollToGroup = this.scrollToGroup.bind(this);
    this._scrollingElement = this.getScrollingElement();
    this.duplicateGalleryItems = this.duplicateGalleryItems.bind(this);
    this.eventsListener = this.eventsListener.bind(this);
    this.onGalleryScroll = this.onGalleryScroll.bind(this);
    this.setPlayingIdxState = this.setPlayingIdxState.bind(this);
    this.getVisibleItems = this.getVisibleItems.bind(this);

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
    this.videoScrollHelper = new VideoScrollHelperWrapper(this.setPlayingIdxState);

    this.items = [];
    this.itemsDimensions = {};
    this.preloadedItems = {};
    this.layoutCss = [];
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
        const galleryState = this.reCreateGalleryExpensively(props);
        if (Object.keys(galleryState).length > 0) {
          this.initialGalleryState = galleryState;
        }
      }
    }

    this.state = {
      ...initialState,
      ...this.initialGalleryState,
    };
  }

  getVisibleItems(items, container) {
    const { gotFirstScrollEvent } = this.state;
    const scrollY = window.scrollY;
    const {galleryHeight, scrollBase, galleryWidth} = container;
    if(isSEOMode() || utils.isSSR() || gotFirstScrollEvent || !isSiteMode() || scrollY > 0 || this.props.currentIdx > 0) {
      return items;
    }
    let visibleItems = items;
    try {
      const windowHeight = window.innerHeight;
      const isInfinite = this.isVerticalGallery() && this.containerInfiniteGrowthDirection() === 'vertical';
      const galleryBottom = isInfinite ? Infinity : (scrollBase + galleryHeight);
      const windowBottom = scrollY + windowHeight;
      const maxItemTop = Math.min(galleryBottom, windowBottom) - scrollBase;
      if(maxItemTop < 0) { //gallery is below the fold
        visibleItems =  [];
      } else if(this.isVerticalGallery()) {
        visibleItems = items.filter(item => item.offset.top <= maxItemTop);
      } else {
        visibleItems = items.filter(item => item.left <= galleryWidth + 20);
      }
      if(visibleItems.length < 2 && visibleItems.length < items.length) {
        //dont render less then 2 items (otherwise slide show Arrow will be removed)
        visibleItems = items.slice(0,2);
      }
    } catch (e) {
      visibleItems = items;
    }
    return visibleItems;
  }


  componentDidMount() {
    this.loadItemsDimensionsIfNeeded();
    this.scrollToItem(this.props.currentIdx, false, true, 0);
    this.handleNewGalleryStructure();
    this.eventsListener(GALLERY_CONSTS.events.APP_LOADED, {});
    this.getMoreItemsIfNeeded(0);
    this.videoScrollHelper.initializePlayState();

    try {
      if (typeof window.CustomEvent === 'function') {
        this.currentHoverChangeEvent = new CustomEvent('current_hover_change');
      } else { //IE (new CustomEvent is not supported in IE)
        this.currentHoverChangeEvent = window.document.createEvent('CustomEvent'); // MUST be 'CustomEvent'
        this.currentHoverChangeEvent.initCustomEvent('current_hover_change', false, false, null);
      }
    } catch (e) {
      console.error('could not create \'current_hover_change\' customEvent. Error =', e);
    }

    if (this.props.domId) {
      this.currentHoverChangeEvent.domId = this.props.domId;
    }
  }

  componentWillReceiveProps(nextProps) {
    this.getMoreItemsIfNeeded(0);
    if (!this.currentHoverChangeEvent.domId && nextProps.domId) {
      this.currentHoverChangeEvent.domId = nextProps.domId;
    }
    if (this.props.currentIdx !== nextProps.currentIdx) {
      this.scrollToItem(nextProps.currentIdx, false, true, 0);
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
      if (utils.isVerbose() && hasPropsChanged) {
        console.log(
          'New props arrived',
          utils.printableObjectsDiff(currentSignificatProps, nextSignificatProps),
        );
      }
    } catch (e) {
      console.error('Cannot compare props', e);
    }

    if (hasPropsChanged) {
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
            GALLERY_CONSTS.urlSizes.PRELOAD,
            GALLERY_CONSTS.urlTypes.LOW_RES,
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
    this.eventsListener(GALLERY_CONSTS.events.GALLERY_CHANGE, onGalleryChangeData);

    if (needToHandleShowMoreClick) {
      this.setState({ needToHandleShowMoreClick: false });
    }
  }

  reCreateGalleryFromState({ items, styles, container }) {

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
      thumbnailSize: styles.thumbnailSize,
      sharpParams: styles.sharpParams,
      resizeMediaUrl: this.props.resizeMediaUrl,
    });
    this.videoScrollHelper.updateGalleryStructure({
      galleryStructure: this.galleryStructure,
      scrollBase: container.scrollBase,
      videoPlay: styles.videoPlay,
      videoLoop: styles.videoLoop,
      itemClick: styles.itemClick,
      oneRow: styles.oneRow,
    }, true, this.items);

    const shouldUseScrollCss = !isSEOMode() && (isEditMode() || this.state.gotFirstScrollEvent|| this.state.showMoreClickedAtLeastOnce);
    if (shouldUseScrollCss) {
      this.getScrollCss({
        domId: this.props.domId,
        items: this.galleryStructure.galleryItems,
        styleParams: styles,
      });
    }
    this.createCssLayoutsIfNeeded(layoutParams);
  }

  createCssLayoutsIfNeeded(layoutParams) {
    const {settings = {}} = this.props;
    const {avoidInlineStyles = true} = settings;
    if (avoidInlineStyles) {
      // inline styles are replacing the layoutCss
      // avoid inline styles === use layout css
      this.layoutCss = createCssLayouts({
        layoutParams,
        isMobile: utils.isMobile(),
        domId: this.props.domId,
        galleryItems: this.galleryStructure.galleryItems,
      });
    }
  }

  reCreateGalleryExpensively(
    { items, styles, container, watermarkData, itemsDimensions, customInfoRenderer },
    curState,
  ) {
    if (utils.isVerbose()) {
      console.count('PROGALLERY [COUNT] reCreateGalleryExpensively');
      console.time('PROGALLERY [TIME] reCreateGalleryExpensively');
    }

    const state = curState || this.state || {};

    let _styles, _container;
    const customExternalInfoRendererExists = !!customInfoRenderer;
    const stylesWithLayoutStyles = styles && addLayoutStyles(styles, customExternalInfoRendererExists);

    const isNew = checkNewGalleryProps(
      { items, styles: stylesWithLayoutStyles, container, watermarkData, itemsDimensions },
      { ...state, items: this.items },
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
      this.items = this.items.map((item, index) => {
        const metaData = Object.assign(
          {},
          items[index].metaData,
        );
        return Object.assign(item, { metaData }, { ...this.itemsDimensions[item.itemId] })
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

      _styles = addLayoutStyles(styles, customExternalInfoRendererExists);
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
        thumbnailSize: styles.thumbnailSize,
        resizeMediaUrl: this.props.resizeMediaUrl,
        lastVisibleItemIdx: this.lastVisibleItemIdx,
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

      const scrollHelperNewGalleryStructure = {
        galleryStructure: this.galleryStructure,
        scrollBase: _container.scrollBase,
        videoPlay: _styles.videoPlay,
        itemClick: _styles.itemClick,
        oneRow: _styles.oneRow,
        cb: this.setPlayingIdxState,
      }

      this.videoScrollHelper.updateGalleryStructure(scrollHelperNewGalleryStructure, (!utils.isSSR() && (isNew.addedItems || isNew.items)), this.items);

      if (isNew.items) {
        this.loadItemsDimensionsIfNeeded();
      }

      this.createCssLayoutsIfNeeded(layoutParams);

      const shouldUseScrollCss = !isSEOMode() && (isEditMode() || this.state.gotFirstScrollEvent|| this.state.showMoreClickedAtLeastOnce);
      if (shouldUseScrollCss) {
        this.getScrollCss({
          domId: this.props.domId,
          items: this.galleryStructure.galleryItems,
          styleParams: _styles,
        });
      }
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
      try {
        const scrollParams = {
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
        };
        return scrollToItemImp(scrollParams);
      } catch (e) {
        //added console.error to debug sentry error 'Cannot read property 'isRTL' of undefined in pro-gallery-statics'
        console.error('error:', e, ' pro-gallery, scrollToItem, cannot get scrollParams, ',
          'isEditMode =', isEditMode(),
          ' isPreviewMode =', isPreviewMode(),
          ' isSiteMode =', isSiteMode(),
          ' this.state.styles =', this.state.styles,
          ' this.state.container =', this.state.container,
          ' this.galleryStructure =', this.galleryStructure
        );
      }

    }
  }
  scrollToGroup(groupIdx, fixedScroll, isManual, durationInMS = 0, scrollMarginCorrection) {
    if (groupIdx >= 0) {
      const scrollingElement = this._scrollingElement;
      const horizontalElement = scrollingElement.horizontal();
      try {
        const scrollParams = {
          scrollMarginCorrection,
          isRTL: this.state.styles.isRTL,
          oneRow: this.state.styles.oneRow,
          galleryWidth: this.state.container.galleryWidth,
          galleryHeight: this.state.container.galleryHeight,
          top: 0,
          groups: this.galleryStructure.groups,
          totalWidth: this.galleryStructure.width,
          groupIdx,
          fixedScroll,
          isManual,
          scrollingElement,
          horizontalElement,
          durationInMS,
        };
        return scrollToGroupImp(scrollParams);
      } catch (e) {
        //added console.error to debug sentry error 'Cannot read property 'isRTL' of undefined in pro-gallery-statics'
        console.error('error:', e, ' pro-gallery, scrollToGroup, cannot get scrollParams, ',
          'isEditMode =', isEditMode(),
          ' isPreviewMode =', isPreviewMode(),
          ' isSiteMode =', isSiteMode(),
          ' this.state.styles =', this.state.styles,
          ' this.state.container =', this.state.container,
          ' this.galleryStructure =', this.galleryStructure
        );
      }

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

  getScrollCss({ domId, items, styleParams }) {
    this.scrollCss = cssScrollHelper.calcScrollCss({
      items,
      styleParams,
      domId,
    });
  }

  toggleLoadMoreItems() {
    this.eventsListener(
      GALLERY_CONSTS.events.LOAD_MORE_CLICKED,
      this.galleryStructure.galleryItems,
    );
    const showMoreClickedAtLeastOnce = true;
    const needToHandleShowMoreClick = true;
    //before clicking "load more" at the first time
    if (!this.state.showMoreClickedAtLeastOnce) {
      this.getScrollCss({
        domId: this.props.domId,
        items: this.galleryStructure.galleryItems,
        styleParams: this.state.styles,
      });
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

  setGotFirstScrollIfNeeded() {
    if (!this.state.gotFirstScrollEvent) {
      this.getScrollCss({
        domId: this.props.domId,
        items: this.galleryStructure.galleryItems,
        styleParams: this.state.styles,
      });
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

  eventsListener(eventName, eventData, event) {
    this.videoScrollHelper.handleEvent({
      eventName,
      eventData,
    });
    if (eventName === GALLERY_CONSTS.events.HOVER_SET) {
      this.currentHoverChangeEvent.currentHoverIdx = eventData;
      window.dispatchEvent(this.currentHoverChangeEvent);
    }
    if (typeof this.props.eventsListener === 'function') {
      this.props.eventsListener(eventName, eventData, event);
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

      const galleryEnd = this.galleryStructure[oneRow ? 'width' : 'height'] + (oneRow ? 0 : this.state.container.scrollBase);
      const screenSize = window.screen[oneRow ? 'width' : 'height'];
      const scrollEnd = scrollPos + screenSize;
      const getItemsDistance = scrollPos ? 3 * screenSize : 0; //first scrollPos is 0 falsy. dont load before a scroll happened.

      // console.log('[RTL SCROLL] getMoreItemsIfNeeded: ', scrollPos);

      //const curDistance = galleryEnd - scrollEnd;
      //if (curDistance > 0 && curDistance < getItemsDistance) {
      if (galleryEnd - scrollEnd < getItemsDistance) {
        //only when the last item turns visible we should try getting more items
        if (this.state.items.length < this.props.totalItemsCount) {
          this.gettingMoreItems = true;
          this.eventsListener(GALLERY_CONSTS.events.NEED_MORE_ITEMS, this.state.items.length);
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

  allowSSROpacity() {
    const {settings = {}} = this.props;
    const {allowSSROpacity = false} = settings;
    return isPrerenderMode() && allowSSROpacity;
  }

  isVerticalGallery() {
    return !this.state.styles.oneRow
  }

  render() {
    if (!this.canRender()) {
      return null;
    }

    const ViewComponent = this.isVerticalGallery() ? GalleryView : SlideshowView;

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
      : (() => { });
    const dynamicStyles = `
      ${utils.isSSR() && `#pro-gallery-${this.props.domId} div.pro-gallery-parent-container * { transition: none !important }`}
      ${this.allowSSROpacity() && `#pro-gallery-${this.props.domId} .gallery-item-container { opacity: 0 }`}
      ${this.props.styles.overlayBackground && `#pro-gallery-${this.props.domId} .gallery-item-hover::before { background-color: ${this.props.styles.overlayBackground} !important}`}
    `;
    return (
      <div
        data-key="pro-gallery-inner-container"
        key="pro-gallery-inner-container"
      >
        <ScrollIndicator
          domId={this.props.domId}
          oneRow={this.state.styles.oneRow}
          isRTL={this.state.styles.isRTL}
          totalWidth={this.galleryStructure.width}
          scrollBase={this.state.container.scrollBase}
          scrollingElement={this._scrollingElement}
          getMoreItemsIfNeeded={this.getMoreItemsIfNeeded}
          setGotFirstScrollIfNeeded={this.setGotFirstScrollIfNeeded}
          onScroll={this.onGalleryScroll}
        />
        <ViewComponent
          isInDisplay={this.props.isInDisplay}
          scrollingElement={this._scrollingElement}
          totalItemsCount={this.props.totalItemsCount} //the items passed in the props might not be all the items
          renderedItemsCount={this.props.renderedItemsCount}
          items={this.items}
          getVisibleItems={this.getVisibleItems}
          itemsLoveData={this.props.itemsLoveData}
          galleryStructure={this.galleryStructure}
          styleParams={this.state.styles}
          container={this.state.container}
          watermark={this.props.watermarkData}
          settings={{avoidInlineStyles: true, ...this.props.settings}}
          gotScrollEvent={true}
          scroll={{}} //todo: remove after refactor is 100%
          displayShowMore={displayShowMore}
          domId={this.props.domId}
          currentIdx={this.props.currentIdx || 0}
          customHoverRenderer={this.props.customHoverRenderer}
          customInfoRenderer={this.props.customInfoRenderer}
          customSlideshowInfoRenderer={this.props.customSlideshowInfoRenderer}
          customLoadMoreRenderer={this.props.customLoadMoreRenderer}
          playingVideoIdx={this.state.playingVideoIdx}
          nextVideoIdx={this.state.nextVideoIdx}
          noFollowForSEO={this.props.noFollowForSEO}
          proGalleryRegionLabel={this.props.proGalleryRegionLabel}
          actions={{
            ...this.props.actions,
            findNeighborItem,
            toggleLoadMoreItems: this.toggleLoadMoreItems,
            eventsListener: this.eventsListener,
            setWixHeight: (() => { }),
            scrollToItem: this.scrollToItem,
            scrollToGroup: this.scrollToGroup,
            duplicateGalleryItems: this.duplicateGalleryItems,
          }}
          {...this.props.gallery}
        />
        {this.galleryInitialStateJson && (
          <div id="ssr-state-to-hydrate" style={{ display: 'none' }}>
            {this.galleryInitialStateJson}
          </div>
        )}
        <div data-key="dynamic-styles" key="items-styles" style={{ display: 'none' }}>
          {this.layoutCss.map((css, idx) => <style data-key={`layoutCss-${idx}`} key={`layoutCss-${idx}`} dangerouslySetInnerHTML={{ __html: css }} />)}
          {(this.scrollCss || []).filter(Boolean).map((scrollCss, idx) => <style key={`scrollCss_${idx}_padded`} dangerouslySetInnerHTML={{ __html: scrollCss }} />)}
          {dynamicStyles && <style dangerouslySetInnerHTML={{__html: dynamicStyles}} />}
        </div>
      </div>
    );
  }
}

export default GalleryContainer;
