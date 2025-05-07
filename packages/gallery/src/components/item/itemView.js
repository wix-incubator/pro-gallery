import React from 'react';
import {
  GALLERY_CONSTS,
  featureManager,
  window,
  utils,
  isEditMode,
  isPreviewMode,
} from 'pro-gallery-lib';
import MagnifiedImage from './imageWithMagnified.js';
import withSecondaryMedia from '../hoc/withSecondMedia.js';
import TextItem from './textItem.js';
import ItemHover from './itemHover.js';
import { changeActiveElementIfNeeded, onAnchorFocus } from './itemHelper.js';
import { cssScrollHelper } from '../helpers/cssScrollHelper';
import {
  getOuterInfoStyle,
  getInnerInfoStyle,
  getContainerStyle,
  getImageStyle,
} from './itemViewStyleProvider';
import VideoItemWrapper from './videos/videoItemWrapper';
import { getCustomInfoRendererProps, getLinkParams } from './pure';
import { getSlideAnimationClassNames } from '../gallery/proGallery/scrollLessAnimationHelper';

const ImageWithSecondMedia = withSecondaryMedia(MagnifiedImage);
const TextWithSecondMedia = withSecondaryMedia(TextItem);
class ItemView extends React.Component {
  constructor(props) {
    super(props);
    this.props.actions.eventsListener(
      GALLERY_CONSTS.events.ITEM_CREATED,
      this.props
    );

    this.init();

    this.state = {
      isCurrentHover: false,
      itemWasHovered: false,
    };

    this.activeElement = '';
  }

  //-------------------------------------------| INIT |--------------------------------------------//

  init() {
    this.onItemClick = this.onItemClick.bind(this);
    this.onItemWrapperClick = this.onItemWrapperClick.bind(this);
    this.onItemInfoClick = this.onItemInfoClick.bind(this);
    this.onContainerKeyUp = this.onContainerKeyUp.bind(this);
    this.onAnchorKeyDown = this.onAnchorKeyDown.bind(this);
    this.handleItemMouseDown = this.handleItemMouseDown.bind(this);
    this.handleItemMouseUp = this.handleItemMouseUp.bind(this);
    this.setItemLoaded = this.setItemLoaded.bind(this);
    this.isHighlight = this.isHighlight.bind(this);
    this.getItemHover = this.getItemHover.bind(this);
    this.getImageItem = this.getImageItem.bind(this);
    this.getVideoItem = this.getVideoItem.bind(this);
    this.getTextItem = this.getTextItem.bind(this);
    this.getItemInner = this.getItemInner.bind(this);
    this.getItemContainerStyles = this.getItemContainerStyles.bind(this);
    this.getItemWrapperStyles = this.getItemWrapperStyles.bind(this);
    this.getItemAriaLabel = this.getItemAriaLabel.bind(this);
    this.getItemContainerClass = this.getItemContainerClass.bind(this);
    this.getItemWrapperClass = this.getItemWrapperClass.bind(this);
    this.getItemContainerTabIndex = this.getItemContainerTabIndex.bind(this);
    this.isIconTag = this.isIconTag.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.checkIfCurrentHoverChanged =
      this.checkIfCurrentHoverChanged.bind(this);
    this.shouldHoverWithoutOverlayAndClickOnMobile =
      this.shouldHoverWithoutOverlayAndClickOnMobile.bind(this);
  }

  //----------------------------------------| ACTIONS |-------------------------------------------//
  setItemLoaded() {
    this.props.actions.eventsListener(
      GALLERY_CONSTS.events.ITEM_LOADED,
      this.props
    );
    this.setState({
      loaded: true,
    });
  }

  isIconTag(tagName) {
    return (
      ['button', 'i', 'a', 'svg', 'path'].indexOf(tagName.toLowerCase()) >= 0
    );
  }

  onMouseEnter() {
    if (!utils.isMobile()) {
      this.props.actions.eventsListener(
        GALLERY_CONSTS.events.HOVER_SET,
        this.props.idx
      );
    }
  }

  onMouseLeave() {
    if (!utils.isMobile()) {
      this.props.actions.eventsListener(GALLERY_CONSTS.events.HOVER_SET, -1);
      this.props.actions.eventsListener(
        GALLERY_CONSTS.events.HOVER_UNSET,
        this.props.idx
      );
    }
  }

