import Consts from 'photography-client-lib/dist/src/utils/consts';
import utils from '../../utils/index.js';
import window from 'photography-client-lib/dist/src/sdk/windowWrapper';
import experiments from 'photography-client-lib/dist/src/sdk/experimentsWrapper';

/*
    TODO:
    - handle horizontal scroll
    - check Layout creation and do not recreate exisiting layouts
*/


class CssScrollHelper {

  constructor() {
    this.pgScrollSteps = [10240, 5120, 2560, 1280, 640, 320, 160, 80, 40, 20, 10];
    this.pgScrollClassName = 'pgscl';

    this.screenSize = Math.max(window.screen.width, window.screen.height);

    //padding: [belowScreen, aboveScreen]
    //padding: [above images, below image]

    let highResPadding;
    switch (experiments['specs.pro-gallery.scrollPreloading']) {
      case '0':
        highResPadding = [0, 0];
        break;
      case '20':
        highResPadding = [640, 2560];
        break;
      case '40':
        highResPadding = [1280, 5120];
        break;
      case '60':
        highResPadding = [2560, 10240];
        break;
      case '100':
        highResPadding = [Infinity, Infinity];
        break;
      default:
      case '80':
        highResPadding = [5120, Infinity];
        break;
    }

    this.allPagePadding = () => [Infinity, Infinity];
    this.inScreenPadding = () => [0, 0];
    this.aboveScreenPadding = () => [0, Infinity];
    this.justBelowScreenPadding = itemHeight => [5120, -1 * (itemHeight + this.screenSize)];
    this.justBelowAndInScreenPadding = () => [5120, 0];
    this.belowScreenPadding = () => [Infinity, 0];
    this.highResPadding = () => highResPadding || [5120, Infinity];
    this.lowResPadding = () => [10240, Infinity];

    this.scrollCss = [];
    this.scrollCssProps = [];
  }

  getDomId({id}) {
    const shortId = String(id).replace(/[\W]+/g, '');
    return `pgi${shortId}`;
  }

  buildScrollClassName(galleryDomId, idx, val) {
    const shortId = String(galleryDomId).replace(/[\W]+/g, '').slice(-8);
    return `${this.pgScrollClassName}_${shortId}_${val}-${this.pgScrollSteps[idx] + Number(val)}`;
  }

  calcScrollClasses(galleryDomId, scrollTop) {
    return `${this.pgScrollClassName}-${scrollTop} ` + this.pgScrollSteps.map((step, idx) => this.buildScrollClassName(galleryDomId, idx, (Math.floor(scrollTop / step) * step))).join(' ');
  }

  calcScrollCss({galleryDomId, items, styleParams}) {
    if (!(items && items.length)) {
      return '';
    }
    this.screenSize = styleParams.oneRow ? window.innerWidth : window.innerHeight;
    // if (utils.isMobile()) {
    //   this.screenSize *= (320 / window.screen.width);
    // }
    const [lastItem] = items.slice(-1);
    const {top, right} = lastItem.offset;
    const maxStep = this.pgScrollSteps[0];
    this.minHeight = 0 - maxStep;
    this.maxHeight = (Math.ceil(((styleParams.oneRow ? right : top) + this.screenSize) / maxStep) + 1) * maxStep;
    return items.map(item => this.calcScrollCssForItem({galleryDomId, item, styleParams})).join(`\n`);
  }

  shouldCalcScrollCss({id, idx, top, left, width, resizeWidth, maxWidth, height, resizeHeight, maxHeight, resized_url, type}, styleParams) {
    if (type === 'video' || type === 'text') {
      return false;
    }
    return true;
    // if (!this.scrollCss[idx]) {
    //   return true; //recalc as long as no css was created
    // }
    // const scrollCssProps = JSON.stringify({id, idx, top, left, width, resizeWidth, maxWidth, height, resizeHeight, maxHeight, resized_url, oneRow: styleParams.oneRow, loadingMode: styleParams.imageLoadingMode, isSSR: window.isSSR});
    // if (scrollCssProps === this.scrollCssProps[idx]) {
    //   return false;
    // }
    // this.scrollCssProps[idx] = scrollCssProps;
    // return true;
  }

