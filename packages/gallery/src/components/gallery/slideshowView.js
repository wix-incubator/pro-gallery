import utils from '../../common/utils';
import React from 'react';
import GroupView from '../group/groupView.js';
import GalleryDebugMessage from './galleryDebugMessage.js';
import window from '../../common/window/windowWrapper';
import { isEditMode, isPreviewMode } from '../../common/window/viewModeWrapper';
import { isGalleryInViewport } from './galleryHelpers.js';
import PlayIcon from '../svgs/components/play';
import PauseIcon from '../svgs/components/pause';
import EVENTS from '../../common/constants/events';
import { GalleryComponent } from '../galleryComponent';
import { URL_TYPES, URL_SIZES } from '../../common/constants/urlTypes';

utils.fixViewport('Gallery');

class SlideshowView extends GalleryComponent {
  constructor(props) {
    super(props);

    this.scrollToThumbnail = this.scrollToThumbnail.bind(this);
    this.stopAutoSlideshow = this.stopAutoSlideshow.bind(this);
    this.onAutoSlideShowButtonClick = this.onAutoSlideShowButtonClick.bind(
      this,
    );
    this.startAutoSlideshowIfNeeded = this.startAutoSlideshowIfNeeded.bind(
      this,
    );
    this.handleSlideshowKeyPress = this.handleSlideshowKeyPress.bind(this);
    this.onAutoSlideshowAutoPlayKeyPress = this.onAutoSlideshowAutoPlayKeyPress.bind(this);
    this.setCurrentItemByScroll = this.setCurrentItemByScroll.bind(this);
    this._setCurrentItemByScroll = utils.throttle(this.setCurrentItemByScroll, 600).bind(this);
    this._nextItem = utils.throttle(this.nextItem.bind(this), 400).bind(this);
    this.state = {
      currentIdx: 0,
      isInView: true,
      shouldStopAutoSlideShow: false,
    };
    this.lastCurrentItem = undefined;
    this.shouldCreateSlideShowPlayButton = false;
    this.shouldCreateSlideShowNumbers = false;
  }

  isFirstItem() {
    return this.state.currentIdx === 0
    // let pos;
    // if (this.container) {
    //   pos = this.props.styleParams.oneRow
    //     ? this.container.scrollLeft
    //     : this.container.scrollTop;
    // } else {
    //   pos = 0;
    // }
    // const firstItem = () => this.state.currentIdx === 0 || pos === 0;
    // return firstItem();
  }

  isLastItem() {
    return !this.props.styleParams.slideshowLoop && this.state.currentIdx >= this.props.galleryStructure.items.length - 1;

    // let pos;
    // if (this.container) {
    //   pos = this.props.styleParams.oneRow
    //     ? this.container.scrollLeft
    //     : this.container.scrollTop;
    // } else {
    //   pos = 0;
    // }
    // const [lastItemInGallery] = this.props.galleryStructure.items.slice(-1);
    // const lastItem = () =>
    //   this.state.currentIdx >= this.props.totalItemsCount - 1 ||
    //   !lastItemInGallery ||
    //   this.props.container.galleryWidth + pos >= lastItemInGallery.offset.right;
    // return lastItem() && !this.props.styleParams.slideshowLoop;
  }
  //__________________________________Slide show loop functions_____________________________________________

  createNewItemsForSlideshowLoopThumbnails() {
    const items = this.props.items;
    const biasedItems = [];
    const numOfThumbnails = Math.ceil(
      this.props.container.galleryWidth / this.props.styleParams.thumbnailSize,
    );
    // need to create new item ! not just to copy the last once - the react view refferce one of them
    Object.keys(items).forEach(idx => {
      const _idx = Number(idx);
      let biasIdx;
      //bias all items idx by the number of added items
      biasIdx = _idx + numOfThumbnails;
      biasedItems[biasIdx] = { ...items[idx] };
      //create the first copy of items
      if (_idx > items.length - numOfThumbnails - 1) {
        biasIdx = _idx - items.length + numOfThumbnails;
        biasedItems[biasIdx] = { ...items[idx] };
      }
      //create the end items
      if (_idx < numOfThumbnails) {
        biasIdx = _idx + numOfThumbnails + items.length;
        biasedItems[biasIdx] = { ...items[idx] };
      }
    });
    biasedItems.forEach((item, index) => {
      item.loopIndex = index;
    });
    this.ItemsForSlideshowLoopThumbnails = biasedItems;
    this.numOfThumbnails = numOfThumbnails;
  }