  onFocus() {
    if (this.props.settings?.isAccessible) {
      this.props.actions.eventsListener(
        GALLERY_CONSTS.events.HOVER_SET,
        this.props.idx
      );
    }
    this.props.actions.eventsListener(
      GALLERY_CONSTS.events.ITEM_FOCUSED,
      this.props
    );
  }

  onBlur() {
    if (this.props.settings?.isAccessible) {
      this.props.actions.eventsListener(GALLERY_CONSTS.events.HOVER_SET, -1);
      this.props.actions.eventsListener(
        GALLERY_CONSTS.events.HOVER_UNSET,
        this.props.idx
      );
    }
    this.props.actions.eventsListener(
      GALLERY_CONSTS.events.ITEM_LOST_FOCUS,
      this.props
    );
  }

  onContainerKeyUp(e) {
    const clickTarget = 'item-container';
    switch (e.keyCode || e.charCode) {
      case 32: //space
      case 13: //enter
        e.stopPropagation();
        this.onItemClick(e, clickTarget, false); //pressing enter or space always behaves as click on main image, even if the click is on a thumbnail
        if (this.shouldUseDirectLink()) {
          this.itemAnchor.click(); // when directLink, we want to simulate the 'enter' or 'space' press on an <a> element
        }
        return false;
      case 27: //esc
        // The first ESC press removes the hover effect, the second removes focus
        if (this.state.isCurrentHover) {
          this.props.actions.eventsListener(
            GALLERY_CONSTS.events.HOVER_SET,
            -1
          );
        } else {
          e.target.blur();
          this.props.actions.eventsListener(
            GALLERY_CONSTS.events.ITEM_LOST_FOCUS,
            this.props
          );
        }
        return false;
      default:
        return true;
    }
  }

  onAnchorKeyDown(e) {
    // Similar to "onContainerKeyUp()" expect 'shouldUseDirectLink()' part, because we are already on the <a> tag (this.itemAnchor)
    const clickTarget = 'item-container';
    switch (e.keyCode || e.charCode) {
      case 32: //space
      case 13: //enter
        e.stopPropagation();
        this.onItemClick(e, clickTarget, false); //pressing enter or space always behaves as click on main image, even if the click is on a thumbnail
        return false;
      default:
        return true;
    }
  }

  handleGalleryItemAction(e) {
    this.props.actions.eventsListener(
      GALLERY_CONSTS.events.ITEM_ACTION_TRIGGERED,
      this.props,
      e
    );
  }

  onItemWrapperClick(e) {
    const clickTarget = 'item-media';
    this.onItemClick(e, clickTarget);
  }

  onItemInfoClick(e) {
    const clickTarget = 'item-info';
    this.onItemClick(e, clickTarget, false);
    e.stopPropagation();
  }

  onItemClick(e, clickTarget, shouldPreventDefault = true) {
    if (
      utils.isFunction(utils.get(window, 'galleryWixCodeApi.onItemClicked'))
    ) {
      window.galleryWixCodeApi.onItemClicked(this.props); //TODO remove after OOI is fully integrated
    }
    this.props.actions.eventsListener(
      GALLERY_CONSTS.events.ITEM_CLICKED,
      { ...this.props, clickTarget },
      e
    );

    if (this.shouldUseDirectLink()) {
      return;
    }

    if (shouldPreventDefault) {
      e.preventDefault();
    }

    if (
      this.shouldShowHoverOnMobile() ||
      this.shouldShowSecondMediaOnMobile()
    ) {
      setTimeout(this.handleHoverClickOnMobile(e), 0);
    } else if (this.shouldHoverWithoutOverlayAndClickOnMobile()) {
      this.props.actions.eventsListener(
        GALLERY_CONSTS.events.HOVER_SET,
        this.props.idx
      );
    } else {
      this.handleGalleryItemAction(e);
    }
  }

  shouldUseDirectLink = () => {
    const { directLink } = this.props;
    const { url, target } = directLink || {};
    const useDirectLink = !!(
      url &&
      target &&
      this.props.options.itemClick === 'link'
    );
    const shouldUseDirectLinkOnMobile =
      this.shouldShowHoverOnMobile() &&
      this.isClickOnCurrentHoveredItem() &&
      useDirectLink;

    if (shouldUseDirectLinkOnMobile) {
      this.props.actions.eventsListener(GALLERY_CONSTS.events.HOVER_SET, -1);
      return true;
    }
    if (useDirectLink && !this.shouldShowHoverOnMobile()) {
      return true;
    }
    return false;
  };

