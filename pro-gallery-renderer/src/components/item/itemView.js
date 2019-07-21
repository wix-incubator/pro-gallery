import React from 'react';
import ImageItem from './imageItem.js';
import VideoItem from './videos/videoItem';
import TextItem from './textItem.js';
import VideoItemPlaceholder from './videos/videoItemPlaceholder.js';
import ItemHover from './itemHover.js';
import Texts from './texts/texts.js';
import Social from './social/social.js';
import Share from './share/share.js';
import * as actions from '../../actions/galleryActions.js';
import classNames from 'classnames';
import utils from '../../utils/index.js';
import window from '../../utils/window/windowWrapper';
import _ from 'lodash';
import {
  setHorizontalVisibility,
  setVerticalVisibility,
  setInitialVisibility,
} from '../helpers/scrollHelper.js';
import { cssScrollHelper } from '../helpers/cssScrollHelper';
import { featureManager } from '../helpers/versionsHelper';
import { GalleryComponent } from '../galleryComponent';
import EVENTS from '../../utils/constants/events';
import PLACEMENTS from '../../utils/constants/placements';
import OVERLAY_ANIMATIONS from '../../utils/constants/overlayAnimations';
import IMAGE_HOVER_ANIMATIONS from '../../utils/constants/imageHoverAnimations';

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
      playVertically: false,
      playHorizontally: true,
      visibleVertically: true,
      renderedVertically: true,
      visibleHorizontally: true,
      renderedHorizontally: true,
      scroll: {
        top: 0,
        left: 0,
      },
    };

    this.screenSize = (window && window.screen) || {
      width: 1366,
      height: 768,
    };
    this.shouldListenToScroll = this.props.type === 'video';
    this.renderedPaddingMultiply = 2;
    this.visiblePaddingMultiply = 0;
    this.videoPlayVerticalTolerance =
      (this.props.offset.bottom - this.props.offset.top) / 2;
    this.videoPlayHorizontalTolerance =
      (this.props.offset.right - this.props.offset.left) / 2;
    this.padding = {
      renderedVertical:
        utils.parseGetParam('renderedPadding') ||
        this.screenSize.height * this.renderedPaddingMultiply,
      visibleVertical:
        utils.parseGetParam('displayPadding') ||
        this.screenSize.height * this.visiblePaddingMultiply,
      playVertical:
        utils.parseGetParam('playPadding') ||
        this.screenSize.height * this.visiblePaddingMultiply -
          this.videoPlayVerticalTolerance,
      renderedHorizontal:
        utils.parseGetParam('renderedPadding') ||
        this.screenSize.width * this.renderedPaddingMultiply,
      visibleHorizontal:
        utils.parseGetParam('displayPadding') ||
        this.screenSize.width * this.visiblePaddingMultiply,
      playHorizontal:
        utils.parseGetParam('playPadding') ||
        this.screenSize.width * this.visiblePaddingMultiply -
          this.videoPlayHorizontalTolerance,
    };
    this.galleryScroll = {
      top: 0,
      left: 0,
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
    this.setVisibilityState = this.setVisibilityState.bind(this);
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
      showShare: _.isUndefined(forceVal) ? !this.state.showShare : !!forceVal,
    });
  }

  onMouseOver() {
    this.onMouseOverEvent.itemIdx = this.props.idx;
    window.dispatchEvent(this.onMouseOverEvent);
    if (this.props.type === 'video') {
      this.onVideoHover();
    }
  }

  onVideoHover() {
    const { videoPlay } = this.props.styleParams;
    if (videoPlay === 'hover' && !utils.isMobile()) {
      this.props.playVideo(this.props.idx);
    }
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

  handleGalleryItemClick(itemClick) {
    const { videoPlay } = this.props.styleParams;

    _.isFunction(_.get(window, 'galleryWixCodeApi.onItemClicked')) &&
      window.galleryWixCodeApi.onItemClicked(this.props); //TODO remove after OOI is fully integrated

    if (this.props.type === 'video' && itemClick === 'nothing') {
      const shouldTogglePlay = videoPlay === 'onClick' || utils.isMobile();
      if (shouldTogglePlay) {
        this.props.playing
          ? this.props.pauseVideo(this.props.idx)
          : this.props.playVideo(this.props.idx);
      }
    }
    this.props.actions.eventsListener(EVENTS.ITEM_ACTION_TRIGGERED, this.props);
    //this.props.actions.onItemClicked(this.props.idx);
  }

  onItemClick(e) {
    this.props.actions.eventsListener(EVENTS.ITEM_CLICKED, this.props);
    if (this.shouldUseDirectLink()) {
      return _.noop;
    }

    const { itemClick } = this.props.styleParams;

    e.preventDefault();

    if (this.shouldShowHoverOnMobile()) {
      this.handleHoverClickOnMobile(itemClick);
    } else {
      this.handleGalleryItemClick(itemClick);
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
      this.props.actions.setCurrentHover(-1);
      return true;
    }
    if (useDirectLink && !this.shouldShowHoverOnMobile()) {
      return true;
    }
    return false;
  };

  isClickOnCurrentHoveredItem = () =>
    this.props.currentHover === this.props.idx;

  handleHoverClickOnMobile(itemClick) {
    if (this.isClickOnCurrentHoveredItem()) {
      this.props.actions.eventsListener(
        EVENTS.ITEM_ACTION_TRIGGERED,
        this.props,
      );
      //this.props.actions.onItemClicked(this.props.idx);
      this.props.actions.setCurrentHover(-1);
    } else {
      this.props.actions.setCurrentHover(this.props.idx);
    }
  }

  toggleFullscreenIfNeeded(e) {
    let targetClass = _.get(e, 'target.className');
    if (_.isObject(targetClass)) {
      targetClass = _.valuesIn(targetClass);
    }

    if (
      _.isFunction(targetClass.indexOf) &&
      targetClass.indexOf('block-fullscreen') >= 0
    ) {
      console.warn('Blocked fullscreen!', e);
      return;
    } else if (this.props.styleParams.fullscreen) {
      this.props.actions.eventsListener(
        EVENTS.ITEM_ACTION_TRIGGERED,
        this.props,
      );
      //this.props.actions.onItemClicked(this.props.idx);
    }
  }

  handleItemMouseDown(e) {
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

  handleItemMouseUp(e) {
    if (utils.isMobile() && this.longPressTimer) {
      clearTimeout(this.longPressTimer);
    }
    return true; //make sure the default event behaviour continues
  }

  //-----------------------------------------| UTILS |--------------------------------------------//

  setVisibilityState(state) {
    const newState = {};
    Object.keys(state).forEach(key => {
      if (state[key] !== this.state[key]) {
        newState[key] = state[key];
      }
    });
    this.setState(newState, () => {
      this.props.store.dispatch(
        actions.galleryWindowLayoutChanged(this.screenSize.height),
      );
    });
  }

  getItemVisibility() {
    return this.state.visibleHorizontally && this.state.visibleVertically;
  }

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
      if (utils.isEditor() && previewHover) {
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

    if (styleParams.alwaysShowHover === true) {
      return true;
    } else if (utils.isEditor() && styleParams.previewHover === true) {
      return true;
    } else if (styleParams.isSlideshow) {
      return false;
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

  isVisible() {
    return this.state.playVertically && this.state.playHorizontally;
  }

  videoOnMount(videoElement) {
    this.props.videoAdded({
      idx: this.props.idx,
      isVisible: () => this.isVisible(),
    });
  }

  videoOnUnmount() {
    this.props.videoRemoved(this.props.idx);
  }

  getItemTextsDetails() {
    const props = _.pick(this.props, [
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
      (isImage || !utils.isStoreGallery()) && useCustomButton;

    return (
      <Texts
        {...props}
        key={`item-texts-${props.id}`}
        itemContainer={this.itemContainer}
        showShare={this.state.showShare}
        isSmallItem={this.isSmallItem()}
        isNarrow={this.isNarrow()}
        titlePlacement={this.props.styleParams.titlePlacement}
        shouldShowButton={shouldShowButton}
        actions={{
          eventsListener: this.props.actions.eventsListener,
        }}
      />
    );
  }

  getSocial() {
    const props = _.pick(this.props, [
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
      'download_url',
      'originalsUrl',
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
    const props = _.pick(this.props, [
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
    // const props = _.pick(this.props, ['styleParams', 'type', 'idx', 'type']);
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
    const props = _.pick(this.props, [
      'alt',
      'title',
      'description',
      'id',
      'idx',
      'styleParams',
      'resized_url',
      'settings',
      'isInSEO',
    ]);
    return (
      <ImageItem
        {...props}
        key="imageItem"
        visible={this.getItemVisibility()}
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
        onMount={this.videoOnMount.bind(this)}
        onUnmount={this.videoOnUnmount.bind(this)}
        onEnd={this.props.videoEnded.bind(this)}
        key={'video' + this.props.idx}
        hover={itemHover}
        imageDimensions={imageDimensions}
        loadingStatus={{
          failed: this.state.failed,
          loaded: this.state.loaded,
        }}
        onClick={this.handleVideoClick}
        actions={_.merge({}, this.props.actions, {
          setItemLoaded: this.setItemLoaded,
          setItemError: this.setItemError,
          handleItemMouseDown: this.handleItemMouseDown,
          handleItemMouseUp: this.handleItemMouseUp,
        })}
      />
    );
  }
  getVideoItemPlaceholder(itemHover) {
    return (
      <VideoItemPlaceholder
        id={this.props.idx}
        resized_url={this.props.resized_url}
        hover={itemHover}
      />
    );
  }

  getTextItem(imageDimensions) {
    const props = _.pick(this.props, [
      'id',
      'styleParams',
      'style',
      'html',
      'cubeRatio',
    ]);

    return (
      <TextItem
        {...props}
        visible={this.getItemVisibility()}
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
    const visible = this.getItemVisibility();
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
        if (visible) {
          itemInner = this.getVideoItem(imageDimensions, itemHover);
        } else {
          itemInner = this.getVideoItemPlaceholder(itemHover);
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
        <div
          style={{
            height: styleParams.externalInfoHeight,
            textAlign: styleParams.galleryTextAlign,
          }}
          className={elementName}
          onMouseOver={() => {
            utils.isMobile()
              ? _.noop()
              : this.props.actions.setCurrentHover(this.props.idx);
          }}
          onMouseOut={() => {
            utils.isMobile()
              ? _.noop()
              : this.props.actions.setCurrentHover(-1);
          }}
        >
          {itemTexts}
        </div>
      );
    }
    return info;
  }

  simulateHover() {
    return (
      this.props.currentHover === this.props.idx ||
      this.props.styleParams.alwaysShowHover === true ||
      (utils.isEditor() && this.props.styleParams.previewHover === true)
    );
  }

  simulateOverlayHover() {
    return (
      this.simulateHover() ||
      this.props.styleParams.titlePlacement === PLACEMENTS.SHOW_ALWAYS
    );
  }

  getItemContainerStyles() {
    const { styleParams, style, transform } = this.props;
    const wrapperWidth = style.width;

    const border = {};
    if (styleParams.itemBorderWidth) {
      Object.assign(border, {
        borderWidth: styleParams.itemBorderWidth + 'px',
        borderStyle: 'solid',
        borderColor: styleParams.itemBorderColor.value,
      });
    }

    const boxShadow = {};
    if (styleParams.itemEnableShadow) {
      const {
        itemShadowBlur,
        itemShadowDirection,
        itemShadowSize,
      } = styleParams;
      const alpha =
        ((-1 * (Number(itemShadowDirection) - 90)) / 360) * 2 * Math.PI;
      const shadowX = Math.round(itemShadowSize * Math.cos(alpha));
      const shadowY = Math.round(-1 * itemShadowSize * Math.sin(alpha));
      Object.assign(boxShadow, {
        boxShadow: `${shadowX}px ${shadowY}px ${itemShadowBlur}px ${
          styleParams.itemShadowOpacityAndColor.value
        }`,
      });
    }

    const itemStyles = {
      width: wrapperWidth,
      margin: styleParams.imageMargin + 'px',
      position: style.position,
      top: style.top,
      left: style.left,
      right: style.right,
      bottom: style.bottom,
      overflowY: styleParams.isSlideshow ? 'visible' : 'hidden',
      borderRadius: styleParams.itemBorderRadius + 'px',
    };
    Object.assign(itemStyles, {
      position: 'absolute',
      top: this.props.offset.top,
      left: this.props.offset.left,
      right: 'auto',
      bottom: 'auto',
      width: style.width,
      height: style.height + (styleParams.externalInfoHeight || 0),
      margin: styleParams.oneRow ? styleParams.imageMargin + 'px' : 0,
    });

    const styles = _.merge(itemStyles, transform, border, boxShadow);

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
    if (styleParams.itemBorderWidth) {
      styles.margin = -styleParams.itemBorderWidth + 'px';
    }
    Object.assign(styles, this.getImageDimensions());
    return styles;
  }

  getItemAriaLabel() {
    const { type, title } = this.props;
    let typeName;
    switch (type) {
      case 'dummy':
        typeName = '';
        break;
      case 'text':
        typeName = 'Text Box';
        break;
      case 'video':
        typeName = 'Video';
        break;
      default:
        typeName = 'Graphic';
        break;
    }
    const label =
      typeName + ', ' + title + (utils.isStoreGallery() ? ', Buy Now' : '');
    return label;
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
    const classNames = ['gallery-item-wrapper', 'visible'];

    if (styleParams.cubeImages) {
      classNames.push('cube-type-' + styleParams.cubeType);
    }
    if (type === 'text') {
      classNames.push('gallery-item-wrapper-text');
    }
    return classNames.join(' ');
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
        utils.isSite() &&
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
    if (this.shouldListenToScroll) {
      this.initScrollListener();
      setInitialVisibility({
        props: this.props,
        screenSize: this.screenSize,
        padding: this.padding,
        callback: this.setVisibilityState,
      });
    }
  }

  componentWillUnmount() {
    if (this.shouldListenToScroll) {
      this.removeScrollListener();
    }
  }

  componentWillReceiveProps(nextProps) {
    //
  }

  componentDidUpdate(prevProps, prevState) {
    this.changeActiveElementIfNeeded(prevProps);
  }

  removeScrollListener() {
    if (this.scrollEventListenerSet) {
      this.scrollEventListenerSet = false;
      const { scrollingElement } = this.props;
      scrollingElement
        .vertical()
        .removeEventListener('scroll', this.onVerticalScroll);
      const { oneRow } = this.props.styleParams;
      try {
        scrollingElement
          .horizontal()
          .removeEventListener('scroll', this.onHorizontalScroll);
      } catch (e) {}
    }
  }
  normalizeScrollParams(e) {
    Object.assign(e, { ...e.currentTarget });
    const target = {
      scrollY: e.scrollTop || e.y || e.scrollY || 0,
      scrollX: e.scrollLeft || e.x || e.scrollX || 0,
      offsetTop: e.y || 0,
      clientWidth: e.documentWidth || e.innerWidth,
      clientHeight: e.documentHeight || e.innerHeight,
    };
    return target;
  }
  initScrollListener() {
    if (!this.scrollEventListenerSet) {
      this.scrollEventListenerSet = true;
      const scrollInterval = 500;
      //Vertical Scroll
      this.onVerticalScroll = _.throttle(e => {
        const target = this.normalizeScrollParams(e);
        this.setState(
          {
            scroll: Object.assign(this.state.scroll, {
              top: target.scrollY,
              vertical: target,
            }),
          },
          () =>
            setVerticalVisibility({
              target,
              props: this.props,
              screenSize: this.screenSize,
              padding: this.padding,
              callback: this.setVisibilityState,
            }),
        );
      }, scrollInterval);
      const { scrollingElement } = this.props;
      scrollingElement
        .vertical()
        .addEventListener('scroll', this.onVerticalScroll);

      //Horizontal Scroll
      const { oneRow } = this.props.styleParams;
      if (oneRow) {
        this.onHorizontalScroll = _.throttle(({ target }) => {
          this.setState(
            {
              scroll: Object.assign(this.state.scroll, {
                left: target.scrollLeft,
                horizontal: target,
              }),
            },
            () =>
              setHorizontalVisibility({
                target,
                props: this.props,
                screenSize: this.screenSize,
                padding: this.padding,
                callback: this.setVisibilityState,
              }),
          );
        }, scrollInterval);
        scrollingElement
          .horizontal()
          .addEventListener('scroll', this.onHorizontalScroll);
      }
    }
  }

  onContextMenu(e) {
    if (!utils.isDev()) {
      e.preventDefault(e);
    }
  }

  composeItem() {
    const { photoId, id, hash, idx } = this.props;
    const { directLink } = this.props;
    const { itemClick } = this.props.styleParams;
    const { url, target } = directLink || {};
    const isSEO = !!this.props.isInSEO;
    const isPremium = this.props.isPremiumSite;
    const shouldUseNofollow = isSEO && !isPremium;
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
          onClick={this.onItemClick}
          onKeyDown={this.onKeyPress}
          tabIndex={this.getItemContainerTabIndex()}
          data-hash={hash}
          data-id={photoId}
          data-idx={idx}
          aria-label={this.getItemAriaLabel()}
          role="link" //left for accessibility
          aria-level="0"
          data-hook="item-container"
          key={'item-container-' + id}
          style={this.getItemContainerStyles()}
        >
          {this.getTopInfoElementIfNeeded()}
          <div
            data-hook="item-wrapper"
            className={this.getItemWrapperClass()}
            key={'item-wrapper-' + id}
            style={this.getItemWrapperStyles()}
          >
            {this.getItemInner()}
          </div>
          {this.getBottomInfoElementIfNeeded()}
        </div>
      </a>
    );
    return innerDiv;
  }
  //-----------------------------------------| RENDER |--------------------------------------------//

  render() {
    const rendered =
      this.state.renderedVertically && this.state.renderedHorizontally;
    //const {photoId, id, hash, idx} = this.props;
    if (!rendered) {
      return null;
    }
    return this.composeItem();
  }
}

export default ItemView;
