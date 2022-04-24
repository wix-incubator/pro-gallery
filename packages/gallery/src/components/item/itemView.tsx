/* eslint-disable prettier/prettier */
import React from 'react';
import {
  GALLERY_CONSTS,
  featureManager,
  window,
  utils,
  isEditMode,
  isPreviewMode,
  EventsListener,
  GalleryProps,
} from 'pro-gallery-lib';
import ItemHover from './itemHover.js';
import { changeActiveElementIfNeeded, onAnchorFocus } from './itemHelper.js';
import { cssScrollHelper } from '../helpers/cssScrollHelper';
import {
  getInnerInfoStyle,
  getContainerStyle,
  getImageStyle,
  getOuterInfoStyle,
} from './itemViewStyleProvider';
import {
  getSlideAnimationStyles,
  getCustomInfoRendererProps,
  getLinkParams,
} from './pure';
import ProGalleryBaseComponent, { ProGalleryContext } from '../base.js';
import TextItem from './textItem.js';
import VideoItemWrapper from './videos/videoItemWrapper.js';
import MagnifiedImage from './imageWithMagnified.js';
import { MouseEventHandler } from 'react';
import { CSSProperties } from 'react';

interface ItemViewProps {
  idx: number;
  item;
  activeIndex: number;
  directLink: {
    url: string;
    target: string;
  };
  type: string;
  thumbnailHighlightId: string;
  id: string;
  style: any;
  offset;
  isVideoPlaceholder: boolean;
  photoId: string;
  playingVideoIdx: number;
  linkData: any;
  linkUrl: string;
  gotFirstScrollEvent: boolean;
  calculatedAlt: string;
  title: string;
  description: string;
  createUrl: any;
  createMagnifiedUrl: any;
  isTransparent: boolean;
  html: string;
  cropRatio: number;
  hash: string;
  url: string;
}

interface ItemViewExternalProps {
  eventsListener: EventsListener;
  settings: NonNullable<GalleryProps['settings']>;
  options: NonNullable<GalleryProps['options']>;
  customHoverRenderer: any;
  customSlideshowInfoRenderer: any;
  customInfoRenderer: any;
  isPrerenderMode: boolean;
}

interface ItemViewState {
  isCurrentHover: boolean;
  itemWasHovered: boolean;
  loaded?: boolean;
}

class ItemView extends ProGalleryBaseComponent<
  ItemViewProps,
  ItemViewState,
  ItemViewExternalProps