  createScrollSelectorsFunction({galleryDomId, item, styleParams}) {
    const imageTop = styleParams.oneRow ? (item.offset.left - this.screenSize) : (item.offset.top - this.screenSize);
    const imageBottom = styleParams.oneRow ? (item.offset.left + item.width) : (item.offset.top + item.height);
    const minStep = this.pgScrollSteps[this.pgScrollSteps.length - 1];
    const ceil = (num, step) => Math.ceil(Math.min(this.maxHeight, num) / step) * step;
    const floor = (num, step) => Math.floor(Math.max(this.minHeight, num) / step) * step;
    const domId = this.getDomId(item);
    return (padding, suffix) => {
      const [before, after] = padding;
      if (before === after === Infinity) {
        return `.#${domId} ${suffix}`;
      }
      let from = floor(imageTop - before, minStep);
      const to = ceil(imageBottom + after, minStep);
      const scrollClasses = [];
      while (from < to) {
        const largestDividerIdx = this.pgScrollSteps.findIndex(step => (from % step === 0 && from + step <= to)); //eslint-disable-line
        if (largestDividerIdx === -1) {
          console.error('largestDividerIdx is -1. Couldn\'t find index in pgScrollSteps array.\nfrom =', from, '\nto =', to, '\npadding[0] =', padding[0], '\npadding[1] =', padding[1]);
          break;
        }
        scrollClasses.push(`.${this.buildScrollClassName(galleryDomId, largestDividerIdx, from)} ~ div #${domId} ${suffix}`);
        from += this.pgScrollSteps[largestDividerIdx];
        // console.count('pgScroll class created');
      }
      return scrollClasses.join(', ');
    };
  }

  calcScrollCssForItem({galleryDomId, item, styleParams}) {

    const {resized_url, idx} = item;

    if (!this.shouldCalcScrollCss(item, styleParams)) {
      if (utils.isVerbose()) {
        console.log('CSS SCROLL - skipping css calc for item #' + idx, item, this.scrollCss[idx]);
      }
      return this.scrollCss[idx];
    }

    let scrollCss = '';

    const createScrollSelectors = this.createScrollSelectorsFunction({galleryDomId, item, styleParams});

    //load hi-res image + loading transition
    if (!window.isSSR && !item.isDimensionless) {
      scrollCss += createScrollSelectors(this.highResPadding(), `.image-item>canvas`) + `{opacity: 1; transition: opacity .4s linear; background-image: url(${resized_url.img})}`;
    }

    //add the blurry image
    if (!utils.deviceHasMemoryIssues() && styleParams.imageLoadingMode !== Consts.loadingMode.COLOR && (!item.isTransparent || window.isSSR) && !item.isDimensionless) {
      scrollCss += createScrollSelectors(this.lowResPadding(), `.image-item`) + `{background-image: url(${resized_url.thumb})}`;
    }

    //scrollAnimation [DEMO]
    this.createScrollAnimationsIfNeeded({idx, item, styleParams, createScrollSelectors});

    if (utils.isVerbose()) {
      console.log('CSS SCROLL - css calc for item #' + idx, item, this.scrollCss[idx]);
    }

    this.scrollCss[idx] = scrollCss || this.scrollCss[idx];

    return this.scrollCss[idx];
    // console.count('pgScroll item created');
  }

