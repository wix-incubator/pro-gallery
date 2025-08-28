import React from 'react';
import { GALLERY_CONSTS, window, utils, isEditMode, isPreviewMode, optionsMap } from 'pro-gallery-lib';
import GroupView from '../../group/groupView.js';
import GalleryDebugMessage from './galleryDebugMessage.js';
import PlayIcon from '../../svgs/components/play.js';
import PauseIcon from '../../svgs/components/pause.js';
import NavigationPanel, { getCustomNavigationPanelInlineStyles } from './navigationPanel.js';
import { getItemsInViewportOrMarginByActiveGroup } from '../../helpers/virtualization.js';
import { NavigationArrows } from './navigationArrows.js';
import { shouldRenderNavArrows } from '../../helpers/navigationArrowUtils.js';
import { toggleScrollLessAnimation } from './scrollLessAnimationHelper.js';

const SKIP_SLIDES_MULTIPLIER = 1.5;

function getDirection(code) {
  const reverse = [33, 37, 38];
  const direct = [32, 34, 39, 40];
  if (reverse.includes(code)) return -1;
  else if (direct.includes(code)) return 1;
  throw new Error(`no direction is defined for charCode: ${code}`);
}

/**
 * @typedef Props
 * @prop {import('pro-gallery-lib').Options} options
 */

/**
 * @extends {React.Component<Props>}
 */
class SlideshowView extends React.Component {
  constructor(props) {
    super(props);
    this.navigationPanelCallbackOnIndexChange = () => {};
    this.scrollToThumbnail = this.scrollToThumbnail.bind(this);
    this.clearAutoSlideshowInterval = this.clearAutoSlideshowInterval.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onAutoSlideShowButtonClick = this.onAutoSlideShowButtonClick.bind(this);
    this.startAutoSlideshowIfNeeded = this.startAutoSlideshowIfNeeded.bind(this);
    this.updateAutoSlideShowState = this.updateAutoSlideShowState.bind(this);
    this.canStartAutoSlideshow = this.canStartAutoSlideshow.bind(this);
    this.handleSlideshowKeyPress = this.handleSlideshowKeyPress.bind(this);
    this.onAutoSlideshowAutoPlayKeyPress = this.onAutoSlideshowAutoPlayKeyPress.bind(this);
    this.setCurrentItemByScroll = this.setCurrentItemByScroll.bind(this);
    this._setCurrentItemByScroll = utils.throttle(this.setCurrentItemByScroll, 600).bind(this);
    this._next = utils.throttle(this.nextWithEffects.bind(this), props.isScrollLessGallery ? 600 : 400).bind(this);
    this.state = {
      activeIndex: props.activeIndex || 0,
      isInView: true,
      pauseAutoSlideshowClicked: false,
      hideLeftArrow:
        props.options.behaviourParams_gallery_layoutDirection ===
        GALLERY_CONSTS[optionsMap.behaviourParams.gallery.layoutDirection].LEFT_TO_RIGHT,
      hideRightArrow:
        props.options.behaviourParams_gallery_layoutDirection ===
        GALLERY_CONSTS[optionsMap.behaviourParams.gallery.layoutDirection].RIGHT_TO_LEFT,
      shouldBlockAutoSlideshow: false,
      isInFocus: false,
    };
    this.lastCurrentItem = undefined;
    this.shouldCreateSlideShowPlayButton = false;
    this.skipFromSlide = Math.round(this.props.totalItemsCount * SKIP_SLIDES_MULTIPLIER); // Used in infinite loop
  }

  isFirstItem() {
    return this.state.activeIndex === 0;
  }

  isScrollStart(props = this.props) {
    const slideAnimation = props.options.behaviourParams_gallery_horizontal_slideAnimation;
    if (
      slideAnimation !== GALLERY_CONSTS[optionsMap.behaviourParams.gallery.horizontal.slideAnimation].SCROLL ||
      !this.scrollElement
    ) {
      return false;
    }
    return this.scrollPosition(props) <= 1;
  }

  isScrollEnd(props = this.props) {
    const slideAnimation = props.options.behaviourParams_gallery_horizontal_slideAnimation;
    if (
      props.options.behaviourParams_gallery_horizontal_loop ||
      slideAnimation === GALLERY_CONSTS[optionsMap.behaviourParams.gallery.horizontal.slideAnimation].FADE ||
      slideAnimation === GALLERY_CONSTS[optionsMap.behaviourParams.gallery.horizontal.slideAnimation].DECK
    ) {
      return false;
    }
    return (
      this.isAllItemsLoaded(props) &&
      this.scrollPositionAtTheAndOfTheGallery(props) >= Math.floor(this.getScrollElementWidth(props))
    );
  }