> {
  constructor(props) {
    super(props);
    this.compProps.eventsListener(
      GALLERY_CONSTS.events.ITEM_CREATED,
      this.compProps
    );

    this.state = {
      isCurrentHover: false,
      itemWasHovered: false,
    };
  }
  activeElement = '';
  itemAnchor: HTMLAnchorElement | null = null;
  itemContainer: HTMLDivElement | null = null;
  longPressTimer?: number;
  hasRequiredMediaUrl?: boolean;

  mapProGalleryContextToProps = (
    context: ProGalleryContext
  ): Omit<ItemView['compProps'], keyof ItemView['props']> => {
    return {
      eventsListener: context.eventsListener!,
      settings: context.settings!,
      options: context.options!,
      customHoverRenderer: context.customComponents!.customHoverRenderer,
      customSlideshowInfoRenderer:
        context.customComponents!.customSlideshowInfoRenderer,
      customInfoRenderer: context.customComponents!.customInfoRenderer,
      isPrerenderMode: !!context.isPrerenderMode,
    };
  };

  //----------------------------------------| ACTIONS |-------------------------------------------//
  setItemLoaded = (): void => {
    this.compProps.eventsListener(
      GALLERY_CONSTS.events.ITEM_LOADED,
      this.compProps
    );
    this.setState({
      loaded: true,
    });
  };

  isIconTag = (tagName: string): boolean => {
    return (
      ['button', 'i', 'a', 'svg', 'path'].indexOf(tagName.toLowerCase()) >= 0
    );
  };

  onMouseOver = (): void => {
    if (!(utils as any).isMobile()) {
      this.compProps.eventsListener(
        GALLERY_CONSTS.events.HOVER_SET,
        this.compProps.idx
      );
    }
  };

  onMouseOut = (): void => {
    if (!(utils as any).isMobile()) {
      this.compProps.eventsListener(GALLERY_CONSTS.events.HOVER_SET, -1);
    }
  };

  onFocus = (): void => {
    if (this.compProps.settings?.isAccessible) {
      this.compProps.eventsListener(
        GALLERY_CONSTS.events.HOVER_SET,
        this.compProps.idx
      );
    }
    this.compProps.eventsListener(
      GALLERY_CONSTS.events.ITEM_FOCUSED,
      this.compProps
    );
  };

  onBlur = (): void => {
    if (this.compProps.settings?.isAccessible) {
      this.compProps.eventsListener(GALLERY_CONSTS.events.HOVER_SET, -1);
    }
    this.compProps.eventsListener(
      GALLERY_CONSTS.events.ITEM_LOST_FOCUS,
      this.compProps
    );
  };

  onContainerKeyDown = (e: React.KeyboardEvent): boolean => {
    const clickTarget = 'item-container';
    switch (e.keyCode || e.charCode) {
      case 32: //space
      case 13: //enter
        e.stopPropagation();
        this.onItemClick(e, clickTarget, false); //pressing enter or space always behaves as click on main image, even if the click is on a thumbnail
        if (this.shouldUseDirectLink()) {
          this.itemAnchor?.click(); // when directLink, we want to simulate the 'enter' or 'space' press on an <a> element
        }
        return false;
      default:
        return true;
    }
  };

  onAnchorKeyDown = (e: React.KeyboardEvent): boolean => {
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
  };

  handleGalleryItemAction: MouseEventHandler = (e): void => {
    this.compProps.eventsListener(
      GALLERY_CONSTS.events.ITEM_ACTION_TRIGGERED,
      this.compProps,
      e
    );
  };

  onItemWrapperClick: MouseEventHandler = (e): void => {
    const clickTarget = 'item-media';
    this.onItemClick(e, clickTarget);
  };

  onItemInfoClick: MouseEventHandler = (e): void => {
    const clickTarget = 'item-info';
    this.onItemClick(e, clickTarget);
  };

  onItemClick = (e: any, clickTarget, shouldPreventDefault = true): void => {
    if (
      (utils as any).isFunction(
        (utils as any).get(window, 'galleryWixCodeApi.onItemClicked')
      )
    ) {
      (window as any).galleryWixCodeApi.onItemClicked(this.compProps); //TODO remove after OOI is fully integrated
    }
    this.compProps.eventsListener(
      GALLERY_CONSTS.events.ITEM_CLICKED,
      { ...this.compProps, clickTarget },
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
  };

  shouldUseDirectLink = (): boolean => {
    const { directLink } = this.compProps;
    const { url, target } = directLink || {};
    const useDirectLink = !!(
      url &&
      target &&
      this.compProps.options.itemClick === 'link'
    );
    const shouldUseDirectLinkOnMobile =
      this.shouldShowHoverOnMobile() &&
      this.isClickOnCurrentHoveredItem() &&
      useDirectLink;

    if (shouldUseDirectLinkOnMobile) {
      this.compProps.eventsListener(GALLERY_CONSTS.events.HOVER_SET, -1);
      return true;
    }
    if (useDirectLink && !this.shouldShowHoverOnMobile()) {
      return true;
    }
    return false;
  };

  isClickOnCurrentHoveredItem = (): boolean =>
    this.state.isCurrentHover || // this single item was already hovered.
    this.compProps.options.hoveringBehaviour ===
      GALLERY_CONSTS.infoBehaviourOnHover.NO_CHANGE; // all the items are always 'already' hovered

  handleHoverClickOnMobile(e): void {
    if (this.isClickOnCurrentHoveredItem()) {
      this.handleGalleryItemAction(e);
      this.compProps.eventsListener(GALLERY_CONSTS.events.HOVER_SET, -1);
    } else {
      this.compProps.eventsListener(
        GALLERY_CONSTS.events.HOVER_SET,
        this.compProps.idx
      );
    }
  }

  handleItemMouseDown = (): true => {
    //check for long press
    // if ((utils as any).isMobile()) {
    //   clearTimeout(this.longPressTimer);
    //   this.longPressTimer = setTimeout(() => {
    //     e.preventDefault(); //prevent default only after a long press (so that scroll will not break)
    //     //do something
    //   }, 500);
    // }
    return true; //make sure the default event behaviour continues
  };

  handleItemMouseUp = (): true => {
    if ((utils as any).isMobile() && this.longPressTimer) {
      clearTimeout(this.longPressTimer);
    }
    return true; //make sure the default event behaviour continues
  };

  //-----------------------------------------| UTILS |--------------------------------------------//

  shouldShowHoverOnMobile = (): boolean => {
    if ((utils as any).isMobile()) {
      const {
        titlePlacement,
        hoveringBehaviour,
        itemClick,
        alwaysShowHover,
        previewHover,
        allowDescription,
        allowTitle,
        isStoreGallery,
      } = this.compProps.options;
      const isNewMobileSettings = (featureManager as any).supports
        .mobileSettings;
      if (
        hoveringBehaviour === GALLERY_CONSTS.infoBehaviourOnHover.NEVER_SHOW
      ) {
        return false;
      }
      if (itemClick === 'nothing' && this.compProps.type !== 'video') {
        return true;
      } else if (
        this.compProps.customHoverRenderer &&
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
  };

  isHighlight = (): boolean => {
    return !!(
      this.compProps.thumbnailHighlightId &&
      this.compProps.thumbnailHighlightId === this.compProps.id
    );
  };

  shouldHover = (): boolean => {
    //see if this could be decided in the preset
    const { options } = this.compProps;
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
    } else if ((utils as any).isMobile()) {
      return this.shouldShowHoverOnMobile();
    } else {
      return true;
    }
  };

  //---------------------------------------| COMPONENTS |-----------------------------------------//

  getItemHover = (imageDimensions): false | JSX.Element => {
    const shouldHover = this.shouldHover();
    return (
      shouldHover && (
        <ItemHover
          {...this.compProps}
          forceShowHover={this.simulateOverlayHover()}
          imageDimensions={imageDimensions}
          itemWasHovered={this.state.itemWasHovered}
          key="hover"
          actions={{
            handleItemMouseDown: this.handleItemMouseDown,
            handleItemMouseUp: this.handleItemMouseUp,
          }}
          renderCustomInfo={
            this.compProps.customHoverRenderer
              ? () =>
                  this.compProps.customHoverRenderer(
                    getCustomInfoRendererProps(this.compProps)
                  )
              : null
          }
        ></ItemHover>
      )
    );
  };

  getImageItem = (imageDimensions): JSX.Element => {
    const props = (utils as any).pick(this.compProps, [
      'gotFirstScrollEvent',
      'calculatedAlt',
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
    ]);

    return (
      <MagnifiedImage
        {...props}
        key="imageItem"
        imageDimensions={imageDimensions}
        isThumbnail={!!this.compProps.thumbnailHighlightId}
        actions={{
          handleItemMouseDown: this.handleItemMouseDown,
          handleItemMouseUp: this.handleItemMouseUp,
          setItemLoaded: this.setItemLoaded,
        }}
      />
    );
  };

  getVideoItem = (imageDimensions, itemHover): JSX.Element => {
    return (
      <VideoItemWrapper
        {...this.compProps}
        shouldPlay={this.compProps.idx === this.compProps.playingVideoIdx}
        key={'video' + this.compProps.idx}
        hover={itemHover}
        imageDimensions={imageDimensions}
        hasLink={this.itemHasLink()}
        actions={{
          eventListeners: this.compProps.eventsListener,
          setItemLoaded: this.setItemLoaded,
          handleItemMouseDown: this.handleItemMouseDown,
          handleItemMouseUp: this.handleItemMouseUp,
        }}
      />
    );
  };

  getTextItem = (imageDimensions): JSX.Element => {
    const props = (utils as any).pick(this.compProps, [
      'id',
      'options',
      'style',
      'html',
      'cropRatio',
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
  };

  getItemInner = (): any => {
    const { type, style, offset, options, id, photoId } = this.compProps;
    let itemInner;

    const { width, height, innerWidth, innerHeight } = style;
    const { innerTop, innerLeft } = offset;

    const itemStyles = {
      width: innerWidth,
      height: innerHeight,
      marginTop: innerTop,
      marginLeft: innerLeft,
    };
    let itemHover: JSX.Element | null = null;
    if (this.shouldHover()) {
      itemHover = this.getItemHover(itemStyles) || null;
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
        if (this.compProps.isVideoPlaceholder) {
          itemInner = this.getVideoItem(itemStyles, itemHover);
        } else {
          itemInner = [this.getImageItem(itemStyles), itemHover];
        }
    }

    if (GALLERY_CONSTS.isLayout('SLIDESHOW')(options)) {
      return this.getSlideshowItemInner({
        options,
        width,
        height,
        itemInner,
        id,
        photoId,
      });
    }

    return itemInner;
  };

  getSlideshowItemInner = ({
    options,
    width,
    height,
    itemInner,
    photoId,
    id,
  }): JSX.Element => {
    const { customSlideshowInfoRenderer } = this.compProps;
    const slideAnimationStyles = getSlideAnimationStyles(this.compProps as any);
    const infoStyle = {
      height: `${options.slideshowInfoSize}px`,
      bottom: `-${options.slideshowInfoSize}px`,
      ...slideAnimationStyles,
      transition: 'none',
    };
    const slideshowInfo = customSlideshowInfoRenderer
      ? customSlideshowInfoRenderer(getCustomInfoRendererProps(this.compProps))
      : null;

    const { idx } = this.compProps;
    return (
      <div>
        <a
          ref={(e) => (this.itemAnchor = e)}
          data-id={photoId}
          data-idx={idx}
          key={'item-container-link-' + id}
          {...getLinkParams(this.compProps as any)}
          tabIndex={-1}
          style={{ ...slideAnimationStyles, width, height }}
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
  };

  getRightInfoElementIfNeeded = (): null | JSX.Element => {
    if (
      GALLERY_CONSTS.hasExternalRightPlacement(
        this.compProps.options.titlePlacement,
        this.compProps.idx
      )
    ) {
      return this.getExternalInfoElement(
        GALLERY_CONSTS.placements.SHOW_ON_THE_RIGHT,
        'gallery-item-right-info'
      );
    } else {
      return null;
    }
  };

  getLeftInfoElementIfNeeded = (): null | JSX.Element => {
    if (
      GALLERY_CONSTS.hasExternalLeftPlacement(
        this.compProps.options.titlePlacement,
        this.compProps.idx
      )
    ) {
      return this.getExternalInfoElement(
        GALLERY_CONSTS.placements.SHOW_ON_THE_LEFT,
        'gallery-item-left-info'
      );
    } else {
      return null;
    }
  };

  getBottomInfoElementIfNeeded = (): null | JSX.Element => {
    if (
      GALLERY_CONSTS.hasExternalBelowPlacement(
        this.compProps.options.titlePlacement,
        this.compProps.idx
      )
    ) {
      return this.getExternalInfoElement(
        GALLERY_CONSTS.placements.SHOW_BELOW,
        'gallery-item-bottom-info'
      );
    } else {
      return null;
    }
  };

  getTopInfoElementIfNeeded = (): null | JSX.Element => {
    if (
      GALLERY_CONSTS.hasExternalAbovePlacement(
        this.compProps.options.titlePlacement,
        this.compProps.idx
      )
    ) {
      return this.getExternalInfoElement(
        GALLERY_CONSTS.placements.SHOW_ABOVE,
        'gallery-item-top-info'
      );
    } else {
      return null;
    }
  };

  getExternalInfoElement = (placement, elementName): null | JSX.Element => {
    const { options, style, customInfoRenderer } = this.compProps;
    if (!customInfoRenderer) {
      return null;
    }
    let info: JSX.Element | null = null;
    //if there is no url for videos and images, we will not render the itemWrapper
    //but will render the info element if exists, with the whole size of the item
    const infoHeight =
      options.textBoxHeight + (this.hasRequiredMediaUrl ? 0 : style.height);
    const infoWidth =
      style.infoWidth + (this.hasRequiredMediaUrl ? 0 : style.width);

    const itemExternalInfo = customInfoRenderer(
      getCustomInfoRendererProps(this.compProps),
      placement
    );

    info = (
      <div
        style={
          getOuterInfoStyle(
            placement,
            options,
            style.height,
            options.textBoxHeight
          ) as CSSProperties
        }
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
  };

  simulateHover = (): boolean => {
    return (
      this.state.isCurrentHover ||
      this.compProps.options.alwaysShowHover === true ||
      (isEditMode() && this.compProps.options.previewHover)
    );
  };

  simulateOverlayHover = (): boolean => {
    return (
      this.simulateHover() ||
      this.compProps.options.hoveringBehaviour ===
        GALLERY_CONSTS.infoBehaviourOnHover.NO_CHANGE
    );
  };

  itemHasLink = () => {
    const { linkData, linkUrl } = this.compProps;
    const itemDoesntHaveLink =
      linkData.type === undefined && (linkUrl === undefined || linkUrl === ''); //when itemClick is 'link' but no link was added to this specific item
    return !itemDoesntHaveLink;
  };

  getItemContainerStyles = (): any => {
    const {
      idx,
      offset,
      style,
      activeIndex,
      options,
      settings = {},
    } = this.compProps;
    const { scrollDirection, imageMargin, itemClick, isRTL, slideAnimation } =
      options;

    const containerStyleByoptions = getContainerStyle(options);
    const itemDoesntHaveLink = !this.itemHasLink(); //when itemClick is 'link' but no link was added to this specific item
    const isSlideshow = GALLERY_CONSTS.isLayout('SLIDESHOW')(
      this.compProps.options
    );

    const itemStyles = {
      overflowY: isSlideshow ? 'visible' : 'hidden',
      position: 'absolute',
      bottom: 'auto',
      margin:
        scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL
          ? imageMargin / 2 + 'px'
          : 0,
      cursor:
        itemClick === GALLERY_CONSTS.itemClick.NOTHING ||
        (itemClick === GALLERY_CONSTS.itemClick.LINK && itemDoesntHaveLink)
          ? 'default'
          : 'pointer',
    };

    const { avoidInlineStyles } = settings;

    const hideOnSSR =
      this.compProps.isPrerenderMode &&
      !this.compProps.settings.disableSSROpacity;
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
          zIndex: activeIndex === idx ? 0 : 1,
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
  };

  getItemWrapperStyles() {
    const { options, style, type } = this.compProps;
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

    styles.height = height + 'px';
    styles.width = width + 'px';
    styles.margin = -options.itemBorderWidth + 'px';

    const itemWrapperStyles = {
      ...styles,
      ...getSlideAnimationStyles(this.compProps),
    };

    return itemWrapperStyles;
  }

  getItemAriaLabel() {
    const { type, calculatedAlt, htmlContent, options } = this.compProps;
    const mapTypeToLabel = {
      dummy: '',
      text: htmlContent,
      video: calculatedAlt || 'Untitled video',
      image: calculatedAlt || 'Untitled image',
    };
    const label = mapTypeToLabel[type];
    return label + (options.isStoreGallery ? ', Buy Now' : '');
  }

  getItemContainerClass() {
    const { options } = this.compProps;
    const imagePlacementAnimation = options.imagePlacementAnimation;
    const overlayAnimation = options.overlayAnimation;
    const imageHoverAnimation = options.imageHoverAnimation;
    const classNames = {
      'gallery-item-container': true,
      visible: true,
      'pro-gallery-highlight': this.isHighlight(),
      clickable: options.itemClick !== 'nothing',
      'simulate-hover': this.simulateHover(),
      'hide-hover': !this.simulateHover() && (utils as any).isMobile(),
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

      'pro-gallery-mobile-indicator': (utils as any).isMobile(),
    };
    const strClass = Object.entries(classNames)
      .map(([classname, isNeeded]) => (isNeeded ? classname : false))
      .filter(Boolean)
      .join(' ');

    return strClass;
  }

  getItemWrapperClass() {
    const { options, type } = this.compProps;
    const classes = ['gallery-item-wrapper', 'visible'];

    if (options.cubeImages) {
      classes.push('cube-type-' + options.cubeType);
    }
    if (type === 'text') {
      classes.push('gallery-item-wrapper-text');
    }
    return classes.join(' ');
  }

  getItemContainerTabIndex() {
    const tabIndex = this.isHighlight()
      ? (utils as any).getTabIndex('currentThumbnail')
      : this.compProps.activeIndex === this.compProps.idx
      ? (utils as any).getTabIndex('currentGalleryItem')
      : -1;
    return tabIndex;
  }

  //-----------------------------------------| REACT |--------------------------------------------//

  componentDidMount = () => {
    if (
      (utils as any).isMobile() &&
      typeof React.initializeTouchEvents === 'function'
    ) {
      try {
        React.initializeTouchEvents(true);
      } catch (e) {
        console.error(e);
      }
    }

    window!.addEventListener(
      'current_hover_change',
      this.checkIfCurrentHoverChanged
    );
  }

  componentWillUnmount = () => {
    clearTimeout(this.itemLoadedTimeout);
    window!.removeEventListener(
      'current_hover_change',
      this.checkIfCurrentHoverChanged
    );
  }

  componentDidUpdate = (prevProps) => {
    changeActiveElementIfNeeded({
      prevProps,
      currentProps: this.compProps,
      itemContainer: this.itemContainer,
    });
  }

  checkIfCurrentHoverChanged = (e) =>{
    if (e.galleryId === this.compProps.galleryId) {
      if (!this.state.isCurrentHover && e.currentHoverIdx === this.compProps.idx) {
        this.setState({
          isCurrentHover: true,
          itemWasHovered: true,
        });
      } else if (
        this.state.isCurrentHover &&
        e.currentHoverIdx !== this.compProps.idx
      ) {
        this.setState({
          isCurrentHover: false,
        });
      }
    }
  }

  onContextMenu = (e: React.MouseEvent) => {
    if (!(utils as any).isDev() && !this.compProps.options.allowContextMenu) {
      e.preventDefault();
    }
  }

  getItemAriaRole = () => {
    switch (this.compProps.options.itemClick) {
      case 'expand':
      case 'fullscreen':
        return 'button';
      case 'link':
        return 'link';
      default:
        return '';
    }
  }

  composeItem = () => {
    const { photoId, id, hash, idx, options, type, url } = this.compProps;

    //if (there is an url for video items and image items) OR text item (text item do not use media url)
    this.hasRequiredMediaUrl = !!url || type === 'text';
    //if titlePlacement !== SHOW_ON_HOVER and !this.hasRequiredMediaUrl, we will NOT render the itemWrapper (but will render the info element with the whole size of the item)
    const isItemWrapperEmpty =
      options.titlePlacement !== GALLERY_CONSTS.placements.SHOW_ON_HOVER &&
      !this.hasRequiredMediaUrl;
    const innerDiv = (
      <div
        className={this.getItemContainerClass()}
        onContextMenu={(e) => this.onContextMenu(e)}
        id={cssScrollHelper.getSellectorDomId(this.compProps)}
        ref={(e) => (this.itemContainer = e)}
        onMouseOver={this.onMouseOver}
        onMouseOut={this.onMouseOut}
        onFocus={this.onFocus}
        onBlur={this.onBlur} // The onblur event is the opposite of the onfocus event.
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
            ...getImageStyle(this.compProps.options),
            ...(GALLERY_CONSTS.hasExternalRightPlacement(
              this.compProps.options.titlePlacement,
              this.compProps.idx
            ) && { float: 'left' }),
            ...(GALLERY_CONSTS.hasExternalLeftPlacement(
              this.compProps.options.titlePlacement,
              this.compProps.idx
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
    const isSlideshow = GALLERY_CONSTS.isLayout('SLIDESHOW')(options);

    if (isSlideshow) {
      return innerDiv;
    } else {
      return (
        <a
          ref={(e) => (this.itemAnchor = e)}
          data-id={photoId}
          data-idx={idx}
          key={'item-container-link-' + id}
          onFocus={() => {
            onAnchorFocus({
              itemAnchor: this.itemAnchor,
              enableExperimentalFeatures: this.compProps.enableExperimentalFeatures,
              itemContainer: this.itemContainer,
            });
          }}
          {...getLinkParams(this.compProps as any)}
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

  renderComponent = () => {
    return this.composeItem();
  };
}

export default ItemView;
/* eslint-enable prettier/prettier */
