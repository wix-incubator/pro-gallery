import { GALLERY_CONSTS, window, utils } from 'pro-gallery-lib';

class CssScrollHelper {
  constructor() {
    this.pgScrollSteps = [];
    for (let i = 1; i < 50000; i *= 2) {
      this.pgScrollSteps.push(i);
    }
    this.pgScrollSteps.reverse();
    this.pgScrollClassName = 'pgscl';

    this.screenSize = Math.max(window.screen.width, window.screen.height);

    this.scrollCss = [];
    this.scrollCssProps = [];

    try {
      this.settings = JSON.parse(localStorage.gallerySettings);
    } catch (e) {
      this.settings = {}
    }
  }

  getSellectorDomId({ id, idx }) {
    const shortId = String(id).replace(/[\W]+/g, '');
    return `pgi${shortId}_${idx}`;
  }

  buildScrollClassName(idx, val, domId) {
    const shortId = String(domId || this.domId).replace(/[\W]+/g, '').slice(-8);
    return `${this.pgScrollClassName}_${shortId}_${val}-${
      this.pgScrollSteps[idx] + Number(val)
    }`;
  }

  calcScrollClasses(scrollTop, domId) {
    //used by the scroll indicator
    return (
      `${this.pgScrollClassName}-${scrollTop} ` +
      this.pgScrollSteps
        .map((step, idx) =>
          this.buildScrollClassName(
            idx,
            Math.floor(scrollTop / step) * step,
            domId
          )
        )
        .join(' ')
    );
  }

