/* eslint-disable prettier/prettier */
/* eslint-disable no-redeclare */
/* eslint-disable no-case-declarations */
/* eslint-disable no-unused-vars */
import utils from "../../common/utils";
import { window } from "pro-gallery-lib";
import { GALLERY_CONSTS } from "pro-gallery-lib";
import { createScrollAnimations } from "./cssAnimationsHelper";

const isHorizontalScroll = (options) => options.scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL;

class CssScrollHelper {
  constructor() {
    this.galleryId = "???";
    this.pgScrollSteps = [];
    for (let i = 1; i < 50000; i *= 2) {
      this.pgScrollSteps.push(i);
    }
    this.pgScrollSteps.reverse();
    this.pgScrollClassName = "pgs";

    this.scrollCss = [];
    this.scrollCssProps = [];

    this.transitionDuration = 250;
    this.animationPadding = 1000;

    try {
      this.settings = JSON.parse(localStorage.gallerySettings);
    } catch (e) {
      this.settings = {};
    }
  }

  getSellectorDomId({ id, idx }) {
    const shortId = String(id).replace(/[\W]+/g, "");
    return `pgi${shortId}_${idx}`;
  }

  buildScrollClassName(idx, val, itemId, axis) {
    const shortId = String(this.galleryId).replace(/[\W]+/g, "").slice(-4);
    return `${this.pgScrollClassName}${shortId}-${axis}_${val}-${this.pgScrollSteps[idx] + Number(val)}`;
  }

  isScrollingClassName(axis, isScrolling) {
    return `${this.pgScrollClassName}-${axis}-${isScrolling ? "scrolling" : "paused"}`;
  }

  calcScrollClasses(itemId, scrollTop, scrollLeft, isScrollingVertically, isScrollingHorizontally) {
    //used by the scroll indicator
    return (
      `${this.isScrollingClassName("y", isScrollingVertically)} ` +
      `${this.isScrollingClassName("x", isScrollingHorizontally)} ` +
      `${this.pgScrollClassName}-y-${scrollTop} ` +
      `${this.pgScrollClassName}-x-${scrollLeft} ` +
      this.pgScrollSteps
        .map((step, idx) => this.buildScrollClassName(idx, Math.floor(scrollTop / step) * step, itemId, "y"))
        .join(" ") +
      " " +
      this.pgScrollSteps
        .map((step, idx) => this.buildScrollClassName(idx, Math.floor(scrollLeft / step) * step, itemId, "x"))
        .join(" ")
    );
  }

