import _ from 'lodash';
import utils from '../../utils';
import window from 'photography-client-lib/dist/src/sdk/windowWrapper';

export function scrollToItemImp(scrollParams) {

  let pos;
  const {durationInMS, horizontalElement, scrollingElement, oneRow, galleryWidth, galleryHeight, top, items, itemIdx, fixedScroll, isManual} = scrollParams;

  if (fixedScroll === true) {
      //scroll by half the container size

    if (oneRow) {
      pos = horizontalElement.scrollLeft + itemIdx * galleryWidth / 2;
    } else {
      pos = top + itemIdx * galleryHeight / 2;
    }

  } else {

      //scroll to specific item
    if (utils.isVerbose()) {
      console.log('Scrolling to items #' + itemIdx);
    }

    const item = _.find(items, item => (item.idx === itemIdx));
    pos = oneRow ? _.get(item, 'offset.left') : _.get(item, 'offset.top');

    if (utils.isVerbose()) {
      console.log('Scrolling to position ' + pos, item);
    }

    if (!(pos >= 0)) {
      console.warn('Position not found, not scrolling');
      return false;
    }

    if (oneRow) {

      if (isManual && _.isFunction(_.get(window, 'galleryWixCodeApi.onItemChanged'))) {
        window.galleryWixCodeApi.onItemChanged(item);
      }

        //set scroll to place the item in the middle of the component
      const diff = (galleryWidth - item.width) / 2;
      if (diff > 0) {
        pos -= diff;
      }
      pos = Math.max(0, pos) / utils.getViewportScaleRatio();
      if (utils.isVerbose()) {
        console.log('Scrolling to new position ' + pos, this);
      }
    }
  }

  if (oneRow) {
    utils.scrollTo(horizontalElement, (Math.round(pos * utils.getViewportScaleRatio())), durationInMS, true);
  } else {
    scrollingElement.vertical().scrollTo(0, pos);
  }
  return true;
}

// ----- rendererd / visible ----- //
function getDistanceFromScreen({offset, scroll, itemStart, itemEnd, screenSize}) {
  const before = scroll - offset - itemEnd;
  const after = offset + itemStart - screenSize - scroll;
  return {before, after};
}
function isWithinPaddingVertically({target, scrollBase, top, bottom, screenHeight, padding}) {
  const res = getDistanceFromScreen({offset: scrollBase || 0, scroll: target.scrollY, itemStart: top, itemEnd: bottom, screenSize: screenHeight});
  return (res.before < padding && res.after < padding);
}

function isWithinPaddingHorizontally({target, left, right, screenWidth, padding, oneRow}) {
  if (!oneRow) {
    return true;
  }
  const res = getDistanceFromScreen({offset: 0, scroll: target.scrollLeft, itemStart: left, itemEnd: right, screenSize: screenWidth});
  return (res.before < padding && res.after < padding);
}

function setVerticalVisibility({target, props, screenSize, padding, callback}) {
  const {offset, style} = props;
  const bottom = offset.top + style.height;
  const {scrollBase} = props.container;
  callback({
    playVertically: isWithinPaddingVertically({target, scrollBase, top: offset.top, bottom, screenHeight: screenSize.height, padding: padding.playVertical}),
    visibleVertically: isWithinPaddingVertically({target, scrollBase, top: offset.top, bottom, screenHeight: screenSize.height, padding: padding.visibleVertical}),
    renderedVertically: isWithinPaddingVertically({target, scrollBase, top: offset.top, bottom, screenHeight: screenSize.height, padding: padding.renderedVertical})
  });
}

function setHorizontalVisibility({target, props, screenSize, padding, callback}) {
  const {offset, styleParams, style} = props;
  const right = offset.left + style.width;
  callback({
    playHorizontally: isWithinPaddingHorizontally({target, left: offset.left, right, screenWidth: screenSize.width, padding: padding.playHorizontal, oneRow: styleParams.oneRow}),
    visibleHorizontally: isWithinPaddingHorizontally({target, left: offset.left, right, screenWidth: screenSize.width, padding: padding.visibleHorizontal, oneRow: styleParams.oneRow}),
    renderedHorizontally: isWithinPaddingHorizontally({target, left: offset.left, right, screenWidth: screenSize.width, padding: padding.renderedHorizontal, oneRow: styleParams.oneRow})
  });
}

function setInitialVisibility({props, screenSize, padding, callback}) {
  const {scrollBase, height, width, galleryHeight, galleryWidth} = props.container;
  setVerticalVisibility({target: {
    scrollY: props.scroll.scrollY || 0,
    offsetTop: scrollBase || 0,
  }, props, screenSize, padding, callback});
  setHorizontalVisibility({target: {
    scrollLeft: props.scroll.scrollLeft || 0,
  }, props, screenSize, padding, callback});
}
export {
	isWithinPaddingHorizontally,
	isWithinPaddingVertically,
	setHorizontalVisibility,
	setVerticalVisibility,
	setInitialVisibility,
}
;
