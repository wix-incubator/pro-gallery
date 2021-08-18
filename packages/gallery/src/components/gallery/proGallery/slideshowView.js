/* eslint-disable prettier/prettier */
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

function getDirection(code) {
  const reverse = [33, 37, 38]
  const direct = [32, 34, 39, 40]
  if (reverse.includes(code)) return -1
  else if (direct.includes(code)) return 1
  throw new Error(`no direction is defined for charCode: ${code}`)
}

class SlideshowView extends GalleryComponent {
  constructor(props) {
    super(props);

    this.navigationOutHandler = this.navigationOutHandler.bind(this);
    this.navigationInHandler = this.navigationInHandler.bind(this);
    this.scrollToThumbnail = this.scrollToThumbnail.bind(this);
    this.clearAutoSlideshowInterval = this.clearAutoSlideshowInterval.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onAutoSlideShowButtonClick =
      this.onAutoSlideShowButtonClick.bind(this);
    this.startAutoSlideshowIfNeeded =
      this.startAutoSlideshowIfNeeded.bind(this);
    this.blockAutoSlideshowIfNeeded =
      this.blockAutoSlideshowIfNeeded.bind(this);
    this.canStartAutoSlideshow = this.canStartAutoSlideshow.bind(this);
    this.handleSlideshowKeyPress = this.handleSlideshowKeyPress.bind(this);
    this.onAutoSlideshowAutoPlayKeyPress =
      this.onAutoSlideshowAutoPlayKeyPress.bind(this);
    this.setCurrentItemByScroll = this.setCurrentItemByScroll.bind(this);
    this._setCurrentItemByScroll = utils
      .throttle(this.setCurrentItemByScroll, 600)
      .bind(this);
    this._next = utils.throttle(this.next.bind(this), 400).bind(this);
    this.state = {
      activeIndex: props.activeIndex || 0,
      isInView: true,
      pauseAutoSlideshowClicked: false,
      hideLeftArrow: !props.isRTL,
      hideRightArrow: props.isRTL,
      shouldBlockAutoSlideshow: false,
      isInFocus: false,
    };
    this.lastCurrentItem = undefined;
    this.shouldCreateSlideShowPlayButton = false;
    this.shouldCreateSlideShowNumbers = false;
    this.skipFromSlide = Math.round(
      this.props.totalItemsCount * SKIP_SLIDES_MULTIPLIER
    ); // Used in infinite loop
  }

  isFirstItem() {
    return this.state.activeIndex === 0;
  }

  isScrollStart() {
    const { slideAnimation } = this.props.styleParams;

    if (slideAnimation !== GALLERY_CONSTS.slideAnimations.SCROLL || !this.scrollElement) {
      return false;
    }
    return this.scrollPosition() <= 1;
  }

  isScrollEnd() {
    const { slideshowLoop, slideAnimation } = this.props.styleParams
    if (
      slideshowLoop ||
      slideAnimation === GALLERY_CONSTS.slideAnimations.FADE ||
      slideAnimation === GALLERY_CONSTS.slideAnimations.DECK
    ) {
      return false;
    }
    return (
      this.isAllItemsLoaded() &&
      this.scrollPositionAtTheAndOfTheGallery() >=  Math.floor(this.getScrollElementWidth())
    );
  }

  isAllItemsLoaded() {
    const { totalItemsCount, getVisibleItems, galleryStructure, container } =
      this.props;
    const visibleItemsCount = getVisibleItems(
      galleryStructure.galleryItems,
      container
    ).length;
    return visibleItemsCount >= totalItemsCount;
  }

