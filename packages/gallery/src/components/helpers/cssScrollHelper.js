/* eslint-disable prettier/prettier */
/* eslint-disable no-redeclare */
/* eslint-disable no-case-declarations */
/* eslint-disable no-unused-vars */
import utils from "../../common/utils";
import { window } from "pro-gallery-lib";
import { GALLERY_CONSTS } from "pro-gallery-lib";
import { createScrollAnimations } from "./cssAnimationsHelper";
import { cssEasing } from "../../common/utils/easing";

const advancedScrollAnimation = [
  {
    type: "SKEW",
    fromValue: 10,
    toValue: 0,
    fromAnchor: "BOTTOM",
    toAnchor: "BOTTOM",
    fromPosition: 100,
    toPosition: 200,
    iterations: 5,
    transitionDuration: 400,
    direction: "LEFT",
    hinge: "center",
    reset: false,
    ease: true,
  },
  {
    type: "FADE",
    fromValue: 0,
    toValue: 1,
    fromAnchor: "BOTTOM",
    toAnchor: "BOTTOM",
    fromPosition: 0,
    toPosition: 100,
    iterations: 1,
    transitionDuration: 4000,
    reset: true,
  },
];

const isHorizontalScroll = (options) =>
  options.layoutParams_structure_scrollDirection === GALLERY_CONSTS.layoutParams_structure_scrollDirection.HORIZONTAL;
const getContainerSize = (options, container) =>
  isHorizontalScroll(options)
    ? Math.min(container.width, window.innerWidth)
    : Math.min(container.height, window.innerHeight) + container.scrollBase;

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
    this.createScrollSelectors = {};

    this.animationPadding = 5000;

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

    const containerSize = getContainerSize(options, container);

    return ({ animationParams, selectorSuffix, animationCss }) => {
      // fromPosition:  the distance from the bottom of the screen to start the animation
      // toPosition:  the distance from the bottom of the screen to end the animation

      const createAnimationCss = (step) => {
        const cssObject = animationCss(step);
        const res = Object.entries(cssObject)
          .map(([prop, val]) => `${prop}: ${val};`)
          .join("\n");
        return res;
      };
      const {
        transitionDuration = 400,
        iterations = 10,
        fromPosition = 0,
        toPosition = 100,
        fromAnchor = "BOTTOM",
        toAnchor = "BOTTOM",
        ease = 'linear',
      } = animationParams;

      const createAnimationStep = (idx) => {
        let step = idx / iterations;
        return createAnimationCss(step);
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
            (animationParams.reset ? `.${this.isScrollingClassName(axis, true)}` : "") +
              `.${this.buildScrollClassName(largestDividerIdx, fromPosition, itemId, axis)} ~ div ${selectorSuffix}`
          );
          fromPosition += this.pgScrollSteps[largestDividerIdx];
        }
        return scrollClasses;
      };

      const createAnimationRange = (fromPosition, toPosition) => {
        if (toPosition < 0 || toPosition <= fromPosition) {
          return {};
        }
        return Array.from({ length: iterations })
          .map((i, idx) => fromPosition + (idx * (toPosition - fromPosition)) / iterations)
          .map((i, idx) => ({
              [createAnimationStep(idx)]: createSelectorsRange(i, i + (toPosition - fromPosition) / iterations),
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
        const animationRange = Math.round(toPosition - fromPosition);

        const bottomAnimationStart = Math.round(imageStart - containerSize + fromPosition);
        const bottomAnimationEnd = Math.round(imageStart - containerSize + toPosition);

        const topAnimationStart = Math.round(imageStart + imageSize - fromPosition);
        const topAnimationEnd = Math.round(imageStart + imageSize - toPosition);

        const animationStart = fromAnchor === "BOTTOM" ? bottomAnimationStart : topAnimationStart;
        const animationEnd = toAnchor === "BOTTOM" ? bottomAnimationEnd : topAnimationEnd;

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
        const firstAnimationStep = createAnimationStep(0, true);
        const animatedProperties = 'filter, transform, opacity, border-radius'; //firstAnimationStep.split(":")[0];
        const cssEase = (iterations > 1 || !ease) ? 'linear' : cssEasing[ease] || 'linear';
        const transitionCss = `transition: ${animatedProperties} ${transitionDuration}ms ${cssEase} !important`;

        addScrollClass(`${transitionCss}; ${createAnimationStep(0, true)}`, [selectorSuffix]);
        addScrollClass(
          createAnimationStep(0) + " transtion: none !important;",
          createSelectorsRange(animationStart - this.animationPadding, animationStart)
        );
        addScrollClasses(createAnimationRange(animationStart, animationEnd, false));
        addScrollClass(
          createAnimationStep(iterations) + " transtion: none !important;",
          createSelectorsRange(animationEnd, animationEnd + this.animationPadding)
        );

        const fullCss = Object.entries(scrollClasses)
          .map(([css, selectors]) => (selectors.length > 0 ? `${selectors.join(",\n")} \n{${css}}\n` : false))
          .filter(Boolean)
          .join("\n");

        return fullCss;
      };

      return createScrollClasses();
    };
  }

  createScrollAnimationsIfNeeded({ idx, item, container, options, animation }) {
    const { isRTL, oneColorAnimationColor } = options;
    const animationParams = animation; //TODO: replace with new option
    const { iterations } = animationParams;
    const itemId = this.getSellectorDomId(item);
    const containerSize = getContainerSize(options, container);

    this.createScrollSelectors[itemId] ||= this.createScrollSelectorsFunction({
      itemId,
      item,
      container,
      options,
    });

    return createScrollAnimations({
      createScrollSelectors: this.createScrollSelectors[itemId],
      itemId,
      item,
      options,
      iterations,
      containerSize,
      animationParams,
      isHorizontalScroll: isHorizontalScroll(options),
    });
  }

  calcScrollCssForItem({ item, container, options }) {
    const { idx } = item;
    let scrollCss = "";
    if (this.scrollCss[idx]) {
      return this.scrollCss[idx];
    }
    try {
      for (const animation of options.behaviourParams_gallery_advancedScrollAnimation) {
        scrollCss += this.createScrollAnimationsIfNeeded({
          idx,
          item,
          container,
          options,
          animation,
        });
      }
      this.scrollCss[idx] = scrollCss || this.scrollCss[idx];
    } catch (e) {
      idx === 1 && console.error("failed to calc scroll CSS for item # " + idx, e);
    }
    return this.scrollCss[idx];
  }

  calcScrollCss({ galleryId, items, container, options }) {
    this.galleryId = galleryId;
    const { behaviourParams_gallery_advancedScrollAnimation } = options;
    if (!(items && items.length) || !options) {
      console.error("calcScrollCss: missing params", { items, options });
      return [];
    }
    if (behaviourParams_gallery_advancedScrollAnimation?.length < 1) {
      return [];
    }

    const res = items.map((item) => this.calcScrollCssForItem({ item, container, options }));
    return res;
  }
}

export const cssScrollHelper = new CssScrollHelper();
