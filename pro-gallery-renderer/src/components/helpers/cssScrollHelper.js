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
    this.justBelowScreenPadding = [500, 0];
    this.belowScreenPadding = [Infinity, 0];
    this.highResPadding = [3000, Infinity];
    this.lowResPadding = [8000, Infinity];

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
    if (utils.isMobile()) {
      this.screenSize *= (320 / window.screen.width);
    }
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
    const ceil = (num, step) => Math.ceil(Math.min(this.maxHeight, num) / step) * step;
    const floor = (num, step) => Math.floor(Math.max(0, num) / step) * step;
    const domId = this.getDomId(item);
    return (padding, suffix) => {
      let from = floor(imageTop - padding[0], minStep);
      const to = ceil(imageBottom + padding[1], minStep);
      const scrollClasses = [];
      while (from < to) {
        const largestDividerIdx = this.pgScrollSteps.findIndex(step => (from % step === 0 && from + step <= to)); //eslint-disable-line
        if (largestDividerIdx === -1) {
          console.error('largestDividerIdx is -1. Couldn\'t find index in pgScrollSteps array.\nfrom =', from, '\nto =', to, '\npadding[0] =', padding[0], '\npadding[1] =', padding[1]);
          break;
        }
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
    const scrollAnimation = styleParams.scrollAnimation;

    if (scrollAnimation === Consts.scrollAnimations.NO_EFFECT) {
      return;
    }

    const animationTiming = (((idx % 3) + 2) * 50); //100 - 200

    if (scrollAnimation === Consts.scrollAnimations.FADE_IN) {
      //hide items below screen
      this.scrollCss[idx] += createScrollSelectors(this.justBelowScreenPadding, ' .gallery-item-wrapper') + `{filter: opacity(0);}`;
      //show items in screen
      this.scrollCss[idx] += createScrollSelectors(this.aboveScreenPadding, ' .gallery-item-wrapper') + `{filter: opacity(1) !important; transition: filter 1.5s ease ${animationTiming}ms;}`;
    }

    if (scrollAnimation === Consts.scrollAnimations.GRAYSCALE) {
      //hide items below screen
      this.scrollCss[idx] += createScrollSelectors(this.justBelowScreenPadding, ' .gallery-item-wrapper') + `{filter: grayscale(100%);}`;
      //show items in screen
      this.scrollCss[idx] += createScrollSelectors(this.aboveScreenPadding, ' .gallery-item-wrapper') + `{filter: grayscale(0) !important; transition: filter 1s ease ${animationTiming + 200}ms;}`;
    }

    if (scrollAnimation === Consts.scrollAnimations.SLIDE_UP) {
      //push down items under screen
      this.scrollCss[idx] += createScrollSelectors(this.justBelowScreenPadding, '') + `{transform: translateY(100px);}`;
      //push back items in screen
      this.scrollCss[idx] += createScrollSelectors(this.aboveScreenPadding, '') + `{transform: translateY(0) !important; transition: transform 1s ease;}`;
    }

    if (scrollAnimation === Consts.scrollAnimations.BLURRED) {
      //hide items below screen
      this.scrollCss[idx] += createScrollSelectors(this.justBelowScreenPadding, ' .gallery-item-wrapper') + `{filter: blur(40px) opacity(0);}`;
      //show items in screen
      this.scrollCss[idx] += createScrollSelectors(this.aboveScreenPadding, ' .gallery-item-wrapper') + `{filter: blur(0) opacity(1) !important; transition: filter 600ms ease ${animationTiming}ms;}`;
    }

    if (scrollAnimation === Consts.scrollAnimations.ZOOM_IN) {
      //hide items below screen
      this.scrollCss[idx] += createScrollSelectors(this.justBelowScreenPadding, '') + `{transform: scale(0.8);}`;
      //show items in screen
      this.scrollCss[idx] += createScrollSelectors(this.aboveScreenPadding, '') + `{transform: scale(1) !important; transition: transform 800ms ease;}`;
    }

    if (scrollAnimation === Consts.scrollAnimations.ZOOM_OUT) {
      //hide items below screen
      this.scrollCss[idx] += createScrollSelectors(this.justBelowScreenPadding, '') + `{transform: scale(1.05);}`;
      //show items in screen
      this.scrollCss[idx] += createScrollSelectors(this.aboveScreenPadding, '') + `{transform: scale(1) !important; transition: transform 800ms ease;}`;
    }

    if (scrollAnimation === Consts.scrollAnimations.ONE_COLOR) {
      const oneColorAnimationColor = styleParams.oneColorAnimationColor && styleParams.oneColorAnimationColor.value ? styleParams.oneColorAnimationColor.value : 'transparent';
      //hide items below screen
      this.scrollCss[idx] += createScrollSelectors(this.justBelowScreenPadding, '') + `{background-color: ${oneColorAnimationColor};}`;
      this.scrollCss[idx] += createScrollSelectors(this.justBelowScreenPadding, ' .gallery-item-wrapper') + `{filter: opacity(0)}`;
      //show items in screen
      this.scrollCss[idx] += createScrollSelectors(this.aboveScreenPadding, ' .gallery-item-wrapper') + `{filter: opacity(1) !important; transition: filter 1.5s ease ${animationTiming}ms;}`;
    }

    if (scrollAnimation === Consts.scrollAnimations.PARALLAX) {
      //hide items below screen
      this.scrollCss[idx] += createScrollSelectors(this.justBelowScreenPadding, ' .gallery-item-wrapper') + `{transform: translateY(-5%) scale(1.1);}`;
      //show items in screen
      this.scrollCss[idx] += createScrollSelectors(this.aboveScreenPadding, ' .gallery-item-wrapper') + `{transform: translateY(5%) scale(1.1)!important; transition: transform 800ms ease;}`;
    }

    if (scrollAnimation === Consts.scrollAnimations.ZOOM_OUT2) {
      //hide items below screen
      this.scrollCss[idx] += createScrollSelectors(this.justBelowScreenPadding, ' .gallery-item-wrapper') + `{transform: scale(1.1);}`;
      //show items in screen
      this.scrollCss[idx] += createScrollSelectors(this.aboveScreenPadding, ' .gallery-item-wrapper') + `{transform: scale(1) !important; transition: transform 800ms ease;}`;
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