  //__________________________________end of slide show loop functions__________________________
  nextItem(direction, isAutoTrigger, scrollDuration = 400) {
    
    direction *= (this.props.styleParams.isRTL ? -1 : 1);

    const currentIdx = this.setCurrentItemByScroll() || this.state.currentIdx;
    let nextItem = currentIdx + direction;

    const { scrollToItem } = this.props.actions;
    this.isAutoScrolling = true;

    if (isAutoTrigger) {
      // ---- Called by the Auto Slideshow ---- //
      if (this.isLastItem()) {
        nextItem = 0;
        scrollDuration = 0;
      }
    } else {
      // ---- Called by the user (arrows, keys etc.) ---- //
      this.startAutoSlideshowIfNeeded(this.props.styleParams);
      const isScrollingPastEdge =
        (direction === 1 && this.isLastItem()) ||
        (direction === -1 && this.isFirstItem());
      if (isScrollingPastEdge) {
        return;
      }
    }
    // ---- navigate ---- //
    try {
      scrollToItem(nextItem, false, true, scrollDuration);
    } catch (e) {
      console.error('Cannot proceed to the next Item', e);
      this.stopAutoSlideshow();
      return;
    }
    utils.setStateAndLog(
      this,
      'Next Item',
      {
        currentIdx: nextItem,
      },
      () => {
        this.onCurrentItemChanged();
      },
    );
  }
  onCurrentItemChanged() {
    if (this.lastCurrentItem !== this.state.currentIdx) {
      this.lastCurrentItem = this.state.currentIdx;
      //this.props.actions.onCurrentItemChanged(this.state.currentIdx);
      this.props.actions.eventsListener(
        EVENTS.CURRENT_ITEM_CHANGED,
        this.props.items[this.state.currentIdx],
      );
    }
  }
  stopAutoSlideshow() {
    clearInterval(this.autoSlideshowInterval);
  }

  startAutoSlideshowIfNeeded(styleParams) {
    const {
      isAutoSlideshow,
      autoSlideshowInterval,
      galleryLayout,
    } = styleParams;
    this.stopAutoSlideshow();
    if (!(galleryLayout === 5 || galleryLayout === 4 || galleryLayout === 3))
      return;
    if (
      !(
        isAutoSlideshow &&
        autoSlideshowInterval > 0 &&
        this.state.isInView &&
        !this.state.shouldStopAutoSlideShow
      )
    )
      return;
    this.autoSlideshowInterval = setInterval(
      this.autoScrollToNextItem.bind(this),
      autoSlideshowInterval * 1000,
    );
  }

  autoScrollToNextItem = () => {
    if (isGalleryInViewport(this.props.container)) {
      this._nextItem(1, true, 800);
    }
  };

  scrollToThumbnail(itemIdx, scrollDuration = 400) {
    //not to confuse with this.props.actions.scrollToItem. this is used to replace it only for thumbnail items

    this.props.actions.eventsListener(EVENTS.THUMBNAIL_CLICKED, this.props);

    this.isAutoScrolling = true;
    this.startAutoSlideshowIfNeeded(this.props.styleParams);
    utils.setStateAndLog(
      this,
      'Scroll to Item',
      {
        currentIdx: itemIdx,
      },
      () => {
        this.onCurrentItemChanged();
      },
    );

    this.props.actions.scrollToItem(itemIdx, false, true, scrollDuration);
  }

  handleSlideshowKeyPress(e) {
    switch (e.charCode || e.keyCode) {
      case 38: //up
      case 37: //left
      case 33: //page up
        e.preventDefault();
        this._nextItem(-1);
        return false;
      case 39: //right
      case 40: //down
      case 32: //space
      case 34: //page down
        e.preventDefault();
        this._nextItem(1);
        return false;
    }
    return true; //continue handling the original keyboard event
  }

