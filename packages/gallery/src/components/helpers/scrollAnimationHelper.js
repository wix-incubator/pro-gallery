/* eslint-disable prettier/prettier */
/* eslint-disable no-redeclare */
/* eslint-disable no-case-declarations */
/* eslint-disable no-unused-vars */
import utils from "../../common/utils";
import { window } from "pro-gallery-lib";
import { GALLERY_CONSTS } from "pro-gallery-lib";
import { createScrollAnimations } from "./cssAnimationsHelper";

const isHorizontalScroll = (options) => options.scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL;
const getContainerSize = (options, container) =>
  isHorizontalScroll(options)
    ? Math.min(container.width, window.innerWidth)
    : Math.min(container.height, window.innerHeight) + container.scrollBase;

class ScrollAnimationHelper {
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

  createScrollSelectorsFunction({ itemId, item, container, options, direction, animationDistanceInPx }) {
    const imageStart = Math.round(isHorizontalScroll(options) ? item.offset.left : item.offset.top);
    const imageSize = Math.round(isHorizontalScroll(options) ? item.width : item.height);

    const containerSize = getContainerSize(options, container);

    return ({ position, fromPosition, toPosition, selectorSuffix, animationCss }) => {
      // fromPosition:  the distance from the bottom of the screen to start the animation
      // toPosition:  the distance from the bottom of the screen to end the animation

      const createAnimationCss = (step, isExit) => {
        const cssObject = animationCss(step, isExit);
        const res = Object.entries(cssObject)
          .map(([prop, val]) => `${prop}: ${val};`)
          .join("\n");
        return res;
      };
      const iterations = Math.max(10, Math.round(animationDistanceInPx / 20));
      this.transitionDuration = 400;

      const createAnimationStep = (fromPosition, toPosition, isExit) => {
        if (toPosition < 0) return [];
        fromPosition = Math.max(0, fromPosition);
        toPosition = Math.round(toPosition);
        fromPosition = Math.round(fromPosition);
        const axis = isHorizontalScroll(options) ? "x" : "y";

        const step = (position - fromPosition) / (toPosition - fromPosition);


        return createAnimationCss(step, isExit);
      };

      const createAnimationRange = (fromPosition, toPosition, isExit) => {
        if (toPosition < 0 || toPosition <= fromPosition) {
          return '';
        }
        return createAnimationStep(fromPosition, toPosition, isExit);
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
          addScrollClasses(createAnimationRange(entryAnimationStart, entryAnimationEnd));
        } else if (direction === "OUT") {
          addScrollClasses(createAnimationRange(exitAnimationStart, exitAnimationEnd, true));
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

  createScrollAnimationsIfNeeded({ position, idx, item, container, options }) {
    const { isRTL, scrollAnimation, exitScrollAnimation, oneColorAnimationColor } = options;

    const itemId = this.getSellectorDomId(item);

    const containerSize = getContainerSize(options, container);
    const animationDistanceInPx = Math.round(containerSize * (options.scrollAnimationDistance / 100));

    const createEntryScrollSelectors = this.createScrollSelectorsFunction({
      itemId,
      item,
      container,
      options,
      direction: "IN",
      animationDistanceInPx,
    });
    // const createExitScrollSelectors = this.createScrollSelectorsFunction({
    //   itemId,
    //   item,
    //   container,
    //   options,
    //   animationDistanceInPx,
    //   direction: "OUT",
    // });

    return (
      createScrollAnimations({
        createScrollSelectors: createEntryScrollSelectors,
        position, 
        itemId,
        item,
        options,
        containerSize: getContainerSize(options, container),
        scrollAnimation: options.scrollAnimation,
        isHorizontalScroll: isHorizontalScroll(options),
        animationDistanceInPx,
      })
      //  +
      // " \n" +
      // createScrollAnimations({
      //   createScrollSelectors: createExitScrollSelectors,
      //   itemId,
      //   item,
      //   options,
      //   containerSize: getContainerSize(options, container),
      //   scrollAnimation: options.exitScrollAnimation,
      //   isHorizontalScroll: isHorizontalScroll(options),
      //   animationDistanceInPx,
      // })
    );
  }

  calcScrollCssForItem({ position, item, container, options }) {
    const { idx } = item;
    let scrollCss = "";
    scrollCss += this.createScrollAnimationsIfNeeded({
      position, 
      idx,
      item,
      container,
      options,
    });

    this.scrollCss[idx] = scrollCss || this.scrollCss[idx];

    return this.scrollCss[idx];
  }

  calcScrollAnimation({top}) {
    console.log('scrollAnimationHelper calcScrollAnimation', { top });
    debugger;
    const { galleryId, items, container, options } = this;
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

    const res = items.map((item) => this.calcScrollCssForItem({ position: top, item, container, options }));
    console.log('scrollAnimationHelper', {scrollAnimation: res})
    return res;
  }

  init({ galleryId, items, container, options }) {
    // console.log('scrollAnimationHelper init', { galleryId, items, container, options })
      this.galleryId = galleryId;
      this.items = items;
      this.container = container;
      this.options = options;
  }
}

export const scrollAnimationHelper = new ScrollAnimationHelper();