  getScrollElementWidth() {
    const { galleryStructure } = this.props;
    const { imageMargin } = this.props.styleParams
    return galleryStructure.width - imageMargin / 2;
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
      this.state.activeIndex >= this.props.totalItemsCount - 1
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
  shouldBlockNext({ scrollingUpTheGallery }) {
    return (
      (scrollingUpTheGallery && this.isLastItem()) ||
      (!scrollingUpTheGallery && this.isFirstItem())
    );
  }

  shouldNotAllowScroll({ scrollingUpTheGallery }) {
    return (
      (scrollingUpTheGallery && this.isLastItemFullyVisible()) ||
      (!scrollingUpTheGallery && this.isFirstItemFullyVisible())
    );
  }

  next({
    direction,
    isAutoTrigger,
    scrollDuration,
    isKeyboardNavigation = false,
    isContinuousScrolling = false,
  }) {

    const scrollingUpTheGallery = this.props.styleParams.isRTL
    ? direction <= -1
    : direction >= 1;

    if (
      this.shouldBlockNext({ scrollingUpTheGallery })
    ) {
      this.clearAutoSlideshowInterval();
      return;
    }
    direction *= this.props.styleParams.isRTL ? -1 : 1;
    const activeElement = document.activeElement;
    const galleryItemIsFocused =
      activeElement.className &&
      activeElement.className.includes('gallery-item-container');
    const avoidIndividualNavigation =
      !isKeyboardNavigation ||
      !(this.props.styleParams.isAccessible && galleryItemIsFocused);
    let ignoreScrollPosition = false;

    if (
      this.props.styleParams.slideAnimation !==
      GALLERY_CONSTS.slideAnimations.SCROLL
    ) {
      scrollDuration = 0;
      ignoreScrollPosition = true;
    }

    if (avoidIndividualNavigation && this.props.styleParams.groupSize > 1) {
      this.nextGroup({ direction, scrollDuration, isContinuousScrolling, scrollingUpTheGallery }); //if its not in accessibility that requieres individual nav and we are in a horizontal(this file) collage(layout 0) - use group navigation
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
        isContinuousScrolling,
        scrollingUpTheGallery,
      });
    }
    this.removeArrowsIfNeeded();
  }

  async nextItem({
    direction,
    isAutoTrigger,
    scrollDuration,
    avoidIndividualNavigation,
    ignoreScrollPosition,
    isContinuousScrolling,
    scrollingUpTheGallery,
  }) {
    if (this.isSliding) {
      return;
    }
    this.isSliding = true;

    let activeIndex;
    if (ignoreScrollPosition) {
      activeIndex = this.state.activeIndex;
    } else {
      if (
        avoidIndividualNavigation &&
        !(this.props.styleParams.groupSize > 1)
      ) {
        activeIndex = this.getCenteredItemIdxByScroll();
      } else {
        activeIndex = isAutoTrigger
          ? this.setCurrentItemByScroll()
          : this.state.activeIndex;
      }
    }

    let nextItem = activeIndex + direction;
    if (!this.props.styleParams.slideshowLoop) {
      nextItem = Math.min(
        this.props.galleryStructure.items.length - 1,
        nextItem
      );
      nextItem = Math.max(0, nextItem);
    }

    const { scrollToItem } = this.props.actions;
    this.isAutoScrolling = true;

    // ---- navigate ---- //
    try {
      const scrollMarginCorrection = this.getStyles().margin || 0;
      const _scrollDuration =
        scrollDuration || this.props.styleParams.scrollDuration || 400;
      const itemToScroll = ignoreScrollPosition ? 0 : nextItem;
      const shouldAllowScroll = !this.shouldNotAllowScroll({ scrollingUpTheGallery });

        shouldAllowScroll &&
        await scrollToItem(
            itemToScroll,
            false,
            true,
            _scrollDuration,
            scrollMarginCorrection,
            isContinuousScrolling,
          );

        if (this.props.styleParams.groupSize === 1) {
          const skipToSlide = this.skipFromSlide - this.props.totalItemsCount;

          if (nextItem >= this.skipFromSlide) {
            nextItem = skipToSlide;
           await scrollToItem(nextItem);
          }
        }

        utils.setStateAndLog(
          this,
          'Next Item',
          {
            activeIndex: nextItem,
          },
          () => {
            this.onCurrentItemChanged();
            this.isSliding = false;
            if (isContinuousScrolling) {
              this.startAutoSlideshowIfNeeded(this.props.styleParams);
            }
          }
        );

        if (ignoreScrollPosition) {
          this.props.getMoreItemsIfNeeded(
            this.props.galleryStructure.galleryItems[nextItem].offset.left
          );
          this.props.setGotFirstScrollIfNeeded();
        }

    } catch (e) {
      console.error('Cannot proceed to the next Item', e);
      this.clearAutoSlideshowInterval();
      return;
    }
  }

  async nextGroup({ direction, scrollDuration, isContinuousScrolling = false, scrollingUpTheGallery }) {
    if (this.isSliding) {
      return;
    }
    this.isSliding = true;
    const currentGroupIdx = this.getCenteredGroupIdxByScroll();
    let currentGroup = currentGroupIdx + direction;
    const scrollToGroup = this.props.actions.scrollToGroup;

    this.isAutoScrolling = true;

    // ---- navigate ---- //
    try {
      const scrollMarginCorrection = this.getStyles().margin || 0;
      const _scrollDuration =
        scrollDuration || this.props.styleParams.scrollDuration || 400;
      const shouldAllowScroll = !this.shouldNotAllowScroll({ scrollingUpTheGallery });

      shouldAllowScroll &&
      await scrollToGroup(
          currentGroup,
          false,
          true,
          _scrollDuration,
          scrollMarginCorrection,
          isContinuousScrolling
        );
      utils.setStateAndLog(
        this,
        'Next Item',
        {
          activeIndex: this.getCenteredItemIdxByScroll() + direction,
        },
        () => {
          this.onCurrentItemChanged();
          this.isSliding = false;
          if (isContinuousScrolling) {
            this.startAutoSlideshowIfNeeded(this.props.styleParams);
          }
        }
      );
    } catch (e) {
      console.error('Cannot proceed to the next Group', e);
      this.clearAutoSlideshowInterval();
      return;
    }
  }

  onCurrentItemChanged() {
    if (this.lastCurrentItem !== this.state.activeIndex) {
      this.lastCurrentItem = this.state.activeIndex;
      //this.props.actions.onCurrentItemChanged(this.state.currentIdx);
      const currentGalleryItem =
        this.props.galleryStructure.galleryItems[this.state.activeIndex];
      const item = this.props.items[this.state.activeIndex];
      if (item) {
        item.idx = this.state.activeIndex;
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
  clearAutoSlideshowInterval() {
    clearInterval(this.autoSlideshowInterval);
  }

  canStartAutoSlideshow(styleParams) {
    return (
      styleParams.isAutoSlideshow &&
      !this.state.shouldBlockAutoSlideshow
    );
  }

  startAutoSlideshowIfNeeded(styleParams) {
    this.clearAutoSlideshowInterval();
    if (this.canStartAutoSlideshow(styleParams)) {
      if (
        styleParams.autoSlideshowType ===
        GALLERY_CONSTS.autoSlideshowTypes.CONTINUOUS &&
        styleParams.autoSlideshowContinuousSpeed > 0
      ) {
        this.autoScrollToNextItem();
      } else if (
        styleParams.autoSlideshowType ===
          GALLERY_CONSTS.autoSlideshowTypes.INTERVAL &&
        styleParams.autoSlideshowInterval > 0
      ) {
        this.autoSlideshowInterval = setInterval(
          this.autoScrollToNextItem,
          styleParams.autoSlideshowInterval * 1000
        );
      }
    }
  }

  autoScrollToNextItem = () => {
    if (
      !isEditMode() &&
      (isGalleryInViewport(this.props.container) || isPreviewMode())
    ) {
      const { styleParams } = this.props;
      const direction = styleParams.isRTL ? -1 : 1;

      if (
        styleParams.autoSlideshowType ===
        GALLERY_CONSTS.autoSlideshowTypes.CONTINUOUS
      ) {
        this._next({
          direction,
          isAutoTrigger: true,
          isContinuousScrolling: true,
        });
      } else if (styleParams.autoSlideshowType ===
        GALLERY_CONSTS.autoSlideshowTypes.INTERVAL) {
        this._next({
          direction,
          isAutoTrigger: true,
          scrollDuration: 800,
        });
      }
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
      direction: itemIdx - this.state.activeIndex,
      isAutoTrigger: false,
      scrollDuration,
      isKeyboardNavigation: false,
    });
  }

  handleSlideshowKeyPress(e) {
    e.stopPropagation();
    const relevantKeys = [32, 33, 34, 37, 38, 39, 40, 27];
    // key code -> 32=space, 37=left, 38=up, 39=right, 40=down, 27=esc
    // charCode -> , 33=page up, 34=page down
    const code = e.charCode || e.keyCode;

    if (relevantKeys.includes(code) === false) return true;
    e.preventDefault();
    const activeItemIdx =
      window.document.activeElement.getAttribute('data-idx');

    const shouldFocusOutOfViewComponent =
      activeItemIdx &&
      this.props.totalItemsCount - 1 === Number(activeItemIdx) &&
      Number(activeItemIdx) === this.state.activeIndex;

    if ((code === 40 && shouldFocusOutOfViewComponent) || code === 27) {
      const elementToFocus = {
        27: this.props.galleryContainerRef,
        40: this.props.outOfViewComponent,
      }[code];
      utils.focusGalleryElement(elementToFocus);
    } else {
      this._next({ direction: getDirection(code), isKeyboardNavigation: true });
    }
    return false;
  }

  createThumbnails(thumbnailPosition) {
    let items = this.props.items;
    let activeIndex = this.state.activeIndex;
    if (this.props.styleParams.slideshowLoop) {
      if (!this.ItemsForSlideshowLoopThumbnails) {
        this.createNewItemsForSlideshowLoopThumbnails();
      }
      activeIndex += this.numOfThumbnails;
      items = this.ItemsForSlideshowLoopThumbnails;
    }
    if (utils.isVerbose()) {
      console.log('creating thumbnails for idx', activeIndex);
    }

    let width = this.props.styleParams.thumbnailSize;
    let height = this.props.styleParams.thumbnailSize;
    let horizontalThumbnails;
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
        horizontalThumbnails = true;
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
        horizontalThumbnails = false;
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

    this.firstItemIdx = activeIndex - Math.floor(numOfThumbnails / 2) - 1;
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
      activeIndex < numOfThumbnails / 2 - 1
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
      activeIndex > numOfThumbnails / 2 - 1 &&
      activeIndex < items.length - numOfThumbnails / 2
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
    } else if (activeIndex >= items.length - numOfThumbnails / 2) {
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
          (horizontalThumbnails ? ' one-row hide-scrollbars ' : '') +
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
              : thumbnailItem.idx === activeIndex;
            const itemStyle = {
              width: thumbnailSize,
              height: thumbnailSize,
              marginLeft: thumbnailSpacings,
              marginTop: thumbnailSpacings,
              overflow: 'hidden',
              backgroundImage: `url(${thumbnailItem.createUrl(
                GALLERY_CONSTS.urlSizes.THUMBNAIL,
                GALLERY_CONSTS.urlTypes.HIGH_RES
              )})`,
            };
            const thumbnailOffset = horizontalThumbnails
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
                    styleParams={{
                      ...this.props.styleParams,
                      cubeType: 'fill',
                      cubeImages: true
                    }}
                    actions={{}}
                    imageDimensions={{...itemStyle, marginTop: 0, marginLeft: 0}}
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
    // console.log('[RTL SCROLL] setCurrentItemByScroll: ', scrollLeft);
    const items = this.props.galleryStructure.galleryItems;

    let centeredIdx;

    // const scrollPos = this.props.styleParams.isRTL ?
    // this.props.galleryStructure.width - scrollLeft - this.props.container.galleryWidth / 2 :
    const scrollPositionAtTheMiddleOfTheGallery = this.scrollPositionAtTheMiddleOfTheGallery();

    if (scrollPositionAtTheMiddleOfTheGallery === 0) {
      centeredIdx = 0;
    } else {
      for (let item, i = 0; (item = items[i]); i++) {
        if (item.offset.left > scrollPositionAtTheMiddleOfTheGallery) {
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
    // console.log('[RTL SCROLL] setCurrentItemByScroll: ', scrollLeft);
    const groups = this.props.galleryStructure.groups;

    let centeredGroupIdx;

    const scrollPositionAtTheMiddleOfTheGallery = this.scrollPositionAtTheMiddleOfTheGallery();

    if (scrollPositionAtTheMiddleOfTheGallery === 0) {
      centeredGroupIdx = 0;
    } else {
      for (let group, i = 0; (group = groups[i]); i++) {
        if (group.left > scrollPositionAtTheMiddleOfTheGallery) {
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
      (this.scrollElement && this.scrollElement.getAttribute('data-scrolling')) ===
      'true';

    if (isScrolling) {
      this.clearAutoSlideshowInterval();

      //while the scroll is animating, prevent the reaction to this event
      return;
    }
    this.startAutoSlideshowIfNeeded(this.props.styleParams);

    const activeIndex = this.getCenteredItemIdxByScroll();

    if (!utils.isUndefined(activeIndex)) {
      utils.setStateAndLog(
        this,
        'Set Current Item',
        {
          activeIndex,
        },
        () => {
          this.onCurrentItemChanged();
        }
      );
    }
    return activeIndex;
  }

  createDebugMsg() {
    return <GalleryDebugMessage {...this.props.debug} />;
  }

  getArrowsRenderData() {
    const { customNavArrowsRenderer } = this.props.customComponents;
    const { arrowsSize } = this.props.styleParams;
    if (customNavArrowsRenderer) {
      return {
        arrowRenderer: customNavArrowsRenderer,
        navArrowsContainerWidth: arrowsSize,
        navArrowsContainerHeight: arrowsSize
      }
    }

    const arrowOrigWidth = 23; //arrow-right svg and arrow-left svg width
    const arrowOrigHeight = 39; //arrow-right svg and arrow-left svg height
    const scalePercentage = arrowsSize / arrowOrigWidth;
    const svgStyle = { transform: `scale(${scalePercentage})` };

    const navArrowsContainerWidth = arrowsSize; // === arrowOrigWidth * scalePercentage
    const navArrowsContainerHeight = arrowOrigHeight * scalePercentage;

    const { arrowsColor } = this.props.styleParams;
    const svgInternalStyle = utils.isMobile() && arrowsColor?.value ? {fill: arrowsColor.value} : {}


    const arrowRenderer = (position) => {
      const { d, transform } = position === 'right' ?
        {
          d: "M857.005,231.479L858.5,230l18.124,18-18.127,18-1.49-1.48L873.638,248Z",
          transform: "translate(-855 -230)"
        }
          :
        {
          d: "M154.994,259.522L153.477,261l-18.471-18,18.473-18,1.519,1.48L138.044,243Z",
          transform: "translate(-133 -225)"
        }
      return (
        <svg width={arrowOrigWidth} height={arrowOrigHeight} viewBox={`0 0 ${arrowOrigWidth} ${arrowOrigHeight}`} style={svgStyle}>
          <path
            className="slideshow-arrow"
            style={svgInternalStyle}
            d={d}
            transform={transform}
          />
        </svg>
      );
    };

    return {arrowRenderer, navArrowsContainerWidth, navArrowsContainerHeight}
  }

  createNavArrows() {
    const {
      isRTL,
      scrollDirection,
      isSlideshow,
      slideshowInfoSize,
      imageMargin,
      arrowsPadding,
      arrowsPosition,
      arrowsVerticalPosition,
      titlePlacement,
      textBoxHeight,
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
          scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL &&
          this.props.container.galleryWidth >= allGroupsWidth;
        return isAllItemsFitsGalleryWidth;
      });

    //remove navBars if no scroll is needed and is column layout
    if (shouldNotRenderNavArrows) {
      return null;
    }

    const {arrowRenderer, navArrowsContainerWidth, navArrowsContainerHeight} = this.getArrowsRenderData();

    const { galleryHeight } = this.props.container;
    const infoHeight = isSlideshow ? slideshowInfoSize : textBoxHeight;
    const imageHeight = isSlideshow
      ? galleryHeight
      : galleryHeight - infoHeight;
    const infoSpace =
      isSlideshow || GALLERY_CONSTS.hasExternalVerticalPlacement(titlePlacement)
        ? {
            [GALLERY_CONSTS.arrowsVerticalPosition.ITEM_CENTER]: 0,
            [GALLERY_CONSTS.arrowsVerticalPosition.IMAGE_CENTER]: infoHeight,
            [GALLERY_CONSTS.arrowsVerticalPosition.INFO_CENTER]: -imageHeight,
          }[arrowsVerticalPosition]
        : 0;

    const containerStyle = {
      width: `${navArrowsContainerWidth}px`,
      height: `${navArrowsContainerHeight}px`,
      padding: 0,
      top: `calc(50% - ${navArrowsContainerHeight / 2}px + ${
        imageMargin / 4
      }px - ${infoSpace / 2}px)`,
    };

    const arrowsPos =
      scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL &&
      arrowsPosition === GALLERY_CONSTS.arrowsPosition.OUTSIDE_GALLERY
        ? `-${20 + navArrowsContainerWidth}px`
        : `${imageMargin / 2 + (arrowsPadding ? arrowsPadding : 0)}px`;
    // imageMargin effect the margin of the main div ('pro-gallery-parent-container') that SlideshowView is rendering, so the arrows should be places accordingly
    // arrowsPadding relevant only for arrowsPosition.ON_GALLERY

    const prevContainerStyle = {
      left: arrowsPos,
    };
    const nextContainerStyle = {
      right: arrowsPos,
    };


    return [
      hideLeftArrow ? null : (
        <button
          className={
            'nav-arrows-container' +
            (utils.isMobile() ? ' pro-gallery-mobile-indicator' : '')
          }
          onClick={() => this._next({ direction: -1 })}
          aria-label={`${isRTL ? 'Next' : 'Previous'} Item`}
          tabIndex={utils.getTabIndex('slideshowPrev')}
          key="nav-arrow-back"
          data-hook="nav-arrow-back"
          style={{ ...containerStyle, ...prevContainerStyle }}
        >
          {arrowRenderer('left')}
        </button>
      ),
      hideRightArrow ? null : (
        <button
          className={'nav-arrows-container'}
          onClick={() => this._next({ direction: 1 })}
          aria-label={`${!isRTL ? 'Next' : 'Previous'} Item`}
          tabIndex={utils.getTabIndex('slideshowNext')}
          key="nav-arrow-next"
          data-hook="nav-arrow-next"
          style={{ ...containerStyle, ...nextContainerStyle }}
        >
          {arrowRenderer('right')}
        </button>
      ),
    ];
  }

  createLayout() {
    const { getVisibleItems, galleryStructure, container } =
      this.props;

    const galleryConfig = {
      scrollingElement: this.props.scrollingElement,
      totalItemsCount: this.props.totalItemsCount,
      scroll: this.props.scroll,
      styleParams: this.props.styleParams,
      container: this.props.container,
      settings: this.props.settings,
      activeIndex: this.state.activeIndex,
      customComponents: this.props.customComponents,
      noFollowForSEO: this.props.noFollowForSEO,
      galleryId: this.props.id,
      gotFirstScrollEvent: this.props.gotFirstScrollEvent,
      playingVideoIdx: this.props.playingVideoIdx,
      isPrerenderMode: this.props.isPrerenderMode,
      totalWidth: this.props.galleryStructure.width,
      firstUserInteractionExecuted: this.props.firstUserInteractionExecuted,
      enableExperimentalFeatures: this.props.enableExperimentalFeatures,
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
    // When arrows are set outside of the gallery, gallery is resized (in dimensionsHelper -> getGalleryWidth) and needs to be positioned accordingly
    const galleryStyleForExternalArrows =
      this.props.styleParams.scrollDirection ===
        GALLERY_CONSTS.scrollDirection.HORIZONTAL &&
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
    this.setState(
      { pauseAutoSlideshowClicked: !this.state.pauseAutoSlideshowClicked },
      () => {
        this.blockAutoSlideshowIfNeeded(this.props);
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
        aria-pressed={this.state.pauseAutoSlideshowClicked}
        tabIndex={0}
        style={{
          top: `calc(100% - ${slideshowInfoSize}px + 3px)`,
          ...side,
        }}
      >
        {this.state.pauseAutoSlideshowClicked ? (
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
          {(this.state.activeIndex % totalItemsCount) +
            1 +
            '/' +
            totalItemsCount}
        </div>
      </div>
    );
  }

  getThumbnails() {
    const hasThumbnails = this.props.styleParams.hasThumbnails;
    const thumbnailsPosition =
      this.props.styleParams.galleryThumbnailsAlignment;

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
          this.props.styleParams.layoutParams.gallerySpacing),
    };
  }

  getScrollPosition() {
    return this.scrollElement
      ? this.scrollPosition()
      : 0;
  }

  scrollPositionAtTheMiddleOfTheGallery(){
    return this.getScrollPosition() + this.props.container.galleryWidth / 2;
  }

  scrollPositionAtTheAndOfTheGallery(){
    return this.getScrollPosition() + this.props.container.galleryWidth;
  }

  scrollPosition() {
    return (this.props.styleParams.isRTL ? -1 : 1) * this.scrollElement.scrollLeft;
  }

  //-----------------------------------------| REACT |--------------------------------------------//

  blockAutoSlideshowIfNeeded(props = this.props) {
    const { isGalleryInHover, styleParams } = props;
    const { pauseAutoSlideshowClicked, shouldBlockAutoSlideshow, isInView, isInFocus } =
      this.state;
    let should = false;
    if (!isInView || pauseAutoSlideshowClicked) {
      should = true;
    } else if (
      isGalleryInHover &&
      styleParams.pauseAutoSlideshowOnHover
    ) {
      should = true;
    } else if (
      isInFocus &&
      styleParams.isAccessible
    ) {
      should = true;
    }
    if (shouldBlockAutoSlideshow !== should) {
      this.setState({ shouldBlockAutoSlideshow: should }, () => {
        this.startAutoSlideshowIfNeeded(styleParams);
      });
    } else {
      return;
    }
  }

  onFocus(){
    this.setState(
      { isInFocus: true },
      () => {
        this.blockAutoSlideshowIfNeeded(this.props);
      }
    );
  }

  onBlur(){
    this.setState(
      { isInFocus: false },
      () => {
        this.blockAutoSlideshowIfNeeded(this.props);
      }
    );
  }

  UNSAFE_componentWillReceiveProps(props) {
    if (props.items) {
      this.ItemsForSlideshowLoopThumbnails = false;
    }
    if (this.props.isInDisplay !== props.isInDisplay) {
      this.setState({ isInView: props.isInDisplay }, () =>
        this.blockAutoSlideshowIfNeeded(props)
      );
    }
    if (this.props.isGalleryInHover !== props.isGalleryInHover) {
      this.blockAutoSlideshowIfNeeded(props);
    }
    if (this.props.activeIndex !== props.activeIndex) {
      utils.setStateAndLog(
        this,
        'Next Item',
        {
          activeIndex: props.activeIndex,
        },
        () => {
          this.onCurrentItemChanged();
        }
      );
    }
    if (this.props.totalItemsCount !== props.totalItemsCount) {
      this.removeArrowsIfNeeded();
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
      const shouldUpdateArrowsState =
        !!nextHideLeft !== !!hideLeftArrow ||
        !!nextHideRight !== !!hideRightArrow;

      if (shouldUpdateArrowsState) {
        this.setState({
          hideLeftArrow: !!nextHideLeft,
          hideRightArrow: !!nextHideRight,
        });
      }
  }

  navigationOutHandler() {
    //TODO remove after full refactor release
    utils.setStateAndLog(this, 'Next Item', {
      isInView: false,
    });
    this.clearAutoSlideshowInterval();
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

    this.scrollElement = window.document.querySelector(
      `#pro-gallery-${this.props.id} #gallery-horizontal-scroll`
    );
    if (this.scrollElement) {
      this.scrollElement.addEventListener('scroll', this._setCurrentItemByScroll);
    }
    if (this.state.activeIndex > 0) {
      this.props.actions.scrollToItem(this.state.activeIndex);
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

    if (this.scrollElement) {
      this.scrollElement.removeEventListener(
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
        {...utils.getAriaAttributes({
          proGalleryRole: this.props.proGalleryRole,
          proGalleryRegionLabel: this.props.proGalleryRegionLabel
        })}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
      >
        {thumbnails[0]}
        {gallery}
        {thumbnails[1]}
      </div>
    );
  }
}

export default SlideshowView;
/* eslint-enable prettier/prettier */