  createThumbnails(thumbnailPosition) {
    let items = this.props.items;
    let currentIdx = this.state.currentIdx;
    if (this.props.styleParams.slideshowLoop) {
      if (!this.ItemsForSlideshowLoopThumbnails) {
        this.createNewItemsForSlideshowLoopThumbnails();
      }
      currentIdx += this.numOfThumbnails;
      items = this.ItemsForSlideshowLoopThumbnails;
    }
    if (utils.isVerbose()) {
      console.log('creating thumbnails for idx', currentIdx);
    }

    let width = this.props.styleParams.thumbnailSize;
    let height = this.props.styleParams.thumbnailSize;
    let oneRow;
    let numOfThumbnails;
    let numOfWholeThumbnails;

    switch (thumbnailPosition) {
      case 'top':
      case 'bottom':
        width =
          this.props.container.galleryWidth +
          this.props.styleParams.thumbnailSpacings;
        height =
          this.props.styleParams.thumbnailSize +
          this.props.styleParams.thumbnailSpacings;
        oneRow = true;
        numOfThumbnails = Math.ceil(
          width / this.props.styleParams.thumbnailSize,
        );
        numOfWholeThumbnails = Math.floor(
          (width + this.props.styleParams.thumbnailSpacings) /
            (this.props.styleParams.thumbnailSize +
              this.props.styleParams.thumbnailSpacings * 2),
        );
        break;
      case 'left':
      case 'right':
        height =
          this.props.container.galleryHeight +
          2 * this.props.styleParams.thumbnailSpacings;
        width =
          this.props.styleParams.thumbnailSize +
          2 * this.props.styleParams.thumbnailSpacings;
        oneRow = false;
        numOfThumbnails = Math.ceil(
          height / this.props.styleParams.thumbnailSize,
        );
        numOfWholeThumbnails = Math.floor(
          height /
            (this.props.styleParams.thumbnailSize +
              this.props.styleParams.thumbnailSpacings * 2),
        );
        break;
    }

    this.firstItemIdx = currentIdx - Math.floor(numOfThumbnails / 2) - 1;
    this.lastItemIdx = this.firstItemIdx + numOfThumbnails;

    if (this.firstItemIdx < 0) {
      this.lastItemIdx -= this.firstItemIdx;
      this.firstItemIdx = 0;
    }

    if (this.lastItemIdx > items.length - 1) {
      this.firstItemIdx -= this.lastItemIdx - (items.length - 1);
      if (this.firstItemIdx < 0) {
        this.firstItemIdx = 0;
      }
      this.lastItemIdx = items.length - 1;
    }

    numOfThumbnails = this.lastItemIdx - this.firstItemIdx + 1;
    if (
      numOfThumbnails % 2 === 0 &&
      items.length > numOfThumbnails &&
      this.lastItemIdx < items.length - 1
    ) {
      // keep an odd number of thumbnails if there are more thumbnails than items and if the thumbnails haven't reach the last item yet
      numOfThumbnails += 1;
      this.lastItemIdx += 1;
    }

    const thumbnailsContainerSize =
      numOfThumbnails * this.props.styleParams.thumbnailSize +
      ((numOfThumbnails - 1) * 2 + 1) *
        this.props.styleParams.thumbnailSpacings;
    const thumbnailsStyle = { width, height };

    if (
      items.length <= numOfWholeThumbnails ||
      currentIdx < numOfThumbnails / 2 - 1
    ) {
      //there are less thumbnails than available thumbnails spots || one of the first thumbnails
      switch (thumbnailPosition) {
        case 'top':
        case 'bottom':
          thumbnailsStyle.width = thumbnailsContainerSize + 'px';
          thumbnailsStyle.left = 0;
          break;
        case 'left':
        case 'right':
          thumbnailsStyle.height = thumbnailsContainerSize + 'px';
          thumbnailsStyle.marginTop = 0;
          break;
      }
    } else if (
      currentIdx > numOfThumbnails / 2 - 1 &&
      currentIdx < items.length - numOfThumbnails / 2
    ) {
      //set selected to center only if neeeded
      switch (thumbnailPosition) {
        case 'top':
        case 'bottom':
          thumbnailsStyle.width = thumbnailsContainerSize + 'px';
          thumbnailsStyle.left = (width - thumbnailsContainerSize) / 2 + 'px';
          break;
        case 'left':
        case 'right':
          thumbnailsStyle.height = thumbnailsContainerSize + 'px';
          thumbnailsStyle.marginTop =
            (height - thumbnailsContainerSize) / 2 + 'px';
          break;
      }
    } else if (currentIdx >= items.length - numOfThumbnails / 2) {
      //one of the last thumbnails
      switch (thumbnailPosition) {
        case 'top':
        case 'bottom':
          thumbnailsStyle.left = width - thumbnailsContainerSize + 'px';
          thumbnailsStyle.overflow = 'visible';
          break;
        case 'left':
        case 'right':
          thumbnailsStyle.top = height - thumbnailsContainerSize + 'px';
          thumbnailsStyle.overflow = 'visible';
          break;
      }
    }

    if (this.props.styleParams.isRTL) {
      thumbnailsStyle.right = thumbnailsStyle.left;
      delete thumbnailsStyle.left;
    }

    let thumbnailsMargin;
    const thumbnailSpacings = this.props.styleParams.thumbnailSpacings;
    switch (this.props.styleParams.galleryThumbnailsAlignment) {
      case 'bottom':
        thumbnailsMargin = `${thumbnailSpacings}px -${thumbnailSpacings}px 0 -${thumbnailSpacings}px`;
        break;
      case 'left':
        thumbnailsMargin = `-${thumbnailSpacings}px ${thumbnailSpacings}px -${thumbnailSpacings}px 0`;
        break;
      case 'top':
        thumbnailsMargin = `0 -${thumbnailSpacings}px ${thumbnailSpacings}px -${thumbnailSpacings}px`;
        break;
      case 'right':
        thumbnailsMargin = `-${thumbnailSpacings}px 0 -${thumbnailSpacings}px ${thumbnailSpacings}px`;
        break;
    }
    const getThumbnailItemForSlideshowLoop = itemId =>
      this.props.galleryStructure.galleryItems.find(item => item.id === itemId);
    const highlighledIdxForSlideshowLoop = Math.floor(numOfThumbnails / 2);
    let thumbnailItems;
    if (this.props.styleParams.slideshowLoop) {
      thumbnailItems = items.slice(this.firstItemIdx, this.lastItemIdx + 1);
    } else {
      thumbnailItems = this.props.galleryStructure.galleryItems.slice(
        this.firstItemIdx,
        this.lastItemIdx + 1,
      );
    }
    const { thumbnailSize } = this.props.styleParams;
    return (
      <div
        className={
          'pro-gallery inline-styles thumbnails-gallery ' +
          (oneRow ? ' one-row hide-scrollbars ' : '') +
          (this.props.styleParams.isRTL ? ' rtl ' : '') +
          (this.props.styleParams.isAccessible ? ' accessible ' : '')
        }
        style={{
          width,
          height,
          margin: thumbnailsMargin,
        }}
        data-hook="gallery-thumbnails"
      >
        <div
          data-hook="gallery-thumbnails-column"
          className={'galleryColumn'}
          key={'thumbnails-column'}
          style={Object.assign(thumbnailsStyle, { width, height })}
        >
          {thumbnailItems.map((item, idx) => {
            const thumbnailItem = this.props.styleParams.slideshowLoop
              ? getThumbnailItemForSlideshowLoop(item.itemId || item.photoId)
              : item;
            const highlighted = this.props.styleParams.slideshowLoop
              ? idx === highlighledIdxForSlideshowLoop
              : thumbnailItem.idx === currentIdx;
            const itemStyle = {
              width: thumbnailSize,
              height: thumbnailSize,
              margin: thumbnailSpacings,
              backgroundImage: `url(${thumbnailItem.createUrl(
                URL_SIZES.THUMBNAIL,
                URL_TYPES.HIGH_RES,
              )})`,
            };
            const thumbnailOffset = oneRow
              ? { [this.props.styleParams.isRTL ? 'right' : 'left']: thumbnailSize * idx + 2 * idx * thumbnailSpacings }
              : { top: thumbnailSize * idx + 2 * idx * thumbnailSpacings };
            Object.assign(itemStyle, thumbnailOffset);
            return (
              <div
                key={
                  'thumbnail-' +
                  thumbnailItem.id +
                  (Number.isInteger(item.loopIndex) ? '-' + item.loopIndex : '')
                }
                className={
                  'thumbnailItem' +
                  (highlighted
                    ? ' pro-gallery-thumbnails-highlighted gallery-item-container highlight' +
                      (utils.isMobile() ? ' pro-gallery-mobile-indicator' : '')
                    : '')
                }
                data-key={thumbnailItem.id}
                style={itemStyle}
                onContextMenu={e => this.onContextMenu(e)}
                onClick={() => this.scrollToThumbnail(thumbnailItem.idx)}
              />
            );
          })}
        </div>
      </div>
    );
  }

