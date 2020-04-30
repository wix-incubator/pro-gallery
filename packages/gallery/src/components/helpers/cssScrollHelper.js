import LOADING_MODE from '../../common/constants/loadingMode';
import SCROLL_ANIMATIONS from '../../common/constants/scrollAnimations';
import utils from '../../common/utils/index.js';
import window from '../../common/window/windowWrapper';
import { URL_TYPES, URL_SIZES } from '../../common/constants/urlTypes';

class CssScrollHelper {
  constructor() {
    this.pgScrollSteps = [
      40960,
      20480,
      10240,
      5120,
      2560,
      1280,
      640,
      320,
      160,
      80,
      40,
      20,
      10,
    ];
    this.pgScrollClassName = 'pgscl';

    this.screenSize = Math.max(window.screen.width, window.screen.height);

    this.scrollCss = [];
    this.scrollCssProps = [];
    this.calcScrollPaddings(false);
  }

  calcScrollPaddings(allowPreloading = true) {
    //padding: [belowScreen, aboveScreen]
    //padding: [above images, below image]
    this.allPagePadding = () => [Infinity, Infinity];
    this.inScreenPadding = () => [0, 0];
    this.aboveScreenPadding = () => [0, Infinity];
    this.justBelowScreenPadding = itemHeight => [
      Infinity,
      -1 * (itemHeight + this.screenSize),
    ];
    this.justBelowAndAboveScreenPadding = () => [2560, Infinity];
    this.justBelowAndInScreenPadding = () => [5120, 0];
    this.belowScreenPadding = () => [Infinity, 0];

    this.highResPadding = () => (allowPreloading ? [5120, Infinity] : [0, 0]);
    this.lowResPadding = () => (allowPreloading ? [10240, Infinity] : [0, 0]);
  }

  getSellectorDomId({ id, idx }) {
    const shortId = String(id).replace(/[\W]+/g, '');
    return `pgi${shortId}_${idx}`;
  }

  buildScrollClassName(domId, idx, val) {
    const shortId = String(domId)
      .replace(/[\W]+/g, '')
      .slice(-8);
    return `${this.pgScrollClassName}_${shortId}_${val}-${this.pgScrollSteps[
      idx
    ] + Number(val)}`;
  }

  calcScrollClasses(domId, scrollTop) {
    return (
      `${this.pgScrollClassName}-${scrollTop} ` +
      this.pgScrollSteps
        .map((step, idx) =>
          this.buildScrollClassName(
            domId,
            idx,
            Math.floor(scrollTop / step) * step,
          ),
        )
        .join(' ')
    );
  }

  calcScrollCss({ domId, items, styleParams, allowPreloading, isUnknownWidth }) {
    if (!(items && items.length)) {
      return [];
    }
    this.screenSize = styleParams.oneRow
      ? Math.min(window.outerWidth, window.screen.width)
      : Math.min(window.outerHeight, window.screen.height);
    if (!styleParams.oneRow && utils.isMobile()) {
      this.screenSize += 50;
    }
    this.calcScrollPaddings(allowPreloading);

    const [lastItem] = items.slice(-1);
    const { top, right } = lastItem.offset;
    const maxStep = this.pgScrollSteps[0];
    this.minHeight = 0 - maxStep;
    this.maxHeight =
      (Math.ceil(
        ((styleParams.oneRow ? right : top) + this.screenSize) / maxStep,
      ) +
        1) *
      maxStep;
    return items
      .map(item =>
        this.calcScrollCssForItem({ domId, item, styleParams, isUnknownWidth }),
      )
  }

  shouldCalcScrollCss({ type }) {
    if (type === 'video' || type === 'text') {
      return false;
    }
    return true;
  }

