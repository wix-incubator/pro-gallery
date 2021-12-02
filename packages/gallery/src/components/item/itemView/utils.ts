import {
  featureManager,
  GALLERY_CONSTS,
  isEditMode,
  isPreviewMode,
  utils,
} from 'pro-gallery-lib';
import { CSSProperties } from 'react';
import type { IItemViewProps } from '../itemView';
import { getContainerStyle } from '../itemViewStyleProvider';
import { getSlideAnimationStyles } from '../pure';

export function isClickOnCurrentHoveredItem(
  props: IItemViewProps,
  isCurrentHover: boolean
): boolean {
  return (
    isCurrentHover || // this single item was already hovered.
    props.options.hoveringBehaviour ===
      GALLERY_CONSTS.infoBehaviourOnHover.NO_CHANGE
  );
}

export function shouldUseDirectLink(
  props: IItemViewProps,
  isCurrentHover: boolean
): boolean {
  const { directLink } = props;
  const { url, target } = directLink || {};
  const useDirectLink = !!(url && target && props.options.itemClick === 'link');
  const shouldUseDirectLinkOnMobile =
    shouldShowHoverOnMobile(props) &&
    isClickOnCurrentHoveredItem(props, isCurrentHover) &&
    useDirectLink;

  if (shouldUseDirectLinkOnMobile) {
    props.actions.eventsListener(GALLERY_CONSTS.events.HOVER_SET, -1);
    return true;
  }
  if (useDirectLink && !shouldShowHoverOnMobile(props)) {
    return true;
  }
  return false;
}

export function shouldShowHoverOnMobile(props: IItemViewProps): boolean {
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
    } = props.options;
    const isNewMobileSettings = (featureManager.supports as any).mobileSettings;
    if (hoveringBehaviour === GALLERY_CONSTS.infoBehaviourOnHover.NEVER_SHOW) {
      return false;
    }
    if (itemClick === 'nothing' && props.type !== 'video') {
      return true;
    } else if (
      props.customComponents.customHoverRenderer &&
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

export function shouldHover(
  props: IItemViewProps,
  itemWasHovered: boolean
): boolean {
  //see if this could be decided in the preset
  const { options } = props;
  const { alwaysShowHover, previewHover, hoveringBehaviour, overlayAnimation } =
    options;
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
    !itemWasHovered
  ) {
    //when there is no overlayAnimation, we want to render the itemHover only on first hover and on (and not before)
    //when there is a specific overlayAnimation, to support the animation we should render the itemHover before any hover activity.
    return false;
  } else if (utils.isMobile()) {
    return shouldShowHoverOnMobile(props);
  } else {
    return true;
  }
}

export function isHighlight(props: IItemViewProps): boolean {
  return (
    !!props.thumbnailHighlightId && props.thumbnailHighlightId === props.id
  );
}

export function itemHasLink(props: IItemViewProps): boolean {
  const { linkData, linkUrl } = props;
  const itemDoesntHaveLink =
    linkData.type === undefined && (linkUrl === undefined || linkUrl === ''); //when itemClick is 'link' but no link was added to this specific item
  return !itemDoesntHaveLink;
}

export function getItemAriaLabel(props: IItemViewProps): string {
  const { type, alt, options } = props;
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
  return label + (options.isStoreGallery ? ', Buy Now' : '');
}

export function getItemWrapperClass(props: IItemViewProps): string {
  const { options, type } = props;
  const classes = ['gallery-item-wrapper', 'visible'];

  if (options.cubeImages) {
    classes.push('cube-type-' + options.cubeType);
  }
  if (type === 'text') {
    classes.push('gallery-item-wrapper-text');
  }
  return classes.join(' ');
}

