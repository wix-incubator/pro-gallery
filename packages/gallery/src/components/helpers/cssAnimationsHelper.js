import { GALLERY_CONSTS } from "pro-gallery-lib";

export const createScrollAnimations = ({
  createScrollSelectors,
  itemId,
  item,
  options,
  containerSize,
  animationParams,
  isHorizontalScroll,
}) => {
  const { isRTL, oneColorAnimationColor, scrollAnimationIntensity, scrollAnimationDistance } = options;

  const {
    NO_EFFECT,
    FADE,
    GRAYSCALE,
    SHADOW,
    BLUR,
    ONE_COLOR,
    MAIN_COLOR,
    EXPAND,
    SHRINK,
    ROUND,
    ZOOM,
    SKEW_UP,
    SKEW_DOWN,
    SKEW_RIGHT,
    SKEW_LEFT,
    SPIRAL_RIGHT,
    SPIRAL_LEFT,
    ROTATE_RIGHT,
    ROTATE_LEFT,
    HINGE_RIGHT,
    HINGE_LEFT,
    FLIP_UP,
    FLIP_DOWN,
    FLIP_LEFT,
    FLIP_RIGHT,
    SQUEEZE_UP,
    SQUEEZE_DOWN,
    SQUEEZE_LEFT,
    SQUEEZE_RIGHT,
    SLIDE_UP,
    SLIDE_DOWN,
    SLIDE_LEFT,
    SLIDE_RIGHT,
    APPEAR_UP,
    APPEAR_DOWN,
    APPEAR_LEFT,
    APPEAR_RIGHT,
    PAN_LEFT,
    PAN_RIGHT,
    PAN_UP,
    PAN_DOWN,
  } = GALLERY_CONSTS.advancedScrollAnimations;

  const i = scrollAnimationIntensity || 25;
  const h = isHorizontalScroll;
  const s = animationParams;

  let scrollSelectorsCss = "";
  let animationBySuffix = {};

  const addScrollSelectors = ({ selectorSuffix, animationCss, animationParams }, generalStyles = "") => {
    scrollSelectorsCss += generalStyles + ` \n`;
    animationBySuffix[selectorSuffix] = [...(animationBySuffix[selectorSuffix] || []), animationCss];
  };

  const mergeSelectorsCss = () => {
    for (let [selectorSuffix, animationCss] of Object.entries(animationBySuffix)) {
      scrollSelectorsCss += createScrollSelectors({
        animationParams,
        selectorSuffix,
        animationCss: (step, isExit) => {
          const cssObject = {};
          for (let cssCreationFunction of animationCss) {
            const animationCssObject = cssCreationFunction(step, isExit);
            for (let cssProp of Object.keys(animationCssObject)) {
              if (cssObject[cssProp]) {
                cssObject[cssProp] = cssObject[cssProp] + " " + animationCssObject[cssProp];
              } else {
                cssObject[cssProp] = animationCssObject[cssProp];
              }
            }
          }
          return cssObject;
        },
      });
    }
    return scrollSelectorsCss;
  };

  const valueInRange = (step, from, to, roundTo, ease = false) => {
    //TODO - use easing
    const _step = ease ? Math.pow(step, 3) : step;
    const val = _step * (to - from) + from;
    if (roundTo < 1) {
      const roundedRoundTo = Math.round(1 / roundTo); //stupid javascript
      return Math.round(val * roundedRoundTo) / roundedRoundTo;
    } else {
      return Math.round(val * roundTo) / roundTo;
    }
  };

  const hasAnimation = (...animations) => {
    return [...animations].some(animation => s.type === animation);
  }

  if (hasAnimation(FADE)) {
    const { fromValue, toValue } = animationParams;
    addScrollSelectors({
      selectorSuffix: `#${itemId} .gallery-item-wrapper`,
      animationParams,
      animationCss: (step, isExit) => ({
        opacity: valueInRange(step, fromValue, toValue, 0.01),
      }),
    });
  }
  if (hasAnimation(GRAYSCALE)) {
    const { fromValue, toValue } = animationParams;
    addScrollSelectors({
      selectorSuffix: `#${itemId} .gallery-item-content`,
      animationParams,
      animationCss: (step, isExit) => ({
        filter: `grayscale(${valueInRange(step, fromValue, toValue, 1)}%)`,
      }),
    });
  }
  if (hasAnimation(SHADOW)) {
    //TODO check why animation doesn't start on time
    const fromVal = Math.round(15 + i / 6); // 15-31
    const toVal = 0;
    const animationParams = s[SHADOW];
    const { fromValue, toValue } = animationParams;
    addScrollSelectors({
      selectorSuffix: `#${itemId}`,
      animationParams,
      animationCss: (step, isExit) => {
        const size = valueInRange(step, fromVal, toVal, 1);
        return {
          filter: `drop-shadow(0 0 ${size}px rgba(0,0,0,${0.3 + i / 250}));`,
        };
      },
    });
  }
  if (hasAnimation(EXPAND)) {
    const { fromValue, toValue } = animationParams;
    addScrollSelectors({
      selectorSuffix: `#${itemId} .gallery-item-wrapper`,
      animationParams,
      animationCss: (step, isExit) => ({
        transform: `scale(${valueInRange(step, fromValue, toValue, 0.01)})`,
      }),
    });
  }
  if (hasAnimation(SHRINK)) {
    const { fromValue, toValue } = animationParams;
    addScrollSelectors({
      selectorSuffix: `#${itemId}`,
      animationParams,
      animationCss: (step, isExit) => ({
        transform: `scale(${valueInRange(step, fromValue, toValue, 0.01)})`,
      }),
    });
  }
  if (hasAnimation(ZOOM)) {
    const fromVal = Math.round(110 + i / 4) / 100; // 1.1-1.35
    const toVal = 1;
    const animationParams = s[ZOOM_OUT];
    const { fromValue, toValue } = animationParams;
    addScrollSelectors({
      selectorSuffix: `#${itemId} .gallery-item-content`,
      animationParams,
      animationCss: (step, isExit) => ({
        transform: `scale(${valueInRange(step, fromVal, toVal, 0.01)})`,
      }),
    });
  }
  if (hasAnimation(ZOOM_IN)) {
    const fromVal = 1;
    const toVal = Math.round(110 + i / 4) / 100; // 1.1-1.35
    const animationParams = s[ZOOM_IN];
    const { fromValue, toValue } = animationParams;
    addScrollSelectors({
      selectorSuffix: `#${itemId} .gallery-item-content`,
      animationParams,
      animationCss: (step, isExit) => ({
        transform: `scale(${valueInRange(step, fromVal, toVal, 0.01)})`,
      }),
    });
  }
  if (hasAnimation(BLUR)) {
    const fromVal = Math.round(10 + (i * 9) / 10); // 10-100;
    const toVal = 0;
    const scaleByBlur = (blur) => {
      const size = Math.min(item.width, item.height);
      return (size + blur * 2) / size;
    };
    const animationParams = s[BLUR];
    const { fromValue, toValue } = animationParams;
    addScrollSelectors({
      selectorSuffix: `#${itemId} .gallery-item-content`,
      animationParams,
      animationCss: (step, isExit) => {
        const blur = valueInRange(step, fromVal, toVal, 1);
        return {
          transform: `scale(${scaleByBlur(blur)})`,
          filter: `blur(${blur}px)`,
        };
      },
    });
  }
  if (hasAnimation(ROTATE_LEFT, ROTATE_RIGHT)) {
    //TODO - add scale so that the image will fit in the container
    const direction = hasAnimation(ROTATE_LEFT) ? 1 : -1;
    const fromVal = direction * Math.round(2 + i / 8); // 2-14
    const toVal = 0;
    const animationParams = s[ROTATE_LEFT] || s[ROTATE_RIGHT];
    const { fromValue, toValue } = animationParams;
    addScrollSelectors({
      selectorSuffix: `#${itemId}`,
      animationParams,
      animationCss: (step, isExit) => ({
        transform: `rotate(${valueInRange(step, fromVal, toVal, 1)}deg)`,
        "transform-origin": "center",
      }),
    });
  }
  if (hasAnimation(HINGE_LEFT, HINGE_RIGHT)) {
    const origin = hasAnimation(HINGE_LEFT) ? "top left" : "top right";
    const direction = hasAnimation(HINGE_LEFT) ? 1 : -1;
    const fromVal = direction * Math.round(2 + i / 8); // 2-14
    const toVal = 0;
    const animationParams = s[HINGE_LEFT] || s[HINGE_RIGHT];
    const { fromValue, toValue } = animationParams;
    addScrollSelectors({
      selectorSuffix: `#${itemId}`,
      animationParams,
      animationCss: (step, isExit) => ({
        transform: `rotate(${(isExit ? -1 : 1) * valueInRange(step, fromVal, toVal, 1)}deg)`,
        "transform-origin": origin,
      }),
    });
  }
  if (hasAnimation(ROUND)) {
    const from = Math.round(i / 1.2);
    const to = 0;
    const animationParams = s[ROUND];
    const { fromValue, toValue } = animationParams;
    addScrollSelectors({
      selectorSuffix: `#${itemId} .gallery-item-wrapper`,
      animationParams,
      animationCss: (step, isExit) => ({
        "border-radius": `${valueInRange(step, from, to, 1)}%`,
      }),
    });
  }

  if (hasAnimation(SQUEEZE_DOWN, SQUEEZE_UP, SQUEEZE_LEFT, SQUEEZE_RIGHT)) {
    const rtlFix = h && isRTL ? -1 : 1;
    const directionFix = hasAnimation(SQUEEZE_UP, SQUEEZE_LEFT) ? 1 : -1;
    const prop = hasAnimation(SQUEEZE_LEFT, SQUEEZE_RIGHT) ? "X" : "Y";
    const origin = hasAnimation(SQUEEZE_DOWN)
      ? "bottom"
      : hasAnimation(SQUEEZE_UP)
      ? "top"
      : hasAnimation(SQUEEZE_RIGHT)
      ? "right"
      : "left";
    const fromVal = 1 - i / 100; // .8-0
    const toVal = 1;
    const animationParams = s[SQUEEZE_DOWN] || s[SQUEEZE_UP] || s[SQUEEZE_LEFT] || s[SQUEEZE_RIGHT];
    const { fromValue, toValue } = animationParams;

    addScrollSelectors(
      {
        selectorSuffix: `#${itemId} .gallery-item-content`,
        animationParams,
        animationCss: (step, isExit) => ({
          transform: `scale${prop}(${valueInRange(step, fromVal, toVal, 0.01)})`,
          "transform-origin": origin,
          "object-fit": "fill",
        }),
      },
      ` #${itemId} {overflow: visible !important;}`
    );
  }

  if (hasAnimation(FLIP_DOWN, FLIP_UP, FLIP_LEFT, FLIP_RIGHT)) {
    const xAxis = hasAnimation(FLIP_RIGHT, FLIP_LEFT) ? 0 : hasAnimation(FLIP_UP) ? -1 : 1;
    const yAxis = hasAnimation(FLIP_UP, FLIP_DOWN) ? 0 : hasAnimation(FLIP_RIGHT) ? -1 : 1;
    const origin = hasAnimation(FLIP_DOWN)
      ? "bottom"
      : hasAnimation(FLIP_UP)
      ? "top"
      : hasAnimation(FLIP_RIGHT)
      ? "right"
      : "left";
    const fromVal = 10 + (i * 8) / 10; // 0-90
    const toVal = 0;
    const animationParams = s[FLIP_DOWN] || s[FLIP_UP] || s[FLIP_LEFT] || s[FLIP_RIGHT];
    const { fromValue, toValue } = animationParams;
    addScrollSelectors(
      {
        selectorSuffix: `#${itemId} .gallery-item-wrapper`,
        animationParams,
        animationCss: (step, isExit) => ({
          transform: `rotate3d(${xAxis}, ${yAxis}, 0, ${valueInRange(step, fromVal, toVal, 1)}deg)`,
          "transform-origin": origin,
        }),
      },
      `#${itemId}>div {perspective: 1000px;}`
    );
  }

  if (hasAnimation(ONE_COLOR)) {
    const bgColor = oneColorAnimationColor?.value || oneColorAnimationColor || "transparent";
    const animationParams = s[ONE_COLOR];
    const { fromValue, toValue } = animationParams;
    addScrollSelectors(
      {
        selectorSuffix: `#${itemId} .gallery-item-content`,
        animationParams,
        animationCss: (step, isExit) => ({
          opacity: valueInRange(step, 0.5 - i / 50, 1, 0.01),
        }),
      },
      ` #${itemId} .gallery-item-wrapper {background-color: ${bgColor} !important;}`
    );
  }
  if (hasAnimation(MAIN_COLOR)) {
    const pixel = item.createUrl("pixel", "img");
    const animationParams = s[MAIN_COLOR];
    const { fromValue, toValue } = animationParams;
    addScrollSelectors(
      {
        selectorSuffix: `#${itemId} .gallery-item-content`,
        animationParams,
        animationCss: (step, isExit) => ({
          opacity: valueInRange(step, 0.5 - i / 50, 1, 0.01),
        }),
      },
      ` #${itemId} .gallery-item-wrapper {background-image: url(${pixel}) !important;}`
    );
  }
  if (hasAnimation(SLIDE_DOWN, SLIDE_UP, SLIDE_LEFT, SLIDE_RIGHT)) {
    const rtlFix = h && isRTL ? -1 : 1;
    const directionFix = hasAnimation(SLIDE_UP, SLIDE_LEFT) ? 1 : -1;
    const prop = hasAnimation(SLIDE_LEFT, SLIDE_RIGHT) ? "X" : "Y";
    const slideGap = i * 2; // 0-200
    const fromVal = slideGap * rtlFix * directionFix;
    const toVal = 0;
    const animationParams = s[SLIDE_DOWN] || s[SLIDE_UP] || s[SLIDE_LEFT] || s[SLIDE_RIGHT];
    const { fromValue, toValue } = animationParams;

    addScrollSelectors(
      {
        selectorSuffix: `#${itemId} .gallery-item-wrapper`,
        animationParams,
        animationCss: (step, isExit) => ({
          transform: `translate${prop}(${valueInRange(step, fromVal * (isExit ? -1 : 1), toVal, 1)}px)`,
        }),
      },
      ` #${itemId} {overflow: visible !important;}`
    );
  }

  if (hasAnimation(APPEAR_DOWN, APPEAR_UP, APPEAR_LEFT, APPEAR_RIGHT)) {
    const rtlFix = h && isRTL ? -1 : 1;
    const directionFix = hasAnimation(APPEAR_UP, APPEAR_LEFT) ? 1 : -1;
    const prop = hasAnimation(APPEAR_LEFT, APPEAR_RIGHT) ? "X" : "Y";
    const appearFrom = 50 + i / 2; // 0-200
    const fromVal = appearFrom * rtlFix * directionFix;
    const toVal = 0;

    const animationParams = s[APPEAR_DOWN] || s[APPEAR_UP] || s[APPEAR_LEFT] || s[APPEAR_RIGHT];
    const { fromValue, toValue } = animationParams;
    addScrollSelectors(
      {
        selectorSuffix: `#${itemId} .gallery-item-content`,
        animationParams,
        animationCss: (step, isExit) => ({
          transform: `translate${prop}(${valueInRange(step, fromVal * (isExit ? -1 : 1), toVal, 1, false)}px)`,
        }),
      },
      ` #${itemId} {overflow: visible !important;}`
    );
  }

  if (hasAnimation(PAN_LEFT, PAN_RIGHT, PAN_UP, PAN_DOWN)) {
    //TODO = the image should not exit the frame
    const scale = 1.1 + i / 200; //1.1 - 2.1
    const { width, height } = item;
    const dimension = hasAnimation(PAN_LEFT, PAN_RIGHT) ? width : height;
    const pan = Math.round((dimension * (scale - 1)) / 2 / scale);
    const selectorSuffix = `#${itemId} .gallery-item-content`;
    const prop = hasAnimation(PAN_LEFT, PAN_RIGHT) ? "X" : "Y";
    const fromVal = (hasAnimation(PAN_LEFT, PAN_UP) ? 1 : -1) * pan;
    const toVal = -1 * fromVal;

    const animationParams = s[PAN_LEFT] || s[PAN_RIGHT] || s[PAN_UP] || s[PAN_DOWN];
    const { fromValue, toValue } = animationParams;
    addScrollSelectors({
      selectorSuffix,
      animationParams,
      animationCss: (step, isExit) => ({
        transform: `scale(${valueInRange(0, scale, scale, 0.01)}) translate${prop}(${valueInRange(
          step,
          fromVal,
          toVal,
          1,
          false
        )}px)`,
      }),
    });
  }

  if (hasAnimation(SPIRAL_LEFT, SPIRAL_RIGHT)) {
    const direction = hasAnimation(SPIRAL_LEFT) ? 1 : -1;
    const fromVal = direction * (5 + Math.round(i / 8)); // 5 - 30
    const scaleByDeg = (deg) => {
      const rad = (Math.abs(deg) * 2 * Math.PI) / 360;
      const { width, height } = item;
      const maxSize = Math.max(width, height);
      const minSize = Math.min(width, height);
      return (Math.cos(rad) * (maxSize * Math.sin(rad) + minSize)) / minSize;
    };
    const toVal = 0;
    const selectorSuffix = `#${itemId} .gallery-item-content`;

    const animationParams = s[SPIRAL_LEFT] || s[SPIRAL_RIGHT];
    const { fromValue, toValue } = animationParams;
    addScrollSelectors({
      selectorSuffix,
      animationParams,
      animationCss: (step, isExit) => {
        const deg = valueInRange(step, fromVal, toVal, 1);
        return {
          transform: `scale(${scaleByDeg(deg)}) rotate(${deg}deg)`,
          "transform-origin": "center",
        };
      },
    });
  }

  if (hasAnimation(SKEW_LEFT, SKEW_RIGHT, SKEW_UP, SKEW_DOWN)) {
    const direction = hasAnimation(SKEW_LEFT, SKEW_UP) ? 1 : -1;
    const fromVal = direction * (5 + Math.round(i / 20)); // 5 - 30
    const scaleByDeg = (deg) => {
      const rad = (Math.abs(deg) * 2 * Math.PI) / 360;
      const { width, height } = item;
      const maxSize = Math.max(width, height);
      const minSize = Math.min(width, height);
      return (Math.tan(rad) * minSize + maxSize) / maxSize;
    };
    const toVal = 0;
    const selectorSuffix = `#${itemId} .gallery-item-content`;
    const skewX = (deg) => (hasAnimation(SKEW_LEFT, SKEW_RIGHT) ? deg : 0);
    const skewY = (deg) => (hasAnimation(SKEW_LEFT, SKEW_RIGHT) ? 0 : deg);

    const animationParams = s[SKEW_LEFT] || s[SKEW_RIGHT] || s[SKEW_UP] || s[SKEW_DOWN];
    const { fromValue, toValue } = animationParams;
    addScrollSelectors({
      selectorSuffix,
      animationParams,
      animationCss: (step, isExit) => {
        const deg = valueInRange(step, fromVal, toVal, 1);
        return {
          transform: `scale(${scaleByDeg(Math.abs(deg))}) skew(${skewY(deg)}deg, ${skewX(deg)}deg)`,
          "transform-origin": "center",
        };
      },
    });
  }

  return mergeSelectorsCss();
};