  createScrollSelectorsFunction({ domId, item, styleParams }) {
    const imageTop = styleParams.oneRow
      ? item.offset.left - this.screenSize
      : item.offset.top - this.screenSize;
    const imageBottom = styleParams.oneRow
      ? item.offset.left + item.width
      : item.offset.top + item.height;
    const minStep = this.pgScrollSteps[this.pgScrollSteps.length - 1];
    const ceil = (num, step) =>
      Math.ceil(Math.min(this.maxHeight, num) / step) * step;
    const floor = (num, step) =>
      Math.floor(Math.max(this.minHeight, num) / step) * step;
    const sellectorDomId = this.getSellectorDomId(item);
    return (padding, suffix) => {
      const [before, after] = padding;
      if (before === Infinity && after === Infinity) {
        return `#pro-gallery-${domId} #${sellectorDomId} ${suffix}`;
      }
      let from = floor(imageTop - before, minStep);
      const to = ceil(imageBottom + after, minStep);
      // if (utils.isVerbose()) {
      //   console.log(
      //     `CSS SCROLL - item #${item.idx} display range is: (${from} - ${to})`,
      //   );
      // }
      const scrollClasses = [];
      while (from < to) {
        const largestDividerIdx = this.pgScrollSteps.findIndex(step => (from % step === 0 && from + step <= to)); //eslint-disable-line
        if (largestDividerIdx === -1) {
          console.error(
            "largestDividerIdx is -1. Couldn't find index in pgScrollSteps array.\nfrom =",
            from,
            '\nto =',
            to,
            '\npadding[0] =',
            padding[0],
            '\npadding[1] =',
            padding[1],
          );
          break;
        }
        scrollClasses.push(
          `.${this.buildScrollClassName(
            domId,
            largestDividerIdx,
            from,
          )} ~ div #${sellectorDomId} ${suffix}`,
        );
        from += this.pgScrollSteps[largestDividerIdx];
        // console.count('pgScroll class created');
      }
      return scrollClasses.join(', ');
    };
  }

  calcScrollCssForItem({ domId, item, styleParams, isUnknownWidth }) {
    const { type, createUrl, idx } = item;
    const itemTag = utils.hasNativeLazyLoadSupport()? 'img' : 'canvas';
    let scrollCss = '';
    const createScrollSelectors = this.createScrollSelectorsFunction({
      domId,
      item,
      styleParams,
    });

    if (type !== 'text') {
      //load hi-res image + loading transition
      if (!isUnknownWidth && !item.isDimensionless) { //FAKE SSR
        scrollCss +=
          createScrollSelectors(this.highResPadding(), `.${type}-item>${itemTag}`) +
          `{opacity: 1; transition: opacity 1s linear; background-image: url(${createUrl(
            URL_SIZES.RESIZED,
            URL_TYPES.HIGH_RES,
          )})}`;
      }

      //add the blurry image/color
      if (
        !utils.deviceHasMemoryIssues() &&
        styleParams.imageLoadingMode === LOADING_MODE.BLUR &&
        (!item.isTransparent || isUnknownWidth) &&
        !item.isDimensionless
      ) {
        scrollCss +=
          createScrollSelectors(this.lowResPadding(), `.image-item`) +
          `{background-image: url(${createUrl(
            URL_SIZES.RESIZED,
            URL_TYPES.LOW_RES,
          )})}`;
      }
      if (
        !utils.deviceHasMemoryIssues() &&
        styleParams.imageLoadingMode === LOADING_MODE.MAIN_COLOR &&
        (!item.isTransparent || isUnknownWidth) && //FAKE SSR
        !item.isDimensionless
      ) {
        scrollCss +=
          createScrollSelectors(this.lowResPadding(), ' .image-item') + `{background-size: 0.3px; background-repeat: repeat; background-image: url(${createUrl(
            URL_SIZES.PIXEL,
            URL_TYPES.HIGH_RES,
          )})}`;
      }
    }

    //scrollAnimation
    scrollCss += this.createScrollAnimationsIfNeeded({
      idx,
      item,
      styleParams,
      createScrollSelectors,
    });

    // if (utils.isVerbose()) {
    //   console.log(
    //     'CSS SCROLL - css calc for item #' + idx,
    //     item,
    //     this.scrollCss[idx],
    //   );
    // }

    this.scrollCss[idx] = scrollCss || this.scrollCss[idx];

    return this.scrollCss[idx];
    // console.count('pgScroll item created');
  }

