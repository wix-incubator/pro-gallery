import React from 'react';
import {
  GALLERY_CONSTS,
  window,
  utils,
  isEditMode,
  isSEOMode,
  isPreviewMode,
  isSiteMode,
  windowWrapper,
} from 'pro-gallery-lib';
import { ItemsHelper } from 'pro-layouts';
import GalleryView from './galleryView';
import SlideshowView from './slideshowView';
import {
  scrollToItemImp,
  scrollToGroupImp,
  haltScroll,
} from '../../helpers/scrollHelper';
import ScrollIndicator from './galleryScrollIndicator';
import { createCssLayouts } from '../../helpers/cssLayoutsHelper.js';
import { cssScrollHelper } from '../../helpers/cssScrollHelper.js';
import VideoScrollHelperWrapper from '../../helpers/videoScrollHelperWrapper';
import findNeighborItem from '../../helpers/layoutUtils';
import { isGalleryInViewport, Deferred } from './galleryHelpers';

export class GalleryContainer extends React.Component {
  constructor(props) {
    super(props);
    if (utils.isVerbose()) {
      console.count('[OOISSR] galleryContainer constructor', window.isMock);
    }
    this.getMoreItemsIfNeeded = this.getMoreItemsIfNeeded.bind(this);
    this.setGotFirstScrollIfNeeded = this.setGotFirstScrollIfNeeded.bind(this);
    this.toggleLoadMoreItems = this.toggleLoadMoreItems.bind(this);
    this.scrollToItem = this.scrollToItem.bind(this);
    this.scrollToGroup = this.scrollToGroup.bind(this);
    this._scrollingElement = this.getScrollingElement();
    this.eventsListener = this.eventsListener.bind(this);
    this.onGalleryScroll = this.onGalleryScroll.bind(this);
    this.setPlayingIdxState = this.setPlayingIdxState.bind(this);
    this.getVisibleItems = this.getVisibleItems.bind(this);
    this.findNeighborItem = this.findNeighborItem.bind(this);
    this.setCurrentSlideshowViewIdx =
      this.setCurrentSlideshowViewIdx.bind(this);
    this.getIsScrollLessGallery = this.getIsScrollLessGallery.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.videoScrollHelper = new VideoScrollHelperWrapper(
      this.setPlayingIdxState
    );
    const initialState = {
      scrollPosition: {
        top: 0,
        left: 0,
      },
      showMoreClickedAtLeastOnce: false,
      initialGalleryHeight: undefined,
      needToHandleShowMoreClick: false,
      gotFirstScrollEvent: props.activeIndex >= 0,
      playingVideoIdx: -1,
      viewComponent: null,
      firstUserInteractionExecuted: false,
      isInHover: false,
      isInViewport: true,
    };

    this.state = initialState;
    this.layoutCss = [];

    this.initialGalleryState = {};
    try {
      const galleryState = this.propsToState(props);
      if (Object.keys(galleryState).length > 0) {
        this.initialGalleryState = galleryState;
      }
    } catch (_e) {
      console.warn('Cannot create initial state from props', _e);
    }

    this.state = {
      ...initialState,
      ...this.initialGalleryState,
    };

    //not sure if there needs to be a handleNEwGalleryStructure here with the intial state. currently looks like not
  }
  initializeScrollPosition() {
    if (this.props.activeIndex > 0) {
      this.scrollToItem(this.props.activeIndex, false, true, 0);
      const currentItem = this.galleryStructure.items[this.props.activeIndex];
      this.onGalleryScroll(currentItem.offset);
    }
  }

  isScrollingUnavailable(height, viewportHeight) {
    const extraPadding = 300;
    if (this.isVerticalGallery()) {
      // If here then the vertical scrolling is what matters
      return height <= viewportHeight + extraPadding;
    } else {
      // If here it's the horizontal scrolling that matters
      return (
        this.state.structure.width < this.state.container.width + extraPadding
      );
    }
  }