  onContextMenu(e) {
    if (!utils.isDev()) {
      e.preventDefault(e);
    }
  }


  setCurrentItemByScroll() {
    if (utils.isVerbose()) {
      console.log('Setting current Idx by scroll', this.isAutoScrolling);
    }

    if (this.isAutoScrolling) {
      //avoid this function if the scroll was originated by us (arrows or thumbnails)
      this.isAutoScrolling = false;
      return;
    }

    const isScrolling =
      (this.container && this.container.getAttribute('data-scrolling')) ===
      'true';

    if (isScrolling) {
      this.stopAutoSlideshow();

      //while the scroll is animating, prevent the reaction to this event
      return;
    }
    this.startAutoSlideshowIfNeeded(this.props.styleParams);
    const scrollLeft = (this.container && this.container.scrollLeft) || 0;
    // console.log('[RTL SCROLL] setCurrentItemByScroll: ', scrollLeft);
    const items = this.props.galleryStructure.galleryItems;

    let currentIdx;

    const scrollPos = this.props.styleParams.isRTL ? 
    this.props.galleryStructure.width - scrollLeft - this.props.container.galleryWidth / 2 :
    scrollLeft + this.props.container.galleryWidth / 2

    if (scrollPos === 0){
      currentIdx = 0;
    } else {
      for (let item, i = 0; (item = items[i]); i++) {
        if (
          item.offset.left >
          scrollPos
        ) {
          currentIdx = i - 1;
          break;
        }
      }
    }
    if (!(currentIdx >= 0)) {
      currentIdx = items.length - 1;
    }

    if (!utils.isUndefined(currentIdx)) {
      utils.setStateAndLog(
        this,
        'Set Current Item',
        {
          currentIdx,
        },
        () => {
          this.onCurrentItemChanged();
        },
      );
    }
    return currentIdx;
  }

