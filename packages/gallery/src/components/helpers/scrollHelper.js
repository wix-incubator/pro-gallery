import { optionsMap, utils } from 'pro-gallery-lib';
import { GALLERY_CONSTS } from 'pro-gallery-lib';
import { Deferred } from '../gallery/proGallery/galleryHelpers';

export function scrollToItemImp(scrollParams) {
  let to, from;
  const {
    durationInMS,
    horizontalElement,
    scrollingElement,
    isRTL,
    scrollDirection,
    galleryWidth,
    galleryHeight,
    totalWidth,
    top,
    items,
    itemIdx,
    fixedScroll,
    slideTransition,
    isContinuousScrolling,
    autoSlideshowContinuousSpeed,
    itemSpacing,
  } = scrollParams;

  const rtlFix = isRTL ? -1 : 1;
  //default = scroll by half the container size
  if (scrollDirection === GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].HORIZONTAL) {
    from = horizontalElement.scrollLeft * rtlFix;
    to = from + (itemIdx * galleryWidth) / 2;
  } else {
    from = top;
    to = top + (itemIdx * galleryHeight) / 2;
  }

  if (fixedScroll !== true) {
    //scroll to specific item
    if (utils.isVerbose()) {
      console.log('Scrolling to items #' + itemIdx);
    }

    const item = items.find((itm) => itm.idx === itemIdx);
    to =
      scrollDirection === GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].HORIZONTAL
        ? utils.get(item, 'offset.left')
        : utils.get(item, 'offset.top');

    if (utils.isVerbose()) {
      console.log('Scrolling to position ' + to, item);
    }

    if (!(to >= 0)) {
      utils.isVerbose() && console.warn('Position not found, not scrolling');
      return new Promise((res) => res());
    }

    if (scrollDirection === GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].HORIZONTAL) {
      //set scroll to place the item in the middle of the component
      const diff = (galleryWidth - item.width - itemSpacing) / 2;
      to -= diff;
      to = Math.max(0, to);
      to = Math.min(to, totalWidth - galleryWidth);
      to *= rtlFix;
      from *= rtlFix;
      if (utils.isVerbose()) {
        console.log('Scrolling to new position ' + to, this);
      }
    }
  }
  if (scrollDirection === GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].HORIZONTAL) {
    return horizontalCssScrollTo({
      scroller: horizontalElement,
      from: Math.round(from),
      to: Math.round(to),
      duration: durationInMS,
      isRTL,
      slideTransition: slideTransition,
      isContinuousScrolling,
      autoSlideshowContinuousSpeed,
    });
  } else {
    return new Promise((resolve) => {
      scrollingElement.vertical().scrollTo(0, to);
      resolve(to);
    });
  }
}
export function scrollToGroupImp(scrollParams) {
  let to, from;
  const {
    durationInMS,
    horizontalElement,
    scrollingElement,
    isRTL,
    scrollDirection,
    galleryWidth,
    galleryHeight,
    totalWidth,
    top,
    groups,
    groupIdx,
    fixedScroll,
    slideTransition,
    isContinuousScrolling,
    autoSlideshowContinuousSpeed,
    itemSpacing,
  } = scrollParams;

  const rtlFix = isRTL ? -1 : 1;
  //default = scroll by half the container size
  if (scrollDirection === GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].HORIZONTAL) {
    from = horizontalElement.scrollLeft;
    to = from + (groupIdx * galleryWidth) / 2;
    // console.log('[RTL SCROLL] scrollTogroupImp: ', from, to);
  } else {
    from = top;
    to = top + (groupIdx * galleryHeight) / 2;
  }

  if (fixedScroll !== true) {
    //scroll to specific group
    if (utils.isVerbose()) {
      console.log('Scrolling to groups #' + groupIdx);
    }

    const group = groups.find((grp) => grp.idx === groupIdx);
    to =
      scrollDirection === GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].HORIZONTAL
        ? utils.get(group, 'left')
        : utils.get(group, 'top');

    if (utils.isVerbose()) {
      console.log('Scrolling to position ' + to, group);
    }

    if (!(to >= 0)) {
      utils.isVerbose() && console.warn('Position not found, not scrolling');
      return new Promise((res) => res());
    }

    if (scrollDirection === GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].HORIZONTAL) {
      //set scroll to place the group in the middle of the component
      const diff = (galleryWidth - group.width - itemSpacing) / 2;
      to -= diff;
      to = Math.max(0, to);
      to = Math.min(to, totalWidth - galleryWidth);
      to *= rtlFix;
      if (utils.isVerbose()) {
        console.log('Scrolling to new position ' + to, this);
      }
    }
  }
  if (scrollDirection === GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].HORIZONTAL) {
    return horizontalCssScrollTo({
      scroller: horizontalElement,
      from: Math.round(from),
      to: Math.round(to),
      duration: durationInMS,
      isRTL,
      slideTransition: slideTransition,
      isContinuousScrolling,
      autoSlideshowContinuousSpeed,
    });
  } else {
    return new Promise((resolve) => {
      scrollingElement.vertical().scrollTo(0, to);
      resolve(to);
    });
  }
}

