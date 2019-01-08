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
    //padding: [above images, below image]
    this.inScreenPadding = () => [0, 0];
    this.aboveScreenPadding = () => [0, Infinity];
    this.justBelowScreenPadding = itemHeight => [5120, -1 * (itemHeight + this.screenSize)];
    this.justBelowAndInScreenPadding = () => [5120, 0];
    this.belowScreenPadding = () => [Infinity, 0];
    this.highResPadding = () => [5120, Infinity];
    this.lowResPadding = () => [10240, Infinity];

    this.scrollCss = [];
    this.scrollCssProps = [];
  }

  getDomId({id, idx}) {
    return `pgi${String(idx)}${String(id).slice(-5, -1)}`;
  }

  calcScrollClasses(pos, maxSize) {
    const scrollPositions = this.pgScrollSteps.map((step, idx) => `${this.pgScrollClassName}-${idx}-${Math.floor(pos / step) * step}`).join(' ');
    const minStep = this.pgScrollSteps[this.pgScrollSteps.length - 1];
    const isScrollStart = pos < minStep;
    const isScrollEnd = pos > maxSize - minStep;
    const scrollEdgeClass = `${this.pgScrollClassName}-${(isScrollEnd ? 'end' : isScrollStart ? 'start' : 'mid')}`;
    scrollPositions.push(scrollEdgeClass);
    return scrollPositions;
  }

  calcScrollCss({items, scrollBase, styleParams}) {
    if (!(items && items.length)) {
      return '';
    }
    this.screenSize = styleParams.oneRow ? window.innerWidth : window.innerHeight;
    // if (utils.isMobile()) {
    //   this.screenSize *= (320 / window.screen.width);
    // }
    this.maxHeight = (styleParams.oneRow ? items[items.length - 1].offset.right : items[items.length - 1].offset.top + scrollBase) + this.screenSize;
    const itemsCss = items.map(item => this.calcScrollCssForItem({item, scrollBase, styleParams})).join(`\n`);

    return itemsCss;
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
      this.scrollCss[idx] += createScrollSelectors(this.highResPadding(), `.image-item>canvas`) + `{opacity: 1; transition: opacity 1s ease 2s; background-image: url(${resized_url.img})}`;
    }

    //add the blurry image
    if (!utils.deviceHasMemoryIssues() && styleParams.imageLoadingMode !== Consts.loadingMode.COLOR && !item.isTransparent) {
      // add blurred background-image
      this.scrollCss[idx] += createScrollSelectors(this.lowResPadding(), `.image-item`) + `{background-image: url(${resized_url.thumb})}`;
    }

    //scrollAnimation [DEMO]
    this.createScrollAnimationsIfNeeded({idx, item, styleParams, createScrollSelectors});

    return this.scrollCss[idx];
    // console.count('pgScroll item created');
  }

  createScrollAnimationsIfNeeded({idx, item, styleParams, createScrollSelectors}) {
    const scrollAnimation = styleParams.scrollAnimation;

    if ((!scrollAnimation) || scrollAnimation === Consts.scrollAnimations.NO_EFFECT) {
      return;
    }

    const _animationTiming = (((idx % 4) + 1) * 100); //100 - 400

    const justBelowScreenPadding = this.justBelowScreenPadding(styleParams.oneRow ? item.width : item.height);
    const justBelowAndInScreenPadding = this.justBelowAndInScreenPadding();
    const inScreenPadding = this.inScreenPadding();
    const animationProps = (animationName, animationDuration, animationTiming) => `${animationName} ${animationDuration}s ease-in ${animationTiming}ms 1 normal backwards paused;`;

    if (scrollAnimation === Consts.scrollAnimations.FADE_IN) {
      this.scrollCss[idx] += createScrollSelectors(justBelowAndInScreenPadding, ' .gallery-item-wrapper') + `{animation: ${animationProps('scroll-animation-fade-in', 1.5, _animationTiming)}}`;
      this.scrollCss[idx] += createScrollSelectors(inScreenPadding, ' .gallery-item-wrapper') + `{animation-play-state: running;}`;
    }

    if (scrollAnimation === Consts.scrollAnimations.GRAYSCALE) {
      this.scrollCss[idx] += createScrollSelectors(justBelowAndInScreenPadding, ' .gallery-item-wrapper') + `{animation: ${animationProps('scroll-animation-grayscale', 1, _animationTiming + 200)}}`;
      this.scrollCss[idx] += createScrollSelectors(inScreenPadding, ' .gallery-item-wrapper') + `{animation-play-state: running;}`;
    }

    if (scrollAnimation === Consts.scrollAnimations.SLIDE_UP) {
      //push down items under screen
      this.scrollCss[idx] += createScrollSelectors(justBelowAndInScreenPadding, '') + `{animation: ${animationProps('scroll-animation-slide-up', 1, 0)}}`;
      //push back items in screen
      this.scrollCss[idx] += createScrollSelectors(inScreenPadding, '') + `{animation-play-state: running;}`;
    }

    if (scrollAnimation === Consts.scrollAnimations.EXPAND) {
      //hide items below screen
      this.scrollCss[idx] += createScrollSelectors(justBelowAndInScreenPadding, '') + `{animation: ${animationProps('scroll-animation-expand', 0.8, 0)}}`;
      //show items in screen
      this.scrollCss[idx] += createScrollSelectors(inScreenPadding, '') + `{animation-play-state: running;}`;
    }

    if (scrollAnimation === Consts.scrollAnimations.SHRINK) {
      //hide items below screen
      this.scrollCss[idx] += createScrollSelectors(justBelowAndInScreenPadding, '') + `{animation: ${animationProps('scroll-animation-shrink', 0.8, 0)}}`;
      //show items in screen
      this.scrollCss[idx] += createScrollSelectors(inScreenPadding, '') + `{animation-play-state: running;}`;
    }


    if (scrollAnimation === Consts.scrollAnimations.ZOOM_OUT) {
      //hide items below screen
      this.scrollCss[idx] += createScrollSelectors(justBelowAndInScreenPadding, ' .gallery-item-wrapper') + `{animation: ${animationProps('scroll-animation-zoom-out', 0.8, 0)}}`;
      //show items in screen
      this.scrollCss[idx] += createScrollSelectors(inScreenPadding, ' .gallery-item-wrapper') + `{animation-play-state: running;}`;
    }

    if (scrollAnimation === Consts.scrollAnimations.ONE_COLOR) {
      const oneColorAnimationColor = styleParams.oneColorAnimationColor && styleParams.oneColorAnimationColor.value ? styleParams.oneColorAnimationColor.value : 'transparent';
      //hide items below screen
      this.scrollCss[idx] += createScrollSelectors(justBelowAndInScreenPadding, '') + `{background-color: ${oneColorAnimationColor};}`;
      this.scrollCss[idx] += createScrollSelectors(justBelowAndInScreenPadding, ' .gallery-item-wrapper') + `{animation: ${animationProps('scroll-animation-fade-in', 1.5, _animationTiming)}}`;
      //show items in screen
      this.scrollCss[idx] += createScrollSelectors(inScreenPadding, ' .gallery-item-wrapper') + `{animation-play-state: running;}`;
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
