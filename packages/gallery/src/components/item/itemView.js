import React from 'react';
import {
  GALLERY_CONSTS,
  featureManager,
  window,
  utils,
  isEditMode,
  isPreviewMode,
  isSiteMode,
  isSEOMode,
} from 'pro-gallery-lib';
import ImageItem from './imageItem.js';
import TextItem from './textItem.js';
import ItemHover from './itemHover.js';
import { cssScrollHelper } from '../helpers/cssScrollHelper';
import { GalleryComponent } from '../galleryComponent';
import {
  getOuterInfoStyle,
  getInnerInfoStyle,
  getContainerStyle,
  getImageStyle,
} from './itemViewStyleProvider';
import VideoItemWrapper from './videos/videoItemWrapper';

class ItemView extends GalleryComponent {
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
    this.onContainerKeyDown = this.onContainerKeyDown.bind(this);
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
    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.changeActiveElementIfNeeded = this.changeActiveElementIfNeeded.bind(
      this
    );
    this.checkIfCurrentHoverChanged = this.checkIfCurrentHoverChanged.bind(
      this
    );
    this.getCustomInfoRendererProps = this.getCustomInfoRendererProps.bind(
      this
    );
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

  onMouseOver() {
    if (!utils.isMobile()) {
      this.props.actions.eventsListener(
        GALLERY_CONSTS.events.HOVER_SET,
        this.props.idx
      );
    }
  }

  onMouseOut() {
    if (!utils.isMobile()) {
      this.props.actions.eventsListener(GALLERY_CONSTS.events.HOVER_SET, -1);
    }
  }

  onFocus() {
    if (this.props.styleParams.isAccessible) {
      this.props.actions.eventsListener(
        GALLERY_CONSTS.events.HOVER_SET,
        this.props.idx
      );
    }
  }

  onBlur() {
    if (this.props.styleParams.isAccessible) {
      this.props.actions.eventsListener(GALLERY_CONSTS.events.HOVER_SET, -1);
    }
  }