  // This function runs if site is scroll-less => tries to fetch gallery's items, -- called from didMount only! --
  async getMoreItemsIfScrollIsDisabled(height, viewportHeight) {
    //there can be no scroll to trigger getMoreItems, but there could be more items
    if (this.isScrollingUnavailable(height, viewportHeight)) {
      const lastItemsCount = this.state.items.length;
      // Trying to get more items
      this.getMoreItemsIfNeeded(0).then(() => {
        // No need to continue calling if no items are left to fetch
        if (this.state.items.length > lastItemsCount) {
          const { body, documentElement: html } = document;
          const viewportHeight = window.innerHeight;
          const height = Math.max(
            body.scrollHeight,
            body.offsetHeight,
            html.clientHeight,
            html.scrollHeight,
            html.offsetHeight
          );
          this.getMoreItemsIfScrollIsDisabled(height, viewportHeight);
        }
      });
    }
  }

  componentDidMount() {
    windowWrapper.stopUsingMock();
    const { body, documentElement: html } = document;
    const viewportHeight = window.innerHeight;
    const height = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );
    this.initializeScrollPosition();
    this.getMoreItemsIfScrollIsDisabled(height, viewportHeight);
    this.handleNewGalleryStructure();
    this.eventsListener(GALLERY_CONSTS.events.APP_LOADED, {});
    this.videoScrollHelper.initializePlayState();

    try {
      if (typeof window.CustomEvent === 'function') {
        this.currentHoverChangeEvent = new CustomEvent('current_hover_change');
      } else {
        //IE (new CustomEvent is not supported in IE)
        this.currentHoverChangeEvent =
          window.document.createEvent('CustomEvent'); // MUST be 'CustomEvent'
        this.currentHoverChangeEvent.initCustomEvent(
          'current_hover_change',
          false,
          false,
          null
        );
      }
    } catch (e) {
      console.error(
        "could not create 'current_hover_change' customEvent. Error =",
        e
      );
    }

    if (this.props.id) {
      this.currentHoverChangeEvent.galleryId = this.props.id;
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!this.currentHoverChangeEvent.galleryId && nextProps.id) {
      this.currentHoverChangeEvent.galleryId = nextProps.id;
    }
    if (
      this.props.activeIndex !== nextProps.activeIndex &&
      nextProps.activeIndex !== this.currentSlideshowViewIdx
    ) {
      this.scrollToItem(nextProps.activeIndex, false, true, 0);
    }

    const reCreateGallery = () => {
      const galleryState = this.propsToState(nextProps);
      if (Object.keys(galleryState).length > 0) {
        this.setState(galleryState, this.handleNewGalleryStructure);
      }
    };

    const getSignificantProps = (props) => {
      const { id, options, container, items, isInDisplay, isPrerenderMode } =
        props;
      return { id, options, container, items, isInDisplay, isPrerenderMode };
    };

    if (this.reCreateGalleryTimer) {
      clearTimeout(this.reCreateGalleryTimer);
    }

    let hasPropsChanged = true;
    try {
      const currentSignificantProps = getSignificantProps(this.props);
      const nextSignificantProps = getSignificantProps(nextProps);
      hasPropsChanged =
        JSON.stringify(currentSignificantProps) !==
        JSON.stringify(nextSignificantProps);
      if (utils.isVerbose() && hasPropsChanged) {
        console.log(
          'New props arrived',
          utils.printableObjectsDiff(
            currentSignificantProps,
            nextSignificantProps
          )
        );
      }
    } catch (e) {
      console.error('Cannot compare props', e);
    }

    if (hasPropsChanged) {
      reCreateGallery();
      if (this.props.isInDisplay !== nextProps.isInDisplay) {
        this.handleNavigation(nextProps.isInDisplay);
      }
    } else {
      //this is a hack, because in fullwidth, new props arrive without any changes
      // this.reCreateGalleryTimer = setTimeout(reCreateGallery, 1000);
    }
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
    const { container, needToHandleShowMoreClick, initialGalleryHeight } =
      this.state;
    const isInfinite = this.containerInfiniteGrowthDirection() === 'vertical';
    let updatedHeight = false;
    const needToUpdateHeightNotInfinite =
      !isInfinite && needToHandleShowMoreClick;
    if (needToUpdateHeightNotInfinite) {
      const showMoreContainerHeight = 138; //according to the scss
      updatedHeight =
        container.height + (initialGalleryHeight - showMoreContainerHeight);
    }
    const options = this.props.options;
    const numOfItems = this.state.items.length;
    const layoutHeight = updatedHeight || this.props.container.height;
    const layoutItems = this.props.structure.items;
    const isFixedHorizontlaGalleryRatio =
      this.containerInfiniteGrowthDirection() === 'horizontal' &&
      this.state.options.layoutParams.structure.galleryRatio.value > 0;