  createScrollSelectorsFunction({ itemId, item, container, options, direction }) {
    const imageStart = Math.round(isHorizontalScroll(options) ? item.offset.left : item.offset.top);
    const imageSize = Math.round(isHorizontalScroll(options) ? item.width : item.height);

    const containerSize = isHorizontalScroll(options)
      ? Math.min(container.width, window.innerWidth)
      : Math.min(container.height, window.innerHeight) + container.scrollBase;

    return ({ fromPosition, toPosition, selectorSuffix, animationCss }) => {
      // fromPosition:  the distance from the bottom of the screen to start the animation
      // toPosition:  the distance from the bottom of the screen to end the animation

      const createAnimationCss = (step, isExit) => {
        const cssObject = animationCss(step, isExit);
        const res = Object.entries(cssObject)
          .map(([prop, val]) => `${prop}: ${val};`)
          .join("\n");
        return res;
      };
      const iterations = Math.max(10, Math.round(options.scrollAnimationDistance / 10));
      this.transitionDuration = 400;

      const createAnimationStep = (idx, isExit) => {
        if (isExit) {
          idx = iterations - idx;
        }
        let step = idx / iterations;
        return createAnimationCss(step, isExit);
      };

      const createSelectorsRange = (fromPosition, toPosition) => {
        if (toPosition < 0) return [];
        fromPosition = Math.max(0, fromPosition);
        let scrollClasses = [];
        toPosition = Math.round(toPosition);
        fromPosition = Math.round(fromPosition);
        const axis = isHorizontalScroll(options) ? "x" : "y";

        while (fromPosition < toPosition) {
          const largestDividerIdx = this.pgScrollSteps.findIndex(
            (step) => fromPosition % step === 0 && fromPosition + step <= toPosition
          ); //eslint-disable-line
          scrollClasses.push(
            (options.scrollAnimationReset ? `.${this.isScrollingClassName(axis, true)}` : "") +
              `.${this.buildScrollClassName(largestDividerIdx, fromPosition, itemId, axis)} ~ div ${selectorSuffix}`
          );
          fromPosition += this.pgScrollSteps[largestDividerIdx];
        }
        return scrollClasses;
      };

      const createAnimationRange = (fromPosition, toPosition, isExit) => {
        if (toPosition < 0 || toPosition <= fromPosition) {
          return {};
        }
        return Array.from({ length: iterations })
          .map((i, idx) => fromPosition + (idx * (toPosition - fromPosition)) / iterations)
          .map((i, idx) => ({
            [createAnimationStep(idx, isExit)]: createSelectorsRange(i, i + (toPosition - fromPosition) / iterations),
          }))
          .reduce((obj, item) => {
            const itemKey = Object.keys(item)[0];
            return obj[itemKey]
              ? {
                  ...obj,
                  [itemKey]: [...obj[itemKey], ...item[itemKey]],
                }
              : { ...obj, ...item };
          }, {});
      };

      const createScrollClasses = () => {
        const transitionCss = `transition: all ${this.transitionDuration}ms ease !important`;

        const animationRange = Math.round(toPosition - fromPosition);

        const entryAnimationStart = Math.round(imageStart - containerSize + fromPosition);
        const entryAnimationEnd = Math.round(entryAnimationStart + animationRange);

        const exitAnimationStart = Math.round(imageStart + imageSize - toPosition);
        const exitAnimationEnd = Math.round(exitAnimationStart + animationRange);

        const scrollClasses = {};

        const addScrollClass = (key, val) => {
          scrollClasses[key] = [...(scrollClasses[key] || []), ...val];
        };

        const addScrollClasses = (classesObj) => {
          for (let [key, val] of Object.entries(classesObj)) {
            addScrollClass(key, val);
          }
        };

        //first batch: animation start value until the range start:
        addScrollClass(`${transitionCss}; ${createAnimationStep(0, true)}`, [selectorSuffix]);

        if (direction === "IN") {
          addScrollClass(
            createAnimationStep(0) + " transtion: none !important;",
            createSelectorsRange(entryAnimationStart - this.animationPadding, entryAnimationStart)
          );
          addScrollClasses(createAnimationRange(entryAnimationStart, entryAnimationEnd));
          addScrollClass(
            createAnimationStep(iterations) + " transtion: none !important;",
            createSelectorsRange(entryAnimationEnd, entryAnimationEnd + this.animationPadding)
          );
        } else if (direction === "OUT") {
          addScrollClass(
            createAnimationStep(iterations) + " transtion: none !important;",
            createSelectorsRange(exitAnimationStart - this.animationPadding, exitAnimationStart)
          );
          addScrollClasses(createAnimationRange(exitAnimationStart, exitAnimationEnd, true));
          addScrollClass(
            createAnimationStep(0) + " transtion: none !important;",
            createSelectorsRange(exitAnimationEnd, exitAnimationEnd + this.animationPadding)
          );
        }

        const fullCss = Object.entries(scrollClasses)
          .map(([css, selectors]) => (selectors.length > 0 ? `${selectors.join(",\n")} \n{${css}}\n` : false))
          .filter(Boolean)
          .join("\n");

        return fullCss;
      };

      return createScrollClasses();
    };
  }

  createScrollAnimationsIfNeeded({ idx, item, container, options }) {
    const { isRTL, scrollAnimation, exitScrollAnimation, oneColorAnimationColor } = options;

    const itemId = this.getSellectorDomId(item);
    const createEntryScrollSelectors = this.createScrollSelectorsFunction({
      itemId,
      item,
      container,
      options,
      direction: "IN",
    });
    const createExitScrollSelectors = this.createScrollSelectorsFunction({
      itemId,
      item,
      container,
      options,
      direction: "OUT",
    });

    return (
      createScrollAnimations({
        createScrollSelectors: createEntryScrollSelectors,
        itemId,
        item,
        options,
        scrollAnimation: options.scrollAnimation,
        isHorizontalScroll: isHorizontalScroll(options),
      }) +
      " \n" +
      createScrollAnimations({
        createScrollSelectors: createExitScrollSelectors,
        itemId,
        item,
        options,
        scrollAnimation: options.exitScrollAnimation,
        isHorizontalScroll: isHorizontalScroll(options),
      })
    );
  }

  calcScrollCssForItem({ item, container, options }) {
    const { idx } = item;
    let scrollCss = "";
    scrollCss += this.createScrollAnimationsIfNeeded({
      idx,
      item,
      container,
      options,
    });

    this.scrollCss[idx] = scrollCss || this.scrollCss[idx];

    return this.scrollCss[idx];
  }

  calcScrollCss({ galleryId, items, container, options }) {
    this.galleryId = galleryId;
    const { exitScrollAnimation, scrollAnimation } = options;
    if (!(items && items.length)) {
      return [];
    }
    if (
      (!scrollAnimation || scrollAnimation === GALLERY_CONSTS.scrollAnimations.NO_EFFECT) &&
      (!exitScrollAnimation || exitScrollAnimation === GALLERY_CONSTS.scrollAnimations.NO_EFFECT)
    ) {
      return [];
    }

    const res = items.map((item) => this.calcScrollCssForItem({ item, container, options }));
    return res;
  }
}

export const cssScrollHelper = new CssScrollHelper();