  isAllItemsLoaded(props = this.props) {
    const { totalItemsCount, getVisibleItems, galleryStructure, container, isPrerenderMode } = props;
    const visibleItemsCount = getVisibleItems(galleryStructure.galleryItems, container, isPrerenderMode).length;
    return visibleItemsCount >= totalItemsCount;
  }

  getScrollElementWidth(props = this.props) {
    const { galleryStructure } = props;
    return galleryStructure.width - this.props.options.layoutParams_structure_itemSpacing / 2;
  }

  isFirstItemFullyVisible() {
    return !this.props.options.behaviourParams_gallery_horizontal_loop && this.isScrollStart();
  }
  isLastItemFullyVisible() {
    return !this.props.options.behaviourParams_gallery_horizontal_loop && this.isScrollEnd();
  }

  isLastItem() {
    const activeIndex = this.state.activeIndex;
    return !this.props.options.behaviourParams_gallery_horizontal_loop && activeIndex >= this.props.totalItemsCount - 1;
  }

  //__________________________________Slide show loop functions_____________________________________________

  //__________________________________end of slide show loop functions__________________________
  shouldBlockNext({ scrollingUpTheGallery }) {
    return (scrollingUpTheGallery && this.isLastItem()) || (!scrollingUpTheGallery && this.isFirstItem());
  }

  shouldNotAllowScroll({ scrollingUpTheGallery }) {
    return (
      (scrollingUpTheGallery && this.isLastItemFullyVisible()) ||
      (!scrollingUpTheGallery && this.isFirstItemFullyVisible())
    );
  }

  async nextWithEffects(props) {
    const nextItem = await this.next(props);
    if (
      this.props.options.layoutParams_groups_groupSize === 1 &&
      this.props.isScrollLessGallery &&
      nextItem >= this.skipFromSlide
    ) {
      const skipToSlide = this.skipFromSlide - this.props.totalItemsCount;
      toggleScrollLessAnimation(() => this.onScrollToItemOrGroup(skipToSlide, false));
    }
  }

  async next({
    direction,
    isAutoTrigger,
    scrollDuration,
    isKeyboardNavigation = false,
    isContinuousScrolling = false,
  }) {
    const scrollingUpTheGallery =
      this.props.options.behaviourParams_gallery_layoutDirection ===
      GALLERY_CONSTS[optionsMap.behaviourParams.gallery.layoutDirection].RIGHT_TO_LEFT
        ? direction <= -1
        : direction >= 1;
    if (this.shouldBlockNext({ scrollingUpTheGallery })) {
      this.clearAutoSlideshowInterval();
      return;
    }
    direction *=
      this.props.options.behaviourParams_gallery_layoutDirection ===
      GALLERY_CONSTS[optionsMap.behaviourParams.gallery.layoutDirection].RIGHT_TO_LEFT
        ? -1
        : 1;
    const activeElement = document.activeElement;
    const galleryItemIsFocused = activeElement.className && activeElement.className.includes('gallery-item-container');
    const avoidIndividualNavigation =
      !isKeyboardNavigation || !(this.props.settings?.isAccessible && galleryItemIsFocused);
    let ignoreScrollPosition = false;

    if (
      this.props.options.behaviourParams_gallery_horizontal_slideAnimation !==
      GALLERY_CONSTS[optionsMap.behaviourParams.gallery.horizontal.slideAnimation].SCROLL
    ) {
      scrollDuration = 0;
      ignoreScrollPosition = true;
    }
    this.removeArrowsIfNeeded();

    if (avoidIndividualNavigation && this.props.options.layoutParams_groups_groupSize > 1) {
      return this.nextGroup({
        direction,
        scrollDuration,
        isContinuousScrolling,
        scrollingUpTheGallery,
      }); //if its not in accessibility that requieres individual nav and we are in a horizontal(this file) collage(layout 0) - use group navigation
    } else {
      if (
        avoidIndividualNavigation &&
        GALLERY_CONSTS.isLayout('GRID')(this.props.options) &&
        this.props.options.layoutParams_structure_numberOfGridRows
      ) {
        direction *= this.props.options.layoutParams_structure_numberOfGridRows;
      }
      return this.nextItem({
        direction,
        isAutoTrigger,
        scrollDuration,
        avoidIndividualNavigation,
        ignoreScrollPosition,
        isContinuousScrolling,
        scrollingUpTheGallery,
      });
    }
  }

