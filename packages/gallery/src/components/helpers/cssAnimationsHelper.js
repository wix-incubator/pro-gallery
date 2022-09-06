import { GALLERY_CONSTS } from 'pro-gallery-lib';

export const createScrollAnimations = ({
  createScrollSelectors,
  itemId,
  item,
  options,
  scrollAnimation,
  isHorizontalScroll,
}) => {
  const { isRTL, oneColorAnimationColor, scrollAnimationIntensity } = options;

  const {
    NO_EFFECT,
    FADE_IN,
    GRAYSCALE,
    SLIDE_UP,
    SLIDE_IN,
    SLIDE_IN_REVERSED,
    EXPAND,
    ZOOM_OUT,
    ZOOM_IN,
    ONE_COLOR,
    MAIN_COLOR,
    BLUR,
    HINGE,
    SQUEEZE,
    ROTATE,
    FLIP,
  } = GALLERY_CONSTS.scrollAnimations;

  const i = scrollAnimationIntensity || 25;
  const r = (num) => num + Math.round((Math.random() * i) / 4);
  const h = isHorizontalScroll;

  let scrollSelectorsCss = '';
  let generalCss = '';
  let createEntryAnimationStepCss = [];
  let animationBySuffix = {};

  const addScrollSelectors = (
    { selectorSuffix, animationCss },
    generalStyles = ''
  ) => {
    scrollSelectorsCss += generalStyles + ` \n`;
    animationBySuffix[selectorSuffix] = [
      ...(animationBySuffix[selectorSuffix] || []),
      animationCss,
    ];
  };

  const mergeSelectorsCss = () => {
    for (let [selectorSuffix, animationCss] of Object.entries(
      animationBySuffix
    )) {
      scrollSelectorsCss += createScrollSelectors({
        fromPosition: r(0),
        toPosition: r(100 + i * 4),
        selectorSuffix,
        animationCss: (step, isExit) => {
          const cssObject = {};
          for (let cssCreationFunction of animationCss) {
            const animationCssObject = cssCreationFunction(step, isExit);
            for (let cssProp of Object.keys(animationCssObject)) {
              if (cssObject[cssProp]) {
                cssObject[cssProp] =
                  cssObject[cssProp] + ' ' + animationCssObject[cssProp];
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

  const valueInRange = (step, from, to, roundTo, ease = true) => {
    const _step = ease ? Math.pow(step, 3) : step;
    const val = _step * (to - from) + from;
    const roundedVal = Math.round(val / roundTo) * roundTo;
    return roundedVal;
  };

  if (scrollAnimation.includes(FADE_IN)) {
    addScrollSelectors({
      selectorSuffix: `#${itemId} .gallery-item-wrapper`,
      animationCss: (step, isExit) => ({
        opacity: valueInRange(step, 0, 1, 0.01),
      }),
      resetWhenPaused: true,
    });
  }
  if (scrollAnimation.includes(GRAYSCALE)) {
    addScrollSelectors({
      selectorSuffix: `#${itemId} .gallery-item-content`,
      animationCss: (step, isExit) => ({
        filter: `grayscale(${valueInRange(step, 100, 0, 1)}%)`,
      }),
      resetWhenPaused: true,
    });
  }
  if (scrollAnimation.includes(EXPAND)) {
    const fromVal = Math.round(95 - i / 4) / 100; // 0.95-0.7
    const toVal = 1;
    addScrollSelectors({
      selectorSuffix: `#${itemId} .gallery-item-wrapper`,
      animationCss: (step, isExit) => ({
        transform: `scale(${valueInRange(step, fromVal, toVal, 0.01)})`,
      }),
    });
  }
  if (scrollAnimation.includes(ZOOM_OUT)) {
    const fromVal = Math.round(110 + i / 4) / 100; // 1.1-1.35
    const toVal = 1;
    addScrollSelectors({
      selectorSuffix: `#${itemId} .gallery-item-content`,
      animationCss: (step, isExit) => ({
        transform: `scale(${valueInRange(step, fromVal, toVal, 0.01)})`,
      }),
    });
  }
  if (scrollAnimation.includes(ZOOM_IN)) {
    const fromVal = 1;
    const toVal = Math.round(110 + i / 4) / 100; // 1.1-1.35
    addScrollSelectors({
      selectorSuffix: `#${itemId} .gallery-item-content`,
      animationCss: (step, isExit) => ({
        transform: `scale(${valueInRange(step, fromVal, toVal, 0.01)})`,
      }),
    });
  }
  if (scrollAnimation.includes(BLUR)) {
    const fromVal = Math.round(i / 2); // 0-50;
    const toVal = 0;
    addScrollSelectors({
      selectorSuffix: `#${itemId} .gallery-item-content`,
      animationCss: (step, isExit) => ({
        filter: `blur(${valueInRange(step, fromVal, toVal, 1)}px)`,
      }),
      resetWhenPaused: true,
    });
  }
  if (scrollAnimation.includes(ROTATE)) {
    const fromVal = Math.round(5 + i / 10); // 5-15
    const toVal = 0;
    addScrollSelectors({
      selectorSuffix: `#${itemId}`,
      resetWhenPaused: true,
      animationCss: (step, isExit) => ({
        transform: `rotate(${valueInRange(step, fromVal, toVal, 1)}deg)`,
      }),
    });
  }
  if (scrollAnimation.includes(HINGE)) {
    const fromVal = Math.round(5 + i / 10); // 5-15
    const toVal = 0;
    addScrollSelectors({
      selectorSuffix: `#${itemId}`,
      resetWhenPaused: true,
      animationCss: (step, isExit) => ({
        transform: `rotate(${
          (isExit ? -1 : 1) * valueInRange(step, fromVal, toVal, 1)
        }deg)`,
        'transform-origin': isExit ? 'bottom left' : 'top left',
      }),
    });
  }
  if (scrollAnimation.includes(SQUEEZE)) {
    const prop = h ? 'X' : 'Y';
    const entryOrigin = h ? (isRTL ? 'right' : 'left') : 'top';
    const exitOrigin = h ? (isRTL ? 'left' : 'right') : 'bottom';
    const from = Math.round((i * 4) / 5) / 100; // .8-0
    const to = 1;
    addScrollSelectors({
      selectorSuffix: `#${itemId} .gallery-item-content`,
      animationCss: (step, isExit) => ({
        transform: `scale${prop}(${valueInRange(step, from, to, 0.01)})`,
        'transform-origin': isExit ? exitOrigin : entryOrigin,
        'object-fit': 'fill',
      }),
    });
  }

  if (scrollAnimation.includes(FLIP)) {
    const prop = h ? 'X' : 'Y';
    const entryOrigin = h ? (isRTL ? 'right' : 'left') : 'top';
    const exitOrigin = h ? (isRTL ? 'left' : 'right') : 'bottom';
    const fromVal = (i * 9) / 10; // 0-90
    const toVal = 0;
    addScrollSelectors(
      {
        selectorSuffix: `#${itemId} .gallery-item-wrapper`,
        animationCss: (step, isExit) => ({
          transform: `rotate3d(${(isExit ? 1 : -1) * (h ? 0 : 1)}, ${
            (isExit ? -1 : 1) * (h ? 1 : 0)
          }, 0, ${valueInRange(step, fromVal, toVal, 1)}deg)`,
          'transform-origin': isExit ? exitOrigin : entryOrigin,
        }),
      },
      `#${itemId}>div {perspective: 1000px;}`
    );
  }

  if (scrollAnimation.includes(ONE_COLOR)) {
    const bgColor =
      oneColorAnimationColor?.value || oneColorAnimationColor || 'transparent';
    addScrollSelectors(
      {
        resetWhenPaused: true,
        selectorSuffix: `#${itemId} .gallery-item-content`,
        animationCss: (step, isExit) => ({
          opacity: valueInRange(step, 0, 1, 0.01),
        }),
      },
      ` #${itemId} .gallery-item-wrapper {background-color: ${bgColor} !important;}`
    );
  }
  if (scrollAnimation.includes(MAIN_COLOR)) {
    const pixel = item.createUrl('pixel', 'img');
    addScrollSelectors(
      {
        resetWhenPaused: true,
        selectorSuffix: `#${itemId} .gallery-item-content`,
        animationCss: (step, isExit) => ({
          opacity: valueInRange(step, 0, 1, 0.01),
        }),
      },
      ` #${itemId} .gallery-item-wrapper {background-image: url(${pixel}) !important;}`
    );
  }
  if (scrollAnimation.includes(SLIDE_UP)) {
    const rtlFix = h && isRTL ? -1 : 1;
    const prop = h ? 'X' : 'Y';
    const slideGap = i * 2 * rtlFix; // 0-200
    const fromVal = slideGap;
    const toVal = 0;

    addScrollSelectors(
      {
        selectorSuffix: `#${itemId} > div`,
        animationCss: (step, isExit) => ({
          transform: `translate${prop}(${valueInRange(
            step,
            fromVal,
            toVal,
            1
          )}px)`,
        }),
        reverseOnExit: true,
      },
      ` #${itemId} {overflow: visible !important;}`
    );
  }

  if (scrollAnimation.includes(SLIDE_IN)) {
    const fromVal = 100;
    const toVal = 0;
    const prop = h ? 'Y' : 'X';
    addScrollSelectors(
      {
        selectorSuffix: `#${itemId} .gallery-item-content`,
        animationCss: (step, isExit) => ({
          transform: `translate${prop}(${valueInRange(
            step,
            fromVal,
            toVal,
            1
          )}px)`,
        }),
        reverseOnExit: true,
      },
      ` #${itemId} {overflow: visible !important;}`
    );
  }

  if (scrollAnimation.includes(SLIDE_IN_REVERSED)) {
    const fromVal = 100;
    const toVal = 0;
    const prop = h ? 'Y' : 'X';
    addScrollSelectors(
      {
        fromVal: 100,
        toVal: 0,
        selectorSuffix: `#${itemId} .gallery-item-content`,
        animationCss: (step, isExit) => ({
          transform: `translate${prop}(-${valueInRange(
            step,
            fromVal,
            toVal,
            1
          )}px)`,
        }),
      },
      ` #${itemId} {overflow: visible !important;}`
    );
  }

  return mergeSelectorsCss();
};
