import { GALLERY_CONSTS } from 'pro-gallery-lib';

export const createScrollAnimations = ({
  createScrollSelectors,
  itemId,
  idx,
  item,
  container,
  options,
}) => {
  const { isRTL, oneRow, scrollAnimation, oneColorAnimationColor } = options;

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

  switch (scrollAnimation) {
    case FADE_IN:
      return createScrollSelectors({
        fromPosition: 0,
        toPosition: 100,
        selectorSuffix: `#${itemId} .gallery-item-wrapper`,
        animationCss: 'opacity: #;',
        fromValue: 0,
        toValue: 1,
      });
    case SLIDE_UP:
      const rtlFix = oneRow && isRTL ? -1 : 1;
      const slideGap = rtlFix * 50;
      if (oneRow) {
        return (
          createScrollSelectors({
            fromPosition: 0,
            toPosition: 80,
            selectorSuffix: `#${itemId} > div`,
            animationCss: `transform: translateX(#px);`,
            fromValue: slideGap,
            toValue: 0,
            reverseOnExit: true,
          }) + ` #${itemId} {overflow: visible !important;}`
        );
      } else {
        return createScrollSelectors({
          fromPosition: 0,
          toPosition: 500,
          selectorSuffix: `#${itemId}`,
          animationCss: `transform: translateY(#px);`,
          fromValue: slideGap,
          toValue: 0,
          reverseOnExit: true,
        });
      }
    case GRAYSCALE:
      return createScrollSelectors({
        fromPosition: 0,
        toPosition: 200,
        selectorSuffix: `#${itemId} .gallery-item-content`,
        animationCss: 'filter: grayscale(#%);',
        fromValue: 100,
        toValue: 0,
      });
    case EXPAND:
      return createScrollSelectors({
        fromPosition: 0,
        toPosition: 100,
        selectorSuffix: `#${itemId} .gallery-item-wrapper`,
        animationCss: 'transform: scale(#);',
        fromValue: 0.95,
        toValue: 1,
      });
    case ZOOM_OUT:
      return createScrollSelectors({
        fromPosition: 0,
        toPosition: 100,
        selectorSuffix: `#${itemId} .gallery-item-wrapper`,
        animationCss: 'transform: scale(#);',
        fromValue: 1.15,
        toValue: 1,
      });
    case SHRINK:
      return createScrollSelectors({
        fromPosition: 0,
        toPosition: 100,
        selectorSuffix: `#${itemId}`,
        animationCss: 'transform: scale(#);',
        fromValue: 1.02,
        toValue: 1,
      });
    case ONE_COLOR:
      const bgColor =
        oneColorAnimationColor?.value ||
        oneColorAnimationColor ||
        'transparent';
      return (
        createScrollSelectors({
          fromPosition: 0,
          toPosition: 100,
          selectorSuffix: `#${itemId} .gallery-item-wrapper>div`,
          animationCss: `opacity :#;`,
          fromValue: 0,
          toValue: 1,
        }) +
        ` #${itemId} .gallery-item-wrapper {background-color: ${bgColor} !important;}`
      );
    case BLUR:
      return createScrollSelectors({
        fromPosition: 0,
        toPosition: 100,
        selectorSuffix: `#${itemId} .gallery-item-content`,
        animationCss: 'filter: blur(#px);',
        fromValue: 30,
        toValue: 0,
      });
    case MAIN_COLOR:
      const pixel = item.createUrl('pixel', 'img');
      return (
        createScrollSelectors({
          fromPosition: 0,
          toPosition: 100,
          selectorSuffix: `#${itemId} .gallery-item-wrapper>div`,
          animationCss: `opacity :#;`,
          fromValue: 0,
          toValue: 1,
        }) +
        ` #${itemId} .gallery-item-wrapper {background-image: url(${pixel}) !important;}`
      );
  }
};
