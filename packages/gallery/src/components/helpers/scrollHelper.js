import utils from '../../common/utils';

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

  //default = scroll by half the container size
  if (oneRow) {
    from = horizontalElement.scrollLeft;
    if (isRTL) {
      to = from - (itemIdx * galleryWidth) / 2;
    } else {
      to = from + (itemIdx * galleryWidth) / 2;
    }
    // console.log('[RTL SCROLL] scrollToItemImp: ', from, to);
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

    if (item && isRTL) {
      to += item.width;
    }

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

function setVerticalVisibility({
  target,
  props,
  screenSize,
  padding,
  callback,
}) {
  const { offset, style } = props;
  const bottom = offset.top + style.height;
  const { scrollBase } = props.container;
  callback({
    playVertically: isWithinPaddingVertically({
      target,
      scrollBase,
      top: offset.top,
      bottom,
      screenHeight: screenSize.height,
      padding: padding.playVertical,
    }),
    visibleVertically: isWithinPaddingVertically({
      target,
      scrollBase,
      top: offset.top,
      bottom,
      screenHeight: screenSize.height,
      padding: padding.visibleVertical,
    }),
    renderedVertically: isWithinPaddingVertically({
      target,
      scrollBase,
      top: offset.top,
      bottom,
      screenHeight: screenSize.height,
      padding: padding.renderedVertical,
    }),
  });
}

function setHorizontalVisibility({
  target,
  props,
  screenSize,
  padding,
  callback,
}) {
  const { offset, style } = props;
  const right = offset.left + style.width;
  callback({
    playHorizontally: isWithinPaddingHorizontally({
      target,
      left: offset.left,
      right,
      screenWidth: screenSize.width,
      padding: padding.playHorizontal,
    }),
    visibleHorizontally: isWithinPaddingHorizontally({
      target,
      left: offset.left,
      right,
      screenWidth: screenSize.width,
      padding: padding.visibleHorizontal,
    }),
    renderedHorizontally: isWithinPaddingHorizontally({
      target,
      left: offset.left,
      right,
      screenWidth: screenSize.width,
      padding: padding.renderedHorizontal,
    }),
  });
}

function setInitialVisibility({ props, screenSize, padding, callback }) {
  const { scrollBase } = props.container;
  setVerticalVisibility({
    target: {
      scrollY: props.scroll.scrollY || 0,
      offsetTop: scrollBase || 0,
    },
    props,
    screenSize,
    padding,
    callback,
  });
  setHorizontalVisibility({
    target: {
      scrollLeft: props.scroll.scrollLeft || 0,
    },
    props,
    screenSize,
    padding,
    callback,
  });
}

function horizontalCssScrollTo(scroller, from, to, duration, isRTL) {
  const change = to - from;

  const scrollerInner = scroller.firstChild;

  scroller.setAttribute('data-scrolling', 'true');

  Object.assign(scrollerInner.style, {
    transition: `margin ${duration}ms linear`,
    '-webkit-transition': `margin ${duration}ms linear`,
  }, isRTL ? {
    marginRight: `${change}px`,
  } : {
    marginLeft: `${-1 * change}px`,
  });

  return new Promise(resolve => {
    setTimeout(() => {
      Object.assign(scrollerInner.style, {
        transition: `none`,
        '-webkit-transition': `none`,
      }, isRTL ? {
        marginRight: 0,
      } : {
        marginLeft: 0,
      });
      scroller.scrollLeft = to;
      scroller.setAttribute('data-scrolling', '');
      resolve(to);
    }, duration);
  });
}

export {
  isWithinPaddingHorizontally,
  isWithinPaddingVertically,
  setHorizontalVisibility,
  setVerticalVisibility,
  setInitialVisibility,
};
