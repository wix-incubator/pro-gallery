import React from 'react';
import {
  GALLERY_CONSTS,
  window,
  utils,
  isEditMode,
  isPreviewMode,
} from 'pro-gallery-lib';
import GroupView from '../../group/groupView.js';
import GalleryDebugMessage from './galleryDebugMessage.js';
import { isGalleryInViewport } from './galleryHelpers.js';
import PlayIcon from '../../svgs/components/play';
import PauseIcon from '../../svgs/components/pause';
import { GalleryComponent } from '../../galleryComponent';
import TextItem from '../../item/textItem.js';

const SKIP_SLIDES_MULTIPLIER = 1.5;
class SlideshowView extends GalleryComponent {
  constructor(props) {
    super(props);

    this.navigationOutHandler = this.navigationOutHandler.bind(this);
    this.navigationInHandler = this.navigationInHandler.bind(this);
    this.scrollToThumbnail = this.scrollToThumbnail.bind(this);
    this.stopAutoSlideshow = this.stopAutoSlideshow.bind(this);
    this.onAutoSlideShowButtonClick = this.onAutoSlideShowButtonClick.bind(
      this
    );
    this.startAutoSlideshowIfNeeded = this.startAutoSlideshowIfNeeded.bind(
      this
    );
    this.handleSlideshowKeyPress = this.handleSlideshowKeyPress.bind(this);
    this.onAutoSlideshowAutoPlayKeyPress = this.onAutoSlideshowAutoPlayKeyPress.bind(
      this
    );
    this.setCurrentItemByScroll = this.setCurrentItemByScroll.bind(this);
    this._setCurrentItemByScroll = utils
      .throttle(this.setCurrentItemByScroll, 600)
      .bind(this);
    this._next = utils.throttle(this.next.bind(this), 400).bind(this);
    this.state = {
      currentIdx: props.currentIdx || 0,
      isInView: true,
      shouldStopAutoSlideShow: false,
      hideLeftArrow: !props.isRTL,
      hideRightArrow: props.isRTL,
    };
    this.lastCurrentItem = undefined;
    this.shouldCreateSlideShowPlayButton = false;
    this.shouldCreateSlideShowNumbers = false;
    this.skipFromSlide = Math.round(
      this.props.totalItemsCount * SKIP_SLIDES_MULTIPLIER
    ); // Used in infinite loop
  }

  isFirstItem() {
    return this.state.currentIdx === 0;
  }

  isScrollStart() {
    const { slideAnimation } = this.props.styleParams;

    if (slideAnimation === GALLERY_CONSTS.slideAnimations.FADE) {
      return false;
    }

    if (this.container) {
      return this.getScrollLeft() <= 1;
    } else {
      return false;
    }
  }

  isScrollEnd() {
    const {
      totalItemsCount,
      getVisibleItems,
      galleryStructure,
      container,
    } = this.props;
    const { slideshowLoop, slideAnimation } = this.props.styleParams;

    if (
      slideshowLoop ||
      slideAnimation === GALLERY_CONSTS.slideAnimations.FADE
    ) {
      return false;
    }

    if (this.container) {
      /* 'scrollWidth' is not reliable before first scroll (= it is equal to 'clientWidth' size).
        'scrollWidth' will get his real value just after scrolling.
      */
      const { scrollWidth, clientWidth } = this.container;
      const scrollLeft = this.getScrollLeft();
      const visibleItemsCount = getVisibleItems(
        galleryStructure.galleryItems,
        container
      ).length;
      const allItemsLoaded = visibleItemsCount >= totalItemsCount;
      const visibleLeft = scrollLeft + clientWidth;
      const visibleScroll = scrollWidth - 1;

      return allItemsLoaded && visibleLeft >= visibleScroll;
    } else {
      return false;
    }
  }

  isFirstItemFullyVisible() {
    return !this.props.styleParams.slideshowLoop && this.isScrollStart();
  }
  isLastItemFullyVisible() {
    return !this.props.styleParams.slideshowLoop && this.isScrollEnd();
  }

