import { GALLERY_CONSTS } from 'pro-gallery-lib';

export const createScrollAnimations = ({
  createScrollSelectors,
  itemId,
  item,
  options,
  isHorizontalScroll,
}) => {
  const {
    isRTL,
    scrollAnimation,
    oneColorAnimationColor,
    scrollAnimationIntensity,
  } = options;

  const {
    NO_EFFECT,
    FADE_IN,
    GRAYSCALE,
    SLIDE_UP,
    SLIDE_LEFT,
    EXPAND,
    SHRINK,
    ZOOM_OUT,
    ONE_COLOR,
    MAIN_COLOR,
    BLUR,
  } = GALLERY_CONSTS.scrollAnimations;

  const i = scrollAnimationIntensity || 25;

  switch (scrollAnimation) {
    case FADE_IN:
      return createScrollSelectors({
        fromPosition: i * 2,
        toPosition: i * 10,
        fromValue: 0,
        toValue: 1,
        selectorSuffix: `#${itemId} .gallery-item-wrapper`,
        animationCss: 'opacity: #;',
      });
    case GRAYSCALE:
      return createScrollSelectors({
        fromPosition: i * 2, //0-200
        toPosition: i * 10, //0-1000
        fromValue: 100,
        toValue: 0,
        selectorSuffix: `#${itemId} .gallery-item-content`,
        animationCss: 'filter: grayscale(#%);',
      });
    case EXPAND:
      return createScrollSelectors({
        fromPosition: i * 2, //0-200
        toPosition: i * 10, //0-1000
        fromValue: 0.95 - i / 400, // 0.95-0.7
        toValue: 1,
        selectorSuffix: `#${itemId} .gallery-item-wrapper`,
        animationCss: 'transform: scale(#);',
      });
    case ZOOM_OUT:
      return createScrollSelectors({
        fromPosition: i * 2, //0-200
        toPosition: i * 10, //0-1000
        fromValue: 1.1 + i / 400, // 1.1-1.35
        toValue: 1,
        selectorSuffix: `#${itemId} .gallery-item-wrapper`,
        animationCss: 'transform: scale(#);',
      });
    case SHRINK:
      return createScrollSelectors({
        fromPosition: i * 2, // 0-200
        toPosition: i * 10, // 0-1000
        fromValue: 1.05 + i / 500, // 1.05-1.25
        toValue: 1,
        selectorSuffix: `#${itemId}`,
        animationCss: 'transform: scale(#);',
      });
    case BLUR:
      return createScrollSelectors({
        fromPosition: i * 2, // 0-200
        toPosition: i * 8, // 0-800
        fromValue: 25 + i / 2, // 25-75
        toValue: 0,
        selectorSuffix: `#${itemId} .gallery-item-content`,
        animationCss: 'filter: blur(#px);',
      });
    case ONE_COLOR:
      const bgColor =
        oneColorAnimationColor?.value ||
        oneColorAnimationColor ||
        'transparent';
      return (
        createScrollSelectors({
          fromPosition: i * 2, // 0-200
          toPosition: i * 8, // 0-800
          fromValue: 0,
          toValue: 1,
          selectorSuffix: `#${itemId} .gallery-item-wrapper>div`,
          animationCss: `opacity :#;`,
        }) +
        ` #${itemId} .gallery-item-wrapper {background-color: ${bgColor} !important;}`
      );
    case MAIN_COLOR:
      const pixel = item.createUrl('pixel', 'img');
      return (
        createScrollSelectors({
          fromPosition: i * 2, // 0-200
          toPosition: i * 8, // 0-800
          fromValue: 0,
          toValue: 1,
          selectorSuffix: `#${itemId} .gallery-item-wrapper>div`,
          animationCss: `opacity :#;`,
        }) +
        ` #${itemId} .gallery-item-wrapper {background-image: url(${pixel}) !important;}`
      );
    case SLIDE_UP: {
      const rtlFix = isHorizontalScroll && isRTL ? -1 : 1;
      const slideGap = i * 2 * rtlFix; // 0-200
      const r = Math.round((Math.random() * slideGap) / 10);
      if (isHorizontalScroll) {
        return (
          createScrollSelectors({
            fromPosition: 0 - slideGap + r,
            toPosition: i * 6 + r, // 0-600
            fromValue: slideGap,
            toValue: 0,
            selectorSuffix: `#${itemId} > div`,
            animationCss: `transform: translateX(#px);`,
            iterations: 16,
            reverseOnExit: true,
            noEasing: true,
          }) + ` #${itemId} {overflow: visible !important;}`
        );
      } else {
        return createScrollSelectors({
          fromPosition: 0 - slideGap + r,
          toPosition: i * 4 + r, // 0-400
          fromValue: slideGap,
          toValue: 0,
          selectorSuffix: `#${itemId}`,
          animationCss: `transform: translateY(#px);`,
          iterations: 16,
          reverseOnExit: true,
          noEasing: true,
        });
      }}
    case SLIDE_LEFT: {
      const rtlFix = isHorizontalScroll && isRTL ? -1 : 1;
      if (isHorizontalScroll) {
        return (
          createScrollSelectors({
            fromPosition: 0,
            toPosition: i * 6, // 0-600
            fromValue: 100,
            toValue: 0,
            selectorSuffix: `#${itemId} .gallery-item-wrapper>div`,
            animationCss: `transform: translateY(-#%);`,
            iterations: 16,
            reverseOnExit: true,
            noEasing: true,
          }) + ` #${itemId} {overflow: visible !important;}`
        );
      } else {
        return createScrollSelectors({
          fromPosition: 0,
          toPosition: i * 4, // 0-400
          fromValue: 100,
          toValue: 0,
          selectorSuffix: `#${itemId} .gallery-item-wrapper>div`,
          animationCss: `transform: translateX(#%);`,
          iterations: 16,
          reverseOnExit: true,
          noEasing: true,
        });
      }
  }
};