export function getItemWrapperStyles(props: IItemViewProps): CSSProperties {
  const { options, style, type } = props;
  const { height, width } = style;
  const styles: Partial<CSSProperties> = {};
  if (type === 'text') {
    styles.backgroundColor =
      options.cubeType !== 'fit' ? 'transparent' : 'inherit';
  } else {
    styles.backgroundColor =
      (options.cubeType !== 'fit' ? style.bgColor : 'inherit') || 'transparent';
  }

  styles.height = height + 'px';
  styles.width = width + 'px';
  styles.margin = -options.itemBorderWidth + 'px';
  const isSlideshow = GALLERY_CONSTS.isLayout('SLIDESHOW')(options);

  const itemWrapperStyles = {
    ...styles,
    ...(!isSlideshow && getSlideAnimationStyles(props)),
  };

  return itemWrapperStyles;
}

export function getItemAriaRole(props: IItemViewProps): string {
  switch (props.options.itemClick) {
    case 'expand':
    case 'fullscreen':
      return 'button';
    case 'link':
      return 'link';
    default:
      return '';
  }
}

export function getItemContainerTabIndex(props: IItemViewProps): number {
  const tabIndex = isHighlight(props)
    ? utils.getTabIndex('currentThumbnail')
    : props.activeIndex === props.idx
    ? utils.getTabIndex('currentGalleryItem')
    : -1;
  return tabIndex;
}

export function getItemContainerStyles(
  props: IItemViewProps,
  itemHasLink: boolean,
  loaded: boolean
): CSSProperties {
  const { idx, activeIndex, offset, style, options, settings = {} } = props;
  const { scrollDirection, imageMargin, itemClick, isRTL, slideAnimation } =
    options;

  const containerStyleByoptions = getContainerStyle(options);
  const itemDoesntHaveLink = !itemHasLink; //when itemClick is 'link' but no link was added to this specific item
  const isSlideshow = GALLERY_CONSTS.isLayout('SLIDESHOW')(props.options);

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

  const hideOnSSR = props.isPrerenderMode && !props.settings.disableSSROpacity;
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
    loaded && (isEditMode() || isPreviewMode())
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

export function getItemContainerClass(
  props: IItemViewProps,
  isCurrentHover: boolean
): string {
  function simulateHover() {
    return (
      isCurrentHover ||
      props.options.alwaysShowHover === true ||
      (isEditMode() && props.options.previewHover)
    );
  }

  const { options } = props;
  const isNOTslideshow = !GALLERY_CONSTS.isLayout('SLIDESHOW')(options);
  const imagePlacementAnimation = options.imagePlacementAnimation;
  const overlayAnimation = options.overlayAnimation;
  const imageHoverAnimation = options.imageHoverAnimation;
  const classNames = {
    'gallery-item-container': true,
    visible: true,
    highlight: isHighlight(props),
    clickable: options.itemClick !== 'nothing',
    'simulate-hover': simulateHover(),
    'hide-hover': !simulateHover() && utils.isMobile(),
    'invert-hover':
      options.hoveringBehaviour ===
      GALLERY_CONSTS.infoBehaviourOnHover.DISAPPEARS,

    //animations
    'animation-slide':
      isNOTslideshow &&
      imagePlacementAnimation === GALLERY_CONSTS.imagePlacementAnimations.SLIDE,

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
    'hover-animation-slide-down':
      isNOTslideshow &&
      overlayAnimation === GALLERY_CONSTS.overlayAnimations.SLIDE_DOWN,
    'hover-animation-slide-left':
      isNOTslideshow &&
      overlayAnimation === GALLERY_CONSTS.overlayAnimations.SLIDE_LEFT,

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

function simulateHover(
  props: IItemViewProps,
  isCurrentHover: boolean
): boolean {
  return (
    isCurrentHover ||
    props.options.alwaysShowHover === true ||
    (isEditMode() && props.options.previewHover)
  );
}

export function simulateOverlayHover(
  props: IItemViewProps,
  isCurrentHover: boolean
): boolean {
  return (
    simulateHover(props, isCurrentHover) ||
    props.options.hoveringBehaviour ===
      GALLERY_CONSTS.infoBehaviourOnHover.NO_CHANGE
  );
}