  createDebugMsg() {
    return <GalleryDebugMessage {...this.props.debug} />;
  }

  createNavArrows() {

    const { oneRow, arrowsColor, isSlideshow, slideshowInfoSize, imageMargin, arrowsSize, arrowsPosition } = this.props.styleParams;

    const shouldNotRenderNavArrows = this.props.galleryStructure.columns.some(
      column => {
        const allRenderedGroups =
          column.groups.filter(group => group.rendered) || [];
        const allGroupsWidth = allRenderedGroups.reduce(
          (sum, group) => sum + Math.max(0, group.width),
          0,
        );
        const isAllItemsFitsGalleryWidth =
          oneRow &&
          this.props.container.galleryWidth >= allGroupsWidth;
        return isAllItemsFitsGalleryWidth;
      },
    );

    //remove navBars if no scroll is needed and is column layout
    if (shouldNotRenderNavArrows) {
      return null;
    }

    const arrowWidth = this.props.styleParams.arrowsSize;

    const arrowOrigWidth = 23; //arrow-right svg and arrow-left svg width
    const scalePercentage = arrowWidth / arrowOrigWidth;
    const imageStyle = { transform: `scale(${scalePercentage})` };

    const svgStyle = {};
    if (utils.isMobile()) {
      if (typeof arrowsColor !== 'undefined') {
        svgStyle.fill = arrowsColor.value;
      }
    }

    // nav-arrows-container width is 100. arrowWidth + padding on each side should be 100
    const containerPadding = (100 - arrowWidth) / 2;
    const slideshowSpace = isSlideshow
      ? slideshowInfoSize
      : 0;
    // top: imageMargin effect the margin of the main div that SlideshowView is rendering, so the arrows should be places accordingly. 50% is the middle, 50px is half of nav-arrows-container height
    const containerStyle = {
      padding: `0 ${containerPadding}px 0 ${containerPadding}px`,
      top: `calc(50% - 50px + ${imageMargin /
        2}px - ${slideshowSpace / 2}px)`,
    };
    // Add negative positioning for external arrows. consists of arrow size, half of arrow container and padding
    const arrowsPos =
      oneRow && arrowsPosition
        ? `-${arrowsSize + 50 + 10}px`
        : `${imageMargin}px`;
    // left & right: imageMargin effect the margin of the main div that SlideshowView is rendering, so the arrows should be places accordingly

    const prevContainerStyle = {
      left: arrowsPos,
    };
    const nextContainerStyle = {
      right: arrowsPos,
    };

    const hideLeftArrow = (!isRTL && this.isFirstItem()) || (isRTL && this.isLastItem())
    const hideRightArrow = (isRTL && this.isFirstItem()) || (!isRTL && this.isLastItem())

    return [
      hideLeftArrow ? null : (
        <button
          className={
            'nav-arrows-container prev ' +
            (utils.isMobile() ? 'pro-gallery-mobile-indicator ' : '')
          }
          onClick={() => this._nextItem(-1)}
          aria-label={`${isRTL ? 'Next' : 'Previous'} Item`}
          tabIndex={utils.getTabIndex('slideshowPrev')}
          key="nav-arrow-back"
          data-hook="nav-arrow-back"
          style={{ ...containerStyle, ...prevContainerStyle }}
        >
          <svg width="23" height="39" viewBox="0 0 23 39" style={imageStyle}>
            <path
              className="slideshow-arrow"
              style={svgStyle}
              d="M154.994,259.522L153.477,261l-18.471-18,18.473-18,1.519,1.48L138.044,243Z"
              transform="translate(-133 -225)"
            />
          </svg>
        </button>
      ),
      hideRightArrow ? null : (
        <button
          className={'nav-arrows-container next'}
          onClick={() => this._nextItem(1)}
          aria-label={`${!isRTL ? 'Next' : 'Previous'} Item`}
          tabIndex={utils.getTabIndex('slideshowNext')}
          key="nav-arrow-next"
          data-hook="nav-arrow-next"
          style={{ ...containerStyle, ...nextContainerStyle }}
        >
          <svg width="23" height="39" viewBox="0 0 23 39" style={imageStyle}>
            <path
              className="slideshow-arrow"
              style={svgStyle}
              d="M857.005,231.479L858.5,230l18.124,18-18.127,18-1.49-1.48L873.638,248Z"
              transform="translate(-855 -230)"
            />
          </svg>
        </button>
      ),
    ];
  }