  isLastItem() {
    return (
      !this.props.styleParams.slideshowLoop &&
      this.state.currentIdx >= this.props.totalItemsCount - 1
    );
  }

  //__________________________________Slide show loop functions_____________________________________________

  createNewItemsForSlideshowLoopThumbnails() {
    const items = this.props.items;
    const biasedItems = [];
    const numOfThumbnails = Math.ceil(
      this.props.container.galleryWidth / this.props.styleParams.thumbnailSize
    );
    // need to create new item ! not just to copy the last once - the react view refferce one of them
    Object.keys(items).forEach((idx) => {
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
  next({
    direction,
    isAutoTrigger,
    scrollDuration,
    isKeyboardNavigation = false,
  }) {
    const activeElement = document.activeElement;
    const galleryItemIsFocused =
      activeElement.className &&
      activeElement.className.includes('gallery-item-container');
    const avoidIndividualNavigation =
      !isKeyboardNavigation ||
      !(this.props.styleParams.isAccessible && galleryItemIsFocused);
    let ignoreScrollPosition = false;

    if (
      this.props.styleParams.slideAnimation ===
      GALLERY_CONSTS.slideAnimations.FADE
    ) {
      scrollDuration = 0;
      ignoreScrollPosition = true;
    }

    direction *= this.props.styleParams.isRTL ? -1 : 1;
    if (avoidIndividualNavigation && this.props.styleParams.groupSize > 1) {
      this.nextGroup({ direction, isAutoTrigger, scrollDuration }); //if its not in accessibility that requieres individual nav and we are in a horizontal(this file) collage(layout 0) - use group navigation
    } else {
      if (
        avoidIndividualNavigation &&
        this.props.styleParams.isGrid &&
        this.props.styleParams.numberOfImagesPerCol
      ) {
        direction *= this.props.styleParams.numberOfImagesPerCol;
      }
      this.nextItem({
        direction,
        isAutoTrigger,
        scrollDuration,
        avoidIndividualNavigation,
        ignoreScrollPosition,
      });
    }
    this.removeArrowsIfNeeded();
  }

  nextItem({
    direction,
    isAutoTrigger,
    scrollDuration,
    avoidIndividualNavigation,
    ignoreScrollPosition,
  }) {
    if (this.isSliding) {
      return;
    }
    this.isSliding = true;

    let currentIdx;
    if (ignoreScrollPosition) {
      currentIdx = this.state.currentIdx;
    } else {
      if (
        avoidIndividualNavigation &&
        !(this.props.styleParams.groupSize > 1)
      ) {
        currentIdx = this.getCenteredItemIdxByScroll();
      } else {
        currentIdx = isAutoTrigger
          ? this.setCurrentItemByScroll()
          : this.state.currentIdx;
      }
    }

    let nextItem = currentIdx + direction;
    if (!this.props.styleParams.slideshowLoop) {
      nextItem = Math.min(
        this.props.galleryStructure.items.length - 1,
        nextItem
      );
      nextItem = Math.max(0, nextItem);
    }

    const { scrollToItem } = this.props.actions;
    this.isAutoScrolling = true;

    if (isAutoTrigger) {
      // ---- Called by the Auto Slideshow ---- //
    } else {
      // ---- Called by the user (arrows, keys etc.) ---- //
      this.startAutoSlideshowIfNeeded(this.props.styleParams);
      const scrollingPastLastItem =
        (direction >= 1 && this.isLastItem()) ||
        (direction <= -1 && this.isFirstItem());
      if (scrollingPastLastItem) {
        this.isSliding = false;
        return;
      }
    }
    // ---- navigate ---- //
    try {
      const isScrollingPastEdge =
        !isAutoTrigger &&
        ((direction >= 1 && this.isLastItemFullyVisible()) ||
          (direction <= -1 && this.isFirstItemFullyVisible()));
      const scrollMarginCorrection = this.getStyles().margin || 0;
      const _scrollDuration =
        scrollDuration || this.props.styleParams.scrollDuration || 400;
      const itemToScroll = ignoreScrollPosition ? 0 : nextItem;
      const scrollToItemPromise =
        !isScrollingPastEdge &&
        scrollToItem(
          itemToScroll,
          false,
          true,
          _scrollDuration,
          scrollMarginCorrection
        );
      scrollToItemPromise.then(() => {
        if (this.props.styleParams.groupSize === 1) {
          const skipToSlide = this.skipFromSlide - this.props.totalItemsCount;

          if (nextItem >= this.skipFromSlide) {
            nextItem = skipToSlide;
            scrollToItem(nextItem);
          }
        }

        utils.setStateAndLog(
          this,
          'Next Item',
          {
            currentIdx: nextItem,
          },
          () => {
            this.onCurrentItemChanged();
            this.isSliding = false;
          }
        );

        if (ignoreScrollPosition) {
          this.props.getMoreItemsIfNeeded(
            this.props.galleryStructure.galleryItems[nextItem].offset.left
          );
          this.props.setGotFirstScrollIfNeeded();
        }
      });
    } catch (e) {
      console.error('Cannot proceed to the next Item', e);
      this.stopAutoSlideshow();
      return;
    }
  }

  nextGroup({ direction, isAutoTrigger, scrollDuration }) {
    if (this.isSliding) {
      return;
    }
    this.isSliding = true;
    const currentGroupIdx = this.getCenteredGroupIdxByScroll();
    let currentGroup = currentGroupIdx + direction;
    const scrollToGroup = this.props.actions.scrollToGroup;

    this.isAutoScrolling = true;

    if (isAutoTrigger) {
      // ---- Called by the Auto Slideshow ---- //
      if (this.isLastItem()) {
        // maybe this should be isLastItemFullyVisible now that we have both. product- do we allow autoSlideshow in other layouts ( those that could have more than one item displayed in the galleryWidth)
        currentGroup = 0;
        scrollDuration = 0;
      }
    } else {
      // ---- Called by the user (arrows, keys etc.) ---- //
      // this.startAutoSlideshowIfNeeded(this.props.styleParams);
      const scrollingPastLastItem =
        (direction >= 1 && this.isLastItem()) ||
        (direction <= -1 && this.isFirstItem());
      if (scrollingPastLastItem) {
        this.isSliding = false;
        return;
      }
    }
    // ---- navigate ---- //
    try {
      const isScrollingPastEdge =
        !isAutoTrigger &&
        ((direction >= 1 && this.isLastItemFullyVisible()) ||
          (direction <= -1 && this.isFirstItemFullyVisible()));
      const scrollMarginCorrection = this.getStyles().margin || 0;
      const _scrollDuration =
        scrollDuration || this.props.styleParams.scrollDuration || 400;

      !isScrollingPastEdge &&
        scrollToGroup(
          currentGroup,
          false,
          true,
          _scrollDuration,
          scrollMarginCorrection
        );
      utils.setStateAndLog(
        this,
        'Next Item',
        {
          currentIdx: this.getCenteredItemIdxByScroll() + direction,
        },
        () => {
          this.onCurrentItemChanged();
          this.isSliding = false;
        }
      );
    } catch (e) {
      console.error('Cannot proceed to the next Group', e);
      this.stopAutoSlideshow();
      return;
    }
  }

  onCurrentItemChanged() {
    if (this.lastCurrentItem !== this.state.currentIdx) {
      this.lastCurrentItem = this.state.currentIdx;
      //this.props.actions.onCurrentItemChanged(this.state.currentIdx);
      const currentGalleryItem = this.props.galleryStructure.galleryItems[
        this.state.currentIdx
      ];
      const item = this.props.items[this.state.currentIdx];
      if (item) {
        item.idx = this.state.currentIdx;
        item.resizedImageSrc = currentGalleryItem.createUrl(
          GALLERY_CONSTS.urlSizes.RESIZED,
          GALLERY_CONSTS.urlTypes.HIGH_RES
        );
        this.props.actions.eventsListener(
          GALLERY_CONSTS.events.CURRENT_ITEM_CHANGED,
          item
        );
      }
    }
    this.removeArrowsIfNeeded();
  }
  stopAutoSlideshow() {
    clearInterval(this.autoSlideshowInterval);
  }

  startAutoSlideshowIfNeeded(styleParams) {
    const { isAutoSlideshow, autoSlideshowInterval, oneRow } = styleParams;
    this.stopAutoSlideshow();
    if (!oneRow) return;
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
      autoSlideshowInterval * 1000
    );
  }

  autoScrollToNextItem = () => {
    if (
      !isEditMode() &&
      (isGalleryInViewport(this.props.container) || isPreviewMode())
    ) {
      const direction = this.props.styleParams.isRTL ? -1 : 1;
      this._next({ direction, isAutoTrigger: true, scrollDuration: 800 });
    }
  };

  scrollToThumbnail(itemIdx, scrollDuration) {
    //not to confuse with this.props.actions.scrollToItem. this is used to replace it only for thumbnail items

    this.props.actions.eventsListener(
      GALLERY_CONSTS.events.THUMBNAIL_CLICKED,
      this.props
    );

    this.props.setGotFirstScrollIfNeeded(); //load all the images in the thumbnails bar

    this.next({
      direction: itemIdx - this.state.currentIdx,
      isAutoTrigger: false,
      scrollDuration,
      isKeyboardNavigation: false,
    });
  }

  handleSlideshowKeyPress(e) {
    e.stopPropagation();
    switch (e.charCode || e.keyCode) {
      case 38: //up
      case 37: //left
      case 33: //page up
        e.preventDefault();
        this._next({ direction: -1, isKeyboardNavigation: true });
        return false;
      case 39: //right
      case 40: //down
      case 32: //space
      case 34: //page down
        e.preventDefault();
        this._next({ direction: 1, isKeyboardNavigation: true });
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
          width / this.props.styleParams.thumbnailSize
        );
        numOfWholeThumbnails = Math.floor(
          (width + this.props.styleParams.thumbnailSpacings) /
            (this.props.styleParams.thumbnailSize +
              this.props.styleParams.thumbnailSpacings * 2)
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
          height / this.props.styleParams.thumbnailSize
        );
        numOfWholeThumbnails = Math.floor(
          height /
            (this.props.styleParams.thumbnailSize +
              this.props.styleParams.thumbnailSpacings * 2)
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
    const getThumbnailItemForSlideshowLoop = (itemId) =>
      this.props.galleryStructure.galleryItems.find(
        (item) => item.id === itemId
      );
    const highlighledIdxForSlideshowLoop = Math.floor(numOfThumbnails / 2);
    let thumbnailItems;
    if (this.props.styleParams.slideshowLoop) {
      thumbnailItems = items.slice(this.firstItemIdx, this.lastItemIdx + 1);
    } else {
      thumbnailItems = this.props.galleryStructure.galleryItems.slice(
        this.firstItemIdx,
        this.lastItemIdx + 1
      );
    }
    const { thumbnailSize } = this.props.styleParams;
    return (
      <div
        className={
          'pro-gallery inline-styles thumbnails-gallery ' +
          (oneRow ? ' one-row hide-scrollbars ' : '') +
          (this.props.styleParams.isRTL ? ' rtl ' : ' ltr ') +
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
                GALLERY_CONSTS.urlSizes.THUMBNAIL,
                GALLERY_CONSTS.urlTypes.HIGH_RES
              )})`,
            };
            const thumbnailOffset = oneRow
              ? {
                  [this.props.styleParams.isRTL ? 'right' : 'left']:
                    thumbnailSize * idx + 2 * idx * thumbnailSpacings,
                }
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
                onClick={() => this.scrollToThumbnail(thumbnailItem.idx)}
              >
                {item.type === 'text' ? (
                  <TextItem
                    {...this.props}
                    {...thumbnailItem.renderProps()}
                    actions={{}}
                    imageDimensions={itemStyle}
                    style={{
                      ...thumbnailItem.renderProps().style,
                      ...itemStyle,
                    }}
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  getCenteredItemIdxByScroll() {
    const scrollLeft = this.getScrollLeft();
    // console.log('[RTL SCROLL] setCurrentItemByScroll: ', scrollLeft);
    const items = this.props.galleryStructure.galleryItems;

    let centeredIdx;

    // const scrollPos = this.props.styleParams.isRTL ?
    // this.props.galleryStructure.width - scrollLeft - this.props.container.galleryWidth / 2 :
    const scrollPos = scrollLeft + this.props.container.galleryWidth / 2;

    if (scrollPos === 0) {
      centeredIdx = 0;
    } else {
      for (let item, i = 0; (item = items[i]); i++) {
        if (item.offset.left > scrollPos) {
          centeredIdx = i - 1;
          break;
        }
      }
    }
    if (!(centeredIdx >= 0)) {
      centeredIdx = items.length - 1;
    }
    return centeredIdx;
  }

  getCenteredGroupIdxByScroll() {
    const scrollLeft = this.getScrollLeft();
    // console.log('[RTL SCROLL] setCurrentItemByScroll: ', scrollLeft);
    const groups = this.props.galleryStructure.groups;

    let centeredGroupIdx;

    const scrollPos = scrollLeft + this.props.container.galleryWidth / 2;

    if (scrollPos === 0) {
      centeredGroupIdx = 0;
    } else {
      for (let group, i = 0; (group = groups[i]); i++) {
        if (group.left > scrollPos) {
          centeredGroupIdx = i - 1;
          break;
        }
      }
    }
    if (!(centeredGroupIdx >= 0)) {
      centeredGroupIdx = groups.length - 1;
    }
    return centeredGroupIdx;
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

    const currentIdx = this.getCenteredItemIdxByScroll();

    if (!utils.isUndefined(currentIdx)) {
      utils.setStateAndLog(
        this,
        'Set Current Item',
        {
          currentIdx,
        },
        () => {
          this.onCurrentItemChanged();
        }
      );
    }
    return currentIdx;
  }

  createDebugMsg() {
    return <GalleryDebugMessage {...this.props.debug} />;
  }

  createNavArrows() {
    const {
      isRTL,
      oneRow,
      arrowsColor,
      isSlideshow,
      slideshowInfoSize,
      imageMargin,
      arrowsSize,
      arrowsPosition,
      showArrows,
    } = this.props.styleParams;
    const { hideLeftArrow, hideRightArrow } = this.state;
    const shouldNotRenderNavArrows =
      this.props.isPrerenderMode ||
      !showArrows ||
      this.props.galleryStructure.columns.some((column) => {
        const allRenderedGroups =
          column.groups.filter((group) => group.rendered) || [];
        const allGroupsWidth = allRenderedGroups.reduce(
          (sum, group) => sum + Math.max(0, group.width),
          0
        );
        const isAllItemsFitsGalleryWidth =
          oneRow && this.props.container.galleryWidth >= allGroupsWidth;
        return isAllItemsFitsGalleryWidth;
      });

    //remove navBars if no scroll is needed and is column layout
    if (shouldNotRenderNavArrows) {
      return null;
    }

    const arrowWidth = this.props.styleParams.arrowsSize;

    const arrowOrigWidth = 23; //arrow-right svg and arrow-left svg width
    const scalePercentage = arrowWidth / arrowOrigWidth;
    const svgStyle = { transform: `scale(${scalePercentage})` };

    const svgInternalStyle = {};
    if (utils.isMobile()) {
      if (typeof arrowsColor !== 'undefined') {
        svgInternalStyle.fill = arrowsColor.value;
      }
    }

    // nav-arrows-container width is 100. arrowWidth + padding on each side should be 100
    const containerPadding = (100 - arrowWidth) / 2;
    const slideshowSpace = isSlideshow ? slideshowInfoSize : 0;
    // top: imageMargin effect the margin of the main div that SlideshowView is rendering, so the arrows should be places accordingly. 50% is the middle, 50px is half of nav-arrows-container height
    const containerStyle = {
      padding: `0 ${containerPadding}px 0 ${containerPadding}px`,
      top: `calc(50% - 50px + ${imageMargin / 4}px - ${slideshowSpace / 2}px)`,
    };
    // Add negative positioning for external arrows. consists of arrow size, half of arrow container and padding
    const arrowsPos =
      oneRow && arrowsPosition === GALLERY_CONSTS.arrowsPosition.OUTSIDE_GALLERY
        ? `-${arrowsSize + 50 + 10}px`
        : `${imageMargin / 2}px`;
    // left & right: imageMargin effect the margin of the main div that SlideshowView is rendering, so the arrows should be places accordingly

    const prevContainerStyle = {
      left: arrowsPos,
    };
    const nextContainerStyle = {
      right: arrowsPos,
    };

    const arrowRenderer = this.props.customNavArrowsRenderer;

    return [
      hideLeftArrow ? null : (
        <button
          className={
            'nav-arrows-container prev ' +
            (utils.isMobile() ? 'pro-gallery-mobile-indicator ' : '')
          }
          onClick={() => this._next({ direction: -1 })}
          aria-label={`${isRTL ? 'Next' : 'Previous'} Item`}
          tabIndex={utils.getTabIndex('slideshowPrev')}
          key="nav-arrow-back"
          data-hook="nav-arrow-back"
          style={{ ...containerStyle, ...prevContainerStyle }}
        >
          {arrowRenderer ? (
            arrowRenderer('left')
          ) : (
            <svg width="23" height="39" viewBox="0 0 23 39" style={svgStyle}>
              <path
                className="slideshow-arrow"
                style={svgInternalStyle}
                d="M154.994,259.522L153.477,261l-18.471-18,18.473-18,1.519,1.48L138.044,243Z"
                transform="translate(-133 -225)"
              />
            </svg>
          )}
        </button>
      ),
      hideRightArrow ? null : (
        <button
          className={'nav-arrows-container next'}
          onClick={() => this._next({ direction: 1 })}
          aria-label={`${!isRTL ? 'Next' : 'Previous'} Item`}
          tabIndex={utils.getTabIndex('slideshowNext')}
          key="nav-arrow-next"
          data-hook="nav-arrow-next"
          style={{ ...containerStyle, ...nextContainerStyle }}
        >
          {arrowRenderer ? (
            arrowRenderer('right')
          ) : (
            <svg width="23" height="39" viewBox="0 0 23 39" style={svgStyle}>
              <path
                className="slideshow-arrow"
                style={svgInternalStyle}
                d="M857.005,231.479L858.5,230l18.124,18-18.127,18-1.49-1.48L873.638,248Z"
                transform="translate(-855 -230)"
              />
            </svg>
          )}
        </button>
      ),
    ];
  }

  createLayout() {
    const {
      itemsLoveData,
      getVisibleItems,
      galleryStructure,
      container,
    } = this.props;

    const galleryConfig = {
      scrollingElement: this.props.scrollingElement,
      totalItemsCount: this.props.totalItemsCount,
      scroll: this.props.scroll,
      styleParams: this.props.styleParams,
      container: this.props.container,
      watermark: this.props.watermark,
      settings: this.props.settings,
      currentIdx: this.state.currentIdx,
      customHoverRenderer: this.props.customHoverRenderer,
      customInfoRenderer: this.props.customInfoRenderer,
      customSlideshowInfoRenderer: this.props.customSlideshowInfoRenderer,
      noFollowForSEO: this.props.noFollowForSEO,
      domId: this.props.domId,
      gotFirstScrollEvent: this.props.gotFirstScrollEvent,
      playingVideoIdx: this.props.playingVideoIdx,
      isPrerenderMode: this.props.isPrerenderMode,
      totalWidth: this.props.galleryStructure.width,
      firstUserInteractionExecuted: this.props.firstUserInteractionExecuted,
      actions: {
        eventsListener: this.props.actions.eventsListener,
      },
    };

    const renderGroups = (column) => {
      const layoutGroupView =
        !!column.galleryGroups.length &&
        getVisibleItems(column.galleryGroups, container);
      return (
        layoutGroupView &&
        layoutGroupView.map((group) => {
          return group.rendered
            ? React.createElement(GroupView, {
                allowLoop:
                  this.props.styleParams.slideshowLoop &&
                  this.props.galleryStructure.width >
                    this.props.container.width,
                itemsLoveData,
                ...group.renderProps(galleryConfig),
                ariaHidden: group.idx > this.skipFromSlide,
              })
            : false;
        })
      );
    };

    return galleryStructure.columns.map((column, c) => {
      const columnStyle = {
        width: this.props.isPrerenderMode ? '100%' : column.width,
        height: container.galleryHeight,
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
          className={`gallery-horizontal-scroll gallery-column hide-scrollbars ${
            this.props.styleParams.isRTL ? ' rtl ' : ' ltr '
          } ${this.props.styleParams.scrollSnap ? ' scroll-snap ' : ''} `}
          key={'column' + c}
          style={columnStyle}
        >
          <div className="gallery-horizontal-scroll-inner">
            {renderGroups(column)}
          </div>
        </div>
      );
    });
  }

  createGallery() {
    // When arrows are set outside of the gallery, gallery is resized and needs to be positioned
    const galleryStyleForExternalArrows =
      this.props.styleParams.oneRow &&
      this.props.styleParams.arrowsPosition ===
        GALLERY_CONSTS.arrowsPosition.OUTSIDE_GALLERY
        ? {
            overflow: 'visible',
            left:
              this.props.styleParams.arrowsSize +
              40 +
              this.props.styleParams.imageMargin / 2,
          }
        : {};

    const galleryDimensions = this.props.isPrerenderMode
      ? {
          width: '100%',
          height: this.props.container.galleryHeight,
        }
      : {
          height: this.props.container.galleryHeight,
          width: this.props.container.galleryWidth,
        };

    const galleryStyle = {
      ...galleryDimensions,
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
          (this.props.styleParams.isRTL ? ' rtl ' : ' ltr ')
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
      }
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

  calcSlideshowCounterWidth() {
    const { totalItemsCount } = this.props;
    if (totalItemsCount < 10) {
      // x/x
      return 26;
    } else if (totalItemsCount < 100) {
      // xx/xx
      return 43;
    } else if (totalItemsCount < 1000) {
      // xxx/xxx
      return 60;
    } else {
      // xxxx/xxxx or more
      return 76;
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
      this.props.styleParams.imageMargin / 2 +
      (this.isFullWidthGallery() ? 50 : 0);

    const side =
      galleryTextAlign === 'right'
        ? { left: `${imageMargin / 2}px` }
        : {
            right: `${
              imageMargin / 2 +
              (this.shouldCreateSlideShowNumbers
                ? this.calcSlideshowCounterWidth()
                : 0)
            }px`,
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
      this.props.styleParams.imageMargin / 2 +
      (this.isFullWidthGallery() ? 50 : 0);

    const leftMargin = this.shouldCreateSlideShowPlayButton
      ? imageMargin / 2 + 25
      : imageMargin / 2;

    const side =
      galleryTextAlign === 'right'
        ? { left: `${leftMargin}px` }
        : { right: `${imageMargin / 2}px` };

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
          {(this.state.currentIdx % totalItemsCount) +
            1 +
            '/' +
            totalItemsCount}
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
    let classNames = 'pro-gallery-parent-container';
    if (this.props.styleParams.isSlideshow) {
      classNames += ' gallery-slideshow';
    } else if (this.props.styleParams.isSlider) {
      classNames += ' gallery-slider';
    } else if (this.props.styleParams.hasThumbnails) {
      classNames += ' gallery-thumbnails';
    } else if (this.props.styleParams.isColumns) {
      classNames += ' gallery-columns';
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
        (this.props.styleParams.imageMargin / 2 -
          this.props.styleParams.galleryMargin),
    };
  }

  getScrollLeft() {
    return this.container
      ? (this.props.styleParams.isRTL ? -1 : 1) * this.container.scrollLeft
      : 0;
  }

  //-----------------------------------------| REACT |--------------------------------------------//

  UNSAFE_componentWillReceiveProps(props) {
    if (props.items) {
      this.ItemsForSlideshowLoopThumbnails = false;
    }
    if (this.props.isInDisplay !== props.isInDisplay) {
      this.setState({ isInView: props.isInDisplay }, () =>
        this.startAutoSlideshowIfNeeded(props.styleParams)
      );
    }
    if (this.props.currentIdx !== props.currentIdx) {
      utils.setStateAndLog(
        this,
        'Next Item',
        {
          currentIdx: props.currentIdx,
        },
        () => {
          this.onCurrentItemChanged();
        }
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

  removeArrowsIfNeeded() {
    setTimeout(() => {
      const { isRTL } = this.props.styleParams;
      const { hideLeftArrow, hideRightArrow } = this.state;

      const isScrollStart = this.isScrollStart();
      const isFirstItem = this.isFirstItem();
      const isScrollEnd = this.isScrollEnd();
      const isLastItem = this.isLastItem();

      const atStart = isScrollStart || isFirstItem;
      const atEnd = isScrollEnd || isLastItem;

      const nextHideLeft = (!isRTL && atStart) || (isRTL && atEnd);
      const nextHideRight = (isRTL && atStart) || (!isRTL && atEnd);
      const isNew =
        !!nextHideLeft !== !!hideLeftArrow ||
        !!nextHideRight !== !!hideRightArrow;

      if (isNew) {
        this.setState({
          hideLeftArrow: !!nextHideLeft,
          hideRightArrow: !!nextHideRight,
        });
      }
    }, 50);
  }
  navigationOutHandler() {
    //TODO remove after full refactor release
    utils.setStateAndLog(this, 'Next Item', {
      isInView: false,
    });
    this.stopAutoSlideshow();
  }

  navigationInHandler() {
    //TODO remove after full refactor release
    utils.setStateAndLog(this, 'Next Item', {
      isInView: true,
    });
    this.startAutoSlideshowIfNeeded(this.props.styleParams);
  }

  componentDidMount() {
    window.addEventListener(
      'gallery_navigation_out',
      this.navigationOutHandler
    );
    window.addEventListener('gallery_navigation_in', this.navigationInHandler);

    this.container = window.document.querySelector(
      `#pro-gallery-${this.props.domId} #gallery-horizontal-scroll`
    );
    if (this.container) {
      this.container.addEventListener('scroll', this._setCurrentItemByScroll);
    }
    if (this.state.currentIdx > 0) {
      this.props.actions.scrollToItem(this.state.currentIdx);
      this.onCurrentItemChanged();
    } else {
      this.setCurrentItemByScroll();
    }
    this.startAutoSlideshowIfNeeded(this.props.styleParams);
  }

  componentWillUnmount() {
    window.removeEventListener(
      'gallery_navigation_out',
      this.navigationOutHandler
    );
    window.removeEventListener(
      'gallery_navigation_in',
      this.navigationInHandler
    );

    if (this.container) {
      this.container.removeEventListener(
        'scroll',
        this._setCurrentItemByScroll
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
        aria-label={this.props.proGalleryRegionLabel}
      >
        {thumbnails[0]}
        {gallery}
        {thumbnails[1]}
      </div>
    );
  }
}

export default SlideshowView;
