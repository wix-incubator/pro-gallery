import _ from 'lodash';
import utils from '../../utils';

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