  createLayout() {
    const { itemsLoveData } = this.props;

    const galleryConfig = {
      scrollingElement: this.props.scrollingElement,
      renderedItemsCount: this.props.renderedItemsCount,
      scroll: this.props.scroll,
      styleParams: this.props.styleParams,
      container: this.props.container,
      watermark: this.props.watermark,
      settings: this.props.settings,
      currentIdx: this.state.currentIdx,
      customHoverRenderer: this.props.customHoverRenderer,
      customInfoRenderer: this.props.customInfoRenderer,
      noFollowForSEO: this.props.noFollowForSEO,
      galleryDomId: this.props.domId,
      galleryId: this.props.galleryId,
      playingVideoIdx: this.props.playingVideoIdx,
      nextVideoIdx: this.props.nextVideoIdx,
      actions: {
        isCurrentHover: this.props.actions.isCurrentHover,
        eventsListener: this.props.actions.eventsListener,
      },
    };

    return this.props.galleryStructure.columns.map((column, c) => {
      const columnStyle = {
        width: column.width,
        height: this.props.container.galleryHeight,
      };
      if (this.props.styleParams.isSlideshow) {
        Object.assign(columnStyle, {
          paddingBottom: this.props.styleParams.slideshowInfoSize,
        });
      }
      return (
        <div
          data-hook="gallery-column"
          id="gallery-horizontal-scroll"
          className={`gallery-horizontal-scroll gallery-column hide-scrollbars ${(this.props.styleParams.isRTL ? ' rtl ' : '')} ${(this.props.styleParams.scrollSnap ? ' scroll-snap ' : '')} `}
          key={'column' + c}
          style={columnStyle}
        >
          <div className="gallery-horizontal-scroll-inner">
            {!!column.galleryGroups.length &&
              column.galleryGroups.map(group =>
                group.rendered
                  ? React.createElement(
                      GroupView,
                      {
                        itemsLoveData,
                        ...group.renderProps(galleryConfig)
                      },
                    )
                  : false,
              )}
          </div>
        </div>
      );
    });
  }

