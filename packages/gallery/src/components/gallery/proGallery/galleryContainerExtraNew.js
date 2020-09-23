import React from 'react';
import { GALLERY_CONSTS, ItemsHelper, window, utils, isEditMode, isPrerenderMode, isSEOMode, isPreviewMode, isSiteMode } from 'pro-gallery-lib';
import GalleryView from './galleryView';
import SlideshowView from './slideshowView';
import { scrollToItemImp, scrollToGroupImp } from '../../helpers/scrollHelper';
import ScrollIndicator from './galleryScrollIndicator';
import { createCssLayouts } from '../../helpers/cssLayoutsHelper.js';
import { cssScrollHelper } from '../../helpers/cssScrollHelper.js';
import VideoScrollHelperWrapper from '../../helpers/videoScrollHelperWrapper'
import {LayoutFixer} from './layoutFixer';

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
    this.eventsListener = this.eventsListener.bind(this);
    this.onGalleryScroll = this.onGalleryScroll.bind(this);
    this.setPlayingIdxState = this.setPlayingIdxState.bind(this);
    this.getVisibleItems = this.getVisibleItems.bind(this);
    this.videoScrollHelper = new VideoScrollHelperWrapper(this.setPlayingIdxState);

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
    this.layoutCss = [];

    this.initialGalleryState = {};
    try {
      const galleryState = this.propsToState(props);
      if (Object.keys(galleryState).length > 0) {
        this.initialGalleryState = galleryState;
      }
    } catch (_e) {
      console.warn(_e);
    }

    this.state = {
      ...initialState,
      ...this.initialGalleryState,
    };
  }

  componentDidMount() {
    this.scrollToItem(this.props.currentIdx, false, true, 0);
    this.eventsListener(GALLERY_CONSTS.events.APP_LOADED, {});
    this.videoScrollHelper.initializePlayState();

    try {
      if (typeof window.CustomEvent === 'function') {
        this.currentHoverChangeEvent = new CustomEvent('current_hover_change');
      } else { //IE (new CustomEvent is not supported in IE)
        this.currentHoverChangeEvent = window.document.createEvent('CustomEvent'); // MUST be 'CustomEvent'
        this.currentHoverChangeEvent.initCustomEvent('current_hover_change', false, false, null);
      }
    } catch(e) {
      console.error('could not create \'current_hover_change\' customEvent. Error =', e);
    }

    if (this.props.domId) {
      this.currentHoverChangeEvent.domId = this.props.domId;
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.currentHoverChangeEvent.domId && nextProps.domId) {
      this.currentHoverChangeEvent.domId = nextProps.domId;
    }
    if (this.props.currentIdx !== nextProps.currentIdx) {
      this.scrollToItem(nextProps.currentIdx, false, true, 0);
    }

    const reCreateGallery = () => {
      const galleryState = this.propsToState(nextProps);
      if (Object.keys(galleryState).length > 0) {
        this.setState(galleryState);
      }
    };

    const getSignificantProps = props => {
      const { domId, styles, container, items, watermark } = props;
      return { domId, styles, container, items, watermark };
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
    const styleParams = this.props.styles;
    const numOfItems = this.state.items.length;
    const layoutHeight = this.props.structure.height;
    const layoutItems = this.props.structure.items;
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
    console.log('handleNewGalleryStructure', onGalleryChangeData);
    this.eventsListener(GALLERY_CONSTS.events.GALLERY_CHANGE, onGalleryChangeData);

    if (needToHandleShowMoreClick) {
      this.setState({ needToHandleShowMoreClick: false });
    }
  }

  isVerticalGallery() {
    return !this.state.styles.oneRow
  }

  getVisibleItems(items, container) {
    const { gotFirstScrollEvent } = this.state;
    const scrollY = window.scrollY;
    const {galleryHeight, scrollBase, galleryWidth} = container;
    if (isSEOMode() || isEditMode() || isPreviewMode() || utils.isSSR() || gotFirstScrollEvent || scrollY > 0 || this.props.currentIdx > 0) {
      return items;
    }
    let visibleItems = items;
    try {
      const windowHeight = window.innerHeight;
      const isInfinite = this.isVerticalGallery() && this.containerInfiniteGrowthDirection() === 'vertical';
      const galleryBottom = isInfinite ? Infinity : (scrollBase + galleryHeight);
      const windowBottom = scrollY + windowHeight;
      const maxItemTop = Math.min(galleryBottom, windowBottom) - scrollBase;
      if (maxItemTop < 0) { //gallery is below the fold
        visibleItems = [];
      } else if (this.isVerticalGallery()) {
        visibleItems = items.filter(item => item.offset.top < maxItemTop);
      } else {
        visibleItems = items.filter(item => item.left <= galleryWidth + 20);
      }
      if(visibleItems.length < 2 && visibleItems.length < items.length) {
        //dont render less then 2 items (otherwise slide show Arrow will be removed)
        visibleItems = items.slice(0, 2);
      }
    } catch (e) {
      console.error('Could not calculate visible items, returning original items', e);
      visibleItems = items;
    }
    return visibleItems;
  }

  propsToState({loopingItems, items, styles, structure, container, domId, resizeMediaUrl}) {

    items = items || this.props.items;
    styles = styles || this.props.styles;
    container = container || this.props.container;
    structure = structure || this.props.structure;
    domId = domId || this.props.domId;
    resizeMediaUrl = resizeMediaUrl || this.props.resizeMediaUrl;

    this.galleryStructure = ItemsHelper.convertToGalleryItems(structure, { // TODO use same objects in the memory when the galleryItems are changed
      thumbnailSize: styles.thumbnailSize,
      sharpParams: styles.sharpParams,
      resizeMediaUrl: resizeMediaUrl,
    });

    // // ------------ TODO. This is using GalleryItem and I am leaving it here for now ---------- //

    const shouldUseScrollCss = !isSEOMode() && (isEditMode() || this.state.gotFirstScrollEvent|| this.state.showMoreClickedAtLeastOnce);
    if (shouldUseScrollCss) {
      this.getScrollCss({
        domId: domId,
        items: this.galleryStructure.galleryItems,
        styleParams: styles,
      });
    }
    const scrollHelperNewGalleryStructure = {
      galleryStructure: this.galleryStructure,
      scrollBase: container.scrollBase,
      videoPlay: styles.videoPlay,
      videoLoop: styles.videoLoop,
      itemClick: styles.itemClick,
      oneRow: styles.oneRow,
      cb: this.setPlayingIdxState,
    }

    this.videoScrollHelper.updateGalleryStructure(scrollHelperNewGalleryStructure, !utils.isSSR() ,items)

      const layoutParams = {
        items: items,
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

    this.createCssLayoutsIfNeeded(layoutParams);
    this.createDynamicStyles(styles);

    const newState = {items: loopingItems || items, styles, container, structure}
    return newState;
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

    console.log('[SLIDESHOW RTL] scrollToItem', itemIdx);

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
      } catch(e) {
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
      } catch(e) {
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
    const _styles = styles || this.props.styles;
    // return the direction in which the gallery can grow on it's own (aka infinite scroll)
    const { enableInfiniteScroll } = this.props.styles; //TODO - props or "raw" styles
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

  createDynamicStyles({overlayBackground}) {
    const allowSSROpacity = isPrerenderMode() && !!this.props.settings.allowSSROpacity;
    this.dynamicStyles = `
      ${!allowSSROpacity ? '' : `#pro-gallery-${this.props.domId} .gallery-item-container { opacity: 0 }`}
      ${!overlayBackground ? '' : `#pro-gallery-${this.props.domId} .gallery-item-hover::before { background-color: ${overlayBackground} !important}`}
    `.trim();
  }

  createCssLayoutsIfNeeded(layoutParams) {
    this.layoutCss = createCssLayouts({
      layoutParams,
      isMobile: utils.isMobile(),
      domId: this.props.domId,
      galleryItems: this.galleryStructure.galleryItems,
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

      if (galleryEnd - scrollEnd < getItemsDistance) {
        //only when the last item turns visible we should try getting more items
          this.gettingMoreItems = true;
          this.eventsListener(GALLERY_CONSTS.events.NEED_MORE_ITEMS, this.state.items.length);
          setTimeout(() => {
            //wait a bit before allowing more items to be fetched - ugly hack before promises still not working
            this.gettingMoreItems = false;
          }, 2000);
    }
  }
}

  canRender() {
    const can = this.props.container && this.props.styles && this.state.items;
    if (!can && utils.isVerbose()) {
      console.log(
        'PROGALLERY [CAN_RENDER] GalleryContainer',
        can,
        this.props.container,
        this.props.styles,
        this.state.items,
      );
    }
    return can;
  }

  render() {
    if (!this.canRender()) {
      return null;
    }

    const ViewComponent = this.props.styles.oneRow ? SlideshowView : GalleryView;

    if (utils.isVerbose()) {
      console.count('PROGALLERY [COUNTS] - GalleryContainer (render)');
      console.log(
        'PROGALLERY [RENDER] - GalleryContainer',
        this.props.container.scrollBase,
        { props: this.props, items: this.state.items},
      );
    }

    const displayShowMore = this.containerInfiniteGrowthDirection() === 'none';

    const findNeighborItem = this.layouter
      ? this.layouter.findNeighborItem
      : (() => {});

    return (
      <div
        data-key="pro-gallery-inner-container"
        key="pro-gallery-inner-container"
      >
        <ScrollIndicator
          domId={this.props.domId}
          oneRow={this.props.styles.oneRow}
          isRTL={this.props.styles.isRTL}
          totalWidth={this.galleryStructure.width}
          scrollBase={this.props.container.scrollBase}
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
          getMoreItemsIfNeeded={this.getMoreItemsIfNeeded}
          setGotFirstScrollIfNeeded={this.setGotFirstScrollIfNeeded}
          items={this.state.items}
          getVisibleItems={this.getVisibleItems}
          itemsLoveData={this.props.itemsLoveData}
          galleryStructure={this.galleryStructure}
          styleParams={this.props.styles}
          container={this.props.container}
          watermark={this.props.watermark}
          settings={this.props.settings}
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
            setWixHeight: (() => {}),
            scrollToItem: this.scrollToItem,
            scrollToGroup: this.scrollToGroup,
          }}
          {...this.props.gallery}
        />
        <div data-key="items-styles" key="items-styles" style={{display: 'none'}}>
          {(this.layoutCss || []).filter(Boolean).map((css, idx) => <style id={`layoutCss-${idx}`} key={`layoutCss-${idx}`} dangerouslySetInnerHTML={{ __html: css }} />)}
          {(this.scrollCss || []).filter(Boolean).map((css, idx) => <style id={`scrollCss_${idx}`} key={`scrollCss_${idx}`} dangerouslySetInnerHTML={{ __html: css }} />)}
          {!!this.dynamicStyles && <style dangerouslySetInnerHTML={{__html: this.dynamicStyles}} />}
        </div>
        {this.props.useLayoutFixer ? <LayoutFixer
          parentId={`pro-gallery-inner-container-${this.props.domId}`}
          styles={this.state.styles}
          items={this.items}
        /> : null }
      </div>
    );
  }
}

export default GalleryContainer;