  createScrollAnimationsIfNeeded({ idx, styleParams, createScrollSelectors }) {
    const scrollAnimation = styleParams.scrollAnimation;

    if (utils.isSSR()) {
      return '';
    }

    if (!scrollAnimation || scrollAnimation === SCROLL_ANIMATIONS.NO_EFFECT) {
      return '';
    }

    const _randomTiming = ((idx % 3) + 1) * 100; //100 - 300

    const animationPreparationPadding = this.allPagePadding();
    const animationActivePadding = this.aboveScreenPadding();

    let scrollAnimationCss = '';
    const itemTag = utils.hasNativeLazyLoadSupport()? 'img' : 'canvas';
    // notice: these 2 animations must have the blurry image
    if (scrollAnimation === SCROLL_ANIMATIONS.MAIN_COLOR) {
      scrollAnimationCss += createScrollSelectors(animationPreparationPadding, ' .image-item') + `{background-size: 1px; background-repeat: repeat;}`;
      scrollAnimationCss += createScrollSelectors(animationPreparationPadding, ` ${itemTag}`) + `{filter: opacity(0); transition: filter 1.${_randomTiming}s ease-in !important;}`;
      scrollAnimationCss += createScrollSelectors(animationActivePadding, ` ${itemTag}`) + `{filter: opacity(1) !important;}`;
    }

    if (scrollAnimation === SCROLL_ANIMATIONS.BLUR) {
      scrollAnimationCss += createScrollSelectors(animationPreparationPadding, ` ${itemTag}`) + `{filter: opacity(0); transition: filter 1.${_randomTiming}s ease-in !important;}`;
      scrollAnimationCss += createScrollSelectors(animationActivePadding, ` ${itemTag}`) + `{filter: opacity(1) !important;}`;
    }

    if (scrollAnimation === SCROLL_ANIMATIONS.FADE_IN) {
      scrollAnimationCss +=
        createScrollSelectors(
          animationPreparationPadding,
          ' .gallery-item-wrapper',
        ) +
        `{filter: opacity(0); transition: filter 1.${_randomTiming}s ease-in !important;}`;
      scrollAnimationCss +=
        createScrollSelectors(
          animationActivePadding,
          ' .gallery-item-wrapper',
        ) + `{filter: opacity(1) !important;}`;
    }

    if (scrollAnimation === SCROLL_ANIMATIONS.GRAYSCALE) {
      scrollAnimationCss +=
        createScrollSelectors(
          animationPreparationPadding,
          ' .gallery-item-wrapper',
        ) +
        `{filter: grayscale(100%); transition: filter 1.${200 +
          _randomTiming}s ease-in !important;}`;
      scrollAnimationCss +=
        createScrollSelectors(
          animationActivePadding,
          ' .gallery-item-wrapper',
        ) + `{filter: grayscale(0) !important;}`;
    }

    if (scrollAnimation === SCROLL_ANIMATIONS.SLIDE_UP) {
      scrollAnimationCss +=
        createScrollSelectors(animationPreparationPadding, '') +
        `{transform: translateY(100px); transition: transform 0.8s cubic-bezier(.13,.78,.53,.92) !important;}`;
      scrollAnimationCss +=
        createScrollSelectors(animationActivePadding, '') +
        `{transform: translateY(0) !important;}`;
    }

    if (scrollAnimation === SCROLL_ANIMATIONS.EXPAND) {
      scrollAnimationCss +=
        createScrollSelectors(animationPreparationPadding, '') +
        `{transform: scale(0.95); transition: transform 1s cubic-bezier(.13,.78,.53,.92) !important;}`;
      scrollAnimationCss +=
        createScrollSelectors(animationActivePadding, '') +
        `{transform: scale(1) !important;}`;
    }

    if (scrollAnimation === SCROLL_ANIMATIONS.SHRINK) {
      scrollAnimationCss +=
        createScrollSelectors(animationPreparationPadding, '') +
        `{transform: scale(1.05); transition: transform 1s cubic-bezier(.13,.78,.53,.92) !important;}`;
      scrollAnimationCss +=
        createScrollSelectors(animationActivePadding, '') +
        `{transform: scale(1) !important;}`;
    }

    if (scrollAnimation === SCROLL_ANIMATIONS.ZOOM_OUT) {
      scrollAnimationCss +=
        createScrollSelectors(
          animationPreparationPadding,
          ' .gallery-item-wrapper',
        ) +
        `{transform: scale(1.1); transition: transform 1.2s cubic-bezier(.13,.78,.53,.92) !important;}`;
      scrollAnimationCss +=
        createScrollSelectors(
          animationActivePadding,
          ' .gallery-item-wrapper',
        ) + `{transform: scale(1) !important;}`;
    }

    if (scrollAnimation === SCROLL_ANIMATIONS.ONE_COLOR) {
      const oneColorAnimationColor =
        styleParams.oneColorAnimationColor &&
        styleParams.oneColorAnimationColor.value
          ? styleParams.oneColorAnimationColor.value
          : 'transparent';

      scrollAnimationCss +=
        createScrollSelectors(animationPreparationPadding, '') +
        `{background-color: ${oneColorAnimationColor};}`;
      scrollAnimationCss +=
        createScrollSelectors(
          animationPreparationPadding,
          ' .gallery-item-wrapper',
        ) +
        `{filter: opacity(0); transition: filter 0.${600 +
          _randomTiming}s ease-in !important;}`;
      scrollAnimationCss +=
        createScrollSelectors(
          animationActivePadding,
          ' .gallery-item-wrapper',
        ) + `{filter: opacity(1) !important;}`;
    }

    return scrollAnimationCss;
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