    const onGalleryChangeData = {
      numOfItems,
      container,
      options,
      layoutHeight,
      layoutItems,
      isInfinite,
      isFixedHorizontlaGalleryRatio,
      updatedHeight,
    };
    if (utils.isVerbose()) {
      console.log('handleNewGalleryStructure', onGalleryChangeData);
    }
    this.eventsListener(
      GALLERY_CONSTS.events.GALLERY_CHANGE,
      onGalleryChangeData
    );

    if (needToHandleShowMoreClick) {
      this.setState({ needToHandleShowMoreClick: false });
    }
  }

  isVerticalGallery() {
    return (
      this.state.options.scrollDirection ===
      GALLERY_CONSTS.scrollDirection.VERTICAL
    );
  }

  getIsScrollLessGallery(options) {
    const { scrollDirection, slideAnimation } = options;
    return (
      scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL &&
      slideAnimation !== GALLERY_CONSTS.slideAnimations.SCROLL
    );
  }

  getVisibleItems(items, container, isPrerenderMode) {
    const { gotFirstScrollEvent } = this.state;
    const scrollY = this.state?.scrollPosition?.top || 0;
    const { galleryHeight, scrollBase, galleryWidth } = container;
    if (
      isPrerenderMode || // (used to be isSSR, had a hydrate bug, isPrerenderMode is the way to go in terms of hydrate issues)
      isSEOMode() ||
      isEditMode() ||
      gotFirstScrollEvent ||
      scrollY > 0 || // Can be an inner container with its own scroll
      window.scrollY > 0 ||
      isPreviewMode() ||
      this.props.activeIndex > 0
    ) {
      return items;
    }

    let visibleItems = items;
    try {
      const windowHeight = window.innerHeight;
      const isInfinite =
        this.isVerticalGallery() &&
        this.containerInfiniteGrowthDirection() === 'vertical';
      const galleryBottom = isInfinite ? Infinity : scrollBase + galleryHeight;
      const windowBottom = scrollY + windowHeight;
      const maxItemTop = Math.min(galleryBottom, windowBottom) - scrollBase;
      if (maxItemTop < 0) {
        //gallery is below the fold
        visibleItems = [];
      } else if (this.isVerticalGallery()) {
        visibleItems = items.filter((item) => item.offset.top < maxItemTop);
      } else {
        visibleItems = items.filter((item) => item.left <= galleryWidth + 20);
      }
      if (visibleItems.length < 2 && visibleItems.length < items.length) {
        //dont render less then 2 items (otherwise slide show Arrow will be removed)
        visibleItems = items.slice(0, 2);
      }
    } catch (e) {
      console.error(
        'Could not calculate visible items, returning original items',
        e
      );
      visibleItems = items;
    }
    return visibleItems;
  }

  propsToState({
    items,
    options,
    structure,
    container,
    id,
    createMediaUrl,
    isPrerenderMode,
  }) {
    items = items || this.props.items;
    options = options || this.props.options;
    container = container || this.props.container;
    structure = structure || this.props.structure;
    id = id || this.props.id;
    createMediaUrl = createMediaUrl || this.props.createMediaUrl;

    this.galleryStructure = ItemsHelper.convertToGalleryItems(structure, {
      // TODO use same objects in the memory when the galleryItems are changed
      thumbnailSize: options.thumbnailSize,
      sharpParams: options.sharpParams,
      createMediaUrl,
    });

    // // ------------ TODO. This is using GalleryItem and I am leaving it here for now ---------- //

    const shouldUseScrollCss =
      !isSEOMode() &&
      (isEditMode() ||
        this.state.gotFirstScrollEvent ||
        this.state.showMoreClickedAtLeastOnce);
    if (shouldUseScrollCss) {
      this.getScrollCss({
        id,
        items: this.galleryStructure.galleryItems,
        options,
        container: container,
      });
    }
    const scrollHelperNewGalleryStructure = {
      galleryStructure: this.galleryStructure,
      galleryWidth: container.galleryWidth,
      scrollBase: container.scrollBase,
      videoPlay: options.videoPlay,
      videoLoop: options.videoLoop,
      itemClick: options.itemClick,
      scrollDirection: options.scrollDirection,
      cb: this.setPlayingIdxState,
    };

    this.videoScrollHelper.updateGalleryStructure(
      scrollHelperNewGalleryStructure,
      !utils.isSSR(),
      items
    );

    const layoutParams = {
      items: items,
      container,
      styleParams: options,
      gotScrollEvent: true,
      options: {
        showAllItems: true,
        skipVisibilitiesCalc: true,
        useLayoutStore: false,
        createLayoutOnInit: false,
      },
    };

    this.createCssLayoutsIfNeeded(layoutParams);
    this.createDynamicStyles(options, isPrerenderMode);

    const newState = {
      items,
      options,
      container,
      structure,
    };
    return newState;
  }

  getScrollingElement() {
    const horizontal = () =>
      window.document.querySelector(
        `#pro-gallery-${this.props.id} #gallery-horizontal-scroll-${this.props.id}`
      );
    const vertical = this.props.scrollingElement
      ? () => this.props.scrollingElement
      : () => window;
    return { vertical, horizontal };
  }

  scrollToItem(
    itemIdx,
    fixedScroll,
    isManual,
    durationInMS = 0,
    scrollMarginCorrection,
    isContinuousScrolling = false
  ) {
    if (itemIdx >= 0) {
      if (!this.state.gotFirstScrollEvent) {
        this.setState({
          gotFirstScrollEvent: true,
        });
      }
      if (this.getIsScrollLessGallery(this.state.options)) {
        return;
      }
      const scrollingElement = this._scrollingElement;
      const horizontalElement = scrollingElement.horizontal();
      try {
        const scrollParams = {
          scrollMarginCorrection,
          isRTL: this.state.options.isRTL,
          scrollDirection: this.state.options.scrollDirection,
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
          slideTransition: this.state.options.slideTransition,
          isContinuousScrolling,
          autoSlideshowContinuousSpeed:
            this.state.options.autoSlideshowContinuousSpeed,
          imageMargin: this.state.options.imageMargin,
        };
        this.currentScrollData = scrollToItemImp(scrollParams);
        return this.currentScrollData.scrollDeffered.promise.then(() => {
          this.currentScrollData = null;
        });
      } catch (e) {
        //added console.error to debug sentry error 'Cannot read property 'isRTL' of undefined in pro-gallery-statics'
        console.error(
          'error:',
          e,
          ' pro-gallery, scrollToItem, cannot get scrollParams, ',
          'isEditMode =',
          isEditMode(),
          ' isPreviewMode =',
          isPreviewMode(),
          ' isSiteMode =',
          isSiteMode(),
          ' this.state.options =',
          this.state.options,
          ' this.state.container =',
          this.state.container,
          ' this.galleryStructure =',
          this.galleryStructure
        );
      }
    }
  }
  scrollToGroup(
    groupIdx,
    fixedScroll,
    isManual,
    durationInMS = 0,
    scrollMarginCorrection,
    isContinuousScrolling = false
  ) {
    if (groupIdx >= 0) {
      const scrollingElement = this._scrollingElement;
      const horizontalElement = scrollingElement.horizontal();
      try {
        const scrollParams = {
          scrollMarginCorrection,
          isRTL: this.state.options.isRTL,
          scrollDirection: this.state.options.scrollDirection,
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
          slideTransition: this.state.options.slideTransition,
          isContinuousScrolling,
          autoSlideshowContinuousSpeed:
            this.state.options.autoSlideshowContinuousSpeed,
          imageMargin: this.state.options.imageMargin,
        };
        this.currentScrollData = scrollToGroupImp(scrollParams);
        return this.currentScrollData.scrollDeffered.promise.then(() => {
          this.currentScrollData = null;
        });
      } catch (e) {
        //added console.error to debug sentry error 'Cannot read property 'isRTL' of undefined in pro-gallery-statics'
        console.error(
          'error:',
          e,
          ' pro-gallery, scrollToGroup, cannot get scrollParams, ',
          'isEditMode =',
          isEditMode(),
          ' isPreviewMode =',
          isPreviewMode(),
          ' isSiteMode =',
          isSiteMode(),
          ' this.state.options =',
          this.state.options,
          ' this.state.container =',
          this.state.container,
          ' this.galleryStructure =',
          this.galleryStructure
        );
      }
    }
  }

  containerInfiniteGrowthDirection(options = false) {
    const _options = options || this.props.options;
    // return the direction in which the gallery can grow on it's own (aka infinite scroll)
    const { enableInfiniteScroll } = this.props.options; //TODO - props or "raw" options
    const { showMoreClickedAtLeastOnce } = this.state;
    const { scrollDirection, loadMoreAmount } = _options;
    if (scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL) {
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

  setPlayingIdxState(playingVideoIdx) {
    this.setState({
      playingVideoIdx,
    });
  }

  onGalleryScroll(scrollPosition) {
    if (this.props.isInDisplay) {
      this.eventsListener(
        GALLERY_CONSTS.events.GALLERY_SCROLLED,
        scrollPosition
      );
    }
  }

  updateVisibility = () => {
    const isInViewport = isGalleryInViewport({
      container: this.props.container,
      scrollTop: this.state.scrollPosition.top,
    });
    if (this.state.isInViewport !== isInViewport) {
      this.setState({
        isInViewport,
      });
    }
  };
  setVisibilityIfNeeded = (prevProps, prevState) => {
    const { container } = this.props;
    const { scrollPosition } = this.state;
    if (
      container.scrollBase !== prevProps.container.scrollBase ||
      scrollPosition.top !== prevState.scrollPosition.top
    ) {
      this.updateVisibility();
    }
  };
  componentDidUpdate(prevProps, prevState) {
    // in order to update when container is available
    this.setVisibilityIfNeeded(prevProps, prevState);
    if (this.props.isPrerenderMode !== prevProps.isPrerenderMode) {
      const { body, documentElement: html } = document;
      const viewportHeight = window.innerHeight;
      const height = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight
      );
      this.getMoreItemsIfScrollIsDisabled(height, viewportHeight);
    }
  }

  createDynamicStyles({ overlayBackground }, isPrerenderMode) {
    const useSSROpacity =
      isPrerenderMode && !this.props.settings.disableSSROpacity;
    this.dynamicStyles = `
      ${
        !useSSROpacity
          ? ''
          : `#pro-gallery-${this.props.id} .gallery-item-container { opacity: 0 }`
      }
      ${
        !overlayBackground
          ? ''
          : `#pro-gallery-${this.props.id} .gallery-item-hover::before { background: ${overlayBackground} !important}`
      }
    `.trim();
  }

  createCssLayoutsIfNeeded(layoutParams) {
    const { settings = {} } = this.props;
    const { avoidInlineStyles } = settings;
    if (avoidInlineStyles) {
      this.layoutCss = createCssLayouts({
        layoutParams,
        isMobile: utils.isMobile(),
        id: this.props.id,
        galleryItems: this.galleryStructure.galleryItems,
      });
    }
  }

  getScrollCss({ id, items, options, container }) {
    this.scrollCss = cssScrollHelper.calcScrollCss({
      items,
      options,
      id,
      container,
    });
  }

  toggleLoadMoreItems() {
    this.eventsListener(
      GALLERY_CONSTS.events.LOAD_MORE_CLICKED,
      this.galleryStructure.galleryItems
    );
    const showMoreClickedAtLeastOnce = true;
    const needToHandleShowMoreClick = true;
    //before clicking "load more" at the first time
    if (!this.state.showMoreClickedAtLeastOnce) {
      this.getScrollCss({
        id: this.props.id,
        items: this.galleryStructure.galleryItems,
        options: this.state.options,
        container: this.state.container,
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
        }
      );
    } else {
      //from second click
      this.setState(
        {
          needToHandleShowMoreClick,
        },
        () => {
          this.handleNewGalleryStructure();
        }
      );
    }
  }

  setGotFirstScrollIfNeeded() {
    if (!this.state.gotFirstScrollEvent) {
      this.getScrollCss({
        id: this.props.id,
        items: this.galleryStructure.galleryItems,
        options: this.state.options,
        container: this.state.container,
      });
      this.setState({
        gotFirstScrollEvent: true,
      });
    }
  }

  setCurrentSlideshowViewIdx(idx) {
    this.currentSlideshowViewIdx = idx;
  }

  simulateHorizontalScrollToItem(item) {
    item?.offset && this.onGalleryScroll({ left: item.offset.left });
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
    if (eventName === GALLERY_CONSTS.events.CURRENT_ITEM_CHANGED) {
      this.setCurrentSlideshowViewIdx(eventData.idx);
      if (
        this.getIsScrollLessGallery(this.state.options) &&
        this.state.firstUserInteractionExecuted
      ) {
        this.simulateHorizontalScrollToItem(
          this.galleryStructure.items[eventData.idx]
        );
      }
    }
    if (!this.state.firstUserInteractionExecuted) {
      switch (eventName) {
        case GALLERY_CONSTS.events.HOVER_SET:
        case GALLERY_CONSTS.events.LOAD_MORE_CLICKED:
        case GALLERY_CONSTS.events.ITEM_ACTION_TRIGGERED:
        case GALLERY_CONSTS.events.ITEM_CLICKED:
          this.setState({ firstUserInteractionExecuted: true });
          break;
      }
    }
    if (typeof this.props.eventsListener === 'function') {
      switch (eventName) {
        case GALLERY_CONSTS.events.ITEM_ACTION_TRIGGERED:
        case GALLERY_CONSTS.events.ITEM_CLICKED:
          setTimeout(() => {
            this.props.eventsListener(eventName, eventData, event);
          }, 0);
          break;
        default:
          this.props.eventsListener(eventName, eventData, event);
      }
    }

    if (eventName === GALLERY_CONSTS.events.GALLERY_SCROLLED) {
      this.videoScrollHelper.trigger.SCROLL(eventData);
      const newScrollPosition = {
        ...this.state.scrollPosition,
        ...eventData,
      };
      this.setState({ scrollPosition: newScrollPosition });
    }
  }

  getMoreItemsIfNeeded(scrollPos) {
    if (this.deferredGettingMoreItems?.isPending) {
      // Already getting more items so do nothing
    } else {
      this.deferredGettingMoreItems = new Deferred();

      if (
        !(
          this.galleryStructure &&
          this.galleryStructure.galleryItems &&
          this.galleryStructure.galleryItems.length > 0 &&
          this.state.items &&
          this.state.options &&
          this.state.container
        )
      ) {
        // No items are fetched -> reject
        this.deferredGettingMoreItems.reject();
      } else {
        //more items can be fetched from the server
        //TODO - add support for horizontal galleries
        const { scrollDirection } = this.state.options;
        const galleryEnd =
          this.galleryStructure[
            scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL
              ? 'width'
              : 'height'
          ] +
          (scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL
            ? 0
            : this.state.container.scrollBase);
        const screenSize =
          window[
            scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL
              ? 'innerWidth'
              : 'innerHeight'
          ];
        const scrollEnd = scrollPos + screenSize;
        const getItemsDistance = scrollPos ? 3 * screenSize : 0; //first scrollPos is 0 falsy. dont load before a scroll happened.
        if (galleryEnd < getItemsDistance + scrollEnd) {
          //only when the last item turns visible we should try getting more items
          this.eventsListener(
            GALLERY_CONSTS.events.NEED_MORE_ITEMS,
            this.state.items.length
          );
          setTimeout(() => {
            //wait a bit before allowing more items to be fetched - ugly hack before promises still not working
            this.deferredGettingMoreItems.resolve();
          }, 2000);
        } else {
          // No items are fetched -> reject
          this.deferredGettingMoreItems.reject();
        }
      }
    }
    return this.deferredGettingMoreItems.promise.catch(() => {});
  }

  canRender() {
    const can = this.props.container && this.props.options && this.state.items;
    if (!can && utils.isVerbose()) {
      console.log(
        'PROGALLERY [CAN_RENDER] GalleryContainer',
        can,
        this.props.container,
        this.props.options,
        this.state.items
      );
    }
    return can;
  }

  onMouseEnter() {
    if (
      this.currentScrollData?.isContinuousScrolling &&
      this.state.options.pauseAutoSlideshowOnHover
    ) {
      haltScroll(this.currentScrollData);
    }
    this.setState({ isInHover: true });
  }

  onMouseLeave() {
    this.setState({ isInHover: false });
  }

  findNeighborItem = (itemIdx, dir) =>
    findNeighborItem(itemIdx, dir, this.state.structure.items); // REFACTOR BLUEPRINTS - this makes the function in the layouter irrelevant (unless the layouter is used as a stand alone with this function, maybe the layouter needs to be split for bundle size as well...)

  render() {
    if (!this.canRender()) {
      return null;
    }

    const ViewComponent =
      this.props.options.scrollDirection ===
      GALLERY_CONSTS.scrollDirection.HORIZONTAL
        ? SlideshowView
        : GalleryView;

    if (utils.isVerbose()) {
      console.count('PROGALLERY [COUNTS] - GalleryContainer (render)');
      console.log(
        'PROGALLERY [RENDER] - GalleryContainer',
        this.props.container.scrollBase,
        { props: this.props, items: this.state.items }
      );
    }

    const displayShowMore = this.containerInfiniteGrowthDirection() === 'none';
    return (
      <div
        data-key="pro-gallery-inner-container"
        key="pro-gallery-inner-container"
        className={this.props.isPrerenderMode ? 'pro-gallery-prerender' : ''}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        ref={(e) => (this.galleryContainerRef = e)}
        tabIndex={-1}
      >
        <ScrollIndicator
          id={this.props.id}
          scrollDirection={this.props.options.scrollDirection}
          isRTL={this.props.options.isRTL}
          totalWidth={this.galleryStructure.width}
          scrollBase={this.props.container.scrollBase}
          scrollingElement={this._scrollingElement}
          getMoreItemsIfNeeded={this.getMoreItemsIfNeeded}
          setGotFirstScrollIfNeeded={this.setGotFirstScrollIfNeeded}
          onScroll={this.onGalleryScroll}
        />
        <ViewComponent
          isInDisplay={this.props.isInDisplay}
          isInViewport={this.state.isInViewport}
          isPrerenderMode={this.props.isPrerenderMode}
          scrollingElement={this._scrollingElement}
          totalItemsCount={this.props.totalItemsCount} //the items passed in the props might not be all the items
          renderedItemsCount={this.props.renderedItemsCount}
          getMoreItemsIfNeeded={this.getMoreItemsIfNeeded}
          gotFirstScrollEvent={this.state.gotFirstScrollEvent}
          setGotFirstScrollIfNeeded={this.setGotFirstScrollIfNeeded}
          items={this.state.items}
          getVisibleItems={this.getVisibleItems}
          galleryStructure={this.galleryStructure}
          options={this.props.options}
          container={this.props.container}
          settings={this.props.settings}
          displayShowMore={displayShowMore}
          id={this.props.id}
          activeIndex={this.props.activeIndex || 0}
          customComponents={this.props.customComponents}
          playingVideoIdx={this.state.playingVideoIdx}
          noFollowForSEO={this.props.noFollowForSEO}
          proGalleryRegionLabel={this.props.proGalleryRegionLabel}
          proGalleryRole={this.props.proGalleryRole}
          firstUserInteractionExecuted={this.state.firstUserInteractionExecuted}
          isGalleryInHover={this.state.isInHover}
          enableExperimentalFeatures={this.props.enableExperimentalFeatures}
          galleryContainerRef={this.galleryContainerRef}
          outOfViewComponent={this.outOfViewComponent}
          virtualizationSettings={this.props.virtualizationSettings}
          galleryContainerId={`pro-gallery-container-${this.props.id}`}
          scrollTop={this.state?.scrollPosition?.top}
          isScrollLessGallery={this.getIsScrollLessGallery(this.state.options)}
          actions={{
            ...this.props.actions,
            findNeighborItem: this.findNeighborItem,
            toggleLoadMoreItems: this.toggleLoadMoreItems,
            eventsListener: this.eventsListener,
            setWixHeight: () => {},
            scrollToItem: this.scrollToItem,
            scrollToGroup: this.scrollToGroup,
          }}
          {...this.props.gallery}
        />
        <div
          data-key="items-styles"
          key="items-styles"
          style={{ display: 'none' }}
        >
          {(this.layoutCss || []).filter(Boolean).map((css, idx) => (
            <style
              id={`layoutCss-${idx}`}
              key={`layoutCss-${idx}`}
              dangerouslySetInnerHTML={{ __html: css }}
            />
          ))}
          {(this.scrollCss || []).filter(Boolean).map((css, idx) => (
            <style
              id={`scrollCss_${idx}`}
              key={`scrollCss_${idx}`}
              dangerouslySetInnerHTML={{ __html: css }}
            />
          ))}
          {!!this.dynamicStyles && (
            <style dangerouslySetInnerHTML={{ __html: this.dynamicStyles }} />
          )}
        </div>
        {this.props.proGalleryRole === 'application' && (
          <span
            ref={(e) => (this.outOfViewComponent = e)}
            tabIndex={-1}
            className="sr-only out-of-view-component"
          >
            {this.props.translations?.Accessibility_Left_Gallery}
          </span>
        )}
      </div>
    );
  }
}

export default GalleryContainer;
/* eslint-enable prettier/prettier */
