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

    //padding: [belowScreen, aboveScreen]
    this.inScreenPadding = [0, 0];
    this.aboveScreenPadding = [0, Infinity];
    this.justBelowScreenPadding = [this.screenSize, 0];
    this.belowScreenPadding = [Infinity, 0];
    this.highResPadding = [this.screenSize * 3, this.screenSize * 7];
    this.lowResPadding = [this.screenSize * 8, Infinity];

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

  shouldCalcScrollCss({id, top, left, width, height, resized_url, idx, type}, scrollBase, styleParams) {
    if (type === 'video' || type === 'text') {
      return false;
    }
    const scrollCssProps = JSON.stringify({id, top, left, width, height, scrollBase, resized_url, oneRow: styleParams.oneRow, loadingMode: styleParams.imageLoadingMode, isSSR: window.isSSR});
    if (scrollCssProps === this.scrollCssProps[idx]) {
      return false;
    }
    this.scrollCssProps[idx] = scrollCssProps;
    return true;
  }

  createScrollSelectorsFunction({item, scrollBase, styleParams}) {
    const _scrollBase = scrollBase >= 0 ? scrollBase : 0;
    const imageTop = styleParams.oneRow ? (item.offset.left - this.screenSize) : (item.offset.top - this.screenSize + _scrollBase);
    const imageBottom = styleParams.oneRow ? (item.offset.left + item.width) : (item.offset.top + item.height + _scrollBase);
    const minStep = this.pgScrollSteps[this.pgScrollSteps.length - 1];
    const ceil = (num, step) => Math.min(this.maxHeight, (Math.ceil(num / step) * step));
    const floor = (num, step) => Math.max(0, Math.floor(num / step) * step);
    const domId = this.getDomId(item);
    return (padding, suffix) => {
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
  }

  calcScrollCssForItem({item, scrollBase, styleParams}) {

    const {resized_url, uniqueId, idx} = item;

    if (!this.shouldCalcScrollCss(item, scrollBase, styleParams)) {
      return this.scrollCss[idx];
    }

    this.scrollCss[idx] = '';

    const createScrollSelectors = this.createScrollSelectorsFunction({item, scrollBase, styleParams});

    //load hi-res image + loading transition
    if (!window.isSSR) {
      this.scrollCss[idx] += createScrollSelectors(this.highResPadding, `.image-item>canvas`) + `{opacity: 1; transition: opacity 1s ease 2s; background-image: url(${resized_url.img})}`;
    }

    //add the blurry image
    if (!utils.deviceHasMemoryIssues() && styleParams.imageLoadingMode !== Consts.loadingMode.COLOR && !item.isTransparent) {
      // add blurred background-image
      this.scrollCss[idx] += createScrollSelectors(this.lowResPadding, `.image-item`) + `{background-image: url(${resized_url.thumb})}`;
    }

    //scrollAnimation [DEMO]
    this.createScrollAnimationsIfNeeded({idx, styleParams, createScrollSelectors});

    return this.scrollCss[idx];
    // console.count('pgScroll item created');
  }

  createScrollAnimationsIfNeeded({idx, styleParams, createScrollSelectors}) {

    const animationTiming = (((idx % 3) + 2) * 50); //100 - 200

    if (utils.shouldDebug('slideAnimation')) {
      //push down items under screen
      this.scrollCss[idx] += createScrollSelectors(this.justBelowScreenPadding, '') + `{transform: translateY(150px);}`;
      //push back items in screen
      this.scrollCss[idx] += createScrollSelectors(this.aboveScreenPadding, '') + `{transform: translateY(0) !important; transition: transform 800ms ease ${animationTiming}ms;}`;
    }

    if (utils.shouldDebug('sideAnimation')) {
      //push down items under screen
      this.scrollCss[idx] += createScrollSelectors(this.justBelowScreenPadding, '.image-item') + `{transform: translateX(150px);}`;
      //push back items in screen
      this.scrollCss[idx] += createScrollSelectors(this.aboveScreenPadding, '.image-item') + `{transform: translateX(0) !important; transition: transform 800ms ease ${animationTiming}ms;}`;
    }

    if (utils.shouldDebug('fadeAnimation')) {
      //hide items below screen
      this.scrollCss[idx] += createScrollSelectors(this.justBelowScreenPadding, '') + `{filter: opacity(0);}`;
      //shoe items in screen
      this.scrollCss[idx] += createScrollSelectors(this.aboveScreenPadding, '') + `{filter: opacity(1) !important; transition: filter 800ms ease ${animationTiming}ms;}`;
    }

    if (utils.shouldDebug('zoomAnimation')) {
      //hide items below screen
      this.scrollCss[idx] += createScrollSelectors(this.justBelowScreenPadding, '') + `{transform: scale(0);}`;
      //shoe items in screen
      this.scrollCss[idx] += createScrollSelectors(this.aboveScreenPadding, '') + `{transform: scale(1) !important; transition: transform 800ms ease ${animationTiming}ms;}`;
    }

    if (utils.shouldDebug('rotateAnimation')) {
      //hide items below screen
      this.scrollCss[idx] += createScrollSelectors(this.justBelowScreenPadding, '') + `{transform: rotate(10deg); transform-origin: top left;}`;
      //shoe items in screen
      this.scrollCss[idx] += createScrollSelectors(this.aboveScreenPadding, '') + `{transform: rotate(0deg) !important; transition: transform 800ms ease ${animationTiming}ms;}`;
    }

    if (utils.shouldDebug('bnwAnimation')) {
      //hide items below screen
      this.scrollCss[idx] += createScrollSelectors(this.justBelowScreenPadding, '') + `{filter: grayscale(100%);}`;
      //shoe items in screen
      this.scrollCss[idx] += createScrollSelectors(this.aboveScreenPadding, '') + `{filter: grayscale(0) !important; transition: filter 800ms ease ${animationTiming}ms;}`;
    }

    if (utils.shouldDebug('blurAnimation')) {
      //hide items below screen
      this.scrollCss[idx] += createScrollSelectors(this.justBelowScreenPadding, '') + `{filter: blur(10px);}`;
      //shoe items in screen
      this.scrollCss[idx] += createScrollSelectors(this.aboveScreenPadding, '') + `{filter: blur(0) !important; transition: filter 800ms ease ${animationTiming}ms;}`;
    }

    if (utils.shouldDebug('flipAnimation')) {
      //hide items below screen
      this.scrollCss[idx] += createScrollSelectors(this.justBelowScreenPadding, '') + `{perspective: 300px;}`;
      this.scrollCss[idx] += createScrollSelectors(this.justBelowScreenPadding, '>canvas') + `{transform: rotateX(-20deg); transform-origin: top;}`;
      //shoe items in screen
      this.scrollCss[idx] += createScrollSelectors(this.aboveScreenPadding, '>canvas') + `{transform: rotateX(0) !important; transition: transform 800ms ease ${animationTiming}ms;}`;
    }

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
