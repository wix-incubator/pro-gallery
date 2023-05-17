import { GALLERY_CONSTS } from 'pro-gallery-lib';
import { easingFunctions } from '../../common/utils/easing';

export const createScrollAnimations = ({
  createScrollSelectors,
  itemId,
  item,
  options,
  animationParams,
  isHorizontalScroll,
  iterations,
}) => {
  const { isRTL, oneColorAnimationColor } = options;

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

  const h = isHorizontalScroll;
  const s = animationParams;

  let scrollSelectorsCss = '';
  let animationBySuffix = {};

  const { hinge = 'center', fromValue, toValue, ease = 'linear' } = animationParams;
  let { direction = 'IN' } = animationParams;

  const convertRelativeDirection = (direction) => {
    if (['IN', 'OUT', 'RIGHTWAY', 'LEFTWAY'].includes(direction)) {
      if (h) {
        if (isRTL) {
          return {
            IN: 'LEFT',
            OUT: 'RIGHT',
            RIGHTWAY: 'UP',
            LEFTWAY: 'DOWN',
          }[direction];
        } else {
          return {
            IN: 'RIGHT',
            OUT: 'LEFT',
            RIGHTWAY: 'DOWN',
            LEFTWAY: 'UP',
          }[direction];
        }
      } else {
        return {
          IN: 'UP',
          OUT: 'DOWN',
          RIGHTWAY: 'RIGHT',
          LEFTWAY: 'LEFT',
        }[direction];
      }
    } else {
      return direction;
    }
  };

  const addScrollSelectors = ({ selectorSuffix, animationCss }, generalStyles = '') => {
    scrollSelectorsCss += generalStyles + ` \n`;
    animationBySuffix[selectorSuffix] = [...(animationBySuffix[selectorSuffix] || []), animationCss];
  };

  const mergeSelectorsCss = () => {
    for (let [selectorSuffix, animationCss] of Object.entries(animationBySuffix)) {
      scrollSelectorsCss += createScrollSelectors({
        animationParams,
        selectorSuffix,
        animationCss: (step) => {
          const cssObject = {};
          for (let cssCreationFunction of animationCss) {
            const animationCssObject = cssCreationFunction(step);
            for (let cssProp of Object.keys(animationCssObject)) {
              if (cssObject[cssProp]) {
                cssObject[cssProp] = cssObject[cssProp] + ' ' + animationCssObject[cssProp];
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

  const valueInRange = (step, from, to, roundTo) => {
    //TODO - use easing
    const easeFunc = easingFunctions[ease] || easingFunctions['linear'];
    const val = easeFunc(step * iterations, from, to - from, iterations);
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
    return [...directions].some((dir) => direction === dir);
  };

  direction = convertRelativeDirection(direction);

  if (hasAnimation(FADE)) {
    addScrollSelectors({
      selectorSuffix: `#${itemId} .gallery-item-wrapper`,
      animationParams,
      animationCss: (step) => ({
        opacity: valueInRange(step, fromValue, toValue, 0.01),
      }),
    });
  }
  if (hasAnimation(GRAYSCALE)) {
    addScrollSelectors({
      selectorSuffix: `#${itemId} .gallery-item-content`,
      animationParams,
      animationCss: (step) => ({
        filter: `grayscale(${valueInRange(step, fromValue, toValue, 1)}%)`,
      }),
    });
  }
  if (hasAnimation(SIZE)) {
    addScrollSelectors({
      selectorSuffix: `#${itemId} .gallery-item-wrapper`,
      animationParams,
      animationCss: (step) => ({
        transform: `scale(${valueInRange(step, fromValue, toValue, 0.01)})`,
      }),
    });
  }
  if (hasAnimation(SHADOW)) {
    //TODO check why animation doesn't start on time
    addScrollSelectors({
      selectorSuffix: `#${itemId}`,
      animationParams,
      animationCss: (step) => {
        const size = valueInRange(step, fromValue, toValue, 1);
        return {
          filter: `drop-shadow(0 0 ${size}px rgba(0,0,0,0.5));`,
        };
      },
    });
  }
  if (hasAnimation(ZOOM)) {
    addScrollSelectors({
      selectorSuffix: `#${itemId} .gallery-item-content`,
      animationParams,
      animationCss: (step) => ({
        transform: `scale(${valueInRange(step, fromValue, toValue, 0.01)})`,
      }),
    });
  }
  if (hasAnimation(BLUR)) {
    addScrollSelectors({
      selectorSuffix: `#${itemId} .gallery-item-content`,
      animationParams,
      animationCss: (step) => {
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
      animationCss: (step) => ({
        transform: `rotate(${valueInRange(step, fromValue, toValue, 1)}deg)`,
        'transform-origin': hinge || 'center',
      }),
    });
  }
  if (hasAnimation(ROUND)) {
    const animationParams = s[ROUND];
    addScrollSelectors({
      selectorSuffix: `#${itemId} .gallery-item-wrapper`,
      animationParams,
      animationCss: (step) => ({
        'border-radius': `${valueInRange(step, fromValue, toValue, 1)}%`,
      }),
    });
  }

  if (hasAnimation(ONE_COLOR)) {
    const bgColor = oneColorAnimationColor?.value || oneColorAnimationColor || 'transparent';
    addScrollSelectors(
      {
        selectorSuffix: `#${itemId} .gallery-item-content`,
        animationParams,
        animationCss: (step) => ({
          opacity: valueInRange(step, fromValue, toValue, 0.01),
        }),
      },
      ` #${itemId} .gallery-item-wrapper {background-color: ${bgColor} !important;}`
    );
  }

  if (hasAnimation(MAIN_COLOR)) {
    const pixel = item.createUrl('pixel', 'img');
    addScrollSelectors(
      {
        selectorSuffix: `#${itemId} .gallery-item-content`,
        animationParams,
        animationCss: (step) => ({
          opacity: valueInRange(step, fromValue, toValue, 0.01),
        }),
      },
      ` #${itemId} .gallery-item-wrapper {background-image: url(${pixel}) !important;}`
    );
  }

  if (hasAnimation(SQUEEZE)) {
    const rtlFix = h && isRTL ? -1 : 1;
    const directionFix = hasDirection('UP', 'LEFT') ? 1 : -1;
    const prop = hasDirection('LEFT', 'RIGHT') ? 'X' : 'Y';
    const origin = hasDirection('DOWN')
      ? 'bottom'
      : hasDirection('UP')
      ? 'top'
      : hasDirection('RIGHT')
      ? 'right'
      : 'left';

    const fromVal = fromValue * directionFix * rtlFix;
    const toVal = toValue * directionFix * rtlFix;

    addScrollSelectors(
      {
        selectorSuffix: `#${itemId} .gallery-item-content`,
        animationParams,
        animationCss: (step) => ({
          transform: `scale${prop}(${valueInRange(step, fromVal, toVal, 0.01)})`,
          'transform-origin': origin,
          'object-fit': 'fill',
        }),
      },
      ` #${itemId} {overflow: visible !important;}`
    );
  }

  if (hasAnimation(FLIP)) {
    const xAxis = hasDirection('RIGHT', 'LEFT') ? 0 : hasDirection('UP') ? -1 : 1;
    const yAxis = hasDirection('UP', 'DOWN') ? 0 : hasDirection('RIGHT') ? -1 : 1;
    const origin = hasDirection('DOWN')
      ? 'bottom'
      : hasDirection('UP')
      ? 'top'
      : hasDirection('RIGHT')
      ? 'right'
      : 'left';
    addScrollSelectors(
      {
        selectorSuffix: `#${itemId} .gallery-item-wrapper`,
        animationParams,
        animationCss: (step) => ({
          transform: `rotate3d(${xAxis}, ${yAxis}, 0, ${valueInRange(step, fromValue, toValue, 1)}deg)`,
          'transform-origin': origin,
        }),
      },
      `#${itemId}>div {perspective: 1000px;}`
    );
  }

  if (hasAnimation(SLIDE)) {
    const rtlFix = h && isRTL ? -1 : 1;
    const directionFix = hasDirection('UP', 'LEFT') ? 1 : -1;
    const prop = hasDirection('LEFT', 'RIGHT') ? 'X' : 'Y';
    const fromVal = fromValue * rtlFix * directionFix;
    const toVal = toValue * rtlFix * directionFix;

    addScrollSelectors(
      {
        selectorSuffix: `#${itemId}`,
        animationParams,
        animationCss: (step) => ({
          transform: `translate${prop}(${valueInRange(step, fromVal, toVal, 1)}px)`,
        }),
      },
      ` #${itemId} {overflow: visible !important;}`
    );
  }

  if (hasAnimation(APPEAR)) {
    const rtlFix = h && isRTL ? -1 : 1;
    const directionFix = hasDirection('UP', 'LEFT') ? 1 : -1;
    const prop = hasDirection('LEFT', 'RIGHT') ? 'X' : 'Y';
    const fromVal = fromValue * rtlFix * directionFix;
    const toVal = toValue * rtlFix * directionFix;

    addScrollSelectors(
      {
        selectorSuffix: `#${itemId} .gallery-item-content`,
        animationParams,
        animationCss: (step) => ({
          transform: `translate${prop}(${valueInRange(step, fromVal, toVal, 1, false)}px)`,
        }),
      },
      ` #${itemId} {overflow: visible !important;}`
    );
  }

  if (hasAnimation(PAN)) {
    //TODO = the image should not exit the frame
    const scale = Math.max(fromValue || 1, toValue || 1);
    const { width, height } = item;
    const dimension = hasDirection('LEFT', 'RIGHT') ? width : height;
    const pan = Math.round((dimension * (scale - 1)) / 2 / scale);
    const prop = hasDirection('LEFT', 'RIGHT') ? 'X' : 'Y';
    const fromVal = (hasDirection('LEFT', 'UP') ? 1 : -1) * pan;
    const toVal = -1 * fromVal;

    const selectorSuffix = `#${itemId} .gallery-item-content`;

    addScrollSelectors({
      selectorSuffix,
      animationParams,
      animationCss: (step) => ({
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
      const size = Math.cos(rad) + (maxSize * Math.sin(rad)) / minSize - Math.sin(rad) * Math.tan(rad);
      return Math.pow(size, 2);
    };
    const selectorSuffix = `#${itemId} .gallery-item-content`;

    addScrollSelectors({
      selectorSuffix,
      animationParams,
      animationCss: (step) => {
        const deg = valueInRange(step, fromValue, toValue, 1);
        return {
          transform: `scale(${scaleByDeg(deg)}) rotate(${deg}deg)`,
          'transform-origin': hinge,
        };
      },
    });
  }

  if (hasAnimation(SKEW)) {
    const direction = hasDirection('LEFT', 'UP') ? 1 : -1;
    const fromVal = direction * fromValue;
    const scaleByDeg = (deg) => {
      const rad = (Math.abs(deg) * 2 * Math.PI) / 360;
      const { width, height } = item;
      const maxSize = hasDirection('LEFT', 'RIGHT') ? width : height;
      const minSize = hasDirection('LEFT', 'RIGHT') ? height : width;
      return (Math.tan(rad) * maxSize + minSize) / minSize;
    };
    const toVal = direction * toValue;
    const selectorSuffix = `#${itemId} .gallery-item-content`;
    const skewX = (deg) => (hasDirection('LEFT', 'RIGHT') ? deg : 0);
    const skewY = (deg) => (hasDirection('LEFT', 'RIGHT') ? 0 : deg);

    addScrollSelectors({
      selectorSuffix,
      animationParams,
      animationCss: (step) => {
        const deg = valueInRange(step, fromVal, toVal, 1);
        return {
          transform: `scale(${scaleByDeg(Math.abs(deg))}) skew(${skewY(deg)}deg, ${skewX(deg)}deg)`,
          'transform-origin': hinge,
        };
      },
    });
  }

  return mergeSelectorsCss();
};
