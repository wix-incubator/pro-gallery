import { utils } from 'pro-gallery-lib';

export function scrollToItemImp(scrollParams) {
  let to, from;
  const {
    scrollMarginCorrection = 0,
    durationInMS,
    horizontalElement,
    scrollingElement,
    isRTL,
    oneRow,
    galleryWidth,
    galleryHeight,
    totalWidth,
    top,
    items,
    itemIdx,
    fixedScroll,
  } = scrollParams;

  const rtlFix = isRTL ? -1 : 1;
  //default = scroll by half the container size
  if (oneRow) {
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

    const item = items.find(itm => itm.idx === itemIdx);
    to = oneRow ? utils.get(item, 'offset.left') : utils.get(item, 'offset.top');

    if (utils.isVerbose()) {
      console.log('Scrolling to position ' + to, item);
    }

    if (!(to >= 0)) {
      utils.isVerbose() && console.warn('Position not found, not scrolling');
      return new Promise(res => res());
    }

    if (oneRow) {
      //set scroll to place the item in the middle of the component
      const diff = (galleryWidth - item.width) / 2;
      if (diff > 0) {
        to -= diff;
      }
      to = Math.max(0, to);
      to = Math.min(to, totalWidth - galleryWidth + scrollMarginCorrection);
      to *= rtlFix;
      from *= rtlFix;
      if (utils.isVerbose()) {
        console.log('Scrolling to new position ' + to, this);
      }
    }
  }
  if (oneRow) {
    return horizontalCssScrollTo(
      horizontalElement,
      Math.round(from),
      Math.round(to),
      durationInMS,
      isRTL,
      true,
    );
  } else {
    return (new Promise(resolve => {
      scrollingElement.vertical().scrollTo(0, to);
      resolve(to);
    }));
  }
}
export function scrollToGroupImp(scrollParams) {
  let to, from;
  const {
    scrollMarginCorrection = 0,
    durationInMS,
    horizontalElement,
    scrollingElement,
    isRTL,
    oneRow,
    galleryWidth,
    galleryHeight,
    totalWidth,
    top,
    groups,
    groupIdx,
    fixedScroll,
  } = scrollParams;

  //default = scroll by half the container size
  if (oneRow) {
    from = horizontalElement.scrollLeft;
    if (isRTL) {
      to = from - (groupIdx * galleryWidth) / 2;
    } else {
      to = from + (groupIdx * galleryWidth) / 2;
    }
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

    const group = groups.find(grp => grp.idx === groupIdx);
    to = oneRow ? utils.get(group, 'left') : utils.get(group, 'top');

    if (group && isRTL) {
      to += group.width;
    }

    if (utils.isVerbose()) {
      console.log('Scrolling to position ' + to, group);
    }

    if (!(to >= 0)) {
      utils.isVerbose() && console.warn('Position not found, not scrolling');
      return new Promise(res => res());
    }

    if (oneRow) {
      //set scroll to place the group in the middle of the component
      const diff = (galleryWidth - group.width) / 2;
      if (diff > 0) {
        if (isRTL) {
          to += diff;
        } else {
          to -= diff;
        }
      }
      if (isRTL) {
        to = totalWidth - to;
      }
      to = Math.max(0, to);
      to = Math.min(to, totalWidth - galleryWidth + scrollMarginCorrection);
      if (utils.isVerbose()) {
        console.log('Scrolling to new position ' + to, this);
      }
    }
  }
  if (oneRow) {

    return horizontalCssScrollTo(
      horizontalElement,
      Math.round(from),
      Math.round(to),
      durationInMS,
      isRTL,
      true,
    );
  } else {
    return (new Promise(resolve => {
      scrollingElement.vertical().scrollTo(0, to);
      resolve(to);
    }));
  }
}

// ----- rendererd / visible ----- //
function getDistanceFromScreen({
  offset,
  scroll,
  itemStart,
  itemEnd,
  screenSize,
}) {
  const before = scroll - offset - itemEnd;
  const after = offset + itemStart - screenSize - scroll;
  return { before, after };
}
function isWithinPaddingVertically({
  target,
  scrollBase,
  top,
  bottom,
  screenHeight,
  padding,
}) {
  const res = getDistanceFromScreen({
    offset: scrollBase || 0,
    scroll: target.scrollY,
    itemStart: top,
    itemEnd: bottom,
    screenSize: screenHeight,
  });
  return res.before < padding && res.after < padding;
}

function isWithinPaddingHorizontally({
  target,
  left,
  right,
  screenWidth,
  padding,
}) {
  const res = getDistanceFromScreen({
    offset: 0,
    scroll: target.scrollLeft,
    itemStart: left,
    itemEnd: right,
    screenSize: screenWidth,
  });
  return res.before < padding && res.after < padding;
}

function horizontalCssScrollTo(scroller, from, to, duration, isRTL) {
  const change = (to - from);
  if (!(change > 0)) {
    return;
  }

  const scrollerInner = scroller.firstChild;

  // step 1: scroll to the next image + apply a fix with the margin so no movement will show
  // step 2: set the transition animation and the margin to 0
  scroller.setAttribute('data-scrolling', 'true');
  Object.assign(scroller.style, {
    'scroll-snap-type': 'none'
  })
  window.requestAnimationFrame(() => {
    Object.assign(scrollerInner.style, {
    transition: `none`,
    '-webkit-transition': `none`,
    }, (isRTL) ? {
      'margin-right': `${-1 * change}px`,
    } : {
      'margin-left': `${change}px`,
    });

    scroller.scrollLeft = to;

    window.requestAnimationFrame(() => {
      Object.assign(scrollerInner.style, {
        transition: `margin ${duration}ms linear`,
        '-webkit-transition': `margin ${duration}ms linear`,
      }, isRTL ? {
        'margin-right': 0,
      } : {
        'margin-left': 0,
      });
    })
  })

  return new Promise(resolve => {
    setTimeout(() => {
      scroller.style.removeProperty('scroll-snap-type');
      scroller.setAttribute('data-scrolling', '');
      resolve(to);
    }, duration);
  });
}

export {
  isWithinPaddingHorizontally,
  isWithinPaddingVertically,
};
