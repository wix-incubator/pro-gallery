import { GALLERY_CONSTS, window, utils } from 'pro-gallery-lib';

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

  calcScrollPaddings() {
    //padding: [belowScreen, aboveScreen]
    //padding: [above images, below image]
    this.allPagePadding = () => [Infinity, Infinity];
    this.inScreenPadding = () => [0, 0];
    this.aboveScreenPadding = () => [-250, Infinity];
    this.justBelowScreenPadding = itemHeight => [
      Infinity,
      -1 * (itemHeight + this.screenSize),
    ];
    this.justBelowAndAboveScreenPadding = () => [2560, Infinity];
    this.justBelowAndInScreenPadding = () => [5120, 0];
    this.belowScreenPadding = () => [Infinity, 0];

    this.highResPadding = () => ([5120, Infinity]);
    this.lowResPadding = () => ([10240, Infinity]);
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

  calcScrollCss({ domId, items, styleParams }) {
    if (!(items && items.length)) {
      return [];
    }
    const scrollAnimation = styleParams.scrollAnimation;
    if (!scrollAnimation || scrollAnimation === GALLERY_CONSTS.scrollAnimations.NO_EFFECT) {
      return [];
    }
    this.screenSize = styleParams.oneRow
      ? Math.min(window.outerWidth, window.screen.width)
      : Math.min(window.outerHeight, window.screen.height);
    if (!styleParams.oneRow && utils.isMobile()) {
      this.screenSize += 50;
    }
    this.calcScrollPaddings();

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
        this.calcScrollCssForItem({ domId, item, styleParams }),
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

  calcScrollCssForItem({ domId, item, styleParams }) {
    const { idx } = item;
    let scrollCss = '';
    const createScrollSelectors = this.createScrollSelectorsFunction({
      domId,
      item,
      styleParams,
    });

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
    const {isRTL, oneRow, scrollAnimation, scrollDuration} = styleParams;

    if (!scrollAnimation || scrollAnimation === GALLERY_CONSTS.scrollAnimations.NO_EFFECT) {
      return '';
    }

    const oneRowDelay = oneRow ? scrollDuration + 1500 : 0;
    const _randomDelay = ((idx % 4) + 1) * 100 + oneRowDelay; //100 - 400
    const _randomDuration = ((idx % 6) + 1) * 100; //100 - 600

    const animationPreparationPadding = this.allPagePadding();
    const animationActivePadding = this.aboveScreenPadding();

    let scrollAnimationCss = '';
    // notice: these 2 animations must have the blurry image
    if (scrollAnimation === GALLERY_CONSTS.scrollAnimations.MAIN_COLOR || scrollAnimation === GALLERY_CONSTS.scrollAnimations.BLUR) {
      scrollAnimationCss += createScrollSelectors(animationPreparationPadding, ` [data-hook="image-item-overlay"]`) + `{filter: opacity(1); transition: filter 1.${_randomDuration}s ease-in ${_randomDelay}ms !important;}`;
      scrollAnimationCss += createScrollSelectors(animationActivePadding, ` [data-hook="image-item-overlay"]`) + `{filter: opacity(0) !important;}`;
    }

    if (scrollAnimation === GALLERY_CONSTS.scrollAnimations.FADE_IN) {
      scrollAnimationCss +=
        createScrollSelectors(
          animationPreparationPadding,
          ' .gallery-item-wrapper',
        ) +
        `{filter: opacity(0); transition: filter 1.${_randomDuration}s ease-in !important;}`;
      scrollAnimationCss +=
        createScrollSelectors(
          animationActivePadding,
          ' .gallery-item-wrapper',
        ) + `{filter: opacity(1) !important;}`;
    }

    if (scrollAnimation === GALLERY_CONSTS.scrollAnimations.GRAYSCALE) {
      scrollAnimationCss +=
        createScrollSelectors(
          animationPreparationPadding,
          ' .gallery-item-wrapper',
        ) +
        `{filter: grayscale(100%); transition: filter 1.${200 +
        _randomDuration}s ease-in !important;}`;
      scrollAnimationCss +=
        createScrollSelectors(
          animationActivePadding,
          ' .gallery-item-wrapper',
        ) + `{filter: grayscale(0) !important;}`;
    }

    if (scrollAnimation === GALLERY_CONSTS.scrollAnimations.SLIDE_UP) {
      const axis = oneRow ? 'X' : 'Y';
      const direction = isRTL ? '-' : '';
      scrollAnimationCss +=
        createScrollSelectors(animationPreparationPadding, '') +
        `{transform: translate${axis}(${direction}100px); transition: transform 0.8s cubic-bezier(.13,.78,.53,.92) ${_randomDelay}ms !important;}`;
      scrollAnimationCss +=
        createScrollSelectors(animationActivePadding, '') +
        `{transform: translate${axis}(0) !important;}`;
    }

    if (scrollAnimation === GALLERY_CONSTS.scrollAnimations.EXPAND) {
      scrollAnimationCss +=
        createScrollSelectors(animationPreparationPadding, '') +
        `{transform: scale(0.95); transition: transform 1s cubic-bezier(.13,.78,.53,.92) ${_randomDelay}ms !important;}`;
      scrollAnimationCss +=
        createScrollSelectors(animationActivePadding, '') +
        `{transform: scale(1) !important;}`;
    }

    if (scrollAnimation === GALLERY_CONSTS.scrollAnimations.SHRINK) {
      scrollAnimationCss +=
        createScrollSelectors(animationPreparationPadding, '') +
        `{transform: scale(1.05); transition: transform 1s cubic-bezier(.13,.78,.53,.92) ${_randomDelay}ms !important;}`;
      scrollAnimationCss +=
        createScrollSelectors(animationActivePadding, '') +
        `{transform: scale(1) !important;}`;
    }

    if (scrollAnimation === GALLERY_CONSTS.scrollAnimations.ZOOM_OUT) {
      scrollAnimationCss +=
        createScrollSelectors(
          animationPreparationPadding,
          ' .gallery-item-wrapper',
        ) +
        `{transform: scale(1.1); transition: transform 1.2s cubic-bezier(.13,.78,.53,.92) ${_randomDelay}ms !important;}`;
      scrollAnimationCss +=
        createScrollSelectors(
          animationActivePadding,
          ' .gallery-item-wrapper',
        ) + `{transform: scale(1) !important;}`;
    }

    if (scrollAnimation === GALLERY_CONSTS.scrollAnimations.ONE_COLOR) {
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
        `{filter: opacity(0); transition: filter 0.${_randomDuration}s ease-in ${_randomDelay}ms !important;}`;
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
