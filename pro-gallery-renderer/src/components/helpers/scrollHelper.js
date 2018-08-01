import _ from 'lodash';
import utils from '../../utils';

function scrollToItemIfNeeded() {
    //after height is changed - scroll to an item if needed
  if (this.shouldScrollTo >= 0) {
    setTimeout(() => {
      const scrolled = this.scrollToItem(this.shouldScrollTo);
      if (scrolled) {
        this.shouldScrollTo = -1;
      }
    }, 10);
  }
}

function scrollToItem(itemIdx, fixedScroll, isManual) {

  let pos;
  let horizontalElement;

  if (this.state.styleParams.oneRow) {
    const galleryWrapper = this.galleryWrapper || document;
    horizontalElement = galleryWrapper.querySelector('#gallery-horizontal-scroll');
  }

  if (fixedScroll === true) {
      //scroll by half the container size

    if (this.state.styleParams.oneRow) {
      pos = horizontalElement.scrollLeft + itemIdx * this.state.container.galleryWidth / 2;
    } else {
      pos = this.state.scroll.top + itemIdx * this.state.container.galleryHeight / 2;
    }

  } else {

      //scroll to specific item
    if (utils.isVerbose()) {
      console.log('Scrolling to items #' + itemIdx);
    }

    const items = this.galleryStructure.items;

    const item = _.find(items, item => (item.idx === itemIdx));
    pos = this.state.styleParams.oneRow ? _.get(item, 'offset.left') : _.get(item, 'offset.top');

    if (utils.isVerbose()) {
      console.log('Scrolling to position ' + pos, item);
    }

    if (!(pos >= 0)) {
      console.warn('Position not found, not scrolling');
      return false;
    }

    if (this.state.styleParams.oneRow) {

      if (isManual && _.isFunction(_.get(window, 'galleryWixCodeApi.onItemChanged'))) {
        window.galleryWixCodeApi.onItemChanged(item);
      }

        //set scroll to place the item in the middle of the component
      const diff = (this.state.container.galleryWidth - item.width) / 2;
      if (diff > 0) {
        pos -= diff;
      }
      pos = Math.max(0, pos) / utils.getViewportScaleRatio();
      if (utils.isVerbose()) {
        console.log('Scrolling to new position ' + pos, this);
      }
    }
  }

    //pos -= item.height; //don't scroll too much so that the item is not too close to the edge of the container

  utils.setStateAndLog(this, 'Scroll To Item', {
    scrollTop: pos
  }, () => {
    if (this.state.styleParams.oneRow) {
      if (utils.isVerbose()) {
        console.log('Scrolling horiontally', pos, horizontalElement);
      }
      utils.scrollTo(horizontalElement, (Math.round(pos * utils.getViewportScaleRatio())), 400, true);
    } else if (utils.isInWix()) {
      if (utils.isVerbose()) {
        console.log('Scrolling vertically (in wix)');
      }
      // if (utils.getViewModeFromCache() !== 'editor') {
      //     //All of this code should be removed once SDK fix the scrollTo Issue WEED-5804 with this line of code: Wix.scrollTo(0, Math.round(this.scrollBase + (pos * utils.getViewportScaleRatio())));
      //   const scrollToPoint = Math.round(this.scrollBase + (pos * utils.getViewportScaleRatio()));
      //   let shouldScroll = true;
      //   if (shouldScroll) {
      //     let shouldStop = false;
      //     let retriesLeft = 10;
      //     const scrollListener = e => {
      //       if (e.scrollTop > 0 && e.scrollTop !== scrollToPoint) {
      //         shouldStop = true;
      //         Wix.removeEventListener(Wix.Events.SCROLL, scrollListener);
      //       }
      //     };
      //     Wix.addEventListener(Wix.Events.SCROLL, scrollListener);

      //     const retryScroll = () => {
      //       if (!shouldStop && retriesLeft > 0) {
      //         Wix.scrollTo(0, scrollToPoint);
      //         if (retriesLeft === 0) {
      //           shouldStop = true;
      //         }
      //         retriesLeft--;
      //         setTimeout(retryScroll, 500);
      //       }
      //     };
      //     retryScroll();
      //     shouldScroll = false;
      //   }
      // }
    } else {
      if (utils.isVerbose()) {
        console.log('Scrolling vertically (not in wix)');
      }
        //$(window).animate({scrollTop: pos + 'px'});
      window.scrollTop = (Math.round(pos * utils.getViewportScaleRatio()));
    }
  });

  return true;

}
