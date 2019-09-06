import React from 'react';
import ImageItem from './imageItem.js';
import VideoItem from './videos/videoItem';
import TextItem from './textItem.js';
import VideoItemPlaceholder from './videos/videoItemPlaceholder.js';
import ItemHover from './itemHover.js';
import Texts from './texts/texts.js';
import Social from './social/social.js';
import Share from './share/share.js';
import classNames from 'classnames';
import utils from '../../utils/index.js';
import window from '../../utils/window/windowWrapper';
import { cssScrollHelper } from '../helpers/cssScrollHelper';
import { featureManager } from '../helpers/versionsHelper';
import { GalleryComponent } from '../galleryComponent';
import {
  isEditMode,
  isSiteMode,
  isSEOMode,
} from '../../utils/window/viewModeWrapper';
import EVENTS from '../../constants/events';
import PLACEMENTS from '../../constants/placements';
import OVERLAY_ANIMATIONS from '../../constants/overlayAnimations';
import IMAGE_HOVER_ANIMATIONS from '../../constants/imageHoverAnimations';
import {
  getOuterInfoStyle,
  getInnerInfoStyle,
  getContainerStyle,
  getImageStyle,
} from './itemViewStyleProvider';

class ItemView extends GalleryComponent {
  constructor(props) {
    super(props);
    this.props.actions.eventsListener(EVENTS.ITEM_CREATED, this.props);

    this.init();

    this.state = {
      failed: false,
      loaded: false,
      displayed: false,
      retries: 0,
      showShare: false,
    };

    this.activeElement = '';
  }

  //-------------------------------------------| INIT |--------------------------------------------//