  createGallery() {
    // When arrows are set outside of the gallery, gallery is resized and needs to be positioned
    const galleryStyleForExternalArrows =
      this.props.styleParams.oneRow && this.props.styleParams.arrowsPosition
        ? {
            overflow: 'visible',
            left:
              this.props.styleParams.arrowsSize +
              40 +
              this.props.styleParams.imageMargin,
          }
        : {};

    const galleryStyle = {
      height: this.props.container.galleryHeight,
      width: this.props.container.galleryWidth,
      ...galleryStyleForExternalArrows,
    };
    if (this.props.styleParams.isSlideshow) {
      Object.assign(galleryStyle, {
        paddingBottom: this.props.styleParams.slideshowInfoSize,
      });
    }

    return (
      <div
        id="pro-gallery-container"
        className={
          'pro-gallery inline-styles one-row hide-scrollbars ' +
          (this.props.styleParams.enableScroll ? ' slider ' : '') +
          (this.props.styleParams.isAccessible ? ' accessible ' : '') +
          (this.props.styleParams.isRTL ? ' rtl ' : '')
        }
        style={galleryStyle}
      >
        {this.createDebugMsg()}
        {this.createNavArrows()}
        {this.createLayout()}
        {this.createAutoSlideShowPlayButton()}
        {this.createSlideShowNumbers()}
      </div>
    );
  }

  onAutoSlideShowButtonClick() {
    const currShouldStopAutoSlideShow = this.state.shouldStopAutoSlideShow;
    this.setState(
      { shouldStopAutoSlideShow: !currShouldStopAutoSlideShow },
      () => {
        this.startAutoSlideshowIfNeeded(this.props.styleParams);
      },
    );
  }

  isFullWidthGallery() {
    return this.props.container.galleryWidth >= utils.getWindowWidth() - 10;
  }

  onAutoSlideshowAutoPlayKeyPress(e) {
    switch (e.keyCode || e.charCode) {
      case 32: //space
      case 13: //enter
        e.preventDefault();
        e.stopPropagation();
        this.onAutoSlideShowButtonClick();
        return false;
      default:
        return true;
    }
  }

  calcSlideshowCounterWidth () {
    const { totalItemsCount} = this.props;
    if (totalItemsCount < 10) { // x/x
      return 26;
    } else if (totalItemsCount < 100) { // xx/xx
      return 43;
    } else if (totalItemsCount < 1000) { // xxx/xxx
      return 60
    } else { // xxxx/xxxx or more
      return 76
    }
  }

  createAutoSlideShowPlayButton() {
    if (!this.shouldCreateSlideShowPlayButton) {
      return false;
    }
    const {
      styleParams: { galleryTextAlign, slideshowInfoSize },
    } = this.props;

    const imageMargin =
      this.props.styleParams.imageMargin + (this.isFullWidthGallery() ? 50 : 0);

    const side =
      galleryTextAlign === 'right'
        ? { left: `${imageMargin}px` }
        : {
            right: `${(imageMargin + (this.shouldCreateSlideShowNumbers ? this.calcSlideshowCounterWidth() : 0))}px`,
          };
    return (
      <button
        className={'auto-slideshow-button'}
        onClick={() => {
          this.onAutoSlideShowButtonClick();
        }}
        onKeyDown={this.onAutoSlideshowAutoPlayKeyPress}
        data-hook="auto-slideshow-button"
        title={'slideshow auto play'}
        aria-pressed={this.state.shouldStopAutoSlideShow}
        tabIndex={0}
        style={{
          top: `calc(100% - ${slideshowInfoSize}px + 3px)`,
          ...side,
        }}
      >
        {this.state.shouldStopAutoSlideShow ? (
          <PlayIcon width="10px" height="100%" />
        ) : (
          <PauseIcon width="10px" height="100%" />
        )}
      </button>
    );
  }

  createSlideShowNumbers() {
    if (!this.shouldCreateSlideShowNumbers) {
      return false;
    }
    const {
      totalItemsCount,
      styleParams: { galleryTextAlign, slideshowInfoSize },
    } = this.props;

    const imageMargin =
      this.props.styleParams.imageMargin + (this.isFullWidthGallery() ? 50 : 0);

    const leftMargin = this.shouldCreateSlideShowPlayButton
      ? imageMargin + 25
      : imageMargin;

    const side =
      galleryTextAlign === 'right'
        ? { left: `${leftMargin}px` }
        : { right: `${imageMargin}px` };

    return (
      <div
        className={'auto-slideshow-counter'}
        data-hook="auto-slideshow-counter"
        style={{
          top: `calc(100% - ${slideshowInfoSize}px + 3px)`,
          ...side,
        }}
      >
        <div>
          {this.state.currentIdx + 1 + '/' + totalItemsCount}
        </div>
      </div>
    );
  }

