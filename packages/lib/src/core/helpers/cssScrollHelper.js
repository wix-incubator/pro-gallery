/* eslint-disable prettier/prettier */
/* eslint-disable no-redeclare */
/* eslint-disable no-case-declarations */
/* eslint-disable no-unused-vars */
import utils from '../../common/utils';
import window from '../../common/window/windowWrapper';
import GALLERY_CONSTS from '../../common/constants';

class CssScrollHelper {
  constructor() {
    this.pgScrollSteps = [];
    for (let i = 1; i < 50000; i *= 2) {
      this.pgScrollSteps.push(i);
    }
    this.pgScrollSteps.reverse();
    this.pgScrollClassName = 'pgscl';

    this.scrollCss = [];
    this.scrollCssProps = [];

    try {
      this.settings = JSON.parse(localStorage.gallerySettings);
    } catch (e) {
      this.settings = {};
    }
  }

  getSellectorDomId({ id, idx }) {
    const shortId = String(id).replace(/[\W]+/g, '');
    return `pgi${shortId}_${idx}`;
  }

  buildScrollClassName(idx, val, domId) {
    const shortId = String(domId || this.domId)
      .replace(/[\W]+/g, '')
      .slice(-8);
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
    const imageStart = Math.round(
      styleParams.oneRow ? item.offset.left : item.offset.top
    );
    const imageSize = Math.round(styleParams.oneRow ? item.width : item.height);

    const containerSize = styleParams.oneRow
      ? Math.min(container.width, window.innerWidth)
      : Math.min(container.height, window.innerHeight) + container.scrollBase;

    return (range, suffix, animationCss, animation, exitAnimation) => {
      const r = Math.round(Math.random() * 20);
      range[0] += r;
      range[1] += r;

      const [start, stop] = range;
      // start:  the distance from the bottom of the screen to start the animation
      // stop:  the distance from the bottom of the screen to end the animation

      const [enterFrom, enterTo] = animation;
      const [exitFrom, exitTo] = exitAnimation || animation;
      // from: the animation start value
      // to: the animation end value
      const iterations = 10;
      const transitionDuration = 400;

      const transitionCss = `transition: ${animationCss.split(':')[0]} ${transitionDuration}ms ease !important`;

      const animationPadding = 1000;
      const animationDuration = Math.round(stop - start);

      const entryAnimationStart = Math.round(imageStart - containerSize + start);
      const entryAnimationEnd = Math.round(entryAnimationStart + animationDuration);

      const exitAnimationStart = Math.round(imageStart + imageSize - stop);
      const exitAnimationEnd = Math.round(exitAnimationStart + animationDuration);

      const createAnimationStep = (idx, isExit) => {
        const [to, from] = isExit ? [exitTo, exitFrom] : [enterTo, enterFrom];
        if (isExit) {
          idx = iterations - idx;
        }
        const ease = (t) =>
          t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
        let step = Math.round((to - from) * ease(idx / iterations) + from);
        item.idx === 0 &&
          console.log('SCROLL CSS createAnimationStep', {
            idx,
            step,
            res: animationCss.replace('#', step),
          });
        return animationCss.replace('#', step);
      };

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
      };

      const createAnimationRange = (start, end, isExit) => {
        if (end < 0 || end <= start) {
          return {}
        }
        return Array.from({ length: iterations })
          .map((i, idx) => start + (idx * (end - start)) / iterations)
          .map((i, idx) => ({
            [createAnimationStep(idx, isExit)]: createSelectorsRange(
              i,
              i + (end - start) / iterations
            ),
          }))
          .reduce((obj, item) => ({ ...obj, ...item }), {});
      };

      const scrollClasses = {};
      const scrollClassesLog = {};
      const addScrollClass = (key, val) => {
        scrollClasses[key] = [...(scrollClasses[key] || []), ...val];
        scrollClassesLog[key] = scrollClasses[key]
          .map((val) => (String(val).match(/\d+-\d+/) || [])[0])
          .reduce((str, range) => {
            if (!range) return str;
            const [from, to] = range.split('-');
            const lastRange = str[str.length - 1];
            const lastTo = lastRange && lastRange.split('-').splice(-1)[0];
            if (from === lastTo) {
              return [
                ...str.slice(0, str.length - 1),
                lastRange.replace(lastTo, to),
              ];
            } else {
              return [...str, `${from}-${to}`];
            }
          }, [])
          .join(', ');
      };
      const addScrollClasses = (classesObj) => {
        for (let [key, val] of Object.entries(classesObj)) {
          addScrollClass(key, val);
        }
      };

      //first batch: animation start value until the range start:
      addScrollClass(
        `${transitionCss}; ${animationCss.replace('#', enterTo)}`,
        [suffix]
      );

      if (styleParams.animationDirection === 'BOTH') {
        addScrollClass(
          createAnimationStep(0) + 'transtion: none !important;',
          createSelectorsRange(entryAnimationStart - animationPadding, entryAnimationStart)
        );
        addScrollClasses(
          createAnimationRange(entryAnimationStart, entryAnimationEnd)
        );
        addScrollClass(
          createAnimationStep(iterations),
          createSelectorsRange(entryAnimationEnd, exitAnimationStart)
        );
        addScrollClasses(
          createAnimationRange(exitAnimationStart, exitAnimationEnd, true)
        );
        addScrollClass(
          createAnimationStep(iterations, true) + 'transtion: none !important;',
          createSelectorsRange(exitAnimationEnd, exitAnimationEnd + animationPadding )
        );

      } else if (styleParams.animationDirection === 'IN') {
        addScrollClass(
          createAnimationStep(0) + 'transtion: none !important;',
          createSelectorsRange(entryAnimationStart - animationPadding, entryAnimationStart)
        );
        addScrollClasses(
          createAnimationRange(entryAnimationStart, entryAnimationEnd)
        );
        addScrollClass(
          createAnimationStep(iterations) + 'transtion: none !important;',
          createSelectorsRange(entryAnimationEnd, entryAnimationEnd + animationPadding)
        );

      } else if (styleParams.animationDirection === 'OUT') {
        addScrollClass(
          createAnimationStep(iterations) + 'transtion: none !important;',
          createSelectorsRange(exitAnimationStart - animationPadding, exitAnimationStart)
        );
        addScrollClasses(
          createAnimationRange(exitAnimationStart, exitAnimationEnd, true)
        );
        addScrollClass(
          createAnimationStep(iterations, true) + 'transtion: none !important;',
          createSelectorsRange(exitAnimationEnd, exitAnimationEnd + animationPadding)
        );
      }

      const fullCss = Object.entries(scrollClasses)
        .map(([css, selectors]) => `${selectors.join(', ')} {${css}}`)
        .join(' ');

      console.log('SCROLL CLASSES #' + item.idx, scrollClassesLog);

      return fullCss;
    };
  }

  createScrollAnimationsIfNeeded({
    idx,
    item,
    container,
    styleParams,
  }) {
    const {
      isRTL,
      oneRow,
      scrollAnimation,
      oneColorAnimationColor,
    } = styleParams;

    if (
      !scrollAnimation ||
      scrollAnimation === GALLERY_CONSTS.scrollAnimations.NO_EFFECT
    ) {
      return '';
    }

    const {
      NO_EFFECT,
      FADE_IN,
      GRAYSCALE,
      SLIDE_UP,
      EXPAND,
      SHRINK,
      ZOOM_OUT,
      ONE_COLOR,
      MAIN_COLOR,
      BLUR,
    } = GALLERY_CONSTS.scrollAnimations;

    const randomRange = this.settings.animation_random;
    const domId = this.getSellectorDomId(item);
    const createScrollSelectors = this.createScrollSelectorsFunction({
      domId,
      item,
      container,
      styleParams,
    });

    switch (scrollAnimation) {
      case FADE_IN:
        return createScrollSelectors(
          [0,100],
          `#${domId} .gallery-item-wrapper`,
          'opacity: #;',
          [0, 1]
        );
      case SLIDE_UP:
        const rtlFix = oneRow && isRTL ? -1 : 1;
        const slideGap = rtlFix * 50;
        if (oneRow) {
          return (
            createScrollSelectors(
              [0,80],
              `#${domId} > div`,
              `transform: translateX(#px);`,
              [slideGap, 0],
              [-1 * slideGap, 0]
            ) + ` #${domId} {overflow: visible !important;}`
          );
        } else {
          return createScrollSelectors(
            [0,50],
            `#${domId}`,
            `transform: translateY(#px);`,
            [slideGap, 0],
            [-1 * slideGap, 0]
          );
        }
      case GRAYSCALE:
        return createScrollSelectors(
          [0,200],
          `#${domId} .gallery-item-content`,
          'filter: grayscale(#%);',
          [100, 0]
        );
      case EXPAND:
        return createScrollSelectors(
          [0,100],
          `#${domId} .gallery-item-wrapper`,
          'transform: scale(#);',
          [0.95, 1]
        );
      case ZOOM_OUT:
        return createScrollSelectors(
          [0,100],
          `#${domId} .gallery-item-wrapper`,
          'transform: scale(#);',
          [1.15, 1]
        );
      case SHRINK:
        return createScrollSelectors(
          [0,100],
          `#${domId}`,
          'transform: scale(#);',
          [1.02, 1]
        );
      case ONE_COLOR:
        const bgColor =
          oneColorAnimationColor?.value ||
          oneColorAnimationColor ||
          'transparent';
        return (
          createScrollSelectors(
            [0,100],
            `#${domId} .gallery-item-wrapper>div`,
            `opacity :#;`,
            [0, 1]
          ) +
          ` #${domId} .gallery-item-wrapper {background-color: ${bgColor} !important;}`
        );
      case BLUR:
        return createScrollSelectors(
          [0,100],
          `#${domId} .gallery-item-content`,
          'filter: blur(#px);',
          [30, 0]
        );
      case MAIN_COLOR:
        const pixel = item.createUrl('pixel', 'img');
        return createScrollSelectors(
          [0,100],
          `#${domId} .gallery-item-wrapper>div`,
          `opacity :#;`,
          [0, 1]
        ) +
        ` #${domId} .gallery-item-wrapper {background-image: url(${pixel}) !important;}`
    }
  }

  calcScrollCssForItem({ domId, item, container, styleParams }) {
    const { idx } = item;
    let scrollCss = '';
    scrollCss += this.createScrollAnimationsIfNeeded({
      idx,
      item,
      container,
      styleParams,
    });

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
