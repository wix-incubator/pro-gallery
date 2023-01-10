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
    FADE,
    GRAYSCALE,
    SIZE,
    ZOOM,
    SHADOW,
    BLUR,
    ROUND,
    ONE_COLOR,
    MAIN_COLOR,
    ROTATE,
    SPIRAL,
    SQUEEZE,
    FLIP,
    SLIDE,
    APPEAR,
    PAN,
    SKEW,
  } = GALLERY_CONSTS.behaviourParams_gallery_advancedScrollAnimation;

  const i = scrollAnimationIntensity || 25;
  const h = isHorizontalScroll;
  const s = animationParams;

  let scrollSelectorsCss = "";
  let animationBySuffix = {};

  const { direction = 'UP', hinge = 'center', fromValue, toValue } = animationParams;

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
    return [...animations].some((animation) => s.type === animation);
  };

  const hasDirection = (...directions) => {
    return [...directions].some((direction) => s.direction === direction);
  };

  if (hasAnimation(FADE)) {
    addScrollSelectors({
      selectorSuffix: `#${itemId} .gallery-item-wrapper`,
      animationParams,
      animationCss: (step, isExit) => ({
        opacity: valueInRange(step, fromValue, toValue, 0.01),
      }),
    });
  }
  if (hasAnimation(GRAYSCALE)) {
    addScrollSelectors({
      selectorSuffix: `#${itemId} .gallery-item-content`,
      animationParams,
      animationCss: (step, isExit) => ({
        filter: `grayscale(${valueInRange(step, fromValue, toValue, 1)}%)`,
      }),
    });
  }
  if (hasAnimation(SIZE)) {
    addScrollSelectors({
      selectorSuffix: `#${itemId} .gallery-item-wrapper`,
      animationParams,
      animationCss: (step, isExit) => ({
        transform: `scale(${valueInRange(step, fromValue, toValue, 0.01)})`,
      }),
    });
  }
  if (hasAnimation(SHADOW)) {
    //TODO check why animation doesn't start on time
    addScrollSelectors({
      selectorSuffix: `#${itemId}`,
      animationParams,
      animationCss: (step, isExit) => {
        const size = valueInRange(step, fromValue, toValue, 1);
        return {
          filter: `drop-shadow(0 0 ${size}px rgba(0,0,0,0.5));`,
        };
      },
    });
  }
  if (hasAnimation(ZOOM)) {
    const fromVal = Math.round(110 + i / 4) / 100; // 1.1-1.35
    const toVal = 1;
    const animationParams = s[ZOOM_OUT];
    addScrollSelectors({
      selectorSuffix: `#${itemId} .gallery-item-content`,
      animationParams,
      animationCss: (step, isExit) => ({
        transform: `scale(${valueInRange(step, fromVal, toVal, 0.01)})`,
      }),
    });
  }
  if (hasAnimation(BLUR)) {
    addScrollSelectors({
      selectorSuffix: `#${itemId} .gallery-item-content`,
      animationParams,
      animationCss: (step, isExit) => {
        const blur = valueInRange(step, fromValue, toValue, 1);
        return {
          filter: `blur(${blur}px)`,
        };
      },
    });
  }
  if (hasAnimation(ROTATE)) {
    addScrollSelectors({
      selectorSuffix: `#${itemId}`,
      animationParams,
      animationCss: (step, isExit) => ({
        transform: `rotate(${valueInRange(step, fromValue, toValue, 1)}deg)`,
        "transform-origin": hinge || "center",
      }),
    });
  }
  // if (hasAnimation(HINGE)) {
  //   const origin = hasAnimation(HINGE_LEFT) ? "top left" : "top right";
  //   const direction = hasAnimation(HINGE_LEFT) ? 1 : -1;
  //   const fromVal = direction * Math.round(2 + i / 8); // 2-14
  //   const toVal = 0;
  //   const animationParams = s[HINGE_LEFT] || s[HINGE_RIGHT];
  //
  //   addScrollSelectors({
  //     selectorSuffix: `#${itemId}`,
  //     animationParams,
  //     animationCss: (step, isExit) => ({
  //       transform: `rotate(${(isExit ? -1 : 1) * valueInRange(step, fromVal, toVal, 1)}deg)`,
  //       "transform-origin": origin,
  //     }),
  //   });
  // }
  if (hasAnimation(ROUND)) {
    const from = Math.round(i / 1.2);
    const to = 0;
    const animationParams = s[ROUND];
    addScrollSelectors({
      selectorSuffix: `#${itemId} .gallery-item-wrapper`,
      animationParams,
      animationCss: (step, isExit) => ({
        "border-radius": `${valueInRange(step, from, to, 1)}%`,
      }),
    });
  }

  if (hasAnimation(ONE_COLOR)) {
    const bgColor = oneColorAnimationColor?.value || oneColorAnimationColor || "transparent";
    addScrollSelectors(
      {
        selectorSuffix: `#${itemId} .gallery-item-content`,
        animationParams,
        animationCss: (step, isExit) => ({
          opacity: valueInRange(step, fromValue, toValue, 0.01),
        }),
      },
      ` #${itemId} .gallery-item-wrapper {background-color: ${bgColor} !important;}`
    );
  }

  if (hasAnimation(MAIN_COLOR)) {
    const pixel = item.createUrl("pixel", "img");
    addScrollSelectors(
      {
        selectorSuffix: `#${itemId} .gallery-item-content`,
        animationParams,
        animationCss: (step, isExit) => ({
          opacity: valueInRange(step, fromValue, toValue, 0.01),
        }),
      },
      ` #${itemId} .gallery-item-wrapper {background-image: url(${pixel}) !important;}`
    );
  }

  if (hasAnimation(SQUEEZE)) {
    const rtlFix = h && isRTL ? -1 : 1;
    const directionFix = hasDirection("UP", "LEFT") ? 1 : -1;
    const prop = hasDirection("LEFT", "RIGHT") ? "X" : "Y";
    const origin = hasDirection("DOWN")
      ? "bottom"
      : hasDirection("UP")
      ? "top"
      : hasDirection("RIGHT")
      ? "right"
      : "left";

    const fromVal = fromValue * directionFix * rtlFix;
    const toVal = toValue * directionFix * rtlFix;

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

  if (hasAnimation(FLIP)) {
    const xAxis = hasDirection("RIGHT", "LEFT") ? 0 : hasDirection("UP") ? -1 : 1;
    const yAxis = hasDirection("UP", "DOWN") ? 0 : hasDirection("RIGHT") ? -1 : 1;
    const origin = hasDirection("DOWN")
      ? "bottom"
      : hasDirection("UP")
      ? "top"
      : hasDirection("RIGHT")
      ? "right"
      : "left";
    addScrollSelectors(
      {
        selectorSuffix: `#${itemId} .gallery-item-wrapper`,
        animationParams,
        animationCss: (step, isExit) => ({
          transform: `rotate3d(${xAxis}, ${yAxis}, 0, ${valueInRange(step, fromValue, toValue, 1)}deg)`,
          "transform-origin": origin,
        }),
      },
      `#${itemId}>div {perspective: 1000px;}`
    );
  }

  if (hasAnimation(SLIDE)) {
    const rtlFix = h && isRTL ? -1 : 1;
    const directionFix = hasDirection("UP", "LEFT") ? 1 : -1;
    const prop = hasDirection("LEFT", "RIGHT") ? "X" : "Y";
    const fromVal = fromValue * rtlFix * directionFix;
    const toVal = toValue * rtlFix * directionFix;

    addScrollSelectors(
      {
        selectorSuffix: `#${itemId} .gallery-item-wrapper`,
        animationParams,
        animationCss: (step, isExit) => ({
          transform: `translate${prop}(${valueInRange(step, fromVal, toVal, 1)}px)`,
        }),
      },
      ` #${itemId} {overflow: visible !important;}`
    );
  }

  if (hasAnimation(APPEAR)) {
    const rtlFix = h && isRTL ? -1 : 1;
    const directionFix = hasDirection('UP', 'LEFT') ? 1 : -1;
    const prop = hasDirection('LEFT', 'RIGHT') ? "X" : "Y";
    // const appearFrom = 50 + i / 2; // 0-200
    const fromVal = fromValue * rtlFix * directionFix;
    const toVal = toValue * rtlFix * directionFix;

    addScrollSelectors(
      {
        selectorSuffix: `#${itemId} .gallery-item-content`,
        animationParams,
        animationCss: (step, isExit) => ({
          transform: `translate${prop}(${valueInRange(step, fromVal, toVal, 1, false)}px)`,
        }),
      },
      ` #${itemId} {overflow: visible !important;}`
    );
  }

  if (hasAnimation(PAN)) {
    //TODO = the image should not exit the frame
    const scale = Math.max(fromValue || 1, toValue || 1); //1.1 + i / 200; //1.1 - 2.1
    const { width, height } = item;
    const dimension = hasDirection('LEFT', 'RIGHT') ? width : height;
    const pan = Math.round((dimension * (scale - 1)) / 2 / scale);
    const prop = hasDirection('LEFT', 'RIGHT') ? "X" : "Y";
    const fromVal = (hasDirection('LEFT', 'UP') ? 1 : -1) * pan;
    const toVal = -1 * fromVal;
    
    const selectorSuffix = `#${itemId} .gallery-item-content`;

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

  if (hasAnimation(SPIRAL)) {
    const scaleByDeg = (deg) => {
      const rad = (Math.abs(deg) * 2 * Math.PI) / 360;
      const { width, height } = item;
      const maxSize = Math.max(width, height);
      const minSize = Math.min(width, height);
      return (Math.cos(rad) * (maxSize * Math.sin(rad) + minSize)) / minSize;
    };
    const selectorSuffix = `#${itemId} .gallery-item-content`;

    addScrollSelectors({
      selectorSuffix,
      animationParams,
      animationCss: (step, isExit) => {
        const deg = valueInRange(step, fromValue, toValue, 1);
        return {
          transform: `scale(${scaleByDeg(deg)}) rotate(${deg}deg)`,
          "transform-origin": hinge,
        };
      },
    });
  }

  if (hasAnimation(SKEW)) {
    const direction = hasDirection('LEFT', 'UP') ? 1 : -1;
    const fromVal = direction * fromValue; //(5 + Math.round(i / 20)); // 5 - 30
    const scaleByDeg = (deg) => {
      const rad = (Math.abs(deg) * 2 * Math.PI) / 360;
      const { width, height } = item;
      const maxSize = hasDirection('LEFT', 'RIGHT') ? width : height;
      const minSize = hasDirection('LEFT', 'RIGHT') ? height : width;
      return ((Math.tan(rad) * maxSize ) + minSize) / minSize;
    };
    const toVal = direction * toValue;
    const selectorSuffix = `#${itemId} .gallery-item-content`;
    const skewX = (deg) => (hasDirection('LEFT', 'RIGHT') ? deg : 0);
    const skewY = (deg) => (hasDirection('LEFT', 'RIGHT') ? 0 : deg);

    addScrollSelectors({
      selectorSuffix,
      animationParams,
      animationCss: (step, isExit) => {
        const deg = valueInRange(step, fromVal, toVal, 1);
        return {
          transform: `scale(${scaleByDeg(Math.abs(deg))}) skew(${skewY(deg)}deg, ${skewX(deg)}deg)`,
          "transform-origin": hinge,
        };
      },
    });
  }

  return mergeSelectorsCss();
};
