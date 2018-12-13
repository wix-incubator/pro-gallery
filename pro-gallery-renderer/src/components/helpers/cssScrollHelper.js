import Consts from 'photography-client-lib/dist/src/utils/consts';
import utils from '../../utils/index.js';
import window from 'photography-client-lib/dist/src/sdk/windowWrapper';
/*
    TODO:
    - handle horizontal scroll
    - check Layout creation and do not recreate exisiting layouts
*/


class CssScrollHelper {

  constructor() {
    this.pgScrollSteps = [5120, 2560, 1280, 640, 320, 160, 80, 40, 20, 10];
    this.pgScrollClassName = 'pgscl';

    this.screenSize = Math.max(window.screen.width, window.screen.height);

    this.inScreenPadding = [0, 0];
    this.aboveScreenPadding = [100, Infinity];
    this.belowScreenPadding = [Infinity, 100];
    this.visiblePadding = [this.screenSize * 7, this.screenSize * 2];
    this.renderedPadding = [this.screenSize * 7, this.screenSize * 4];

    this.scrollCss = [];
    this.scrollCssProps = [];
  }

  getDomId({id, idx}) {
    return `pgi${String(idx)}${String(id).slice(-5, -1)}`;
  }

  calcScrollClasses(scrollTop) {
    return this.pgScrollSteps.map((step, idx) => `${this.pgScrollClassName}-${idx}-${Math.floor(scrollTop / step) * step}`).join(' ');
  }

  calcScrollCss({items, scrollBase, styleParams}) {
    if (!(items && items.length)) {
      return '';
    }
    this.screenSize = styleParams.oneRow ? window.screen.width : window.screen.height;
    this.maxHeight = (styleParams.oneRow ? items[items.length - 1].offset.right : items[items.length - 1].offset.top + scrollBase) + this.screenSize;
    return items.map(item => this.calcScrollCssForItem({item, scrollBase, styleParams})).join(`\n`);
  }

  shouldCalcScrollCss({top, left, width, height, resized_url, idx, type}, scrollBase, styleParams) {
    if (type === 'video' || type === 'text') {
      return false;
    }
    const scrollCssProps = JSON.stringify({top, left, width, height, scrollBase, resized_url, oneRow: styleParams.oneRow, loadingMode: styleParams.imageLoadingMode, isSSR: window.isSSR});
    if (scrollCssProps === this.scrollCssProps[idx]) {
      return false;
    }
    this.scrollCssProps[idx] = scrollCssProps;
    return true;
  }

  calcScrollCssForItem({item, scrollBase, styleParams}) {

    const {resized_url, uniqueId, idx} = item;
    const domId = this.getDomId(item);

    if (!this.shouldCalcScrollCss(item, scrollBase, styleParams)) {
      return this.scrollCss[idx];
    }

    this.scrollCss[idx] = '';

    const _scrollBase = scrollBase >= 0 ? scrollBase : 0;
    const ceil = (num, step) => Math.min(this.maxHeight, (Math.ceil(num / step) * step));
    const floor = (num, step) => Math.max(0, Math.floor(num / step) * step);
    const imageTop = styleParams.oneRow ? (item.offset.left - this.screenSize) : (item.offset.top - this.screenSize + _scrollBase);
    const imageBottom = styleParams.oneRow ? (item.offset.left + item.width) : (item.offset.top + item.height + _scrollBase);
    const minStep = this.pgScrollSteps[this.pgScrollSteps.length - 1];

    const createScrollSelectors = (padding, suffix) => {
      let from = floor(imageTop - padding[0], minStep);
      const to = ceil(imageBottom + padding[1], minStep);
      const scrollClasses = [];
      while (from < to) {
        const largestDividerIdx = this.pgScrollSteps.findIndex(step => (from % step === 0 && from + step <= to)); //eslint-disable-line
        scrollClasses.push(`.${this.pgScrollClassName}-${largestDividerIdx}-${from} ~ div #${domId} ${suffix}`);
        from += this.pgScrollSteps[largestDividerIdx];
        // console.count('pgScroll class created');
      }
      return scrollClasses.join(', ');
    };

    if (window.isSSR) {

      this.scrollCss[idx] += createScrollSelectors(this.visiblePadding, `.image-item`) + `{background-image: url(${resized_url.thumb})}`;

    } else {

      //load hi-res image + loading transition
      this.scrollCss[idx] += createScrollSelectors(this.visiblePadding, `.image-item>div`) + `{opacity: 1; background-image: url(${resized_url.img})}`;
  
      //add the blurry image
      if (!(utils.deviceHasMemoryIssues() || styleParams.imageLoadingMode === Consts.loadingMode.COLOR)) {
        //remove blurry thumbnail background
        this.scrollCss[idx] += createScrollSelectors(this.inScreenPadding, `.image-item`) + `{background-image: none !important}`;
        // add blurred background-image
        this.scrollCss[idx] += createScrollSelectors(this.renderedPadding, `.image-item`) + `{background-image: url(${resized_url.thumb})}`;
      }
    }

    //scrollAnimation [DEMO]
    // this.scrollCss[idx] += createScrollSelectors(this.visiblePadding, '') + `{transform: translateY(${((idx % 4) * 30) + 100}px); transition-duration: ${((idx % 5) * 100) + 400}ms}`;
    // this.scrollCss[idx] += createScrollSelectors(this.aboveScreenPadding, '') + `{transform: translateY(0) !important}`;

    return this.scrollCss[idx];
    // console.count('pgScroll item created');
  }
}

export const cssScrollHelper = new CssScrollHelper();


  // Testing the best combination of scroll steps (goal is to reduce the number of classe sper item to minimum)
  // ----------------------------------------------------------------------------------------------------------
  // pgScrollSteps = [1000, 100, 10]; -> 6759 / 354 = 19 classes per item
  // pgScrollSteps = [2500, 500, 100, 20]; -> 4137 / 354 = 11.6 classes per item
  // pgScrollSteps = [2560, 1280, 640, 320, 160, 80, 40, 20]; -> 2502 / 354 = 7 classes per item
  // pgScrollSteps = [5120, 2560, 1280, 640, 320, 160, 80, 40, 20]; -> 2502 / 354 = 7 classes per item
  // pgScrollSteps = [5120, 2560, 1280, 640, 320, 160, 80, 40, 20, 10]; -> 2772 / 354 = 7.8 classes per item
