import { GALLERY_CONSTS, utils } from 'pro-gallery-lib';
import { useEffect, useRef, useState } from 'react';
import { isInFocus } from '../itemHelper';
import { IItemViewProps } from '../itemView';
import { getImageStyle } from '../itemViewStyleProvider';
import {
  getItemAriaLabel,
  getItemAriaRole,
  getItemContainerClass,
  getItemContainerStyles,
  getItemContainerTabIndex,
  getItemWrapperClass,
  getItemWrapperStyles,
  isClickOnCurrentHoveredItem,
  itemHasLink,
  shouldHover,
  shouldShowHoverOnMobile,
  shouldUseDirectLink,
  simulateOverlayHover,
} from './utils';

type Event = React.KeyboardEvent | React.MouseEvent;

export function useItemViewEvents(props: IItemViewProps) {
  return {
    loaded() {
      props.actions.eventsListener(GALLERY_CONSTS.events.ITEM_LOADED, props);
    },
    hover() {
      props.actions.eventsListener(GALLERY_CONSTS.events.HOVER_SET, props.idx);
    },
    unhover() {
      props.actions.eventsListener(GALLERY_CONSTS.events.HOVER_SET, -1);
    },
    focus() {
      if (props.settings?.isAccessible) {
        this.hover();
      }
      props.actions.eventsListener(GALLERY_CONSTS.events.ITEM_FOCUSED, props);
    },
    blur() {
      if (props.settings?.isAccessible) {
        this.unhover();
      }
      props.actions.eventsListener(
        GALLERY_CONSTS.events.ITEM_LOST_FOCUS,
        props
      );
    },
    itemAction(e: Event) {
      props.actions.eventsListener(
        GALLERY_CONSTS.events.ITEM_ACTION_TRIGGERED,
        e
      );
    },
    itemClick(event: Event, clickTarget: string) {
      props.actions.eventsListener(
        GALLERY_CONSTS.events.ITEM_CLICKED,
        { props, clickTarget },
        event
      );
    },
  };
}