  createScrollAnimationsIfNeeded({idx, item, styleParams, createScrollSelectors}) {
    const scrollAnimation = styleParams.scrollAnimation;

    if ((!scrollAnimation) || scrollAnimation === Consts.scrollAnimations.NO_EFFECT) {
      return;
    }

    const _animationTiming = (((idx % 4) + 1) * 100); //100 - 400

    const animationPreparationPadding = this.allPagePadding();
    const animationActivePadding = this.aboveScreenPadding();

    const animationProps = (animationName, animationDuration, animationTiming) => `${animationName} ${animationDuration}s ease-in ${animationTiming}ms 1 normal backwards paused;`;

    if (scrollAnimation === Consts.scrollAnimations.FADE_IN) {
      this.scrollCss[idx] += createScrollSelectors(animationPreparationPadding, ' .gallery-item-wrapper') + `{animation: ${animationProps('scroll-animation-fade-in', 1.5, _animationTiming)}}`;
      this.scrollCss[idx] += createScrollSelectors(animationActivePadding, ' .gallery-item-wrapper') + `{animation-play-state: running;}`;
    }

    if (scrollAnimation === Consts.scrollAnimations.GRAYSCALE) {
      this.scrollCss[idx] += createScrollSelectors(animationPreparationPadding, ' .gallery-item-wrapper') + `{animation: ${animationProps('scroll-animation-grayscale', 1, _animationTiming + 200)}}`;
      this.scrollCss[idx] += createScrollSelectors(animationActivePadding, ' .gallery-item-wrapper') + `{animation-play-state: running;}`;
    }

    if (scrollAnimation === Consts.scrollAnimations.SLIDE_UP) {
      //push down items under screen
      this.scrollCss[idx] += createScrollSelectors(animationPreparationPadding, '') + `{animation: ${animationProps('scroll-animation-slide-up', 1, 0)}}`;
      //push back items in screen
      this.scrollCss[idx] += createScrollSelectors(animationActivePadding, '') + `{animation-play-state: running;}`;
    }

    if (scrollAnimation === Consts.scrollAnimations.EXPAND) {
      //hide items below screen
      this.scrollCss[idx] += createScrollSelectors(animationPreparationPadding, '') + `{animation: ${animationProps('scroll-animation-expand', 0.8, 0)}}`;
      //show items in screen
      this.scrollCss[idx] += createScrollSelectors(animationActivePadding, '') + `{animation-play-state: running;}`;
    }

    if (scrollAnimation === Consts.scrollAnimations.SHRINK) {
      //hide items below screen
      this.scrollCss[idx] += createScrollSelectors(animationPreparationPadding, '') + `{animation: ${animationProps('scroll-animation-shrink', 0.8, 0)}}`;
      //show items in screen
      this.scrollCss[idx] += createScrollSelectors(animationActivePadding, '') + `{animation-play-state: running;}`;
    }


    if (scrollAnimation === Consts.scrollAnimations.ZOOM_OUT) {
      //hide items below screen
      this.scrollCss[idx] += createScrollSelectors(animationPreparationPadding, ' .gallery-item-wrapper') + `{animation: ${animationProps('scroll-animation-zoom-out', 0.8, 0)}}`;
      //show items in screen
      this.scrollCss[idx] += createScrollSelectors(animationActivePadding, ' .gallery-item-wrapper') + `{animation-play-state: running;}`;
    }

    if (scrollAnimation === Consts.scrollAnimations.ONE_COLOR) {
      const oneColorAnimationColor = styleParams.oneColorAnimationColor && styleParams.oneColorAnimationColor.value ? styleParams.oneColorAnimationColor.value : 'transparent';
      //hide items below screen
      this.scrollCss[idx] += createScrollSelectors(animationPreparationPadding, '') + `{background-color: ${oneColorAnimationColor};}`;
      this.scrollCss[idx] += createScrollSelectors(animationPreparationPadding, ' .gallery-item-wrapper') + `{animation: ${animationProps('scroll-animation-fade-in', 1.5, _animationTiming)}}`;
      //show items in screen
      this.scrollCss[idx] += createScrollSelectors(animationActivePadding, ' .gallery-item-wrapper') + `{animation-play-state: running;}`;
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
