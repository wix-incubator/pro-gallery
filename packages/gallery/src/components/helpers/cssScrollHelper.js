/* eslint-disable prettier/prettier */
/* eslint-disable no-redeclare */
/* eslint-disable no-case-declarations */
/* eslint-disable no-unused-vars */
import utils from '../../common/utils';
import { window } from 'pro-gallery-lib';
import { GALLERY_CONSTS } from 'pro-gallery-lib';
import { createScrollAnimations } from './cssAnimationsHelper';

class CssScrollHelper {
  constructor() {
    this.galleryId = '???';
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

  buildScrollClassName(idx, val, itemId) {
    const shortId = String(this.galleryId).replace(/[\W]+/g, '').slice(-8);
    return `${this.pgScrollClassName}_${shortId}_${val}-${
      this.pgScrollSteps[idx] + Number(val)
    }`;
  }

  calcScrollClasses(scrollTop, itemId) {
    //used by the scroll indicator
    return (
      `${this.pgScrollClassName}-${scrollTop} ` +
      this.pgScrollSteps
        .map((step, idx) =>
          this.buildScrollClassName(
            idx,
            Math.floor(scrollTop / step) * step,
            itemId
          )
        )
        .join(' ')
    );
  }

  createScrollSelectorsFunction({ itemId, item, container, options }) {
    const imageStart = Math.round(
      options.oneRow ? item.offset.left : item.offset.top
    );
    const imageSize = Math.round(options.oneRow ? item.width : item.height);

    const containerSize = options.oneRow
      ? Math.min(container.width, window.innerWidth)
      : Math.min(container.height, window.innerHeight) + container.scrollBase;

    // return (range, suffix, animationCss, entryAnimationValues, exitAnimationValues) => {
    return ({
      fromPosition,
      toPosition,
      fromValue,
      toValue,
      selectorSuffix,
      animationCss,
      reverseOnExit,
    }) => {
      // return (range, suffix, animationCss, entryAnimationValues, exitAnimationValues) => {

      // fromPosition:  the distance from the bottom of the screen to start the animation
      // toPosition:  the distance from the bottom of the screen to end the animation
      // fromValue: the animation start value
      // toValue: the animation end value

      const exitFix = reverseOnExit ? -1 : 1;
      const [enterFrom, enterTo] = [fromValue, toValue];
      const [exitFrom, exitTo] = [toValue, fromValue * exitFix];

      const iterations = 10;
      const transitionDuration = 400;
      const animationPadding = 1000;

      const transitionCss = `transition: ${
        animationCss.split(':')[0]
      } ${transitionDuration}ms ease !important`;

      const animationDuration = Math.round(toPosition - fromPosition);

      const entryAnimationStart = Math.round(
        imageStart - containerSize + fromPosition
      );
      const entryAnimationEnd = Math.round(
        entryAnimationStart + animationDuration
      );

      const exitAnimationStart = Math.round(
        imageStart + imageSize - toPosition
      );
      const exitAnimationEnd = Math.round(
        exitAnimationStart + animationDuration
      );

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
          const largestDividerIdx = this.pgScrollSteps.findIndex(
            (step) => from % step === 0 && from + step <= to
          ); //eslint-disable-line
          scrollClasses.push(
            `.${this.buildScrollClassName(
              largestDividerIdx,
              from,
              itemId
            )} ~ div ${selectorSuffix}`
          );
          from += this.pgScrollSteps[largestDividerIdx];
          // console.count('pgScroll class created');
        }
        return scrollClasses;
      };

      const createAnimationRange = (start, end, isExit) => {
        if (end < 0 || end <= start) {
          return {};
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
        [selectorSuffix]
      );

      if (options.animationDirection === 'BOTH') {
        addScrollClass(
          createAnimationStep(0) + 'transtion: none !important;',
          createSelectorsRange(
            entryAnimationStart - animationPadding,
            entryAnimationStart
          )
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
          createSelectorsRange(
            exitAnimationEnd,
            exitAnimationEnd + animationPadding
          )
        );
      } else if (options.animationDirection === 'IN') {
        addScrollClass(
          createAnimationStep(0) + 'transtion: none !important;',
          createSelectorsRange(
            entryAnimationStart - animationPadding,
            entryAnimationStart
          )
        );
        addScrollClasses(
          createAnimationRange(entryAnimationStart, entryAnimationEnd)
        );
        addScrollClass(
          createAnimationStep(iterations) + 'transtion: none !important;',
          createSelectorsRange(
            entryAnimationEnd,
            entryAnimationEnd + animationPadding
          )
        );
      } else if (options.animationDirection === 'OUT') {
        addScrollClass(
          createAnimationStep(iterations) + 'transtion: none !important;',
          createSelectorsRange(
            exitAnimationStart - animationPadding,
            exitAnimationStart
          )
        );
        addScrollClasses(
          createAnimationRange(exitAnimationStart, exitAnimationEnd, true)
        );
        addScrollClass(
          createAnimationStep(iterations, true) + 'transtion: none !important;',
          createSelectorsRange(
            exitAnimationEnd,
            exitAnimationEnd + animationPadding
          )
        );
      }

      const fullCss = Object.entries(scrollClasses)
        .map(([css, selectors]) => `${selectors.join(', ')} {${css}}`)
        .join(' ');

      console.log('SCROLL CLASSES #' + item.idx, scrollClassesLog);

      return fullCss;
    };
  }

  createScrollAnimationsIfNeeded({ idx, item, container, options }) {
    const { isRTL, oneRow, scrollAnimation, oneColorAnimationColor } = options;

    if (
      !scrollAnimation ||
      scrollAnimation === GALLERY_CONSTS.scrollAnimations.NO_EFFECT
    ) {
      return '';
    }

    const itemId = this.getSellectorDomId(item);
    const createScrollSelectors = this.createScrollSelectorsFunction({
      itemId,
      item,
      container,
      options,
    });

    return createScrollAnimations({
      createScrollSelectors,
      itemId,
      idx,
      item,
      container,
      options,
    });
  }

  calcScrollCssForItem({ item, container, options }) {
    const { idx } = item;
    let scrollCss = '';
    scrollCss += this.createScrollAnimationsIfNeeded({
      idx,
      item,
      container,
      options,
    });

    this.scrollCss[idx] = scrollCss || this.scrollCss[idx];

    return this.scrollCss[idx];
    // console.count('pgScroll item created');
  }

  calcScrollCss({ galleryId, items, container, options }) {
    this.galleryId = galleryId;
    const scrollAnimation = options.scrollAnimation;
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
      this.calcScrollCssForItem({ item, container, options })
    );
    return res;
  }
}

export const cssScrollHelper = new CssScrollHelper();