export function useItemView(props: IItemViewProps) {
  const events = useItemViewEvents(props);
  const itemAnchor = useRef<HTMLAnchorElement>(null);
  const itemContainer = useRef<HTMLDivElement>(null);
  const [ariaLabel, setAriaLabel] = useState<string>('');
  const timers = useRef({
    longPressTimer: null as null | number,
    itemLoadedTimeout: null as null | number,
  });
  const [isCurrentHover, setIsCurrentHover] = useState(false);
  const [itemWasHovered, setItemWasHovered] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    props.actions.eventsListener(GALLERY_CONSTS.events.ITEM_CREATED, props);

    function checkIfCurrentHoverChanged(e) {
      if (e.galleryId === props.galleryId) {
        if (!isCurrentHover && e.currentHoverIdx === props.idx) {
          setIsCurrentHover(true);
          setItemWasHovered(true);
        } else if (isCurrentHover && e.currentHoverIdx !== props.idx) {
          setIsCurrentHover(false);
        }
      }
    }

    setAriaLabel(getItemAriaLabel(props));

    window!.addEventListener(
      'current_hover_change',
      checkIfCurrentHoverChanged
    );
    return () => {
      window!.removeEventListener(
        'current_hover_change',
        checkIfCurrentHoverChanged
      );
    };
  }, []);

  useEffect(() => {
    if (isInFocus()) {
      if (props.thumbnailHighlightId === props.id) {
        events.focus();
      }
    }
  }, [props.thumbnailHighlightId]);

  useEffect(() => {
    if (isInFocus()) {
      if (props.activeIndex === props.idx) {
        events.focus();
      }
    }
  }, [props.activeIndex]);

  function onItemLoad() {
    setLoaded(true);
    events.loaded();
  }

  function onMouseOver() {
    if (!utils.isMobile()) {
      events.hover();
    }
  }

  function onMouseOut() {
    if (!utils.isMobile()) {
      events.unhover();
    }
  }

  function handleItemMouseUp() {
    if (utils.isMobile() && timers.current.longPressTimer) {
      clearTimeout(timers.current.longPressTimer);
    }
    return true; //make sure the default event behaviour continues
  }

  function handleHoverClickOnMobile(e) {
    if (isClickOnCurrentHoveredItem(props, isCurrentHover)) {
      events.itemAction(e);
      props.actions.eventsListener(GALLERY_CONSTS.events.HOVER_SET, -1);
    } else {
      events.hover();
    }
  }

  function onItemClick(
    e: Event,
    clickTarget: string,
    shouldPreventDefault = true
  ) {
    if (
      utils.isFunction(utils.get(window, 'galleryWixCodeApi.onItemClicked'))
    ) {
      (window as any).galleryWixCodeApi.onItemClicked(props); //TODO remove after OOI is fully integrated
    }
    events.itemClick(e, clickTarget);

    if (shouldUseDirectLink(props, isCurrentHover)) {
      return;
    }

    if (shouldPreventDefault) {
      e.preventDefault();
    }

    if (shouldShowHoverOnMobile(props)) {
      handleHoverClickOnMobile(e);
    } else {
      events.itemAction(e);
    }
  }

  function onContainerKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const clickTarget = 'item-container';
    switch (e.keyCode || e.charCode) {
      case 32: //space
      case 13: //enter
        e.stopPropagation();
        onItemClick(e, clickTarget, false); //pressing enter or space always behaves as click on main image, even if the click is on a thumbnail
        if (shouldUseDirectLink(props, isCurrentHover)) {
          itemAnchor.current?.click(); // when directLink, we want to simulate the 'enter' or 'space' press on an <a> element
        }
        return false;
      default:
        return true;
    }
  }

  function onItemWrapperClick(e: React.MouseEvent<HTMLDivElement>) {
    const clickTarget = 'item-media';
    onItemClick(e, clickTarget);
  }

  function onItemInfoClick(e: React.MouseEvent<HTMLDivElement>) {
    const clickTarget = 'item-info';
    onItemClick(e, clickTarget);
  }

  function onContextMenu(e: Event) {
    if (!utils.isDev() && !props.options.allowContextMenu) {
      e.preventDefault();
    }
  }

  function getItemWrapperContainerStyle() {
    return {
      ...(!props.options.isSlideshow && getImageStyle(props.options)),
      ...(GALLERY_CONSTS.hasExternalRightPlacement(
        props.options.titlePlacement,
        props.idx
      ) && { float: 'left' }),
      ...(GALLERY_CONSTS.hasExternalLeftPlacement(
        props.options.titlePlacement,
        props.idx
      ) && { float: 'right' }),
    };
  }

  function onAnchorKeyDown(e: React.KeyboardEvent<HTMLAnchorElement>) {
    // Similar to "onContainerKeyDown()" expect 'shouldUseDirectLink()' part, because we are already on the <a> tag (this.itemAnchor)
    const clickTarget = 'item-container';
    switch (e.keyCode || e.charCode) {
      case 32: //space
      case 13: //enter
        e.stopPropagation();
        onItemClick(e, clickTarget, false); //pressing enter or space always behaves as click on main image, even if the click is on a thumbnail
        return false;
      default:
        return true;
    }
  }

  return {
    getItemContainerClass: () => getItemContainerClass(props, isCurrentHover),
    getItemContainerTabIndex: () => getItemContainerTabIndex(props),
    getItemAriaRole: () => getItemAriaRole(props),
    getItemWrapperClass: () => getItemWrapperClass(props),
    getItemWrapperStyles: () => getItemWrapperStyles(props),
    itemHasLink: () => itemHasLink(props),
    getItemContainerStyles: () =>
      getItemContainerStyles(props, itemHasLink(props), loaded),
    simulateOverlayHover: () => simulateOverlayHover(props, isCurrentHover),
    isCurrentHover,
    onAnchorKeyDown,
    ariaLabel: ariaLabel,
    itemWasHovered,
    shouldHover: () => shouldHover(props, itemWasHovered),
    onItemWrapperClick,
    onItemInfoClick,
    onContainerKeyDown,
    handleItemMouseUp,
    handleItemMouseDown: () => true,
    onItemLoad,
    onMouseOver,
    onMouseOut,
    onFocus: () => events.focus(),
    onBlur: () => events.blur(),
    itemAnchor,
    itemContainer,
    onContextMenu,
    getItemWrapperContainerStyle,
  };
}