  isClickOnCurrentHoveredItem = () =>
    this.state.isCurrentHover || // this single item was already hovered.
    this.props.options.hoveringBehaviour ===
      GALLERY_CONSTS.infoBehaviourOnHover.NO_CHANGE; // all the items are always 'already' hovered

  handleHoverClickOnMobile(e) {
    if (this.isClickOnCurrentHoveredItem()) {
      this.handleGalleryItemAction(e);
      this.props.actions.eventsListener(GALLERY_CONSTS.events.HOVER_SET, -1);
    } else {
      this.props.actions.eventsListener(
        GALLERY_CONSTS.events.HOVER_SET,
        this.props.idx
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

  shouldShowHoverOnMobile() {
    if (utils.isMobile()) {
      const {
        titlePlacement,
        hoveringBehaviour,
        itemClick,
        alwaysShowHover,
        previewHover,
        allowDescription,
        allowTitle,
        isStoreGallery,
      } = this.props.options;
      const isNewMobileSettings = featureManager.supports.mobileSettings;
      if (
        hoveringBehaviour === GALLERY_CONSTS.infoBehaviourOnHover.NEVER_SHOW
      ) {
        return false;
      }
      if (itemClick === 'nothing' && this.props.type !== 'video') {
        return true;
      } else if (
        this.props.customComponents.customHoverRenderer &&
        GALLERY_CONSTS.hasHoverPlacement(titlePlacement) &&
        hoveringBehaviour !== GALLERY_CONSTS.infoBehaviourOnHover.NEVER_SHOW &&
        isNewMobileSettings &&
        (allowDescription || allowTitle || isStoreGallery)
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
  shouldShowSecondMediaOnMobile() {
    if (utils.isMobile()) {
      const { itemClick } = this.props.options;
      if (itemClick === 'nothing' && this.props.type !== 'video') {
        return (
          this.props.options.behaviourParams.item.secondaryMedia.trigger ===
          GALLERY_CONSTS.secondaryMediaTrigger.HOVER
        );
      } else {
        return false;
      }
    }
    return false;
  }

  shouldHoverWithoutOverlayAndClickOnMobile() {
    return (
      utils.isMobile() &&
      this.props.options.videoPlay === GALLERY_CONSTS.videoPlay.HOVER &&
      this.props.options.itemClick === GALLERY_CONSTS.itemClick.NOTHING
    );
  }

  isHighlight() {
    return (
      this.props.thumbnailHighlightId &&
      this.props.thumbnailHighlightId === this.props.id
    );
  }

  shouldHover() {
    //see if this could be decided in the preset
    const { options } = this.props;
    const {
      alwaysShowHover,
      previewHover,
      hoveringBehaviour,
      overlayAnimation,
    } = options;
    const { NEVER_SHOW, APPEARS } = GALLERY_CONSTS.infoBehaviourOnHover;
    const { NO_EFFECT } = GALLERY_CONSTS.overlayAnimations;

    if (hoveringBehaviour === NEVER_SHOW) {
      return false;
    } else if (alwaysShowHover === true) {
      return true;
    } else if (isEditMode() && previewHover) {
      return true;
    } else if (
      hoveringBehaviour === APPEARS &&
      overlayAnimation === NO_EFFECT &&
      !this.state.itemWasHovered
    ) {
      //when there is no overlayAnimation, we want to render the itemHover only on first hover and on (and not before)
      //when there is a specific overlayAnimation, to support the animation we should render the itemHover before any hover activity.
      return false;
    } else if (utils.isMobile()) {
      return this.shouldShowHoverOnMobile();
    } else {
      return true;
    }
  }

  //---------------------------------------| COMPONENTS |-----------------------------------------//

  getItemHover(imageDimensions) {
    const { customComponents, ...props } = this.props;

    const shouldHover = this.shouldHover();
    return (
      shouldHover && (
        <ItemHover
          {...props}
          forceShowHover={this.simulateOverlayHover()}
          isCurrentHover={this.simulateHover()}
          imageDimensions={imageDimensions}
          itemWasHovered={this.state.itemWasHovered}
          key="hover"
          actions={{
            handleItemMouseDown: this.handleItemMouseDown,
            handleItemMouseUp: this.handleItemMouseUp,
          }}
          renderCustomInfo={
            customComponents.customHoverRenderer
              ? () =>
                  customComponents.customHoverRenderer(
                    getCustomInfoRendererProps(this.props)
                  )
              : null
          }
        ></ItemHover>
      )
    );
  }

  getImageItem(imageDimensions) {
    const props = utils.pick(this.props, [
      'gotFirstScrollEvent',
      'alt',
      'title',
      'description',
      'id',
      'idx',
      'options',
      'createUrl',
      'createMagnifiedUrl',
      'settings',
      'isPrerenderMode',
      'isTransparent',
      'style',
      'hasSecondaryMedia',
      'secondaryMediaItem',
      'customComponents',
    ]);

    return (
      <ImageWithSecondMedia
        {...props}
        key="imageItem"
        imageDimensions={imageDimensions}
        isThumbnail={!!this.props.thumbnailHighlightId}
        isCurrentHover={this.simulateHover()}
        itemWasHovered={this.state.itemWasHovered}
        actions={{
          handleItemMouseDown: this.handleItemMouseDown,
          handleItemMouseUp: this.handleItemMouseUp,
          setItemLoaded: this.setItemLoaded,
        }}
      />
    );
  }

  getVideoItem(imageDimensions, itemHover) {
    return (
      <VideoItemWrapper
        {...this.props}
        shouldPlay={this.props.idx === this.props.playingVideoIdx}
        key={'video' + this.props.idx}
        hover={itemHover}
        imageDimensions={imageDimensions}
        hasLink={this.itemHasLink()}
        isCurrentHover={this.simulateHover()}
        actions={{
          ...this.props.actions,
          setItemLoaded: this.setItemLoaded,
          handleItemMouseDown: this.handleItemMouseDown,
          handleItemMouseUp: this.handleItemMouseUp,
        }}
      />
    );
  }

  getTextItem(imageDimensions) {
    const props = utils.pick(this.props, [
      'id',
      'options',
      'style',
      'html',
      'cropRatio',
      'isPrerenderMode',
      'hasSecondaryMedia',
      'secondaryMediaItem',
    ]);

    return (
      <TextWithSecondMedia
        {...props}
        key="textItem"
        imageDimensions={imageDimensions}
        isCurrentHover={this.simulateHover()}
        itemWasHovered={this.state.itemWasHovered}
        actions={{
          handleItemMouseDown: this.handleItemMouseDown,
          handleItemMouseUp: this.handleItemMouseUp,
          setItemLoaded: this.setItemLoaded,
        }}
      />
    );
  }

  getItemInner() {
    const { type, style, offset } = this.props;
    let itemInner;

    const { innerWidth, innerHeight } = style;
    const { innerTop, innerLeft } = offset;

    const itemStyles = {
      width: innerWidth,
      height: innerHeight,
      marginTop: innerTop,
      marginLeft: innerLeft,
    };
    let itemHover = null;
    if (this.shouldHover()) {
      itemHover = this.getItemHover(itemStyles);
    }

    switch (type) {
      case 'dummy':
        itemInner = <div />;
        break;
      case 'video':
        itemInner = this.getVideoItem(itemStyles, itemHover);
        break;
      case 'text':
        itemInner = [this.getTextItem(itemStyles), itemHover];
        break;
      case 'image':
      case 'picture':
      default:
        if (this.props.isVideoPlaceholder) {
          itemInner = this.getVideoItem(itemStyles, itemHover);
        } else {
          itemInner = [this.getImageItem(itemStyles), itemHover];
        }
    }

    return itemInner;
  }

  getRightInfoElementIfNeeded() {
    if (
      GALLERY_CONSTS.hasExternalRightPlacement(
        this.props.options.titlePlacement,
        this.props.idx
      )
    ) {
      return this.getExternalInfoElement(
        GALLERY_CONSTS.placements.SHOW_ON_THE_RIGHT,
        'gallery-item-right-info'
      );
    } else {
      return null;
    }
  }

  getLeftInfoElementIfNeeded() {
    if (
      GALLERY_CONSTS.hasExternalLeftPlacement(
        this.props.options.titlePlacement,
        this.props.idx
      )
    ) {
      return this.getExternalInfoElement(
        GALLERY_CONSTS.placements.SHOW_ON_THE_LEFT,
        'gallery-item-left-info'
      );
    } else {
      return null;
    }
  }

  getBottomInfoElementIfNeeded() {
    if (
      GALLERY_CONSTS.hasExternalBelowPlacement(
        this.props.options.titlePlacement,
        this.props.idx
      )
    ) {
      return this.getExternalInfoElement(
        GALLERY_CONSTS.placements.SHOW_BELOW,
        'gallery-item-bottom-info'
      );
    } else {
      return null;
    }
  }

  getTopInfoElementIfNeeded() {
    if (
      GALLERY_CONSTS.hasExternalAbovePlacement(
        this.props.options.titlePlacement,
        this.props.idx
      )
    ) {
      return this.getExternalInfoElement(
        GALLERY_CONSTS.placements.SHOW_ABOVE,
        'gallery-item-top-info'
      );
    } else {
      return null;
    }
  }

  getExternalInfoElement(placement, elementName) {
    const { options, customComponents, style } = this.props;
    if (!customComponents.customInfoRenderer) {
      return null;
    }
    let info = null;
    //if there is no url for videos and images, we will not render the itemWrapper
    //but will render the info element if exists, with the whole size of the item
    const infoHeight =
      options.textBoxHeight + (this.hasRequiredMediaUrl ? 0 : style.height);
    const infoWidth =
      style.infoWidth + (this.hasRequiredMediaUrl ? 0 : style.width);

    const itemExternalInfo = customComponents.customInfoRenderer(
      getCustomInfoRendererProps(this.props),
      placement
    );

    const overrideDeckTransition = GALLERY_CONSTS.isLayout('SLIDESHOW')(
      this.props.options
    );

    info = (
      <div
        className={
          'gallery-item-common-info-outer ' +
          getSlideAnimationClassNames(this.props, overrideDeckTransition)
        }
        style={{
          ...getOuterInfoStyle(
            placement,
            options,
            style.height,
            options.textBoxHeight
          ),
        }}
      >
        <div
          style={getInnerInfoStyle(placement, options, infoHeight, infoWidth)}
          className={'gallery-item-common-info ' + elementName}
          onClick={this.onItemInfoClick}
        >
          {itemExternalInfo}
        </div>
      </div>
    );

    return info;
  }

  simulateHover() {
    return (
      this.state.isCurrentHover ||
      this.props.options.alwaysShowHover === true ||
      (isEditMode() && this.props.options.previewHover)
    );
  }

  simulateOverlayHover() {
    return (
      this.simulateHover() ||
      this.props.options.hoveringBehaviour ===
        GALLERY_CONSTS.infoBehaviourOnHover.NO_CHANGE
    );
  }

  itemHasLink() {
    const { linkData, linkUrl } = this.props;
    const itemDoesntHaveLink =
      linkData.type === undefined && (linkUrl === undefined || linkUrl === ''); //when itemClick is 'link' but no link was added to this specific item
    return !itemDoesntHaveLink;
  }

  getItemContainerStyles() {
    const {
      idx,
      activeIndex,
      offset,
      style,
      options,
      settings = {},
    } = this.props;
    const { scrollDirection, imageMargin, isRTL, slideAnimation } = options;

    const containerStyleByoptions = getContainerStyle(options);

    const itemStyles = {
      overflowY: 'hidden',
      position: 'absolute',
      bottom: 'auto',
      margin:
        scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL
          ? imageMargin / 2 + 'px'
          : 0,
    };

    const { avoidInlineStyles } = settings;

    const hideOnSSR =
      this.props.isPrerenderMode && !this.props.settings.disableSSROpacity;
    const opacityStyles = avoidInlineStyles
      ? {}
      : {
          opacity: hideOnSSR ? 0 : 1,
          display: hideOnSSR ? 'none' : 'block',
          transition: 'opacity .2s ease',
        };

    const layoutStyles = avoidInlineStyles
      ? {}
      : {
          top: offset.top,
          left: isRTL ? 'auto' : offset.left,
          right: !isRTL ? 'auto' : offset.left,
          width: style.width + style.infoWidth,
          height: style.height + style.infoHeight,
        };

    let slideAnimationStyles;
    switch (slideAnimation) {
      case GALLERY_CONSTS.slideAnimations.FADE:
        slideAnimationStyles = {
          left: isRTL ? 'auto' : 0,
          right: !isRTL ? 'auto' : 0,
          pointerEvents: activeIndex === idx ? 'auto' : 'none',
          zIndex: activeIndex === idx ? 1 : 0,
        };
        break;
      case GALLERY_CONSTS.slideAnimations.DECK:
        slideAnimationStyles = {
          left: isRTL ? 'auto' : 0,
          right: !isRTL ? 'auto' : 0,
          pointerEvents: activeIndex === idx ? 'auto' : 'none',
          zIndex: Math.sign(activeIndex - idx),
        };
        break;
      default:
        slideAnimationStyles = {};
    }

    const transitionStyles =
      this.state.loaded && (isEditMode() || isPreviewMode())
        ? {
            transition: 'all .4s ease',
            transitionProperty: 'top, left, width, height, opacity',
          }
        : {
            transition: 'none',
          };

    const itemContainerStyles = {
      ...itemStyles,
      ...layoutStyles,
      ...containerStyleByoptions,
      ...transitionStyles,
      ...opacityStyles,
      ...slideAnimationStyles,
    };

    return itemContainerStyles;
  }

  getItemWrapperStyles() {
    const { createUrl, options, style, type } = this.props;
    const { height, width } = style;
    const styles = {};
    if (type === 'text') {
      styles.backgroundColor =
        options.cubeType !== 'fit' ? 'transparent' : 'inherit';
    } else {
      styles.backgroundColor =
        (options.cubeType !== 'fit' ? style.bgColor : 'inherit') ||
        'transparent';
    }

    if (
      options.imageHoverAnimation ===
      GALLERY_CONSTS.imageHoverAnimations.MAIN_COLOR
    ) {
      styles.background = `url(${createUrl(
        GALLERY_CONSTS.urlSizes.PIXEL,
        GALLERY_CONSTS.urlTypes.HIGH_RES
      )})`;
    }

    styles.height = height + 'px';
    styles.width = width + 'px';
    styles.margin = -options.itemBorderWidth + 'px';

    return styles;
  }

  getItemAriaLabel() {
    const { type, alt, htmlContent, options } = this.props;
    const mapTypeToLabel = {
      dummy: '',
      text: htmlContent,
      video: alt || type || '',
      image: alt || type || '',
    };
    const label = mapTypeToLabel[type];
    return label + (options.isStoreGallery ? ', Buy Now' : '');
  }

  isItemClickable(options) {
    const itemDoesntHaveLink = !this.itemHasLink(); //when itemClick is 'link' but no link was added to this specific item

    return options.itemClick === GALLERY_CONSTS.itemClick.NOTHING ||
      (options.itemClick === GALLERY_CONSTS.itemClick.LINK &&
        itemDoesntHaveLink)
      ? false
      : true;
  }

  getItemContainerClass() {
    const { options } = this.props;
    const imagePlacementAnimation = options.imagePlacementAnimation;
    const overlayAnimation = options.overlayAnimation;
    const imageHoverAnimation = options.imageHoverAnimation;
    const isHovered = this.simulateHover();
    const classNames = {
      'gallery-item-container': true,
      'item-container-regular': !isHovered,
      'item-container-hover': isHovered,

      'has-custom-focus': true,
      visible: true,
      'pro-gallery-highlight': this.isHighlight(),
      clickable: this.isItemClickable(options),
      'simulate-hover': this.simulateHover(),
      'hide-hover': !this.simulateHover() && utils.isMobile(),
      'invert-hover':
        options.hoveringBehaviour ===
        GALLERY_CONSTS.infoBehaviourOnHover.DISAPPEARS,

      //animations
      'animation-slide':
        imagePlacementAnimation ===
        GALLERY_CONSTS.imagePlacementAnimations.SLIDE,

      //overlay animations
      'hover-animation-fade-in':
        overlayAnimation === GALLERY_CONSTS.overlayAnimations.FADE_IN,
      'hover-animation-expand':
        overlayAnimation === GALLERY_CONSTS.overlayAnimations.EXPAND,
      'hover-animation-slide-up':
        overlayAnimation === GALLERY_CONSTS.overlayAnimations.SLIDE_UP,
      'hover-animation-slide-right':
        overlayAnimation === GALLERY_CONSTS.overlayAnimations.SLIDE_RIGHT,
      'hover-animation-slide-down':
        overlayAnimation === GALLERY_CONSTS.overlayAnimations.SLIDE_DOWN,
      'hover-animation-slide-left':
        overlayAnimation === GALLERY_CONSTS.overlayAnimations.SLIDE_LEFT,

      //image hover animations
      'main-color-on-hover':
        imageHoverAnimation === GALLERY_CONSTS.imageHoverAnimations.MAIN_COLOR,
      'zoom-in-on-hover':
        imageHoverAnimation === GALLERY_CONSTS.imageHoverAnimations.ZOOM_IN,
      'blur-on-hover':
        imageHoverAnimation === GALLERY_CONSTS.imageHoverAnimations.BLUR,
      'grayscale-on-hover':
        imageHoverAnimation === GALLERY_CONSTS.imageHoverAnimations.GRAYSCALE,
      'shrink-on-hover':
        imageHoverAnimation === GALLERY_CONSTS.imageHoverAnimations.SHRINK,
      'invert-on-hover':
        imageHoverAnimation === GALLERY_CONSTS.imageHoverAnimations.INVERT,
      'color-in-on-hover':
        imageHoverAnimation === GALLERY_CONSTS.imageHoverAnimations.COLOR_IN,
      'darkened-on-hover':
        imageHoverAnimation === GALLERY_CONSTS.imageHoverAnimations.DARKENED,

      'pro-gallery-mobile-indicator': utils.isMobile(),
    };
    const strClass = Object.entries(classNames)
      .map(([classname, isNeeded]) => (isNeeded ? classname : false))
      .filter(Boolean)
      .join(' ');

    return strClass;
  }

  getItemWrapperClass() {
    const { options, type } = this.props;
    const classes = ['gallery-item-wrapper', 'visible'];

    if (options.cubeImages) {
      classes.push('cube-type-' + options.cubeType);
    }
    if (type === 'text') {
      classes.push('gallery-item-wrapper-text');
    }

    classes.push(getSlideAnimationClassNames(this.props));
    return classes.join(' ');
  }

  getItemContainerTabIndex() {
    const tabIndex = this.props.shouldDisableItemFocus
      ? -1
      : this.isHighlight()
      ? utils.getTabIndex('currentThumbnail')
      : this.props.activeIndex === this.props.idx
      ? utils.getTabIndex('currentGalleryItem')
      : -1;
    return tabIndex;
  }

  //-----------------------------------------| REACT |--------------------------------------------//

  componentDidMount() {
    if (utils.isMobile() && typeof React.initializeTouchEvents === 'function') {
      try {
        React.initializeTouchEvents(true);
      } catch (e) {
        console.error(e);
      }
    }

    window.addEventListener(
      'current_hover_change',
      this.checkIfCurrentHoverChanged
    );
  }

  componentWillUnmount() {
    clearTimeout(this.itemLoadedTimeout);
    window.removeEventListener(
      'current_hover_change',
      this.checkIfCurrentHoverChanged
    );
  }

  componentDidUpdate(prevProps) {
    changeActiveElementIfNeeded({
      prevProps,
      currentProps: this.props,
      itemActionRef: this.itemActionRef,
      isAccessible: this.props.settings?.isAccessible,
    });
  }

  checkIfCurrentHoverChanged(e) {
    if (e.galleryId === this.props.galleryId) {
      if (!this.state.isCurrentHover && e.currentHoverIdx === this.props.idx) {
        this.setState({
          isCurrentHover: true,
          itemWasHovered: true,
        });
      } else if (
        this.state.isCurrentHover &&
        e.currentHoverIdx !== this.props.idx
      ) {
        this.setState({
          isCurrentHover: false,
        });
      }
    }
  }

  onContextMenu(e) {
    if (!utils.isDev() && !this.props.options.allowContextMenu) {
      e.preventDefault(e);
    }
  }

  getItemAriaRole() {
    switch (this.props.options.itemClick) {
      case 'expand':
      case 'fullscreen':
        return 'button';
      case 'link':
        return 'link';
      default:
        return '';
    }
  }

  getItemAriaHaspopup() {
    switch (this.props.options.itemClick) {
      case 'expand':
      case 'fullscreen':
        return true;
      default:
        return false;
    }
  }

  composeItem() {
    const { photoId, id, hash, idx, options, type, url } = this.props;

    //if (there is an url for video items and image items) OR text item (text item do not use media url)
    this.hasRequiredMediaUrl = url || type === 'text';
    //if titlePlacement !== SHOW_ON_HOVER and !this.hasRequiredMediaUrl, we will NOT render the itemWrapper (but will render the info element with the whole size of the item)
    const isItemWrapperEmpty =
      options.titlePlacement !== GALLERY_CONSTS.placements.SHOW_ON_HOVER &&
      !this.hasRequiredMediaUrl;
    const itemAriaRole = this.getItemAriaRole();
    const itemAriaLabel = this.getItemAriaLabel();
    const itemAriaHaspopup = this.getItemAriaHaspopup();
    const Element = this.props.elementsOverride?.item || 'div';
    const innerDiv = (
      <Element
        className={this.getItemContainerClass()}
        onContextMenu={(e) => this.onContextMenu(e)}
        id={cssScrollHelper.getSellectorDomId(this.props)}
        ref={(e) => (this.itemContainer = e)}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        data-hash={hash}
        data-id={photoId}
        data-idx={idx}
        data-hook="item-container"
        key={'item-container-' + id}
        style={this.getItemContainerStyles()}
        onKeyUp={this.onContainerKeyUp}
        onClick={this.onItemWrapperClick}
        aria-hidden={this.props.activeIndex !== this.props.idx}
      >
        <div
          data-idx={idx}
          id={'item-action-' + id}
          className="item-action"
          ref={(ref) => (this.itemActionRef = ref)}
          onKeyUp={this.onContainerKeyUp}
          tabIndex={this.getItemContainerTabIndex()}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          data-hook={'item-action'}
          {...(itemAriaLabel && { ['aria-label']: itemAriaLabel })}
          {...(itemAriaRole && { role: itemAriaRole })}
          {...(itemAriaHaspopup && {
            ['aria-haspopup']: itemAriaHaspopup ? 'dialog' : '',
          })}
        ></div>

        {this.getTopInfoElementIfNeeded()}
        {this.getLeftInfoElementIfNeeded()}
        <div
          style={{
            ...getImageStyle(this.props.options),
            ...(GALLERY_CONSTS.hasExternalRightPlacement(
              this.props.options.titlePlacement,
              this.props.idx
            ) && {
              float: 'left',
            }),
            ...(GALLERY_CONSTS.hasExternalLeftPlacement(
              this.props.options.titlePlacement,
              this.props.idx
            ) && {
              float: 'right',
            }),
          }}
        >
          {!isItemWrapperEmpty && (
            <div
              data-hook="item-wrapper"
              className={this.getItemWrapperClass()}
              key={'item-wrapper-' + id}
              id={'item-wrapper-' + id}
              style={this.getItemWrapperStyles()}
            >
              {this.getItemInner()}
            </div>
          )}
        </div>
        {this.getRightInfoElementIfNeeded()}
        {this.getBottomInfoElementIfNeeded()}
      </Element>
    );
    const handleKeyDown = (e) => {
      /* Relvenat only for Screen-Reader case:
      Screen-Reader ignores the tabIdex={-1} and therefore stops and focuses on the <a> tag keyDown event,
      so it will not go deeper to the item-container keyDown event.
      */
      this.onAnchorKeyDown(e);
    };
    const handleFocus = () => {
      onAnchorFocus({
        itemAnchor: this.itemAnchor,
        enableExperimentalFeatures: this.props.enableExperimentalFeatures,
        itemContainer: this.itemContainer,
        isAccessible: this.props.settings?.isAccessible,
      });
    };
    const linkParams = getLinkParams(this.props);
    const elementProps = {
      ref: (e) => (this.itemAnchor = e),
      'data-id': photoId,
      className: 'item-link-wrapper',
      'data-idx': idx,
      'data-hook': 'item-link-wrapper',
      onFocus: handleFocus,
      tabIndex: -1,
      onKeyDown: handleKeyDown,
    };
    if (linkParams?.href?.length > 0) {
      return (
        <a key={'item-container-link-' + id} {...elementProps} {...linkParams}>
          {innerDiv}
        </a>
      );
    } else {
      return (
        <div key={'item-container-div-' + id} {...elementProps}>
          {innerDiv}
        </div>
      );
    }
  }

  //-----------------------------------------| RENDER |--------------------------------------------//

  render() {
    return this.composeItem();
  }
}

export default ItemView;
/* eslint-enable prettier/prettier */
