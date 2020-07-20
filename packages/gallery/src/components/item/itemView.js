import React from 'react';
import ImageItem from './imageItem.js';
import VideoItem from './videos/videoItem';
import TextItem from './textItem.js';
import ItemHover from './itemHover.js';
import utils from '../../common/utils/index.js';
import window from '../../common/window/windowWrapper';
import { cssScrollHelper } from '../helpers/cssScrollHelper';
import { featureManager } from '../helpers/versionsHelper';
import { GalleryComponent } from '../galleryComponent';
import {
  isEditMode,
  isSiteMode,
  isSEOMode,
  isPrerenderMode,
} from '../../common/window/viewModeWrapper';
import EVENTS from '../../common/constants/events';
import PLACEMENTS, { hasBelowPlacement, hasAbovePlacement, hasRightPlacement, hasLeftPlacement, hasHoverPlacement } from '../../common/constants/placements';
import INFO_BEHAVIOUR_ON_HOVER from '../../common/constants/infoBehaviourOnHover';
import CLICK_ACTIONS from '../../common/constants/itemClick';
import OVERLAY_ANIMATIONS from '../../common/constants/overlayAnimations';
import IMAGE_HOVER_ANIMATIONS from '../../common/constants/imageHoverAnimations';
import {
  getOuterInfoStyle,
  getInnerInfoStyle,
  getContainerStyle,
  getImageStyle,
} from './itemViewStyleProvider';
import IMAGE_PLACEMENT_ANIMATIONS from '../../common/constants/imagePlacementAnimations.js';

class ItemView extends GalleryComponent {
  constructor(props) {
    super(props);
    this.props.actions.eventsListener(EVENTS.ITEM_CREATED, this.props);

    this.init();

    this.state = {
      isCurrentHover: false,
      itemWasHovered: false
    };

    this.activeElement = '';
  }

  //-------------------------------------------| INIT |--------------------------------------------//

  init() {
    this.onItemClick = this.onItemClick.bind(this);
    this.onItemWrapperClick = this.onItemWrapperClick.bind(this);
    this.onItemInfoClick = this.onItemInfoClick.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
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
    this.changeActiveElementIfNeeded = this.changeActiveElementIfNeeded.bind(
      this,
    );
    this.checkIfCurrentHoverChanged = this.checkIfCurrentHoverChanged.bind(this);
    this.getCustomInfoRendererProps = this.getCustomInfoRendererProps.bind(this);
  }

  //----------------------------------------| ACTIONS |-------------------------------------------//
  setItemLoaded() {
    this.props.actions.eventsListener(EVENTS.ITEM_LOADED, this.props);
    this.setState({
      loaded: true
    });

    this.itemLoadedTimeout = setTimeout(() => {
      this.setState(() => ({ loaded: true }));
    }, 1500);
  }

  isIconTag(tagName) {
    return ['button', 'i', 'a', 'svg', 'path'].indexOf(tagName.toLowerCase()) >= 0;
  }

  onMouseOver() {
    if (!utils.isMobile()) {
      this.props.actions.eventsListener(EVENTS.HOVER_SET, this.props.idx);
    }
  }

  onMouseOut() {
    if (!utils.isMobile()) {
      this.props.actions.eventsListener(EVENTS.HOVER_SET, -1);
    }
  }

  onKeyPress(e) {
    switch (e.keyCode || e.charCode) {
      case 32: //space
      case 13: //enter
        e.preventDefault();
        e.stopPropagation();
        const clickTarget = 'item-container';
        this.onItemClick(e, clickTarget) //pressing enter or space always behaves as click on main image, even if the click is on a thumbnail
        if (this.shouldUseDirectLink()) {
          this.itemAnchor.click(); // when directLink, we want to simulate the 'enter' or 'space' press on an <a> element
        }
        return false;
      default:
        return true;
    }
  }

  handleGalleryItemAction(e) {
    this.props.actions.eventsListener(EVENTS.ITEM_ACTION_TRIGGERED, this.props, e);
  }

  onItemWrapperClick(e) {
    const clickTarget = 'item-media';
    this.onItemClick(e,clickTarget);
  }

  onItemInfoClick(e) {
    const clickTarget = 'item-info';
    this.onItemClick(e,clickTarget);
  }