  getNextItemOrGroupToScrollTo(initiator, direction, ignoreScrollPosition, avoidIndividualNavigation, isAutoTrigger) {
    this.isSliding = true;
    let nextIndex;
    if (
      initiator === 'nextGroup' ||
      (initiator === 'nextItem' &&
        !ignoreScrollPosition &&
        avoidIndividualNavigation &&
        !(this.props.options.layoutParams_groups_groupSize > 1))
    ) {
      const key = initiator === 'nextGroup' ? 'groups' : 'galleryItems';
      nextIndex = this.getCenteredItemOrGroupIdxByScroll(key) + direction;
    } else if (initiator === 'nextItem') {
      if (ignoreScrollPosition || !isAutoTrigger) {
        nextIndex = this.state.activeIndex;
      } else {
        nextIndex = this.setCurrentItemByScroll();
      }
      nextIndex += direction;

      if (!this.props.options.behaviourParams_gallery_horizontal_loop) {
        nextIndex = Math.min(this.props.galleryStructure.items.length - 1, nextIndex);
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

      if (this.props.options.layoutParams_groups_groupSize === 1 && !this.props.isScrollLessGallery) {
        if (nextItem >= this.skipFromSlide) {
          nextItem = utils.inRange(nextItem, this.props.totalItemsCount);
          await this.props.actions.scrollToItem(nextItem);
        }
      }

      this.onScrollToItemOrGroup(nextItem, isContinuousScrolling);

      if (ignoreScrollPosition) {
        this.props.getMoreItemsIfNeeded(this.props.galleryStructure.galleryItems[nextItem].offset.left);
        this.props.setGotFirstScrollIfNeeded();
      }
      return nextItem;
    } catch (e) {
      this.onThrowScrollError('Cannot proceed to the next Item', e);
    }
  }

  async nextGroup({ direction, scrollDuration, isContinuousScrolling = false, scrollingUpTheGallery }) {
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

  async scrollToItemOrGroup(func, indexToScroll, isContinuousScrolling, scrollDuration, scrollingUpTheGallery) {
    const shouldAllowScroll = !this.shouldNotAllowScroll({
      scrollingUpTheGallery,
    });
    const { scrollMarginCorrection, _scrollDuration } = this.getScrollParameters(scrollDuration);
    shouldAllowScroll &&
      (await func(indexToScroll, false, true, _scrollDuration, scrollMarginCorrection, isContinuousScrolling));
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
      _scrollDuration:
        scrollDuration ?? this.props.options.behaviourParams_gallery_horizontal_navigationDuration ?? 400,
    };
  }

  onCurrentItemChanged(props = this.props) {
    if (this.lastCurrentItem !== this.state.activeIndex) {
      this.lastCurrentItem = this.state.activeIndex;
      //this.props.actions.onCurrentItemChanged(this.state.currentIdx);
      const currentGalleryItem = this.props.galleryStructure.galleryItems[this.state.activeIndex];
      const item = this.props.items[this.state.activeIndex];
      if (item) {
        item.idx = this.state.activeIndex;
        item.resizedImageSrc = currentGalleryItem.createUrl(
          GALLERY_CONSTS.urlSizes.RESIZED,
          GALLERY_CONSTS.urlTypes.HIGH_RES
        );
        this.props.actions.eventsListener(GALLERY_CONSTS.events.CURRENT_ITEM_CHANGED, item);
      }
      this.navigationPanelCallbackOnIndexChange(this.state.activeIndex);
    }
    this.removeArrowsIfNeeded(props);
  }
  clearAutoSlideshowInterval() {
    clearInterval(this.autoSlideshowInterval);
  }

  canStartAutoSlideshow(options) {
    return (
      options.behaviourParams_gallery_horizontal_autoSlide_behaviour !==
        GALLERY_CONSTS[optionsMap.behaviourParams.gallery.horizontal.autoSlide.behaviour].OFF &&
      !this.state.shouldBlockAutoSlideshow
    );
  }

  /**
   *
   * @param {import('pro-gallery-lib').Options} options
   */
  startAutoSlideshowIfNeeded(options) {
    this.clearAutoSlideshowInterval();
    if (this.canStartAutoSlideshow(options)) {
      if (
        options.behaviourParams_gallery_horizontal_autoSlide_behaviour ===
          GALLERY_CONSTS[optionsMap.behaviourParams.gallery.horizontal.autoSlide.behaviour].CONTINUOUS &&
        options.behaviourParams_gallery_horizontal_autoSlide_speed > 0
      ) {
        this.autoScrollToNextItem();
      } else if (
        options.behaviourParams_gallery_horizontal_autoSlide_behaviour ===
          GALLERY_CONSTS[optionsMap.behaviourParams.gallery.horizontal.autoSlide.behaviour].INTERVAL &&
        options.behaviourParams_gallery_horizontal_autoSlide_interval > 0
      ) {
        this.autoSlideshowInterval = setInterval(
          this.autoScrollToNextItem,
          options.behaviourParams_gallery_horizontal_autoSlide_interval * 1000
        );
      }
    }
  }

  autoScrollToNextItem = () => {
    if (!isEditMode() && (this.props.isInViewport || isPreviewMode())) {
      const { options } = this.props;
      const direction =
        options.behaviourParams_gallery_layoutDirection ===
        GALLERY_CONSTS[optionsMap.behaviourParams.gallery.layoutDirection].RIGHT_TO_LEFT
          ? -1
          : 1;

      if (
        options.behaviourParams_gallery_horizontal_autoSlide_behaviour ===
        GALLERY_CONSTS[optionsMap.behaviourParams.gallery.horizontal.autoSlide.behaviour].CONTINUOUS
      ) {
        this._next({
          direction,
          isAutoTrigger: true,
          isContinuousScrolling: true,
        });
      } else if (
        options.behaviourParams_gallery_horizontal_autoSlide_behaviour ===
        GALLERY_CONSTS[optionsMap.behaviourParams.gallery.horizontal.autoSlide.behaviour].INTERVAL
      ) {
        this._next({
          direction,
          isAutoTrigger: true,
          scrollDuration: 800,
        });
      }
    }
  };

  getFirstIdx(itemIdx) {
    const { galleryItems } = this.props.galleryStructure;
    const activeItemId = galleryItems[itemIdx].itemId;
    return galleryItems.find((item) => item.itemId === activeItemId).idx;
  }

  scrollToThumbnail(itemIdx, scrollDuration) {
    //not to confuse with this.props.actions.scrollToItem. this is used to replace it only for thumbnail items
    this.props.actions.eventsListener(GALLERY_CONSTS.events.THUMBNAIL_CLICKED, this.props);
    const activeIdx = this.state.activeIndex;
    const targetIdx = activeIdx + (this.getFirstIdx(itemIdx) - this.getFirstIdx(activeIdx));
    this.scrollToIndex({ itemIdx: targetIdx, scrollDuration });
  }

  scrollToIndex({ itemIdx, scrollDuration }) {
    //not to confuse with this.props.actions.scrollToItem. this is used to replace it only for thumbnail items
    this.props.setGotFirstScrollIfNeeded(); //load all the images in the thumbnails bar

    const isRTL =
      this.props.options.behaviourParams_gallery_layoutDirection ===
      GALLERY_CONSTS[optionsMap.behaviourParams.gallery.layoutDirection].RIGHT_TO_LEFT;

    const direction = isRTL ? this.state.activeIndex - itemIdx : itemIdx - this.state.activeIndex;
    return this.next({
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
    const activeItemIdx = window.document.activeElement.getAttribute('data-idx');

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

  getCenteredItemOrGroupIdxByScroll(key) {
    const itemsOrGroups = this.props.galleryStructure[key];
    let centeredItemOrGroupIdx;
    const scrollPositionAtTheMiddleOfTheGallery = this.scrollPositionAtTheMiddleOfTheGallery();

    if (scrollPositionAtTheMiddleOfTheGallery === 0) {
      centeredItemOrGroupIdx = 0;
    } else {
      for (let itemOrGroup, i = 0; (itemOrGroup = itemsOrGroups[i]); i++) {
        const itemOrGroupLeft = key === 'galleryItems' ? itemOrGroup.offset.left : itemOrGroup.left;
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
      //avoid this function if the scroll was originated by us (arrows or navigationPanels)
      this.isAutoScrolling = false;
      return;
    }

    const isScrolling = (this.scrollElement && this.scrollElement.getAttribute('data-scrolling')) === 'true';

    if (isScrolling) {
      this.clearAutoSlideshowInterval();

      //while the scroll is animating, prevent the reaction to this event
      return;
    }
    this.startAutoSlideshowIfNeeded(this.props.options);
    if (isEditMode()) {
      return this.state.activeIndex;
    }

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
    const { container, options, customComponents, id } = this.props;
    const { hideLeftArrow, hideRightArrow } = this.state;
    return (
      <NavigationArrows
        container={container}
        options={options}
        customNavArrowsRenderer={customComponents.customNavArrowsRenderer}
        hideLeftArrow={hideLeftArrow}
        hideRightArrow={hideRightArrow}
        next={this._next}
        id={id}
      />
    );
  }

  getBufferedItems(galleryGroups, container) {
    const { state, props } = this;
    const { options, virtualizationSettings, getVisibleItems, isPrerenderMode } = props;
    const { activeIndex } = state;
    const groups = getVisibleItems(galleryGroups, container, isPrerenderMode);
    const galleryWidth = this.props.galleryContainerRef?.clientWidth || container.galleryWidth || 0;

    return getItemsInViewportOrMarginByActiveGroup({
      groups,
      activeIndex,
      galleryWidth,
      options,
      virtualizationSettings,
    });
  }
  createGalleryConfig() {
    return {
      scrollingElement: this.props.scrollingElement,
      scroll: this.props.scroll,
      container: this.props.container,
      options: this.props.options,
      settings: this.props.settings,
      activeIndex: this.state.activeIndex,
      customComponents: this.props.customComponents,
      galleryId: this.props.id,
      gotFirstScrollEvent: this.props.gotFirstScrollEvent,
      playingVideoIdx: this.props.playingVideoIdx,
      playing3DIdx: this.props.playing3DIdx,
      noFollowForSEO: this.props.noFollowForSEO,
      isPrerenderMode: this.props.isPrerenderMode,
      firstUserInteractionExecuted: this.props.firstUserInteractionExecuted,
      enableExperimentalFeatures: this.props.enableExperimentalFeatures,
      actions: {
        eventsListener: this.props.actions.eventsListener,
      },
      totalItemsCount: this.props.totalItemsCount,
      totalWidth: this.props.galleryStructure.width,
    };
  }
  createLayout() {
    const { container, galleryStructure } = this.props;
    const galleryConfig = this.createGalleryConfig();
    const renderGroups = (column) => {
      const layoutGroupView = !!column.galleryGroups.length && this.getBufferedItems(column.galleryGroups, container);
      if (layoutGroupView) {
        return layoutGroupView.map(({ group, shouldRender }) => {
          return group.rendered
            ? React.createElement(GroupView, {
                disableItemFocus: this.props.disableItemFocus,
                activeIndex: this.state.activeIndex,
                slideAnimation: this.props.options.behaviourParams_gallery_horizontal_slideAnimation,
                allowLoop:
                  this.props.options.behaviourParams_gallery_horizontal_loop &&
                  this.props.galleryStructure.width > this.props.container.width,
                ...group.renderProps(galleryConfig),
                ariaHidden: group.idx > this.skipFromSlide,
                shouldRenderEmpty: !shouldRender,
                container: this.props.container,
                key: group.idx,
              })
            : false;
        });
      }
    };

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
            this.props.options.behaviourParams_gallery_layoutDirection ===
            GALLERY_CONSTS[optionsMap.behaviourParams.gallery.layoutDirection].RIGHT_TO_LEFT
              ? ' rtl '
              : ' ltr '
          } ${this.props.options.behaviourParams_gallery_horizontal_enableScrollSnap ? ' scroll-snap ' : ''} `}
          key={'column' + c}
          style={columnStyle}
        >
          <div className="gallery-horizontal-scroll-inner">{renderGroups(column)}</div>
        </div>
      );
    });
  }

  getDimensions() {
    const height = this.props.container.galleryHeight;
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
      this.props.options.layoutParams_structure_scrollDirection ===
        GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].HORIZONTAL &&
      this.props.options.layoutParams_navigationArrows_position ===
        GALLERY_CONSTS[optionsMap.layoutParams.navigationArrows.position].OUTSIDE_GALLERY
        ? {
            overflow: 'visible',
            left:
              this.props.options.layoutParams_navigationArrows_size +
              40 +
              this.props.options.layoutParams_structure_itemSpacing / 2,
          }
        : {};
    const mouseCursorContainerStyle = {
      display: 'flex',
      justifyContent: 'space-between',
    };
    const galleryDimensions = this.getDimensions();
    const galleryStyle = {
      ...galleryDimensions,
      ...galleryStyleForExternalArrows,
      ...mouseCursorContainerStyle,
    };

    return (
      <div
        id={this.props.galleryContainerId}
        className={
          'pro-gallery inline-styles one-row hide-scrollbars ' +
          (this.props.options.behaviourParams_gallery_horizontal_blockScroll ? '' : ' slider ') +
          (this.props.settings?.isAccessible ? ' accessible ' : '') +
          (this.props.options.behaviourParams_gallery_layoutDirection ===
          GALLERY_CONSTS[optionsMap.behaviourParams.gallery.layoutDirection].RIGHT_TO_LEFT
            ? ' rtl '
            : ' ltr ')
        }
        style={galleryStyle}
      >
        {this.createDebugMsg()}
        {this.createLayout()}
        {this.createAutoSlideShowPlayButton()}
        {this.createSlideShowNumbers()}
        {shouldRenderNavArrows({
          options: this.props.options,
          container: this.props.container,
          isPrerenderMode: this.props.isPrerenderMode,
          galleryStructure: this.props.galleryStructure,
          customNavArrowsRenderer: this.props.customComponents.customNavArrowsRenderer,
        }) && this.createNavArrows()}
      </div>
    );
  }

  onAutoSlideShowButtonClick() {
    this.setState({ pauseAutoSlideshowClicked: !this.state.pauseAutoSlideshowClicked }, () => {
      this.updateAutoSlideShowState(this.props);
    });
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

    const slideshowInfoAlignment = this.props.options.behaviourParams_gallery_horizontal_slideshowInfo_buttonsAlignment;
    const calculatedItemSpacing =
      this.props.options.layoutParams_structure_itemSpacing / 2 + (this.isFullWidthGallery() ? 50 : 0);

    const side =
      slideshowInfoAlignment ===
      GALLERY_CONSTS[optionsMap.behaviourParams.gallery.horizontal.slideshowInfo.buttonsAlignment].RIGHT
        ? { left: `${calculatedItemSpacing / 2}px` }
        : {
            right: `${
              calculatedItemSpacing / 2 +
              (this.props.options.behaviourParams_gallery_horizontal_slideshowInfo_enableCounter
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
          top: `calc(100% - ${this.props.options.layoutParams_info_height}px + 3px)`,
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
    if (!this.props.options.behaviourParams_gallery_horizontal_slideshowInfo_enableCounter) {
      return false;
    }
    const { totalItemsCount } = this.props;
    const slideshowInfoAlignment = this.props.options.behaviourParams_gallery_horizontal_slideshowInfo_buttonsAlignment;

    const calculatedItemSpacing =
      this.props.options.layoutParams_structure_itemSpacing / 2 + (this.isFullWidthGallery() ? 50 : 0);

    const leftMargin = this.shouldCreateSlideShowPlayButton
      ? calculatedItemSpacing / 2 + 25
      : calculatedItemSpacing / 2;

    const side =
      slideshowInfoAlignment ===
      GALLERY_CONSTS[optionsMap.behaviourParams.gallery.horizontal.slideshowInfo.buttonsAlignment].RIGHT
        ? { left: `${leftMargin}px` }
        : { right: `${calculatedItemSpacing / 2}px` };

    return (
      <div
        className={'auto-slideshow-counter'}
        data-hook="auto-slideshow-counter"
        style={{
          top: `calc(100% - ${this.props.options.layoutParams_info_height}px + 3px)`,
          ...side,
        }}
      >
        <div>{(this.state.activeIndex % totalItemsCount) + 1 + '/' + totalItemsCount}</div>
      </div>
    );
  }

  getCustomNavigationPanel = () => {
    if (typeof this.props.customComponents?.EXPERIMENTAL_customNavigationPanelRenderer === 'function') {
      return this.props.customComponents.EXPERIMENTAL_customNavigationPanelRenderer;
    } else {
      return false;
    }
  };
  createOrGetCustomNavigationPanelAPI = () => {
    const isRTL =
      this.props.options.behaviourParams_gallery_layoutDirection ===
      GALLERY_CONSTS[optionsMap.behaviourParams.gallery.layoutDirection].RIGHT_TO_LEFT;
    if (!this.navigationPanelAPI) {
      this.navigationPanelAPI = {
        onGalleryNavigationStart: (handler) => {
          this.props.actions.eventsListener(GALLERY_CONSTS.events.GALLERY_NAVIGATION_START, handler);
        },
        next: () => {
          this.next({
            scrollDuration: 400,
            isKeyboardNavigation: false,
            isAutoTrigger: false,
            avoidIndividualNavigation: false,
            isContinuousScrolling: false,
            direction: isRTL ? -1 : 1,
          });
        },
        previous: () => {
          this.next({
            scrollDuration: 400,
            isKeyboardNavigation: false,
            isAutoTrigger: false,
            avoidIndividualNavigation: false,
            isContinuousScrolling: false,
            direction: isRTL ? 1 : -1,
          });
        },
        navigateNextEnabled: () => {
          return isRTL ? !this.state.hideLeftArrow : !this.state.hideRightArrow;
        },
        navigatePreviousEnabled: () => {
          return isRTL ? !this.state.hideRightArrow : !this.state.hideLeftArrow;
        },
        currentIndex: () => {
          return this.state.activeIndex;
        },
        triggerItemClick: (e, { itemIndex = this.state.activeIndex } = {}) => {
          const galleryConfig = this.createGalleryConfig();
          const item = this.props.galleryStructure.galleryItems[itemIndex % this.props.totalItemsCount];
          const props = item?.renderProps({
            ...galleryConfig,
            visible: true,
          });

          this.props.actions.eventsListener(GALLERY_CONSTS.events.ITEM_ACTION_TRIGGERED, props, e);
        },
        navigateToIndex: (itemIdx, animationDuration = 400) => {
          this.scrollToIndex({ itemIdx, scrollDuration: animationDuration });
        },
      };
    }
    this.props.actions.eventsListener(GALLERY_CONSTS.events.NAVIGATION_API_READY, this.navigationPanelAPI);
    return this.navigationPanelAPI;
  };

  getNavigationPanelArray() {
    if (!this.props.options.layoutParams_thumbnails_enable) {
      return [false, false];
    }

    const customNavigationPanelRenderer = this.getCustomNavigationPanel();

    let navigationPanel;
    if (customNavigationPanelRenderer) {
      const { galleryHeight, galleryWidth, height, width } = this.props.container;
      const customNavigationPanelInlineStyles = getCustomNavigationPanelInlineStyles({
        galleryHeight,
        galleryWidth,
        height,
        width,
        galleryThumbnailsAlignment: this.props.options.layoutParams_thumbnails_alignment,
        navigationPanelPosition: this.props.options.layoutParams_thumbnails_position,
      });
      navigationPanel = (domOrder) => (
        <div className="custom-navigation-panel" style={customNavigationPanelInlineStyles}>
          {customNavigationPanelRenderer({
            ...this.props,
            domOrder,
            activeIndex: this.state.activeIndex,
            navigationToIdxCB: this.scrollToThumbnail,
            navigationPanelAPI: this.createOrGetCustomNavigationPanelAPI(),
          })}
        </div>
      );
    } else {
      navigationPanel = (domOrder) => (
        <NavigationPanel
          {...this.props}
          domOrder={domOrder}
          activeIndex={this.state.activeIndex}
          navigationToIdxCB={this.scrollToThumbnail}
        />
      );
    }

    const navigationPanels = [];
    if (
      this.props.options.layoutParams_thumbnails_position ===
      GALLERY_CONSTS[optionsMap.layoutParams.thumbnails.position].ON_GALLERY
    ) {
      navigationPanels[0] = false;
      navigationPanels[1] = navigationPanel('after');
      return navigationPanels;
    } else {
      //OUTSIDE_GALLERY
      if (this.props.isPrerenderMode) {
        navigationPanels[0] = navigationPanel('before');
        navigationPanels[1] = navigationPanel('after');
        return navigationPanels;
      }
      switch (this.props.options.layoutParams_thumbnails_alignment) {
        case GALLERY_CONSTS[optionsMap.layoutParams.thumbnails.alignment].TOP:
        case GALLERY_CONSTS[optionsMap.layoutParams.thumbnails.alignment].LEFT:
          navigationPanels[0] = navigationPanel('before');
          navigationPanels[1] = false;
          break;
        case GALLERY_CONSTS[optionsMap.layoutParams.thumbnails.alignment].RIGHT:
        case GALLERY_CONSTS[optionsMap.layoutParams.thumbnails.alignment].BOTTOM:
          navigationPanels[0] = false;
          navigationPanels[1] = navigationPanel('after');
          break;
      }
      return navigationPanels;
    }
  }

  getClassNames() {
    let classNames = 'pro-gallery-parent-container';
    if (GALLERY_CONSTS.isLayout('SLIDER')(this.props.options)) {
      classNames += ' gallery-slider';
    } else if (this.props.options.layoutParams_thumbnails_enable) {
      classNames += ' gallery-thumbnails';
    } else if (GALLERY_CONSTS.isLayout('COLUMN')(this.props.options)) {
      classNames += ' gallery-columns';
    }

    return classNames;
  }
  getStyles() {
    return {
      margin:
        -1 *
        (this.props.options.layoutParams_structure_itemSpacing / 2 -
          this.props.options.layoutParams_structure_gallerySpacing),
      width: this.props.container.width,
      height: this.props.container.height,
    };
  }

  getScrollPosition(props = this.props) {
    return this.scrollElement ? this.scrollPosition(props) : 0;
  }

  scrollPositionAtTheMiddleOfTheGallery() {
    return this.getScrollPosition() + this.props.container.galleryWidth / 2;
  }

  scrollPositionAtTheAndOfTheGallery(props = this.props) {
    return this.getScrollPosition(props) + props.container.galleryWidth;
  }

  scrollPosition(props = this.props) {
    return (
      (props.options.behaviourParams_gallery_layoutDirection ===
      GALLERY_CONSTS[optionsMap.behaviourParams.gallery.layoutDirection].RIGHT_TO_LEFT
        ? -1
        : 1) * this.scrollElement.scrollLeft
    );
  }

  //-----------------------------------------| REACT |--------------------------------------------//

  updateAutoSlideShowState(props = this.props) {
    const { isGalleryInHover, options, settings } = props;
    const { pauseAutoSlideshowClicked, shouldBlockAutoSlideshow, isInView, isInFocus } = this.state;
    const shouldPauseDueToHover = isGalleryInHover && options.behaviourParams_gallery_horizontal_autoSlide_pauseOnHover;
    const shouldPauseDueToFocus = isInFocus && settings?.isAccessible;
    let shouldBlock = !isInView || pauseAutoSlideshowClicked || shouldPauseDueToFocus || shouldPauseDueToHover;
    if (shouldBlockAutoSlideshow !== shouldBlock) {
      this.setState({ shouldBlockAutoSlideshow: shouldBlock }, () => {
        this.startAutoSlideshowIfNeeded(options);
      });
    }
  }

  onFocus() {
    this.setState({ isInFocus: true }, () => {
      this.updateAutoSlideShowState(this.props);
    });
  }

  onBlur() {
    this.setState({ isInFocus: false }, () => {
      this.updateAutoSlideShowState(this.props);
    });
  }

  UNSAFE_componentWillReceiveProps(props) {
    const isInView = props.isInViewport && (props.isInDisplay ?? true);
    const oldIsInView = this.props.isInViewport && (this.props.isInDisplay ?? true);
    if (isInView !== oldIsInView) {
      this.setState({ isInView }, () => {
        this.updateAutoSlideShowState(props);
      });
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
          this.onCurrentItemChanged(props);
        }
      );
    }
    if (
      this.props.totalItemsCount !== props.totalItemsCount ||
      this.props.container.galleryHeight !== props.container.galleryHeight ||
      this.props.container.galleryWidth !== props.container.galleryWidth ||
      this.state.activeIndex !== props.activeIndex
    ) {
      this.removeArrowsIfNeeded(props);
    }
    if (isEditMode() || isPreviewMode()) {
      if (
        //check that the change is related to the slideshow settings
        ((this.props.options.behaviourParams_gallery_horizontal_autoSlide_behaviour !==
          GALLERY_CONSTS[optionsMap.behaviourParams.gallery.horizontal.autoSlide.behaviour].OFF) !==
          props.options.behaviourParams_gallery_horizontal_autoSlide_behaviour) !==
          GALLERY_CONSTS[optionsMap.behaviourParams.gallery.horizontal.autoSlide.behaviour].OFF ||
        this.props.options.behaviourParams_gallery_horizontal_autoSlide_interval !==
          props.options.behaviourParams_gallery_horizontal_autoSlide_interval
      ) {
        this.startAutoSlideshowIfNeeded(props.options);
      }
    }

    this.shouldCreateSlideShowPlayButton =
      props.options.behaviourParams_gallery_horizontal_autoSlide_behaviour !==
        GALLERY_CONSTS[optionsMap.behaviourParams.gallery.horizontal.autoSlide.behaviour].OFF &&
      props.options.behaviourParams_gallery_horizontal_slideshowInfo_enablePlayButton;
  }

  removeArrowsIfNeeded(props = this.props) {
    const isRTL =
      props.options.behaviourParams_gallery_layoutDirection ===
      GALLERY_CONSTS[optionsMap.behaviourParams.gallery.layoutDirection].RIGHT_TO_LEFT;
    const { hideLeftArrow, hideRightArrow } = this.state;

    const isScrollStart = this.isScrollStart(props);
    const isFirstItem = this.isFirstItem();
    const isScrollEnd = this.isScrollEnd(props);
    const isLastItem = this.isLastItem();

    let atStart, atEnd;
    if (isEditMode()) {
      atStart = isFirstItem;
      atEnd = isLastItem;
    } else {
      atStart = isScrollStart || isFirstItem;
      atEnd = isScrollEnd || isLastItem;
    }

    const nextHideLeft = (!isRTL && atStart) || (isRTL && atEnd);
    const nextHideRight = (isRTL && atStart) || (!isRTL && atEnd);
    const shouldUpdateArrowsState = !!nextHideLeft !== !!hideLeftArrow || !!nextHideRight !== !!hideRightArrow;

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
    this.createOrGetCustomNavigationPanelAPI();
  }

  componentWillUnmount() {
    if (this.scrollElement) {
      this.scrollElement.removeEventListener('scroll', this._setCurrentItemByScroll);
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
    const navigationPanel = this.getNavigationPanelArray();

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
          proGalleryRegionLabel: this.props.proGalleryRegionLabel,
        })}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
      >
        {navigationPanel[0]}
        {gallery}
        {navigationPanel[1]}
      </div>
    );
  }
}

export default SlideshowView;