  createScrollSelectorsFunction({ item, container, styleParams }) {
    const imageStart = (styleParams.oneRow
      ? item.offset.left
      : item.offset.top);
    const imageSize = styleParams.oneRow
      ? item.width
      : item.height;

    const containerSize =  styleParams.oneRow
      ? Math.min(container.width, window.innerWidth)
      : Math.min(container.height, window.innerHeight) + container.scrollBase;

    return (range, suffix, animationCss, animation, exitAnimation) => {
      if (this.settings.animation_range_start >= 0 && this.settings.animation_range_stop > 0) {
        range = [this.settings.animation_range_start, this.settings.animation_range_stop];
      }
      if (this.settings.animation_random) {
        const r = Math.round(Math.random() * this.settings.animation_random);
        range[0] += r;
        range[1] += r;
      }
      const [start, stop] = range;
        // start:  the distance from the bottom of the screen to start the animation
        // stop:  the distance from the bottom of the screen to end the animation

      const [enterFrom, enterTo] = animation;
      const [exitFrom, exitTo] = exitAnimation || animation;
        // from: the animation start value
        // to: the animation end value
      const iterations = this.settings.animation_iterations || 10;
      const transitionDuration = (this.settings.animation_transition_duration || 400);

      console.log('CSS SCROLL: settinngs', this.settings);

      const transitionCss = `transition: ${animationCss.split(':')[0]} ${transitionDuration}ms ease !important`; 

      const animationPadding = 1000;
      const animationDuration = stop - start;

      const cssAnimationStart = imageStart - containerSize;
      const cssAnimationEnd = imageStart + imageSize;
      
      const entryAnimationStart = imageStart - containerSize + start;
      const entryAnimationEnd = entryAnimationStart + animationDuration;

      const exitAnimationStart = imageStart + imageSize - stop;
      const exitAnimationEnd = exitAnimationStart + animationDuration;

      const createAnimationStep = (idx, isExit) => {
        const [to, from] = isExit ? [exitTo, exitFrom] : [enterTo, enterFrom];
        if (isExit) {
          idx = iterations - idx;
        }
        const ease = t => t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t
        let step = ((to - from) * ease(idx / iterations)) + from;
        item.idx === 0 && console.log('SCROLL CSS createAnimationStep',{idx, step, res: animationCss.replace('#', step)});
        return animationCss.replace('#', step);
      }

      const createSelectorsRange = (from, to) => {
        if (to < 0) return [];
        from = Math.max(0, from);
        let scrollClasses = [];
        to = Math.round(to);
        from = Math.round(from);
        while (from < to) {
          const largestDividerIdx = this.pgScrollSteps.findIndex(step => (from % step === 0 && from + step <= to)); //eslint-disable-line
          scrollClasses.push(
            `.${this.buildScrollClassName(
              largestDividerIdx,
              from
            )} ~ div ${suffix}`
          );
          from += this.pgScrollSteps[largestDividerIdx];
          // console.count('pgScroll class created');
        }
        return scrollClasses;
      }
    
      const createAnimationRange = (start, end, isExit) => {
        return Array.from({length: iterations})
        .map((i, idx) => start + idx * (end - start) / iterations)
        .map((i, idx) => ({[createAnimationStep(idx, isExit)]: createSelectorsRange(i, i + ((end - start) / iterations))}))
        .reduce((obj, item) => ({...obj, ...item}),{})
      }

      const scrollClasses = {};
      const scrollClassesLog = {};
      const addScrollClass = (key, val) => {
        scrollClasses[key] = [
          ...(scrollClasses[key] || []),
          ...val
        ]
        scrollClassesLog[key] = scrollClasses[key].map(val => (String(val).match(/\d+-\d+/) || [])[0]).reduce((str, range) => {
          if (!range) return str;
          const [from, to] = range.split('-');
          const lastRange = str[str.length - 1];
          const lastTo = lastRange && lastRange.split('-').splice(-1)[0];
          if (from === lastTo) {
            return [
              ...str.slice(0, str.length - 1),
              lastRange.replace(lastTo, to)
            ];
          } else {
            return [
              ...str,
              (`${from}-${to}`)
            ];
          }
        }, []).join(', ');
      };
      const addScrollClasses = (classesObj) => {
        for (let [key, val] of Object.entries(classesObj)) {
          addScrollClass(key, val);
        }
      };

      //first batch: animation start value until the range start:
      addScrollClass(`${transitionCss}; ${animationCss.replace('#', enterTo)}`, [suffix]);

      if (styleParams.animationDirection === 'BOTH') {

        addScrollClass(createAnimationStep(0) + 'transtion: none !important;', createSelectorsRange(cssAnimationStart - animationPadding, cssAnimationStart));
        addScrollClass(createAnimationStep(0), createSelectorsRange(cssAnimationStart, entryAnimationStart));
        addScrollClasses(createAnimationRange(entryAnimationStart, entryAnimationEnd));
        addScrollClass(createAnimationStep(iterations), createSelectorsRange(entryAnimationEnd, exitAnimationStart));
        addScrollClasses(createAnimationRange(exitAnimationStart, exitAnimationEnd, true));
        addScrollClass(createAnimationStep(iterations, true), createSelectorsRange(exitAnimationEnd, cssAnimationEnd));
        addScrollClass(createAnimationStep(iterations, true) + 'transtion: none !important;', createSelectorsRange(cssAnimationEnd, cssAnimationEnd + animationPadding));

      } else if (styleParams.animationDirection === 'IN') {

        addScrollClass(createAnimationStep(0) + 'transtion: none !important;', createSelectorsRange(cssAnimationStart - animationPadding, cssAnimationStart));
        addScrollClass(createAnimationStep(0), createSelectorsRange(cssAnimationStart, entryAnimationStart));
        addScrollClasses(createAnimationRange(entryAnimationStart, entryAnimationEnd));
        addScrollClass(createAnimationStep(iterations), createSelectorsRange(entryAnimationEnd, cssAnimationEnd));
        addScrollClass(createAnimationStep(iterations) + 'transtion: none !important;', createSelectorsRange(cssAnimationEnd, cssAnimationEnd + animationPadding));

      } else if (styleParams.animationDirection === 'OUT') {

        addScrollClass(createAnimationStep(iterations) + 'transtion: none !important;', createSelectorsRange(cssAnimationStart - animationPadding, cssAnimationStart));
        addScrollClass(createAnimationStep(iterations), createSelectorsRange(cssAnimationStart, exitAnimationStart));
        addScrollClasses(createAnimationRange(exitAnimationStart, exitAnimationEnd, true));
        addScrollClass(createAnimationStep(iterations, true), createSelectorsRange(exitAnimationEnd, cssAnimationEnd));
        addScrollClass(createAnimationStep(iterations, true) + 'transtion: none !important;', createSelectorsRange(cssAnimationEnd, cssAnimationEnd + animationPadding));
      }

      const fullCss = Object.entries(scrollClasses)
      .map(([css, selectors]) => `${selectors.join(', ')} {${css}}`)
      .join(' ');

      console.log('SCROLL CLASSES #' + item.idx, scrollClassesLog);

      return fullCss;
    };
  }