  onItemClick(e,clickTarget) {
    if (utils.isFunction(utils.get(window, 'galleryWixCodeApi.onItemClicked'))) {
      window.galleryWixCodeApi.onItemClicked(this.props); //TODO remove after OOI is fully integrated
    }
    this.props.actions.eventsListener(EVENTS.ITEM_CLICKED, {...this.props, clickTarget}, e);

    if (this.shouldUseDirectLink()) {
      return;
    }

    e.preventDefault();

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
      this.props.actions.eventsListener(EVENTS.HOVER_SET, -1);
      return true;
    }
    if (useDirectLink && !this.shouldShowHoverOnMobile()) {
      return true;
    }
    return false;
  };

  isClickOnCurrentHoveredItem = () =>
    this.state.isCurrentHover;

  handleHoverClickOnMobile(e) {
    if (this.isClickOnCurrentHoveredItem()) {
      this.handleGalleryItemAction(e);
      this.props.actions.eventsListener(EVENTS.HOVER_SET, -1);
    } else {
      this.props.actions.eventsListener(EVENTS.HOVER_SET, this.props.idx);
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
      } = this.props.styleParams;
      const isNewMobileSettings = featureManager.supports.mobileSettings;
      if (hoveringBehaviour === INFO_BEHAVIOUR_ON_HOVER.NEVER_SHOW) {
        return false;
      }
      if (itemClick === 'nothing' && this.props.type !== 'video') {
        return true;
      } else if (
        this.props.customHoverRenderer &&
        hasHoverPlacement(titlePlacement) && hoveringBehaviour !== INFO_BEHAVIOUR_ON_HOVER.NEVER_SHOW &&
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

  shouldHover() { //see if this could be decided in the preset
    const { styleParams } = this.props;
    const { alwaysShowHover, previewHover, hoveringBehaviour } = styleParams;
    const { NEVER_SHOW, APPEARS } = INFO_BEHAVIOUR_ON_HOVER;

    if (hoveringBehaviour === NEVER_SHOW) {
      return false;
    } else if (alwaysShowHover === true) {
      return true;
    } else if (isEditMode() && previewHover) {
      return true;
    } else if (!this.state.itemWasHovered && hoveringBehaviour === APPEARS) {
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
      (style.height * style.ratio - style.width) / -2,
    );
    const imageMarginTop = Math.round(
      (style.width / style.ratio - style.height) / -2,
    );
    const isGridFit = (styleParams.cubeImages && styleParams.cubeType === 'fit');

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
      }
    } else if (isGridFit && !isLandscape) {
      dimensions = {
        //portrait
        width: style.width - 2 * imageMarginLeft,
        height: style.height,
        margin: `0 ${imageMarginLeft}px`,
      }
    }
    if (styleParams.itemBorderRadius) {
      dimensions.borderRadius = styleParams.itemBorderRadius + 'px';
    }
    if (isPrerenderMode()) {
      const itemContainerDimensions = this.getItemContainerDimensions();
      dimensions = {...dimensions, ...itemContainerDimensions, transition: 'width 1s, height 1s'};
    }
    return dimensions;
  }

  getItemContainerDimensions() {
    const dimensions = {}
    if (this.itemContainer && window.getComputedStyle) {
      const height = window.getComputedStyle(this.itemContainer).getPropertyValue("height");
      const width = window.getComputedStyle(this.itemContainer).getPropertyValue("width");
      width && (dimensions.width = width);
      height && (dimensions.height = height);
    }
    return dimensions;
  }

  getItemHover(imageDimensions) {
    const { customHoverRenderer, ...props } = this.props;
    const shouldHover = this.shouldHover() || null;
    return shouldHover && (
      <ItemHover
        {...props}
        forceShowHover={this.simulateOverlayHover()}
        shouldHover={shouldHover}
        imageDimensions={imageDimensions}
        key="hover"
        actions={{
          handleItemMouseDown: this.handleItemMouseDown,
          handleItemMouseUp: this.handleItemMouseUp,
        }}
        renderCustomInfo={customHoverRenderer ? () => customHoverRenderer(this.getCustomInfoRendererProps()) : null}
      >
      </ItemHover>
    );
  }

  getCustomInfoRendererProps() {
    return {...this.props, ...{isMobile: utils.isMobile()}}
  };

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
      'lazyLoad',
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
      <VideoItem
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
    const {width, height} = this.getImageDimensions();
    const imageDimensions = {width, height};

    let itemHover = null;
    if (this.shouldHover() || styleParams.isSlideshow) {
      itemHover = this.getItemHover(imageDimensions);
    }


    switch (type) {
      case 'dummy':
          itemInner = <div />;
        break;
      case 'video':
        
          itemInner = this.getVideoItem(imageDimensions, itemHover);
        break;
      case 'text':
        itemInner = [this.getTextItem(imageDimensions), itemHover];
        break;
      case 'image':
      case 'picture':
      default:
        if (this.props.isVideoPlaceholder) {
          itemInner = this.getVideoItem(imageDimensions, itemHover);
        } else {
        itemInner = [this.getImageItem(imageDimensions), itemHover];
        }
    }

    if (styleParams.isSlideshow) {
      const { customSlideshowInfoRenderer } = this.props;
      const style = {
        height: `${styleParams.slideshowInfoSize}px`,
        bottom: `-${styleParams.slideshowInfoSize}px`,
      };
      const slideshowInfo = customSlideshowInfoRenderer
        ? customSlideshowInfoRenderer(this.getCustomInfoRendererProps()) : null;

      const { photoId, id, idx } = this.props;
      itemInner = (
        <div>
          <a
            ref={e => (this.itemAnchor = e)}
            data-id={photoId}
            data-idx={idx}
            key={'item-container-link-' + id}
            {...this.getLinkParams()}
            tabIndex={-1}
          >
            {itemInner}
          </a>
          <div
            className="gallery-slideshow-info"
            data-hook="gallery-slideshow-info-buttons"
            style={style}
          >
            {slideshowInfo}
          </div>
        </div>
      );
    }

    return itemInner;
  }

  getRightInfoElementIfNeeded() {
    if (hasRightPlacement(this.props.styleParams.titlePlacement)) {
      return this.getExternalInfoElement(PLACEMENTS.SHOW_ON_THE_RIGHT, 'gallery-item-right-info');
    } else {
      return null;
    }
  }

  getLeftInfoElementIfNeeded() {
    if (hasLeftPlacement(this.props.styleParams.titlePlacement)) {
      return this.getExternalInfoElement(PLACEMENTS.SHOW_ON_THE_LEFT, 'gallery-item-left-info');
    } else {
      return null;
    }
  }

  getBottomInfoElementIfNeeded() {
    if (hasBelowPlacement(this.props.styleParams.titlePlacement)) {
      return this.getExternalInfoElement(PLACEMENTS.SHOW_BELOW, 'gallery-item-bottom-info');
    } else {
      return null;
    }
  }

  getTopInfoElementIfNeeded() {
    if (hasAbovePlacement(this.props.styleParams.titlePlacement)) {
      return this.getExternalInfoElement(PLACEMENTS.SHOW_ABOVE, 'gallery-item-top-info');
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
    const infoHeight = styleParams.textBoxHeight + (this.hasRequiredMediaUrl ? 0 : style.height);
    const infoWidth = style.infoWidth + (this.hasRequiredMediaUrl ? 0 : style.width);

    const itemExternalInfo = customInfoRenderer(this.getCustomInfoRendererProps(), placement);

    info = (
      <div style={getOuterInfoStyle(placement, styleParams, style.height, styleParams.textBoxHeight)}>
        <div
          style={getInnerInfoStyle(placement, styleParams, infoHeight, infoWidth)}
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
      this.props.styleParams.hoveringBehaviour === INFO_BEHAVIOUR_ON_HOVER.NO_CHANGE
    );
  }

  itemHasLink(){
    const { linkData, linkUrl } = this.props;
    const itemDoesntHaveLink = linkData.type === undefined && (linkUrl === undefined || linkUrl === ''); //when itemClick is 'link' but no link was added to this specific item
    return !itemDoesntHaveLink;
  }
  
  getItemContainerStyles() {
    const { offset, style, styleParams, settings = {} } = this.props;

    const containerStyleByStyleParams = getContainerStyle(styleParams);
    const itemDoesntHaveLink = !this.itemHasLink(); //when itemClick is 'link' but no link was added to this specific item

    const itemStyles = {
      overflowY: styleParams.isSlideshow ? 'visible' : 'hidden',
      position: 'absolute',
      bottom: 'auto',
      margin: styleParams.oneRow ? styleParams.imageMargin + 'px' : 0,
      cursor: styleParams.itemClick === CLICK_ACTIONS.NOTHING ||
      (styleParams.itemClick === CLICK_ACTIONS.LINK && itemDoesntHaveLink)
        ? 'default'
        : 'pointer'
    };

    const layoutStyles = settings.avoidInlineStyles ? {} : {
      top: offset.top,
      left: styleParams.isRTL ? 'auto' : offset.left,
      right: !styleParams.isRTL ? 'auto' : offset.left,
      width: style.width + style.infoWidth,
      height: style.height + style.infoHeight,
    };

    return { ...itemStyles, ...layoutStyles, ...containerStyleByStyleParams };
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
    };

    return itemWrapperStyles;

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
      'visible': true,
      highlight: this.isHighlight(),
      clickable: styleParams.itemClick !== 'nothing',
      'simulate-hover': this.simulateHover(),
      'hide-hover': !this.simulateHover() && utils.isMobile(),
      'invert-hover':
        styleParams.hoveringBehaviour === INFO_BEHAVIOUR_ON_HOVER.DISAPPEARS,

      //animations
      'animation-slide':
        isNOTslideshow && imagePlacementAnimation === IMAGE_PLACEMENT_ANIMATIONS.SLIDE,

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
    };
    const strClass = Object.entries(classNames)
      .map(([classname, isNeeded]) => isNeeded ? classname : false)
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
            `#pro-gallery-${this.props.domId} #${String(
              activeElement.id,
            )}`,
          );
        const isGalleryItemInFocus = () =>
          String(activeElement.className).indexOf('gallery-item-container') >=
          0;
        //check if focus is on 'load-more' in current gallery
        const isThisGalleryShowMoreInFocus = () =>
          !!window.document.querySelector(
            `#pro-gallery-${this.props.domId} #${String(
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
    if (utils.isMobile()) {
      try {
        React.initializeTouchEvents(true);
      } catch (e) { }
    }

    window.addEventListener('current_hover_change', this.checkIfCurrentHoverChanged);
  }

  componentWillUnmount() {
    clearTimeout(this.itemLoadedTimeout);
    window.removeEventListener('current_hover_change', this.checkIfCurrentHoverChanged);
  }

  componentDidUpdate(prevProps) {
    this.changeActiveElementIfNeeded(prevProps);
  }

  checkIfCurrentHoverChanged(e) {
    if (e.domId === this.props.domId) {
      if (!this.state.isCurrentHover && e.currentHoverIdx === this.props.idx) {
        this.setState({
          isCurrentHover: true,
          itemWasHovered: true
        })
      } else if (this.state.isCurrentHover && e.currentHoverIdx !== this.props.idx) {
        this.setState({
          isCurrentHover: false
        })
      }
    }
  };

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

  getLinkParams() {
    const { directLink, styleParams, directShareLink } = this.props;
    const isSEO = isSEOMode();
    if (styleParams.itemClick === CLICK_ACTIONS.LINK) {
    const { url, target } = directLink || {};
    const noFollowForSEO = this.props.noFollowForSEO;
    const shouldUseNofollow = isSEO && noFollowForSEO;
    const shouldUseDirectLink = !!(url && target);
    const seoLinkParams = shouldUseNofollow ? { rel: 'nofollow' } : {};
    const linkParams = shouldUseDirectLink
      ? { href: url, target, ...seoLinkParams }
      : {};
    return linkParams;
  } else if (styleParams.itemClick === CLICK_ACTIONS.FULLSCREEN || styleParams.itemClick === CLICK_ACTIONS.EXPAND){
    // place share link as the navigation item
    const url = directShareLink;
    const shouldUseDirectShareLink = !!url;
    const linkParams = shouldUseDirectShareLink
    ? { href: url , "data-cancel-link":true }
    : {};
    return linkParams;
    }
  }

  composeItem() {
    const { photoId, id, hash, idx, styleParams, type, url } = this.props;

    //if (there is an url for video items and image items) OR text item (text item do not use media url)
    this.hasRequiredMediaUrl = url || type === 'text';
    //if titlePlacement !== SHOW_ON_HOVER and !this.hasRequiredMediaUrl, we will NOT render the itemWrapper (but will render the info element with the whole size of the item)
    const isItemWrapperEmpty = styleParams.titlePlacement !== PLACEMENTS.SHOW_ON_HOVER && !this.hasRequiredMediaUrl;
    const innerDiv = (
      <div
        className={this.getItemContainerClass()}
        onContextMenu={e => this.onContextMenu(e)}
        id={cssScrollHelper.getSellectorDomId(this.props)}
        ref={e => (this.itemContainer = e)}
        onMouseOver={this.onMouseOver}
        onMouseOut={this.onMouseOut}
        onKeyDown={this.onKeyPress}
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
          style={{...(!this.props.styleParams.isSlideshow && getImageStyle(this.props.styleParams)),
            ...((hasRightPlacement(this.props.styleParams.titlePlacement)) && {float: 'left'}),
            ...((hasLeftPlacement(this.props.styleParams.titlePlacement)) && {float: 'right'})
          }}
        >
          {!isItemWrapperEmpty && (<div
            data-hook="item-wrapper"
            className={this.getItemWrapperClass()}
            key={'item-wrapper-' + id}
            style={this.getItemWrapperStyles()}
            onClick={this.onItemWrapperClick}
          >
            {this.getItemInner()}
          </div>)}
        </div>
        {this.getRightInfoElementIfNeeded()}
        {this.getBottomInfoElementIfNeeded()}
      </div>
    );

    if (styleParams.isSlideshow) {
      return innerDiv
    } else {
      return (
        <a
          ref={e => (this.itemAnchor = e)}
          data-id={photoId}
          data-idx={idx}
          key={'item-container-link-' + id}
          {...this.getLinkParams()}
          tabIndex={-1}
        >
          {innerDiv}
        </a>
      )
    }
  }

  //-----------------------------------------| RENDER |--------------------------------------------//

  render() {
    return this.composeItem();
  }
}

export default ItemView;
