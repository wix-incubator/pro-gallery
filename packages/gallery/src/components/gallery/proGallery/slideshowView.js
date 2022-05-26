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
import PlayIcon from '../../svgs/components/play';
import PauseIcon from '../../svgs/components/pause';
import TextItem from '../../item/textItem.js';
import { 
  getArrowsRenderData,
  shouldRenderNavArrows,
  getArrowBoxStyle
} from '../../helpers/navigationArrowUtils'
import { getItemsInViewportOrMarginByActiveGroup } from '../../helpers/virtualization';
import { getThumbnailsData, clearGalleryItems } from '../../helpers/thumbnailsLogic';

const SKIP_SLIDES_MULTIPLIER = 1.5;



function getDirection(code) {
  const reverse = [33, 37, 38]
  const direct = [32, 34, 39, 40]
  if (reverse.includes(code)) return -1
  else if (direct.includes(code)) return 1
  throw new Error(`no direction is defined for charCode: ${code}`)
}


class SlideshowView extends React.Component {
  constructor(props) {
    super(props);

    this.scrollToThumbnail = this.scrollToThumbnail.bind(this);
    this.clearAutoSlideshowInterval = this.clearAutoSlideshowInterval.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onAutoSlideShowButtonClick =
      this.onAutoSlideShowButtonClick.bind(this);
    this.startAutoSlideshowIfNeeded =
      this.startAutoSlideshowIfNeeded.bind(this);
    this.updateAutoSlideShowState =
      this.updateAutoSlideShowState.bind(this);
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
      hideLeftArrow: !props.options.isRTL,
      hideRightArrow: props.options.isRTL,
      shouldBlockAutoSlideshow: false,
      isInFocus: false,
    };
    this.lastCurrentItem = undefined;
    this.shouldCreateSlideShowPlayButton = false;
    this.skipFromSlide = Math.round(
      this.props.totalItemsCount * SKIP_SLIDES_MULTIPLIER
    ); // Used in infinite loop
  }

  isFirstItem() {
    return this.state.activeIndex === 0;
  }

  isScrollStart() {
    const { slideAnimation } = this.props.options;

    if (slideAnimation !== GALLERY_CONSTS.slideAnimations.SCROLL || !this.scrollElement) {
      return false;
    }
    return this.scrollPosition() <= 1;
  }

  isScrollEnd() {
    const { slideshowLoop, slideAnimation } = this.props.options
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
    const { imageMargin } = this.props.options
    return galleryStructure.width - imageMargin / 2;
  }

  isFirstItemFullyVisible() {
    return !this.props.options.slideshowLoop && this.isScrollStart();
  }
  isLastItemFullyVisible() {
    return !this.props.options.slideshowLoop && this.isScrollEnd();
  }

  isLastItem() {
    return (
      !this.props.options.slideshowLoop &&
      this.state.activeIndex >= this.props.totalItemsCount - 1
    );
  }

  //__________________________________Slide show loop functions_____________________________________________

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

    const scrollingUpTheGallery = this.props.options.isRTL
    ? direction <= -1
    : direction >= 1;
    if (
      this.shouldBlockNext({ scrollingUpTheGallery })
    ) {
      this.clearAutoSlideshowInterval();
      return;
    }
    direction *= this.props.options.isRTL ? -1 : 1;
    const activeElement = document.activeElement;
    const galleryItemIsFocused =
      activeElement.className &&
      activeElement.className.includes('gallery-item-container');
    const avoidIndividualNavigation =
      !isKeyboardNavigation ||
      !(this.props.settings?.isAccessible && galleryItemIsFocused);
    let ignoreScrollPosition = false;

    if (
      this.props.options.slideAnimation !==
      GALLERY_CONSTS.slideAnimations.SCROLL
    ) {
      scrollDuration = 0;
      ignoreScrollPosition = true;
    }

    if (avoidIndividualNavigation && this.props.options.groupSize > 1) {
      this.nextGroup({ direction, scrollDuration, isContinuousScrolling, scrollingUpTheGallery }); //if its not in accessibility that requieres individual nav and we are in a horizontal(this file) collage(layout 0) - use group navigation
    } else {
      if (
        avoidIndividualNavigation &&
        GALLERY_CONSTS.isLayout('GRID')(this.props.options) &&
        this.props.options.numberOfImagesPerCol
      ) {
        direction *= this.props.options.numberOfImagesPerCol;
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

  getNextItemOrGroupToScrollTo(
    initiator,
    direction,
    ignoreScrollPosition,
    avoidIndividualNavigation,
    isAutoTrigger
  ) {
    this.isSliding = true;
    let nextIndex;
    if (
      initiator === 'nextGroup' ||
      (initiator === 'nextItem' &&
        !ignoreScrollPosition &&
        avoidIndividualNavigation &&
        !(this.props.options.groupSize > 1))
    ) {
      const key = initiator === 'nextGroup' ? 'groups' : 'galleryItems';
      nextIndex =
        this.getCenteredItemOrGroupIdxByScroll(key) + direction;
    }
    else if(initiator === 'nextItem') {
      if(ignoreScrollPosition || !isAutoTrigger) {
        nextIndex = this.state.activeIndex
      } else {
        nextIndex = this.setCurrentItemByScroll();
      }
      nextIndex += direction;

      if (!this.props.options.slideshowLoop) {
        nextIndex = Math.min(
          this.props.galleryStructure.items.length - 1,
          nextIndex
        );
        nextIndex = Math.max(0, nextIndex);
      }
    }
    this.isAutoScrolling = true;
    return nextIndex;
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

    let nextItem = this.getNextItemOrGroupToScrollTo(
      'nextItem',
      direction,
      ignoreScrollPosition,
      avoidIndividualNavigation,
      isAutoTrigger
    );

    try {
      const itemToScroll = ignoreScrollPosition ? 0 : nextItem;
      await this.scrollToItemOrGroup(
        this.props.actions.scrollToItem,
        itemToScroll,
        isContinuousScrolling,
        scrollDuration,
        scrollingUpTheGallery
      );

      if (this.props.options.groupSize === 1) {
        const skipToSlide = this.skipFromSlide - this.props.totalItemsCount;

        if (nextItem >= this.skipFromSlide) {
          nextItem = skipToSlide;
          await this.props.actions.scrollToItem(nextItem);
        }
      }

      this.onScrollToItemOrGroup(nextItem, isContinuousScrolling);

      if (ignoreScrollPosition) {
        this.props.getMoreItemsIfNeeded(
          this.props.galleryStructure.galleryItems[nextItem].offset.left
        );
        this.props.setGotFirstScrollIfNeeded();
      }
    } catch (e) {
      this.onThrowScrollError('Cannot proceed to the next Item', e);
    }
  }

  async nextGroup({
    direction,
    scrollDuration,
    isContinuousScrolling = false,
    scrollingUpTheGallery,
  }) {
    if (this.isSliding) {
      return;
    }

    const nextGroup = this.getNextItemOrGroupToScrollTo('nextGroup', direction);

    try {
      await this.scrollToItemOrGroup(
        this.props.actions.scrollToGroup,
        nextGroup,
        isContinuousScrolling,
        scrollDuration,
        scrollingUpTheGallery
      );
      const nextItem = this.getCenteredItemOrGroupIdxByScroll('galleryItems') + direction;
      this.onScrollToItemOrGroup(nextItem, isContinuousScrolling);
    } catch (e) {
      this.onThrowScrollError('Cannot proceed to the next Group', e);
    }
  }

  async scrollToItemOrGroup(
    func,
    indexToScroll,
    isContinuousScrolling,
    scrollDuration,
    scrollingUpTheGallery
  ) {
    const shouldAllowScroll = !this.shouldNotAllowScroll({ scrollingUpTheGallery });
    const { scrollMarginCorrection, _scrollDuration } = this.getScrollParameters(scrollDuration);
    shouldAllowScroll &&
      (await func(
        indexToScroll,
        false,
        true,
        _scrollDuration,
        scrollMarginCorrection,
        isContinuousScrolling
      ));
  }

  onThrowScrollError(massage, e) {
    console.error(massage, e);
    this.clearAutoSlideshowInterval();
  }

  onScrollToItemOrGroup(nextItem, isContinuousScrolling) {
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
          this.startAutoSlideshowIfNeeded(this.props.options);
        }
      }
    );
  }

  getScrollParameters(scrollDuration) {
    return {
      scrollMarginCorrection: this.getStyles().margin || 0,
      _scrollDuration: scrollDuration || this.props.options.scrollDuration || 400,
    };
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

  canStartAutoSlideshow(options) {
    return (
      options.isAutoSlideshow &&
      !this.state.shouldBlockAutoSlideshow
    );
  }

  startAutoSlideshowIfNeeded(options) {
    this.clearAutoSlideshowInterval();
    if (this.canStartAutoSlideshow(options)) {
      if (
        options.autoSlideshowType ===
        GALLERY_CONSTS.autoSlideshowTypes.CONTINUOUS &&
        options.autoSlideshowContinuousSpeed > 0
      ) {
        this.autoScrollToNextItem();
      } else if (
        options.autoSlideshowType ===
          GALLERY_CONSTS.autoSlideshowTypes.INTERVAL &&
        options.autoSlideshowInterval > 0
      ) {
        this.autoSlideshowInterval = setInterval(
          this.autoScrollToNextItem,
          options.autoSlideshowInterval * 1000
        );
      }
    }
  }

  autoScrollToNextItem = () => {
    if (
      !isEditMode() &&
      (this.props.isInViewport || isPreviewMode())
    ) {
      const { options } = this.props;
      const direction = options.isRTL ? -1 : 1;

      if (
        options.autoSlideshowType ===
        GALLERY_CONSTS.autoSlideshowTypes.CONTINUOUS
      ) {
        this._next({
          direction,
          isAutoTrigger: true,
          isContinuousScrolling: true,
        });
      } else if (options.autoSlideshowType ===
        GALLERY_CONSTS.autoSlideshowTypes.INTERVAL) {
        this._next({
          direction,
          isAutoTrigger: true,
          scrollDuration: 800,
        });
      }
    }
  };

  get clearedGalleryItems() {
    return clearGalleryItems(this.props.items, this.props.galleryStructure.galleryItems);
  }
  scrollToThumbnail(itemIdx, scrollDuration) {
    //not to confuse with this.props.actions.scrollToItem. this is used to replace it only for thumbnail items

    this.props.actions.eventsListener(
      GALLERY_CONSTS.events.THUMBNAIL_CLICKED,
      this.props
    );

    this.props.setGotFirstScrollIfNeeded(); //load all the images in the thumbnails bar

    const direction = itemIdx - this.state.activeIndex;
    this.next({
      direction,
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
    const { options, galleryStructure, settings } = this.props;
    const { clearedGalleryItems } = this;
    const activeIndex = utils.inRange(this.state.activeIndex, clearedGalleryItems.length);
    const { thumbnailSize, thumbnailSpacings } = options;
    const { horizontalThumbnails, items, thumbnailsMargins, thumbnailsStyle, activeIndexOffsetMemory } = getThumbnailsData({
      items: this.props.items,
      activeIndex,
      options,
      galleryStructure,
      thumbnailPosition,
      containerHeight: this.props.container.height,
      containerWidth: this.props.container.width,
      activeIndexOffsetMemory: this.activeIndexOffsetMemory,
      prevActiveIndex: this.prevActiveIndex,
    });

    this.prevActiveIndex = activeIndex;
    this.activeIndexOffsetMemory = activeIndexOffsetMemory;

    return (
      <div
        className={
          'pro-gallery inline-styles thumbnails-gallery ' +
          (horizontalThumbnails ? ' one-row hide-scrollbars ' : '') +
          (options.isRTL ? ' rtl ' : ' ltr ') +
          (settings?.isAccessible ? ' accessible ' : '')
        }
        style={{
          width: thumbnailsStyle.width,
          height: thumbnailsStyle.height,
          ...thumbnailsMargins,
        }}
        data-hook="gallery-thumbnails"
      >
        <div
          data-hook="gallery-thumbnails-column"
          className={'galleryColumn'}
          key={'thumbnails-column'}
          style={{ ...thumbnailsStyle }}
        >
          {items.map(({ thumbnailItem, location, idx }) => {
            const highlighted = idx === activeIndex;
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
              ...location,
            };
            return (
              <div
                key={
                  'thumbnail-' +
                  thumbnailItem.id +
                  (Number.isInteger(idx) ? '-' + idx : '')
                }
                className={
                  'thumbnailItem' +
                  (highlighted
                    ? ' pro-gallery-thumbnails-highlighted pro-gallery-highlight' +
                      (utils.isMobile() ? ' pro-gallery-mobile-indicator' : '')
                    : '')
                }
                data-key={thumbnailItem.id}
                style={itemStyle}
                onClick={() => this.scrollToThumbnail(idx)}
              >
                {thumbnailItem.type === 'text' ? (
                  <TextItem
                    {...this.props}
                    {...thumbnailItem.renderProps()}
                    options={{
                      ...options,
                      cubeType: 'fill',
                      cubeImages: true,
                    }}
                    actions={{}}
                    imageDimensions={{
                      ...itemStyle,
                      marginTop: 0,
                      marginLeft: 0,
                    }}
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

  getCenteredItemOrGroupIdxByScroll(key) {
    const itemsOrGroups = this.props.galleryStructure[key];
    let centeredItemOrGroupIdx;
    const scrollPositionAtTheMiddleOfTheGallery = this.scrollPositionAtTheMiddleOfTheGallery();

    if (scrollPositionAtTheMiddleOfTheGallery === 0) {
      centeredItemOrGroupIdx = 0;
    } else {
      for (let itemOrGroup, i = 0; (itemOrGroup = itemsOrGroups[i]); i++) {
        const itemOrGroupLeft = key === 'galleryItems' ?
        itemOrGroup.offset.left : itemOrGroup.left
        if (itemOrGroupLeft > scrollPositionAtTheMiddleOfTheGallery) {
          centeredItemOrGroupIdx = i - 1;
          break;
        }
      }
    }
    if (!(centeredItemOrGroupIdx >= 0)) {
      centeredItemOrGroupIdx = itemsOrGroups.length - 1;
    }
    return centeredItemOrGroupIdx;
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
    this.startAutoSlideshowIfNeeded(this.props.options);

    const activeIndex = this.getCenteredItemOrGroupIdxByScroll('galleryItems');

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

  createNavArrows() {
    const {
      isRTL,
      scrollDirection,
      slideshowInfoSize,
      imageMargin,
      arrowsPadding,
      arrowsPosition,
      arrowsVerticalPosition,
      layoutParams,
      titlePlacement,
      textBoxHeight,
    } = this.props.options;
    const {
      container: {
        type,
        backgroundColor,
        borderRadius,
      },
    } = layoutParams.navigationArrows;
    const isSlideshow = GALLERY_CONSTS.isLayout('SLIDESHOW')(this.props.options)
    const { hideLeftArrow, hideRightArrow } = this.state;
    const {arrowRenderer, navArrowsContainerWidth, navArrowsContainerHeight} = getArrowsRenderData({
      customNavArrowsRenderer: this.props.customComponents.customNavArrowsRenderer,
      arrowsColor: this.props.options.arrowsColor,
      arrowsSize: this.props.options.arrowsSize,
      arrowsType: layoutParams.navigationArrows.type,
      containerStyleType: type
    });

    const { galleryHeight } = this.props.container;
    const infoHeight = isSlideshow ? slideshowInfoSize : textBoxHeight;
    const imageHeight = isSlideshow
      ? galleryHeight
      : galleryHeight - infoHeight;


    // the nav arrows parent container top edge is imageMargin/2 ABOVE the actual view, that calculates the middle point of gallery
    const galleryVerticalCenter = `50% + ${imageMargin/4}px` 

    // Determines the direction fix, the direction in which we move the nav arrows 'vertical position fix' pixels 
    let directionFix;
    if (GALLERY_CONSTS.hasExternalAbovePlacement(titlePlacement)){
      directionFix = -1;
    } else if (isSlideshow || GALLERY_CONSTS.hasExternalBelowPlacement(titlePlacement)){
      directionFix = 1;
    } else {
      // if we got here, we should be ITEM_CENTER, taken care of in layoutHelper.js
    }
    const verticalPositionFix = 
          {
            [GALLERY_CONSTS.arrowsVerticalPosition.ITEM_CENTER]: 0,
            [GALLERY_CONSTS.arrowsVerticalPosition.IMAGE_CENTER]: infoHeight * directionFix,
            [GALLERY_CONSTS.arrowsVerticalPosition.INFO_CENTER]: -imageHeight * directionFix,
          }[arrowsVerticalPosition]
    
    const containerStyle = {
      width: `${navArrowsContainerWidth}px`,
      height: `${navArrowsContainerHeight}px`,
      padding: 0,
      top: `calc(${galleryVerticalCenter} - ${navArrowsContainerHeight / 2}px - 
        ${verticalPositionFix / 2}px)`,
      ...getArrowBoxStyle({
        type,
        backgroundColor,
        borderRadius,
      })
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
    const useDropShadow = type === GALLERY_CONSTS.arrowsContainerStyleType.SHADOW;
    const arrowsBaseClasses = [
      'nav-arrows-container',
      useDropShadow ? 'drop-shadow' : ''
    ]
    return [
      hideLeftArrow ? null : (
        <button
          className={
            arrowsBaseClasses.join(' ') +
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
          className={arrowsBaseClasses.join(' ')}
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


  getBufferedItems(galleryGroups, container) {
    const { state, props } = this;
    const { options, virtualizationSettings, getVisibleItems } = props;
    const { activeIndex } = state;
    const groups = getVisibleItems(galleryGroups, container);
    const galleryWidth = this.props.galleryContainerRef?.clientWidth || container.galleryWidth || 0;
  
    return getItemsInViewportOrMarginByActiveGroup({
      groups,
      activeIndex,
      galleryWidth,
      options,
      virtualizationSettings,
    })
  }

  createLayout() {
    const { container, galleryStructure } =
      this.props;

    const galleryConfig = {
      scrollingElement: this.props.scrollingElement,
      totalItemsCount: this.props.totalItemsCount,
      scroll: this.props.scroll,
      options: this.props.options,
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
        this.getBufferedItems(column.galleryGroups, container);
      if (layoutGroupView) {
        return (
          layoutGroupView.map(({group, shouldRender}) => {
            return group.rendered
              ? React.createElement(GroupView, {
                activeIndex: this.state.activeIndex,
                slideAnimation: this.props.options.slideAnimation,
                  allowLoop:
                    this.props.options.slideshowLoop &&
                    this.props.galleryStructure.width >
                      this.props.container.width,
                  ...group.renderProps(galleryConfig),
                  ariaHidden: group.idx > this.skipFromSlide,
                  shouldRenderEmpty: !shouldRender,
                container: this.props.container,
                  key: group.idx,
              }): false})
          );
        }
      
    }
 
    return galleryStructure.columns.map((column, c) => {
      const columnStyle = {
        width: this.props.isPrerenderMode ? '100%' : column.width,
        height: this.getDimensions().height,
        overflowY: this.props.isPrerenderMode ? 'visible' : 'hidden',
      };
      return (
        <div
          data-hook="gallery-column"
          id={`gallery-horizontal-scroll-${this.props.id}`}
          className={`gallery-horizontal-scroll gallery-column hide-scrollbars ${
            this.props.options.isRTL ? ' rtl ' : ' ltr '
          } ${this.props.options.scrollSnap ? ' scroll-snap ' : ''} `}
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

  getDimensions() {
    const isSlideshow = GALLERY_CONSTS.isLayout('SLIDESHOW')(this.props.options)
    const addition = isSlideshow ? this.props.options.slideshowInfoSize : 0
    const height  = this.props.container.galleryHeight + addition
    return this.props.isPrerenderMode
      ? {
        width: '100%',
        height,
      }
      : {
        height,
        width: this.props.container.galleryWidth,
      };
}

  createGallery() {
    // When arrows are set outside of the gallery, gallery is resized (in dimensionsHelper -> getGalleryWidth) and needs to be positioned accordingly
    const galleryStyleForExternalArrows =
      this.props.options.scrollDirection ===
        GALLERY_CONSTS.scrollDirection.HORIZONTAL &&
      this.props.options.arrowsPosition ===
        GALLERY_CONSTS.arrowsPosition.OUTSIDE_GALLERY
        ? {
            overflow: 'visible',
            left:
              this.props.options.arrowsSize +
              40 +
              this.props.options.imageMargin / 2,
          }
        : {};

    const galleryDimensions = this.getDimensions()
    const galleryStyle = {
      ...galleryDimensions,
      ...galleryStyleForExternalArrows,
    };

    return (
      <div
        id={this.props.galleryContainerId}
        className={
          'pro-gallery inline-styles one-row hide-scrollbars ' +
          (this.props.options.enableScroll ? ' slider ' : '') +
          (this.props.settings?.isAccessible ? ' accessible ' : '') +
          (this.props.options.isRTL ? ' rtl ' : ' ltr ')
        }
        style={galleryStyle}
      >
        {this.createDebugMsg()}
        {shouldRenderNavArrows({
          options: this.props.options,
          container: this.props.container,
          isPrerenderMode: this.props.isPrerenderMode,
          galleryStructure: this.props.galleryStructure,
          customNavArrowsRenderer: this.props.customComponents.customNavArrowsRenderer,
        }) && this.createNavArrows()}
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
        this.updateAutoSlideShowState(this.props);
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
      options: { galleryTextAlign, slideshowInfoSize },
    } = this.props;

    const imageMargin =
      this.props.options.imageMargin / 2 +
      (this.isFullWidthGallery() ? 50 : 0);

    const side =
      galleryTextAlign === 'right'
        ? { left: `${imageMargin / 2}px` }
        : {
            right: `${
              imageMargin / 2 +
              (this.props.options.allowSlideshowCounter
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
    if (!this.props.options.allowSlideshowCounter) {
      return false;
    }
    const {
      totalItemsCount,
      options: { galleryTextAlign, slideshowInfoSize },
    } = this.props;

    const imageMargin =
      this.props.options.imageMargin / 2 +
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
    const hasThumbnails = this.props.options.hasThumbnails;
    const thumbnailsPosition =
      this.props.options.galleryThumbnailsAlignment;

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

  getClassNames() {GALLERY_CONSTS.isLayout('SLIDESHOW')(this.props.options)

    let classNames = 'pro-gallery-parent-container';
    if (GALLERY_CONSTS.isLayout('SLIDESHOW')(this.props.options)) {
      classNames += ' gallery-slideshow';
    } else if (GALLERY_CONSTS.isLayout('SLIDER')(this.props.options)) {
      classNames += ' gallery-slider';
    } else if (this.props.options.hasThumbnails) {
      classNames += ' gallery-thumbnails';
    } else if (GALLERY_CONSTS.isLayout('COLUMN')(this.props.options)) {
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
        (this.props.options.imageMargin / 2 -
          this.props.options.layoutParams.gallerySpacing),
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
    return (this.props.options.isRTL ? -1 : 1) * this.scrollElement.scrollLeft;
  }

  //-----------------------------------------| REACT |--------------------------------------------//

  updateAutoSlideShowState(
    props = this.props,
  ) {
    const { isGalleryInHover, options, settings } = props;
    const {
      pauseAutoSlideshowClicked,
      shouldBlockAutoSlideshow,
      isInView,
      isInFocus,
    } = this.state;
    const shouldPauseDueToHover =
      isGalleryInHover && options.pauseAutoSlideshowOnHover;
    const shouldPauseDueToFocus = isInFocus && settings?.isAccessible;
    let shouldBlock =
      !isInView ||
      pauseAutoSlideshowClicked ||
      shouldPauseDueToFocus ||
      shouldPauseDueToHover;
    if (shouldBlockAutoSlideshow !== shouldBlock) {
      this.setState({ shouldBlockAutoSlideshow: shouldBlock }, () => {
        this.startAutoSlideshowIfNeeded(options);
      });
    }
  }

  onFocus(){
    this.setState(
      { isInFocus: true },
      () => {
        this.updateAutoSlideShowState(this.props);
      }
    );
  }

  onBlur(){
    this.setState(
      { isInFocus: false },
      () => {
        this.updateAutoSlideShowState(this.props);
      }
    );
  }

  UNSAFE_componentWillReceiveProps(props) {
    if (props.items) {
      this.itemsForSlideshowLoopThumbnails = false;
    }
    const isInView = props.isInViewport && (props.isInDisplay ?? true);
    const oldIsInView = this.props.isInViewport && (this.props.isInDisplay ?? true);
    if (isInView !== oldIsInView) {
      this.setState({ isInView }, () => {
          this.updateAutoSlideShowState(props);
        }
      );
    } else if (this.props.isGalleryInHover !== props.isGalleryInHover) {
      this.updateAutoSlideShowState(props);
    } else if (this.props.container.scrollBase != props.container.scrollBase) {
      this.forceUpdate(() => {
        this.startAutoSlideshowIfNeeded(props.options);
      });
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
        this.props.options.isAutoSlideshow !==
          props.options.isAutoSlideshow ||
        this.props.options.autoSlideshowInterval !==
          props.options.autoSlideshowInterval
      ) {
        this.startAutoSlideshowIfNeeded(props.options);
      }
    }

    this.shouldCreateSlideShowPlayButton =
      props.options.isAutoSlideshow && props.options.playButtonForAutoSlideShow;

  }

  removeArrowsIfNeeded() {
      const { isRTL } = this.props.options;
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


  componentDidMount() {

    this.scrollElement = window.document.querySelector(
      `#pro-gallery-${this.props.id} #gallery-horizontal-scroll-${this.props.id}`
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
    this.startAutoSlideshowIfNeeded(this.props.options);
  }

  componentWillUnmount() {

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