  onContainerKeyDown(e) {
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
      default:
        return true;
    }
  }

  onAnchorKeyDown(e) {
    // Similar to "onContainerKeyDown()" expect 'shouldUseDirectLink()' part, because we are already on the <a> tag (this.itemAnchor)
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
    this.onItemClick(e, clickTarget);
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

    if (this.shouldShowHoverOnMobile()) {
      this.handleHoverClickOnMobile(e);
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
      this.props.styleParams.itemClick === 'link'
    );
    const shouldUseDirectLinkMobileSecondClick =
      this.shouldShowHoverOnMobile() &&
      this.isClickOnCurrentHoveredItem() &&
      useDirectLink;

    if (shouldUseDirectLinkMobileSecondClick) {
      this.props.actions.eventsListener(GALLERY_CONSTS.events.HOVER_SET, -1);
      return true;
    }
    if (useDirectLink && !this.shouldShowHoverOnMobile()) {
      return true;
    }
    return false;
  };

  isClickOnCurrentHoveredItem = () => this.state.isCurrentHover;

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
      } = this.props.styleParams;
      const isNewMobileSettings = featureManager.supports.mobileSettings;
      if (
        hoveringBehaviour === GALLERY_CONSTS.infoBehaviourOnHover.NEVER_SHOW
      ) {
        return false;
      }
      if (itemClick === 'nothing' && this.props.type !== 'video') {
        return true;
      } else if (
        this.props.customHoverRenderer &&
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

  isHighlight() {
    return (
      this.props.thumbnailHighlightId &&
      this.props.thumbnailHighlightId === this.props.id
    );
  }

  shouldHover() {
    //see if this could be decided in the preset
    const { styleParams } = this.props;
    const {
      alwaysShowHover,
      previewHover,
      hoveringBehaviour,
      overlayAnimation,
    } = styleParams;
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

  getImageDimensions() {
    //image dimensions are for images in grid fit - placing the image with positive margins to show it within the square
    const { styleParams, cubeRatio, style } = this.props;
    const isLandscape = style.ratio >= cubeRatio; //relative to container size
    const imageMarginLeft = Math.round(
      (style.height * style.ratio - style.width) / -2
    );
    const imageMarginTop = Math.round(
      (style.width / style.ratio - style.height) / -2
    );
    const isGridFit = styleParams.cubeImages && styleParams.cubeType === 'fit';

    let dimensions = {};

    if (!isGridFit) {
      dimensions = {
        width: style.width,
        height: style.height,
      };
    } else if (isGridFit && isLandscape) {
      dimensions = {
        //landscape
        height: style.height - 2 * imageMarginTop,
        width: style.width,
        margin: `${imageMarginTop}px 0`,
      };
    } else if (isGridFit && !isLandscape) {
      dimensions = {
        //portrait
        width: style.width - 2 * imageMarginLeft,
        height: style.height,
        margin: `0 ${imageMarginLeft}px`,
      };
    }
    if (
      styleParams.itemBorderRadius &&
      styleParams.imageInfoType !== GALLERY_CONSTS.infoType.ATTACHED_BACKGROUND
    ) {
      dimensions.borderRadius = styleParams.itemBorderRadius + 'px';
    }
    return dimensions;
  }

  getItemHover(imageDimensions) {
    const { customHoverRenderer, ...props } = this.props;
    const shouldHover = this.shouldHover();
    return (
      shouldHover && (
        <ItemHover
          {...props}
          forceShowHover={this.simulateOverlayHover()}
          imageDimensions={imageDimensions}
          itemWasHovered={this.state.itemWasHovered}
          key="hover"
          actions={{
            handleItemMouseDown: this.handleItemMouseDown,
            handleItemMouseUp: this.handleItemMouseUp,
          }}
          renderCustomInfo={
            customHoverRenderer
              ? () => customHoverRenderer(this.getCustomInfoRendererProps())
              : null
          }
        ></ItemHover>
      )
    );
  }

  getCustomInfoRendererProps() {
    return { ...this.props, ...{ isMobile: utils.isMobile() } };
  }

  getImageItem(imageDimensions) {
    const props = utils.pick(this.props, [
      'gotFirstScrollEvent',
      'alt',
      'title',
      'description',
      'id',
      'idx',
      'styleParams',
      'createUrl',
      'settings',
      'isPrerenderMode',
    ]);

    return (
      <ImageItem
        {...props}
        key="imageItem"
        imageDimensions={imageDimensions}
        isThumbnail={!!this.props.thumbnailHighlightId}
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
        playing={this.props.idx === this.props.playingVideoIdx}
        key={'video' + this.props.idx}
        hover={itemHover}
        imageDimensions={imageDimensions}
        hasLink={this.itemHasLink()}
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
      'styleParams',
      'style',
      'html',
      'cubeRatio',
      'isPrerenderMode',
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
    const { width, height, margin } = imageDimensions;

    const itemStyles = { width, height };
    const marginVal =
      margin && Number(margin.replace('0 ', '').replace('px', ''));
    const fitInfoStyles = marginVal
      ? {
          width: `calc(100% + ${marginVal * 2}px)`,
          margin: `0 -${marginVal}px`,
        }
      : {};

    let itemHover = null;
    if (this.shouldHover() || styleParams.isSlideshow) {
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

    if (styleParams.isSlideshow) {
      const { customSlideshowInfoRenderer } = this.props;
      const fadeAnimationStyles = this.getFadeAnimationStyles();
      const infoStyle = {
        height: `${styleParams.slideshowInfoSize}px`,
        bottom: `-${styleParams.slideshowInfoSize}px`,
        ...fitInfoStyles,
        ...fadeAnimationStyles,
        transition: 'none',
      };
      const slideshowInfo = customSlideshowInfoRenderer
        ? customSlideshowInfoRenderer(this.getCustomInfoRendererProps())
        : null;

      const { photoId, id, idx } = this.props;
      itemInner = (
        <div>
          <a
            ref={(e) => (this.itemAnchor = e)}
            data-id={photoId}
            data-idx={idx}
            key={'item-container-link-' + id}
            {...this.getLinkParams()}
            tabIndex={-1}
            style={{ ...fadeAnimationStyles }}
          >
            {itemInner}
          </a>
          <div
            className="gallery-slideshow-info"
            data-hook="gallery-slideshow-info-buttons"
            style={infoStyle}
          >
            {slideshowInfo}
          </div>
        </div>
      );
    }

    return itemInner;
  }

  getRightInfoElementIfNeeded() {
    if (
      GALLERY_CONSTS.hasRightPlacement(
        this.props.styleParams.titlePlacement,
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
      GALLERY_CONSTS.hasLeftPlacement(
        this.props.styleParams.titlePlacement,
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
      GALLERY_CONSTS.hasBelowPlacement(
        this.props.styleParams.titlePlacement,
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
      GALLERY_CONSTS.hasAbovePlacement(
        this.props.styleParams.titlePlacement,
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
    const { styleParams, customInfoRenderer, style } = this.props;
    if (!customInfoRenderer) {
      return null;
    }
    let info = null;
    //if there is no url for videos and images, we will not render the itemWrapper
    //but will render the info element if exists, with the whole size of the item
    const infoHeight =
      styleParams.textBoxHeight + (this.hasRequiredMediaUrl ? 0 : style.height);
    const infoWidth =
      style.infoWidth + (this.hasRequiredMediaUrl ? 0 : style.width);

    const itemExternalInfo = customInfoRenderer(
      this.getCustomInfoRendererProps(),
      placement
    );

    info = (
      <div
        style={getOuterInfoStyle(
          placement,
          styleParams,
          style.height,
          styleParams.textBoxHeight
        )}
      >
        <div
          style={getInnerInfoStyle(
            placement,
            styleParams,
            infoHeight,
            infoWidth
          )}
          className={'gallery-item-common-info ' + elementName}
          aria-hidden={true}
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
      this.props.styleParams.alwaysShowHover === true ||
      (isEditMode() && this.props.styleParams.previewHover)
    );
  }

  simulateOverlayHover() {
    return (
      this.simulateHover() ||
      this.props.styleParams.hoveringBehaviour ===
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
      currentIdx,
      offset,
      style,
      styleParams,
      settings = {},
    } = this.props;
    const {
      oneRow,
      imageMargin,
      itemClick,
      isRTL,
      slideAnimation,
    } = styleParams;

    const containerStyleByStyleParams = getContainerStyle(styleParams);
    const itemDoesntHaveLink = !this.itemHasLink(); //when itemClick is 'link' but no link was added to this specific item

    const itemStyles = {
      overflowY: styleParams.isSlideshow ? 'visible' : 'hidden',
      position: 'absolute',
      bottom: 'auto',
      margin: oneRow ? imageMargin / 2 + 'px' : 0,
      cursor:
        itemClick === GALLERY_CONSTS.itemClick.NOTHING ||
        (itemClick === GALLERY_CONSTS.itemClick.LINK && itemDoesntHaveLink)
          ? 'default'
          : 'pointer',
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

    const fadeAnimationStyles =
      slideAnimation === GALLERY_CONSTS.slideAnimations.FADE
        ? {
            left: isRTL ? 'auto' : 0,
            right: !isRTL ? 'auto' : 0,
            pointerEvents: currentIdx === idx ? 'auto' : 'none',
            zIndex: currentIdx === idx ? 0 : 1,
          }
        : {};

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
      ...containerStyleByStyleParams,
      ...transitionStyles,
      ...opacityStyles,
      ...fadeAnimationStyles,
    };

    return itemContainerStyles;
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
    styles.margin = -styleParams.itemBorderWidth + 'px';
    styles.height = height + 'px';

    const imageDimensions = this.getImageDimensions();

    const itemWrapperStyles = {
      ...styles,
      ...imageDimensions,
      ...(!styleParams.isSlideshow && this.getFadeAnimationStyles()),
    };

    return itemWrapperStyles;
  }

  getFadeAnimationStyles() {
    const { idx, currentIdx, styleParams } = this.props;
    return styleParams.slideAnimation === GALLERY_CONSTS.slideAnimations.FADE
      ? {
          transition: currentIdx === idx ? 'none' : 'opacity .8s ease',
          opacity: currentIdx === idx ? 1 : 0,
          display: 'block',
          // visibility: currentIdx === idx ? 'visible' : 'hidden',
        }
      : {};
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
    const imagePlacementAnimation = styleParams.imagePlacementAnimation;
    const overlayAnimation = styleParams.overlayAnimation;
    const imageHoverAnimation = styleParams.imageHoverAnimation;
    const classNames = {
      'gallery-item-container': true,
      visible: true,
      highlight: this.isHighlight(),
      clickable: styleParams.itemClick !== 'nothing',
      'simulate-hover': this.simulateHover(),
      'hide-hover': !this.simulateHover() && utils.isMobile(),
      'invert-hover':
        styleParams.hoveringBehaviour ===
        GALLERY_CONSTS.infoBehaviourOnHover.DISAPPEARS,

      //animations
      'animation-slide':
        isNOTslideshow &&
        imagePlacementAnimation ===
          GALLERY_CONSTS.imagePlacementAnimations.SLIDE,

      //overlay animations
      'hover-animation-fade-in':
        isNOTslideshow &&
        overlayAnimation === GALLERY_CONSTS.overlayAnimations.FADE_IN,
      'hover-animation-expand':
        isNOTslideshow &&
        overlayAnimation === GALLERY_CONSTS.overlayAnimations.EXPAND,
      'hover-animation-slide-up':
        isNOTslideshow &&
        overlayAnimation === GALLERY_CONSTS.overlayAnimations.SLIDE_UP,
      'hover-animation-slide-right':
        isNOTslideshow &&
        overlayAnimation === GALLERY_CONSTS.overlayAnimations.SLIDE_RIGHT,

      //image hover animations
      'zoom-in-on-hover':
        isNOTslideshow &&
        imageHoverAnimation === GALLERY_CONSTS.imageHoverAnimations.ZOOM_IN,
      'blur-on-hover':
        isNOTslideshow &&
        imageHoverAnimation === GALLERY_CONSTS.imageHoverAnimations.BLUR,
      'grayscale-on-hover':
        isNOTslideshow &&
        imageHoverAnimation === GALLERY_CONSTS.imageHoverAnimations.GRAYSCALE,
      'shrink-on-hover':
        isNOTslideshow &&
        imageHoverAnimation === GALLERY_CONSTS.imageHoverAnimations.SHRINK,
      'invert-on-hover':
        isNOTslideshow &&
        imageHoverAnimation === GALLERY_CONSTS.imageHoverAnimations.INVERT,
      'color-in-on-hover':
        isNOTslideshow &&
        imageHoverAnimation === GALLERY_CONSTS.imageHoverAnimations.COLOR_IN,
      'darkened-on-hover':
        isNOTslideshow &&
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
            `#pro-gallery-${this.props.domId} #${String(activeElement.id)}`
          );
        const isGalleryItemInFocus = () =>
          String(activeElement.className).indexOf('gallery-item-container') >=
          0;
        //check if focus is on 'load-more' in current gallery
        const isThisGalleryShowMoreInFocus = () =>
          !!window.document.querySelector(
            `#pro-gallery-${this.props.domId} #${String(activeElement.id)}`
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
    if (utils.isMobile()) {
      try {
        React.initializeTouchEvents(true);
        // eslint-disable-next-line no-empty
      } catch (e) {}
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
    this.changeActiveElementIfNeeded(prevProps);
  }

  checkIfCurrentHoverChanged(e) {
    if (e.domId === this.props.domId) {
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
    if (!utils.isDev() && !this.props.styleParams.allowContextMenu) {
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
        return '';
    }
  }

  getLinkParams() {
    const { directLink, styleParams, directShareLink } = this.props;
    const isSEO = isSEOMode();
    if (styleParams.itemClick === GALLERY_CONSTS.itemClick.LINK) {
      const { url, target } = directLink || {};
      const noFollowForSEO = this.props.noFollowForSEO;
      const shouldUseNofollow = isSEO && noFollowForSEO;
      const shouldUseDirectLink = !!(url && target);
      const seoLinkParams = shouldUseNofollow ? { rel: 'nofollow' } : {};
      const linkParams = shouldUseDirectLink
        ? { href: url, target, ...seoLinkParams }
        : {};
      return linkParams;
    } else if (
      styleParams.itemClick === GALLERY_CONSTS.itemClick.FULLSCREEN ||
      styleParams.itemClick === GALLERY_CONSTS.itemClick.EXPAND
    ) {
      // place share link as the navigation item
      const url = directShareLink;
      const shouldUseDirectShareLink = !!url;
      const linkParams = shouldUseDirectShareLink
        ? { href: url, 'data-cancel-link': true }
        : {};
      return linkParams;
    }
  }

  composeItem() {
    const { photoId, id, hash, idx, styleParams, type, url } = this.props;

    //if (there is an url for video items and image items) OR text item (text item do not use media url)
    this.hasRequiredMediaUrl = url || type === 'text';
    //if titlePlacement !== SHOW_ON_HOVER and !this.hasRequiredMediaUrl, we will NOT render the itemWrapper (but will render the info element with the whole size of the item)
    const isItemWrapperEmpty =
      styleParams.titlePlacement !== GALLERY_CONSTS.placements.SHOW_ON_HOVER &&
      !this.hasRequiredMediaUrl;
    const innerDiv = (
      <div
        className={this.getItemContainerClass()}
        onContextMenu={(e) => this.onContextMenu(e)}
        id={cssScrollHelper.getSellectorDomId(this.props)}
        ref={(e) => (this.itemContainer = e)}
        onMouseOver={this.onMouseOver}
        onMouseOut={this.onMouseOut}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        onKeyDown={this.onContainerKeyDown}
        tabIndex={this.getItemContainerTabIndex()}
        aria-label={this.getItemAriaLabel()}
        data-hash={hash}
        data-id={photoId}
        data-idx={idx}
        role={this.getItemAriaRole()}
        data-hook="item-container"
        key={'item-container-' + id}
        style={this.getItemContainerStyles()}
      >
        {this.getTopInfoElementIfNeeded()}
        {this.getLeftInfoElementIfNeeded()}
        <div
          style={{
            ...(!this.props.styleParams.isSlideshow &&
              getImageStyle(this.props.styleParams)),
            ...(GALLERY_CONSTS.hasRightPlacement(
              this.props.styleParams.titlePlacement,
              this.props.idx
            ) && { float: 'left' }),
            ...(GALLERY_CONSTS.hasLeftPlacement(
              this.props.styleParams.titlePlacement,
              this.props.idx
            ) && { float: 'right' }),
          }}
        >
          {!isItemWrapperEmpty && (
            <div
              data-hook="item-wrapper"
              className={this.getItemWrapperClass()}
              key={'item-wrapper-' + id}
              id={'item-wrapper-' + id}
              style={this.getItemWrapperStyles()}
              onClick={this.onItemWrapperClick}
            >
              {this.getItemInner()}
            </div>
          )}
        </div>
        {this.getRightInfoElementIfNeeded()}
        {this.getBottomInfoElementIfNeeded()}
      </div>
    );

    if (styleParams.isSlideshow) {
      return innerDiv;
    } else {
      return (
        <a
          ref={(e) => (this.itemAnchor = e)}
          data-id={photoId}
          data-idx={idx}
          key={'item-container-link-' + id}
          {...this.getLinkParams()}
          tabIndex={-1}
          onKeyDown={(e) => {
            /* Relvenat only for Screen-Reader case:
            Screen-Reader ignores the tabIdex={-1} and therefore stops and focuses on the <a> tag keyDown event,
            so it will not go deeper to the item-container keyDown event.
            */
            this.onAnchorKeyDown(e);
          }}
        >
          {innerDiv}
        </a>
      );
    }
  }

  //-----------------------------------------| RENDER |--------------------------------------------//

  render() {
    return this.composeItem();
  }
}

export default ItemView;