// ----- rendererd / visible ----- //
function horizontalCssScrollTo({
  scroller,
  from,
  to,
  duration,
  isRTL,
  slideTransition,
  isContinuousScrolling,
  autoSlideshowContinuousSpeed,
}) {
  let change = to - from;

  if (change === 0) {
    return new Promise((resolve) => resolve(to));
  }

  if (isContinuousScrolling) {
    duration = (Math.abs(change) / autoSlideshowContinuousSpeed) * 1000;
  }

  const scrollerInner = scroller.firstChild;

  scroller.setAttribute('data-scrolling', 'true');
  Object.assign(scroller.style, {
    'scroll-snap-type': 'none',
  });
  Object.assign(
    scrollerInner.style,
    {
      transition: `transform ${duration}ms ${slideTransition}`,
      '-webkit-transition': `transform ${duration}ms ${slideTransition}`,
    },
    {
      transform: `translateX(${-1 * change}px)`,
    }
  );

  const intervals = 10;
  const scrollTransitionEvent = new CustomEvent('scrollTransition', {
    detail: change / intervals,
  });
  const scrollTransitionInterval = setInterval(() => {
    scroller.dispatchEvent(scrollTransitionEvent);
  }, Math.round(duration / intervals));
  let scrollDeffered = new Deferred();
  const currentScrollEndTimeout = setTimeout(() => {
    clearInterval(scrollTransitionInterval);
    Object.assign(
      scrollerInner.style,
      {
        transition: `none`,
        '-webkit-transition': `none`,
      },
      {
        transform: `translateX(0px)`,
      }
    );
    scroller.style.removeProperty('scroll-snap-type');
    scroller.scrollLeft = to;
    scroller.setAttribute('data-scrolling', '');
    scrollDeffered.resolve(to);
  }, duration);

  return {
    scrollDeffered,
    scroller,
    from,
    to,
    duration,
    isRTL,
    slideTransition,
    isContinuousScrolling,
    autoSlideshowContinuousSpeed,
    currentScrollEndTimeout,
  };
}
function animateStopScroll({ scroller, at, isRTL }) {
  Object.assign(scroller.style, {
    'scroll-snap-type': 'none',
  });
  let scrollDeffered = new Deferred();
  Object.assign(
    scroller.firstChild.style,
    {
      transition: `none`,
      '-webkit-transition': `none`,
    },
    {
      transform: `translateX(0px)`,
    }
  );
  scroller.scrollLeft = at;
  scrollDeffered.resolve(at);

  return {
    scrollDeffered,
    scroller,
    isRTL,
  };
}
export function haltScroll({ scroller, from, isRTL, currentScrollEndTimeout, scrollDeffered }) {
  clearTimeout(currentScrollEndTimeout);
  const scrollerInner = scroller.firstChild;
  const computedStyle = getComputedStyle(scrollerInner);
  let transform = computedStyle.getPropertyValue('transform');
  var matrix = new DOMMatrix(transform);

  const margins = Math.round(parseInt(matrix.m41, 10));
  from = from - margins;

  animateStopScroll({
    scroller,
    at: from,
    isRTL,
  });
  scrollDeffered.resolve(from);
}