  init() {
    this.onItemClick = this.onItemClick.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.toggleFullscreenIfNeeded = this.toggleFullscreenIfNeeded.bind(this);
    this.handleItemMouseDown = this.handleItemMouseDown.bind(this);
    this.handleItemMouseUp = this.handleItemMouseUp.bind(this);
    this.setItemLoaded = this.setItemLoaded.bind(this);
    this.setItemError = this.setItemError.bind(this);
    this.isVerticalContainer = this.isVerticalContainer.bind(this);
    this.isHighlight = this.isHighlight.bind(this);
    this.toggleShare = this.toggleShare.bind(this);
    this.getShare = this.getShare.bind(this);
    this.getItemHover = this.getItemHover.bind(this);
    this.getImageItem = this.getImageItem.bind(this);
    this.getVideoItem = this.getVideoItem.bind(this);
    this.getVideoItemPlaceholder = this.getVideoItemPlaceholder.bind(this);
    this.getTextItem = this.getTextItem.bind(this);
    this.getItemInner = this.getItemInner.bind(this);
    this.getItemContainerStyles = this.getItemContainerStyles.bind(this);
    this.getItemWrapperStyles = this.getItemWrapperStyles.bind(this);
    this.getItemAriaLabel = this.getItemAriaLabel.bind(this);
    this.getItemContainerClass = this.getItemContainerClass.bind(this);
    this.getItemWrapperClass = this.getItemWrapperClass.bind(this);
    this.getItemContainerTabIndex = this.getItemContainerTabIndex.bind(this);
    this.isIconTag = this.isIconTag.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this);
    this.changeActiveElementIfNeeded = this.changeActiveElementIfNeeded.bind(
      this,
    );
  }

  //----------------------------------------| ACTIONS |-------------------------------------------//
  setItemError() {
    this.setState({
      retries: this.state.retries + 1,
      failed: this.state.retries >= 3,
    });
  }
  setItemLoaded() {
    this.props.actions.eventsListener(EVENTS.ITEM_LOADED, this.props);
    this.setState({
      failed: false,
      loaded: true,
    });
    setTimeout(() => {
      this.setState({
        displayed: true,
      });
    }, 1500);
  }

  isIconTag(tagName) {
    return ['button', 'i', 'a'].indexOf(tagName.toLowerCase()) >= 0;
  }

  toggleShare(event, forceVal) {
    event.stopPropagation();
    event.preventDefault();
    if (
      event.type === 'mouseout' &&
      (this.isIconTag(event.target.tagName) ||
        (event.relatedTarget && this.isIconTag(event.relatedTarget.tagName)))
    ) {
      //mouseout event should not be fired if hovering over icons (tag name === I)
      return;
    }
    this.setState({
      showShare:
        typeof forceVal === 'undefined' ? !this.state.showShare : !!forceVal,
    });
  }

  onMouseOver() {
    this.props.actions.eventsListener(EVENTS.HOVER_SET, this.props.idx);
    this.onMouseOverEvent.itemIdx = this.props.idx; //VIDEOREWORK why do we need this?
    window.dispatchEvent(this.onMouseOverEvent);
  }

  onKeyPress(e) {
    switch (e.keyCode || e.charCode) {
      case 32: //space
      case 13: //enter
        e.preventDefault();
        e.stopPropagation();
        this.onItemClick(e); //pressing enter or space always behaves as click on main image, even if the click is on a thumbnail
        return false;
      default:
        return true;
    }
  }

  handleGalleryItemClick() {
    utils.isFunction(utils.get(window, 'galleryWixCodeApi.onItemClicked')) &&
      window.galleryWixCodeApi.onItemClicked(this.props); //TODO remove after OOI is fully integrated
    this.props.actions.eventsListener(EVENTS.ITEM_ACTION_TRIGGERED, this.props);
  }

  onItemClick(e) {
    this.props.actions.eventsListener(EVENTS.ITEM_CLICKED, this.props);
    if (this.shouldUseDirectLink()) {
      return (() => {});
    }

    e.preventDefault();

    if (this.shouldShowHoverOnMobile()) {
      this.handleHoverClickOnMobile();
    } else {
      this.handleGalleryItemClick();
    }
  }

  shouldUseDirectLink = () => {
    const { directLink } = this.props;
    const { url, target } = directLink || {};
    const useDirectLink = !!(
      url &&
      target &&
      this.props.styleParams.itemClick === 'link'
    );
    const shouldUseDirectLinkMobileSecondClick =
      this.shouldShowHoverOnMobile() &&
      this.isClickOnCurrentHoveredItem() &&
      useDirectLink;

    if (shouldUseDirectLinkMobileSecondClick) {
      this.props.actions.eventsListener(EVENTS.HOVER_SET, -1);
      return true;
    }
    if (useDirectLink && !this.shouldShowHoverOnMobile()) {
      return true;
    }
    return false;
  };

  isClickOnCurrentHoveredItem = () =>
    this.props.currentHover === this.props.idx;

  handleHoverClickOnMobile() {
    if (this.isClickOnCurrentHoveredItem()) {
      this.handleGalleryItemClick();
      this.props.actions.eventsListener(EVENTS.HOVER_SET, -1);
    } else {
      this.props.actions.eventsListener(EVENTS.HOVER_SET, this.props.idx);
    }
  }

  toggleFullscreenIfNeeded(e) {
    let targetClass = utils.get(e, 'target.className');
    if (typeof targetClass === 'object') {
      targetClass = Object.values(targetClass);
    }

    if (
      utils.isFunction(targetClass.indexOf) &&
      targetClass.indexOf('block-fullscreen') >= 0
    ) {
      console.warn('Blocked fullscreen!', e);
      return;
    } else if (this.props.styleParams.fullscreen) {
      this.props.actions.eventsListener(
        EVENTS.ITEM_ACTION_TRIGGERED,
        this.props,
      );
    }
  }

  handleItemMouseDown() {
    //check for long press
    // if (utils.isMobile()) {
    //   clearTimeout(this.longPressTimer);
    //   this.longPressTimer = setTimeout(() => {
    //     e.preventDefault(); //prevent default only after a long press (so that scroll will not break)
    //     //do something
    //   }, 500);
    // }
    return true; //make sure the default event behaviour continues
  }

  handleItemMouseUp() {
    if (utils.isMobile() && this.longPressTimer) {
      clearTimeout(this.longPressTimer);
    }
    return true; //make sure the default event behaviour continues
  }

  //-----------------------------------------| UTILS |--------------------------------------------//

  isSmallItem() {
    if (this.props.styleParams.isSlideshow) {
      return false;
    }

    let isSmallItem;
    const maxWidth = 90;
    const maxHeight = 90;
    if (
      this.props.styleParams.cubeImages &&
      this.props.styleParams.cubeType === 'fit'
    ) {
      if (this.props.style.orientation === 'landscape') {
        //wide image
        isSmallItem =
          this.props.style.width / this.props.style.ratio <= maxHeight;
      } else {
        //tall image
        isSmallItem =
          this.props.style.height * this.props.style.ratio <= maxWidth;
      }
    } else {
      isSmallItem =
        this.props.style.width <= maxWidth ||
        this.props.style.height <= maxHeight;
    }
    return isSmallItem;
  }

  isNarrow() {
    return this.props.style.width < 200;
  }

  isShort() {
    return this.props.style.height < 150;
  }

  isVerticalContainer() {
    return this.props.style.width < this.props.style.height + 1;
  }

  shouldShowHoverOnMobile() {
    if (utils.isMobile()) {
      const {
        allowDescription,
        allowTitle,
        titlePlacement,
        itemClick,
        isSlideshow,
        alwaysShowHover,
        previewHover,
      } = this.props.styleParams;
      const isNewMobileSettings = featureManager.supports.mobileSettings;
      if (isSlideshow) {
        return false;
      }
      if (itemClick === 'nothing' && this.props.type !== 'video') {
        return true;
      } else if (
        (allowTitle || allowDescription) &&
        (titlePlacement === PLACEMENTS.SHOW_ON_HOVER ||
          titlePlacement === PLACEMENTS.SHOW_NOT_ON_HOVER ||
          titlePlacement === PLACEMENTS.SHOW_ALWAYS) &&
        isNewMobileSettings
      ) {
        return true;
      }
      if (alwaysShowHover) {
        return true;
      }
      if (isEditMode() && previewHover) {
        return true;
      }
    }
    return false;
  }

  isHighlight() {
    return (
      this.props.thumbnailHighlightId &&
      this.props.thumbnailHighlightId === this.props.id
    );
  }

  shouldHover() {
    const { styleParams } = this.props;

    if (styleParams.isSlideshow) {
      return false;
    } else if (styleParams.alwaysShowHover === true) {
      return true;
    } else if (isEditMode() && styleParams.previewHover === true) {
      return true;
    } else if (styleParams.allowHover === false) {
      return false;
    } else if (utils.isMobile()) {
      return this.shouldShowHoverOnMobile();
    } else {
      return true;
    }
  }

  //---------------------------------------| COMPONENTS |-----------------------------------------//

  getImageDimensions() {
    //image dimensions are for images in grid fit - placing the image with positive margins to show it within the square
    const { styleParams, cubeRatio, style } = this.props;
    const imageIsWider = style.ratio >= cubeRatio;
    const imageMarginLeft = Math.round(
      (style.height * style.ratio - style.width) / -2,
    );
    const imageMarginTop = Math.round(
      (style.width / style.ratio - style.height) / -2,
    );
    return !(styleParams.cubeImages && styleParams.cubeType === 'fit')
      ? {
          //not grid fit
          width: style.width,
          height: style.height,
        }
      : //grid fit images
      !imageIsWider
      ? {
          //portrait
          width: style.width - 2 * imageMarginLeft,
          height: style.height,
          marginLeft: imageMarginLeft,
        }
      : {
          //landscape
          height: style.height - 2 * imageMarginTop,
          width: style.width,
          marginTop: imageMarginTop,
        };
  }

  getItemTextsDetails() {
    const props = utils.pick(this.props, [
      'title',
      'description',
      'fileName',
      'id',
      'styleParams',
      'style',
      'container',
    ]);

    const isImage =
      this.props.type === 'image' || this.props.type === 'picture';
    const useCustomButton = this.props.styleParams.useCustomButton === true;
    const shouldShowButton =
      (isImage || !this.props.styleParams.isStoreGallery) && useCustomButton;

    return (
      <Texts
        {...props}
        key={`item-texts-${props.id}`}
        itemContainer={this.itemContainer}
        showShare={this.state.showShare}
        isSmallItem={this.isSmallItem()}
        isNarrow={this.isNarrow()}
        shouldShowButton={shouldShowButton}
        actions={{
          eventsListener: this.props.actions.eventsListener,
        }}
      />
    );
  }

  getSocial() {
    const props = utils.pick(this.props, [
      'html',
      'hashtag',
      'photoId',
      'item',
      'idx',
      'currentIdx',
      'id',
      'styleParams',
      'style',
      'isDemo',
      'type',
      'createUrl',
      'loveCount',
      'isLoved',
    ]);

    return (
      <Social
        {...props}
        showShare={this.state.showShare}
        isSmallItem={this.isSmallItem()}
        isNarrow={this.isNarrow()}
        isShort={this.isShort()}
        isVerticalContainer={this.isVerticalContainer()}
        key={`item-social-${props.id}`}
        actions={{
          openItemShopInFullScreen: this.openItemShopInFullScreen,
          toggleShare: this.toggleShare,
          getShare: this.getShare,
          eventsListener: this.props.actions.eventsListener,
        }}
      />
    );
  }

  getShare() {
    const props = utils.pick(this.props, [
      'styleParams',
      'id',
      'type',
      'style',
      'currentIdx',
      'idx',
      'actions',
    ]);
    return (
      <Share
        {...props}
        allProps={this.props}
        key={`item-share-${props.id}`}
        showShare={this.state.showShare}
        isVerticalContainer={this.isVerticalContainer()}
        actions={{
          toggleShare: this.toggleShare,
          eventsListener: this.props.actions.eventsListener,
        }}
      />
    );
  }

  getItemHover(children, imageDimensions) {
    // const props = utils.pick(this.props, ['styleParams', 'type', 'idx', 'type']);
    const { customHoverRenderer, ...props } = this.props;
    return (
      <ItemHover
        {...props}
        forceShowHover={this.simulateOverlayHover()}
        shouldHover={this.shouldHover()}
        imageDimensions={imageDimensions}
        key="hover"
        actions={{
          handleItemMouseDown: this.handleItemMouseDown,
          handleItemMouseUp: this.handleItemMouseUp,
        }}
        render={customHoverRenderer}
      >
        {children}
      </ItemHover>
    );
  }

  getImageItem(imageDimensions) {
    const props = utils.pick(this.props, [
      'alt',
      'title',
      'description',
      'id',
      'idx',
      'styleParams',
      'createUrl',
      'settings',
    ]);
    return (
      <ImageItem
        {...props}
        key="imageItem"
        loaded={this.state.loaded}
        displayed={this.state.displayed}
        imageDimensions={imageDimensions}
        isThumbnail={!!this.props.thumbnailHighlightId}
        actions={{
          handleItemMouseDown: this.handleItemMouseDown,
          handleItemMouseUp: this.handleItemMouseUp,
          setItemLoaded: this.setItemLoaded,
          setItemError: this.setItemError,
        }}
      />
    );
  }

  getVideoItem(imageDimensions, itemHover) {
    return (
      <VideoItem
        {...this.props}
        playing={this.props.idx === this.props.playingVideoIdx}
        key={'video' + this.props.idx}
        hover={itemHover}
        imageDimensions={imageDimensions}
        loadingStatus={{
          failed: this.state.failed,
          loaded: this.state.loaded,
        }}
        actions={{
          ...this.props.actions,
          setItemLoaded: this.setItemLoaded,
          setItemError: this.setItemError,
          handleItemMouseDown: this.handleItemMouseDown,
          handleItemMouseUp: this.handleItemMouseUp,
        }}
      />
    );
  }
  getVideoItemPlaceholder(imageDimensions, itemHover) {
    const props = utils.pick(this.props, [
      'alt',
      'title',
      'description',
      'id',
      'idx',
      'styleParams',
      'createUrl',
      'settings',
    ]);
    return (
      <VideoItemPlaceholder
        {...props}
        loadingStatus={{
          failed: this.state.failed,
          loaded: this.state.loaded,
        }}
        key="videoPlaceholder"
        loaded={this.state.loaded}
        displayed={this.state.displayed}
        imageDimensions={imageDimensions}
        isThumbnail={!!this.props.thumbnailHighlightId}
        actions={{
          handleItemMouseDown: this.handleItemMouseDown,
          handleItemMouseUp: this.handleItemMouseUp,
          setItemLoaded: this.setItemLoaded,
          setItemError: this.setItemError,
        }}
        id={this.props.idx}
        hover={itemHover}
      />
    );
  }

  getTextItem(imageDimensions) {
    const props = utils.pick(this.props, [
      'id',
      'styleParams',
      'style',
      'html',
      'cubeRatio',
    ]);

    return (
      <TextItem
        {...props}
        key="textItem"
        imageDimensions={imageDimensions}
        actions={{
          handleItemMouseDown: this.handleItemMouseDown,
          handleItemMouseUp: this.handleItemMouseUp,
          setItemLoaded: this.setItemLoaded,
        }}
      />
    );
  }

  getItemInner() {
    const { styleParams, type } = this.props;
    let itemInner;
    const imageDimensions = this.getImageDimensions();
    let itemTexts =
      styleParams.titlePlacement === PLACEMENTS.SHOW_ON_HOVER ||
      styleParams.titlePlacement === PLACEMENTS.SHOW_NOT_ON_HOVER ||
      styleParams.titlePlacement === PLACEMENTS.SHOW_ALWAYS
        ? this.getItemTextsDetails()
        : null; //if titlePlacement (title & description) is BELOW or ABOVE, it is not part of the itemHover
    const social = this.getSocial();
    const share = this.getShare();
    const itemHover = this.getItemHover(
      [itemTexts, social, share],
      imageDimensions,
    );

    switch (type) {
      case 'dummy':
        itemInner = <div />;
        break;
      case 'video':
        if (
          this.props.idx === this.props.playingVideoIdx ||
          this.props.idx === this.props.nextVideoIdx
        ) {
          itemInner = this.getVideoItem(imageDimensions, itemHover);
        } else {
          itemInner = this.getVideoItemPlaceholder(imageDimensions, itemHover);
        }
        break;
      case 'text':
        itemInner = [this.getTextItem(imageDimensions), itemHover];
        break;
      case 'image':
      case 'picture':
      default:
        itemInner = [this.getImageItem(imageDimensions), itemHover];
    }

    if (styleParams.isSlideshow) {
      itemTexts = this.getItemTextsDetails();
      const style = {
        height: `${styleParams.slideshowInfoSize}px`,
        bottom: `-${styleParams.slideshowInfoSize}px`,
      };
      itemInner = (
        <div>
          {itemInner}
          {this.props.currentIdx === this.props.idx ? (
            <div
              className="gallery-item-info gallery-item-bottom-info"
              data-hook="gallery-item-info-buttons"
              style={style}
            >
              <div>
                {social}
                {itemTexts}
              </div>
            </div>
          ) : (
            false
          )}
        </div>
      );
    }

    return itemInner;
  }
  openItemShopInFullScreen(e) {
    e.preventDefault();
    e.stopPropagation();
    this.toggleFullscreenIfNeeded(e);
  }

  getBottomInfoElementIfNeeded() {
    const { styleParams } = this.props;

    if (
      styleParams.titlePlacement === PLACEMENTS.SHOW_BELOW &&
      (styleParams.allowTitle ||
        styleParams.allowDescription ||
        styleParams.useCustomButton)
    ) {
      return this.getInfoElement('gallery-item-bottom-info');
    } else {
      return null;
    }
  }

  getTopInfoElementIfNeeded() {
    const { styleParams } = this.props;

    if (
      styleParams.titlePlacement === PLACEMENTS.SHOW_ABOVE &&
      (styleParams.allowTitle ||
        styleParams.allowDescription ||
        styleParams.useCustomButton)
    ) {
      return this.getInfoElement('gallery-item-top-info');
    } else {
      return null;
    }
  }

  getInfoElement(elementName) {
    const { styleParams } = this.props;
    let info = null;

    //TODO: move the creation of the functions that are passed to onMouseOver and onMouseOut outside
    const { customInfoRenderer } = this.props;
    const itemTexts = customInfoRenderer
      ? customInfoRenderer(this.props)
      : this.getItemTextsDetails();
    if (itemTexts) {
      info = (
        <div style={getOuterInfoStyle(styleParams)}>
          <div
            style={getInnerInfoStyle(styleParams)}
            className={elementName}
            onMouseOver={() => {
              !utils.isMobile() && this.props.actions.eventsListener(
                EVENTS.HOVER_SET,
                this.props.idx,
              );
            }}
            aria-hidden={true}
            onMouseOut={() => {
              !utils.isMobile() && this.props.actions.eventsListener(EVENTS.HOVER_SET, -1);
            }}
          >
            {itemTexts}
          </div>
        </div>
      );
    }
    return info;
  }

  simulateHover() {
    return (
      this.props.currentHover === this.props.idx ||
      this.props.styleParams.alwaysShowHover === true ||
      (isEditMode() && this.props.styleParams.previewHover === true)
    );
  }

  simulateOverlayHover() {
    return (
      this.simulateHover() ||
      this.props.styleParams.titlePlacement === PLACEMENTS.SHOW_ALWAYS
    );
  }

  getItemContainerStyles() {
    const { styleParams, style, transform, offset } = this.props;
    const containerStyleByStyleParams = getContainerStyle(styleParams);

    const itemStyles = {
      overflowY: styleParams.isSlideshow ? 'visible' : 'hidden',
      position: 'absolute',
      bottom: 'auto',
      margin: styleParams.oneRow ? styleParams.imageMargin + 'px' : 0,
    };

    if (utils.isSSR()) {
      return { ...itemStyles, ...transform, ...containerStyleByStyleParams }; //in SSR, item styles arrive from css. htydrate phase should change these
    };

    const positionStyles = {
      top: offset.top,
      width: style.width,
      height: style.height + (styleParams.externalInfoHeight || 0),
    };
    
    const isRTL = true;
    const rtlStyles = {
      left: isRTL ? 'auto' : offset.left,
      right: !isRTL ? 'auto' : offset.left,
    };

    const styles = {
      // ...positionStyles,
      // ...rtlStyles,
      ...itemStyles,
      ...transform,
      ...containerStyleByStyleParams,
    };

    return styles;
  }

  getItemWrapperStyles() {
    const { styleParams, style, type } = this.props;
    const height = style.height;
    const styles = {};
    if (type === 'text') {
      styles.backgroundColor =
        styleParams.cubeType !== 'fit' ? 'transparent' : 'inherit';
    } else {
      styles.backgroundColor =
        (styleParams.cubeType !== 'fit' ? style.bgColor : 'inherit') ||
        'transparent';
    }
    styles.height = height + 'px';
    styles.margin = -styleParams.itemBorderWidth + 'px';

    return {
      ...styles,
      ...this.getImageDimensions(),
    };
  }

  getItemAriaLabel() {
    const { type, alt, styleParams } = this.props;
    let label;
    switch (type) {
      case 'dummy':
        label = '';
        break;
      case 'text':
        label = 'Text item';
        break;
      case 'video':
        label = alt || 'Untitled video';
        break;
      default:
        label = alt || 'Untitled image';
        break;
    }
    return label + (styleParams.isStoreGallery ? ', Buy Now' : '');
  }

  getItemContainerClass() {
    const { styleParams } = this.props;
    const isNOTslideshow = !styleParams.isSlideshow;
    const overlayAnimation = styleParams.overlayAnimation;
    const imageHoverAnimation = styleParams.imageHoverAnimation;
    const className = classNames('gallery-item-container', 'visible', {
      highlight: this.isHighlight(),
      clickable: styleParams.itemClick !== 'nothing',
      'simulate-hover': this.simulateHover(),
      'hide-hover': !this.simulateHover() && utils.isMobile(),
      'invert-hover':
        styleParams.titlePlacement === PLACEMENTS.SHOW_NOT_ON_HOVER,

      //overlay animations
      'hover-animation-fade-in':
        isNOTslideshow && overlayAnimation === OVERLAY_ANIMATIONS.FADE_IN,
      'hover-animation-expand':
        isNOTslideshow && overlayAnimation === OVERLAY_ANIMATIONS.EXPAND,
      'hover-animation-slide-up':
        isNOTslideshow && overlayAnimation === OVERLAY_ANIMATIONS.SLIDE_UP,
      'hover-animation-slide-right':
        isNOTslideshow && overlayAnimation === OVERLAY_ANIMATIONS.SLIDE_RIGHT,

      //image hover animations
      'zoom-in-on-hover':
        isNOTslideshow &&
        imageHoverAnimation === IMAGE_HOVER_ANIMATIONS.ZOOM_IN,
      'blur-on-hover':
        isNOTslideshow && imageHoverAnimation === IMAGE_HOVER_ANIMATIONS.BLUR,
      'grayscale-on-hover':
        isNOTslideshow &&
        imageHoverAnimation === IMAGE_HOVER_ANIMATIONS.GRAYSCALE,
      'shrink-on-hover':
        isNOTslideshow && imageHoverAnimation === IMAGE_HOVER_ANIMATIONS.SHRINK,
      'invert-on-hover':
        isNOTslideshow && imageHoverAnimation === IMAGE_HOVER_ANIMATIONS.INVERT,
      'color-in-on-hover':
        isNOTslideshow &&
        imageHoverAnimation === IMAGE_HOVER_ANIMATIONS.COLOR_IN,
      'darkened-on-hover':
        isNOTslideshow &&
        imageHoverAnimation === IMAGE_HOVER_ANIMATIONS.DARKENED,

      'pro-gallery-mobile-indicator': utils.isMobile(),
    });
    return className;
  }

  getItemWrapperClass() {
    const { styleParams, type } = this.props;
    const classes = ['gallery-item-wrapper', 'visible'];

    if (styleParams.cubeImages) {
      classes.push('cube-type-' + styleParams.cubeType);
    }
    if (type === 'text') {
      classes.push('gallery-item-wrapper-text');
    }
    return classes.join(' ');
  }

  getItemContainerTabIndex() {
    const tabIndex = this.isHighlight()
      ? utils.getTabIndex('currentThumbnail')
      : this.props.currentIdx === this.props.idx
      ? utils.getTabIndex('currentGalleryItem')
      : -1;
    return tabIndex;
  }

  changeActiveElementIfNeeded(prevProps) {
    try {
      if (
        (isSiteMode() || isSEOMode()) &&
        !utils.isMobile() &&
        window.document &&
        window.document.activeElement &&
        window.document.activeElement.className
      ) {
        const activeElement = window.document.activeElement;

        //check if focus is on 'gallery-item-container' in current gallery
        const isThisGalleryItemInFocus = () =>
          !!window.document.querySelector(
            `#pro-gallery-${this.props.galleryDomId} #${String(
              activeElement.id,
            )}`,
          );
        const isGalleryItemInFocus = () =>
          String(activeElement.className).indexOf('gallery-item-container') >=
          0;
        //check if focus is on 'load-more' in current gallery
        const isThisGalleryShowMoreInFocus = () =>
          !!window.document.querySelector(
            `#pro-gallery-${this.props.galleryDomId} #${String(
              activeElement.id,
            )}`,
          );
        const isShowMoreInFocus = () =>
          String(activeElement.className).indexOf('show-more') >= 0;

        if (
          (isGalleryItemInFocus() && isThisGalleryItemInFocus()) ||
          (isShowMoreInFocus() && isThisGalleryShowMoreInFocus())
        ) {
          if (
            this.props.thumbnailHighlightId !==
              prevProps.thumbnailHighlightId &&
            this.props.thumbnailHighlightId === this.props.id
          ) {
            // if the highlighted thumbnail changed and it is the same as this itemview's
            this.itemContainer.focus();
          } else if (
            this.props.currentIdx !== prevProps.currentIdx &&
            this.props.currentIdx === this.props.idx
          ) {
            //check if currentIdx has changed to the current item
            this.itemContainer.focus();
          }
        }
      }
    } catch (e) {
      console.error('Could not set focus to active element', e);
    }
  }
  //-----------------------------------------| REACT |--------------------------------------------//

  componentDidMount() {
    this.onMouseOverEvent = window.document.createEvent('CustomEvent'); // MUST be 'CustomEvent'
    this.onMouseOverEvent.initCustomEvent('on_mouse_over', false, false, null);

    if (utils.isMobile()) {
      try {
        React.initializeTouchEvents(true);
      } catch (e) {}
    }
  }

  componentDidUpdate(prevProps) {
    this.changeActiveElementIfNeeded(prevProps);
  }

  onContextMenu(e) {
    if (!utils.isDev()) {
      e.preventDefault(e);
    }
  }

  getItemAriaRole() {
    switch (this.props.styleParams.itemClick) {
      case 'expand':
      case 'fullscreen':
        return 'button';
      case 'link':
        return 'link';
      default:
        return ''
    }
  }

  composeItem() {
    const { photoId, id, hash, idx } = this.props;
    const { directLink } = this.props;
    const { itemClick } = this.props.styleParams;
    const { url, target } = directLink || {};
    const isSEO = isSEOMode();
    const noFollowForSEO = this.props.noFollowForSEO;
    const shouldUseNofollow = isSEO && noFollowForSEO;
    const shouldUseDirectLink = !!(url && target && itemClick === 'link');
    const seoLinkParams = shouldUseNofollow ? { rel: 'nofollow' } : {};
    const linkParams = shouldUseDirectLink
      ? { href: url, target, ...seoLinkParams }
      : {};
    const innerDiv = (
      <a
        data-id={photoId}
        data-idx={idx}
        key={'item-container-link-' + id}
        {...linkParams}
      >
        <div
          className={this.getItemContainerClass()}
          onContextMenu={e => this.onContextMenu(e)}
          id={cssScrollHelper.getDomId(this.props)}
          ref={e => (this.itemContainer = e)}
          onMouseOver={this.onMouseOver}
          onMouseOut={() => {
            this.props.actions.eventsListener(EVENTS.HOVER_SET, -1);
          }}
          onClick={this.onItemClick}
          onKeyDown={this.onKeyPress}
          tabIndex={this.getItemContainerTabIndex()}
          aria-label={this.getItemAriaLabel()}
          data-hash={hash}
          data-id={photoId}
          data-idx={idx}
          //aria-label={this.getItemAriaLabel()}
          role={this.getItemAriaRole()}
          data-hook="item-container"
          key={'item-container-' + id}
          style={this.getItemContainerStyles()}
        >
          {this.getTopInfoElementIfNeeded()}
          <div
            style={
              this.props.styleParams.isSlideshow
                ? {}
                : getImageStyle(this.props.styleParams)
            }
          >
            <div
              data-hook="item-wrapper"
              className={this.getItemWrapperClass()}
              key={'item-wrapper-' + id}
              style={this.getItemWrapperStyles()}
            >
              {this.getItemInner()}
            </div>
          </div>
          {this.getBottomInfoElementIfNeeded()}
        </div>
      </a>
    );
    return innerDiv;
  }
  //-----------------------------------------| RENDER |--------------------------------------------//

  render() {
    return this.composeItem();
  }
}

export default ItemView;