  createScrollAnimationsIfNeeded({ idx, item, styleParams, createScrollSelectors }) {
    const { isRTL, oneRow, scrollAnimation } = styleParams;

    if (
      !scrollAnimation ||
      scrollAnimation === GALLERY_CONSTS.scrollAnimations.NO_EFFECT
    ) {
      return '';
    }


    const {NO_EFFECT, FADE_IN, GRAYSCALE, SLIDE_UP, EXPAND, SHRINK, ZOOM_OUT, ONE_COLOR, MAIN_COLOR, BLUR } = GALLERY_CONSTS.scrollAnimations;

    const randomRange = this.settings.animation_random;
    switch (scrollAnimation) {
      case FADE_IN:
        const r = Math.round(Math.random() * randomRange);
        return createScrollSelectors([r + 50, r + 150], `#${this.getSellectorDomId(item)} .gallery-item-wrapper`, 'opacity: #;', [0, 1]);
      case SLIDE_UP:
        const rtlFix = (oneRow && isRTL) ? -1 : 1;
        const slideGap = rtlFix * (this.settings.animation_slide_gap || 50);
        const r = Math.round(Math.random() * randomRange);
        if (oneRow) {
          return createScrollSelectors([r + 10, r + 70], `#${this.getSellectorDomId(item)} > div`, `transform: translateX(#px);`, [slideGap, 0], [-1 * slideGap, 0]) + ` #${this.getSellectorDomId(item)} {overflow: visible !important;}`;
        } else {
          return createScrollSelectors([r + 10, r + 70], `#${this.getSellectorDomId(item)}`, `transform: translateY(#px);`, [slideGap, 0], [-1 * slideGap, 0]);
        }
      case GRAYSCALE:
        const r = Math.round(Math.random() * randomRange);
        return createScrollSelectors([r + 150, r + 250], `#${this.getSellectorDomId(item)} .gallery-item-content`, 'filter: grayscale(#%);', [100, 0]);
      case EXPAND:
        const r = Math.round(Math.random() * randomRange);
        return createScrollSelectors([r, r + 100], `#${this.getSellectorDomId(item)} > div`, 'transform: scale(#);', [1, 0.95]);
      case ZOOM_OUT:
        const r = Math.round(Math.random() * randomRange);
        return createScrollSelectors([r, r + 100], `#${this.getSellectorDomId(item)} .gallery-item-wrapper`, 'transform: scale(#);', [1, 1.15]);
      case SHRINK:
        const r = Math.round(Math.random() * randomRange);
        return createScrollSelectors([r, r + 100], `#${this.getSellectorDomId(item)} .gallery-item-wrapper`, 'transform: scale(#);', [1.15, 1]);
  }
    // FADE
    
    // SLIDE
    // return createScrollSelectors([0, 100], `#${this.getSellectorDomId(item)}`, 'transform: translateY(#px);', [100, 0]);
  
    // GRAYSCALE
    // const r = Math.round(Math.random() * 100);
    // return createScrollSelectors([r, r + 100], `#${this.getSellectorDomId(item)} .gallery-item-content`, 'filter: grayscale(#%);', [100, 0]);

    const _randomDelay = ((idx % 3) + 1) * 100; //100 - 300
    const _randomDuration = ((idx % 3) + 1) * 100; //100 - 300

    const animationPreparationPadding = this.allPagePadding();
    const animationActivePadding = this.aboveScreenPadding();

    let scrollAnimationCss = '';
    // notice: these 2 animations must have the blurry image
    if (
      scrollAnimation === GALLERY_CONSTS.scrollAnimations.MAIN_COLOR ||
      scrollAnimation === GALLERY_CONSTS.scrollAnimations.BLUR
    ) {
      scrollAnimationCss +=
        createScrollSelectors(
          animationPreparationPadding,
          ` [data-hook="image-item-overlay"]`
        ) +
        `{filter: opacity(1); transition: filter 1.${_randomDuration}s ease-in ${_randomDelay}ms !important;}`;
      scrollAnimationCss +=
        createScrollSelectors(
          animationActivePadding,
          ` [data-hook="image-item-overlay"]`
        ) + `{filter: opacity(0) !important;}`;
    }

    if (scrollAnimation === GALLERY_CONSTS.scrollAnimations.FADE_IN) {
      scrollAnimationCss +=
        createScrollSelectors(
          animationPreparationPadding,
          ' .gallery-item-wrapper'
        ) +
        `{filter: opacity(0); transition: filter 1.${_randomDuration}s ease-in !important;}`;
      scrollAnimationCss +=
        createScrollSelectors(
          animationActivePadding,
          ' .gallery-item-wrapper'
        ) + `{filter: opacity(1) !important;}`;
    }

    if (scrollAnimation === GALLERY_CONSTS.scrollAnimations.GRAYSCALE) {
      scrollAnimationCss +=
        createScrollSelectors(
          animationPreparationPadding,
          ' .gallery-item-wrapper'
        ) +
        `{filter: grayscale(100%); transition: filter 1.${
          200 + _randomDuration
        }s ease-in !important;}`;
      scrollAnimationCss +=
        createScrollSelectors(
          animationActivePadding,
          ' .gallery-item-wrapper'
        ) + `{filter: grayscale(0) !important;}`;
    }

    if (scrollAnimation === GALLERY_CONSTS.scrollAnimations.SLIDE_UP) {
      const axis = oneRow ? 'X' : 'Y';
      const direction = isRTL ? '-' : '';
      scrollAnimationCss +=
        createScrollSelectors(animationPreparationPadding, '') +
        `{transform: translate${axis}(${direction}100px); transition: transform 0.8s cubic-bezier(.13,.78,.53,.92) !important;}`;
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
          ' .gallery-item-wrapper'
        ) +
        `{transform: scale(1.1); transition: transform 1.2s cubic-bezier(.13,.78,.53,.92) ${_randomDelay}ms !important;}`;
      scrollAnimationCss +=
        createScrollSelectors(
          animationActivePadding,
          ' .gallery-item-wrapper'
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
          ' .gallery-item-wrapper'
        ) +
        `{filter: opacity(0); transition: filter 0.${
          600 + _randomDuration
        }s ease-in !important;}`;
      scrollAnimationCss +=
        createScrollSelectors(
          animationActivePadding,
          ' .gallery-item-wrapper'
        ) + `{filter: opacity(1) !important;}`;
    }

    return scrollAnimationCss;
  }

  shouldCalcScrollCss({ type }) {
    if (type === 'video' || type === 'text') {
      return false;
    }
    return true;
  }

  calcScrollCssForItem({ domId, item, container, styleParams }) {
    const { idx } = item;
    let scrollCss = '';
    const createScrollSelectors = this.createScrollSelectorsFunction({
      domId,
      item,
      container, 
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

  calcScrollCss({ domId, items, container, styleParams }) {
    this.domId = domId;
    const scrollAnimation = styleParams.scrollAnimation;
    if (!(items && items.length)) {
      return [];
    }
    if (
      !scrollAnimation ||
      scrollAnimation === GALLERY_CONSTS.scrollAnimations.NO_EFFECT
    ) {
      return [];
    }

    const res = items.map((item) =>
      this.calcScrollCssForItem({ item, container, styleParams })
    );
    return res;
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