  getThumbnails() {
    const hasThumbnails = this.props.styleParams.hasThumbnails;
    const thumbnailsPosition = this.props.styleParams
      .galleryThumbnailsAlignment;

    const thumbnailsGallery = hasThumbnails
      ? this.createThumbnails(thumbnailsPosition)
      : false;

    const thumbnails = [];
    switch (thumbnailsPosition) {
      case 'top':
      case 'left':
        thumbnails[0] = thumbnailsGallery;
        thumbnails[1] = false;
        break;
      case 'right':
      case 'bottom':
        thumbnails[0] = false;
        thumbnails[1] = thumbnailsGallery;
        break;
    }
    return thumbnails;
  }

  getClassNames() {
    let classNames = '';
    if (this.props.styleParams.isSlideshow) {
      classNames = ' gallery-slideshow';
    } else if (this.props.styleParams.isSlider) {
      classNames = ' gallery-slider';
    } else if (this.props.styleParams.hasThumbnails) {
      classNames = ' gallery-thumbnails';
    } else if (this.props.styleParams.isColumns) {
      classNames = ' gallery-columns';
    }

    if (this.isFullWidthGallery()) {
      classNames += ' streched';
    }

    return classNames;
  }

  getStyles() {
    return {
      margin:
        -1 *
        (this.props.styleParams.imageMargin -
          this.props.styleParams.galleryMargin),
    };
  }

  //-----------------------------------------| REACT |--------------------------------------------//

  componentWillReceiveProps(props) {
    if (props.items) {
      this.ItemsForSlideshowLoopThumbnails = false;
    }
    if (this.props.isInDisplay !== props.isInDisplay) {
      this.setState({ isInView: props.isInDisplay }, () =>
        this.startAutoSlideshowIfNeeded(props.styleParams),
      );
    }
    if (isEditMode() || isPreviewMode()) {
      if (
        //check that the change is related to the slideshow settings
        this.props.styleParams.isAutoSlideshow !==
          props.styleParams.isAutoSlideshow ||
        this.props.styleParams.autoSlideshowInterval !==
          props.styleParams.autoSlideshowInterval
      ) {
        this.startAutoSlideshowIfNeeded(props.styleParams);
      }
    }
    const isAutoSlideShow =
      props.styleParams.galleryLayout === 5 &&
      props.styleParams.isSlideshow &&
      props.styleParams.isAutoSlideshow;

    this.shouldCreateSlideShowPlayButton =
      isAutoSlideShow && props.styleParams.playButtonForAutoSlideShow;

    this.shouldCreateSlideShowNumbers =
      isAutoSlideShow && props.styleParams.allowSlideshowCounter;
  }

  componentDidMount() {
    window.addEventListener('gallery_navigation_out', () => {
      //TODO remove after full refactor release
      utils.setStateAndLog(this, 'Next Item', {
        isInView: false,
      });
      this.stopAutoSlideshow();
    });
    window.addEventListener('gallery_navigation_in', () => {
      //TODO remove after full refactor release
      utils.setStateAndLog(this, 'Next Item', {
        isInView: true,
      });
      this.startAutoSlideshowIfNeeded(this.props.styleParams);
    });

    this.container = window.document.querySelector(
      `#pro-gallery-${this.props.domId} #gallery-horizontal-scroll`,
    );
    if (this.container) {
      this.container.addEventListener('scroll', this._setCurrentItemByScroll);
    }
    this.setCurrentItemByScroll();
    this.startAutoSlideshowIfNeeded(this.props.styleParams);
  }

  componentWillUnmount() {
    if (this.container) {
      this.container.removeEventListener(
        'scroll',
        this._setCurrentItemByScroll,
      );
    }
  }

  //-----------------------------------------| RENDER |--------------------------------------------//

  render() {
    if (utils.isVerbose()) {
      console.count('galleryView render');
      console.count('Rendering Gallery count');
      console.time('Rendering Gallery took ');
    }

    const gallery = this.createGallery();
    const thumbnails = this.getThumbnails();

    if (utils.isVerbose()) {
      console.timeEnd('Rendering Gallery took ');
    }

    return (
      <div
        className={this.getClassNames()}
        style={this.getStyles()}
        onKeyDown={this.handleSlideshowKeyPress}
        role="region"
        aria-label="Gallery. you can navigate the gallery with keyboard arrow keys."
      >
        {thumbnails[0]}
        {gallery}
        {thumbnails[1]}
      </div>
    );
  }
}

export default SlideshowView;
