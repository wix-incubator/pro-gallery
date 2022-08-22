import { GALLERY_CONSTS } from 'pro-gallery-lib';

export const createScrollAnimations = ({
  createScrollSelectors,
  itemId,
  item,
  options,
  isHorizontalScroll,
}) => {
  const { isRTL, scrollAnimation, oneColorAnimationColor } = options;

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
        fromPosition: 50,
        toPosition: 200,
        fromValue: 0,
        toValue: 1,
        selectorSuffix: `#${itemId} .gallery-item-wrapper`,
        animationCss: 'opacity: #;',
      });
    case SLIDE_UP:
      const rtlFix = isHorizontalScroll && isRTL ? -1 : 1;
      const slideGap = 100 * rtlFix;
      const r = () => Math.round(Math.random() * slideGap);
      if (isHorizontalScroll) {
        return (
          createScrollSelectors({
            fromPosition: 0 - slideGap + r(),
            toPosition: 200 + r(),
            fromValue: slideGap,
            toValue: 0,
            selectorSuffix: `#${itemId} > div`,
            animationCss: `transform: translateX(#px);`,
            iterations: 20,
            reverseOnExit: true,
          }) + ` #${itemId} {overflow: visible !important;}`
        );
      } else {
        return createScrollSelectors({
          fromPosition: 0 - slideGap + r(),
          toPosition: 200 + r(),
          fromValue: slideGap,
          toValue: 0,
          selectorSuffix: `#${itemId}`,
          animationCss: `transform: translateY(#px);`,
          iterations: 20,
          reverseOnExit: true,
        });
      }
    case GRAYSCALE:
      return createScrollSelectors({
        fromPosition: 50,
        toPosition: 200,
        fromValue: 100,
        toValue: 0,
        selectorSuffix: `#${itemId} .gallery-item-content`,
        animationCss: 'filter: grayscale(#%);',
      });
    case EXPAND:
      return createScrollSelectors({
        fromPosition: 50,
        toPosition: 200,
        fromValue: 0.9,
        toValue: 1,
        selectorSuffix: `#${itemId} .gallery-item-wrapper`,
        animationCss: 'transform: scale(#);',
      });
    case ZOOM_OUT:
      return createScrollSelectors({
        fromPosition: 50,
        toPosition: 200,
        fromValue: 1.15,
        toValue: 1,
        selectorSuffix: `#${itemId} .gallery-item-wrapper`,
        animationCss: 'transform: scale(#);',
      });
    case SHRINK:
      return createScrollSelectors({
        fromPosition: 50,
        toPosition: 200,
        fromValue: 1.1,
        toValue: 1,
        selectorSuffix: `#${itemId}`,
        animationCss: 'transform: scale(#);',
      });
    case ONE_COLOR:
      const bgColor =
        oneColorAnimationColor?.value ||
        oneColorAnimationColor ||
        'transparent';
      return (
        createScrollSelectors({
          fromPosition: 100,
          toPosition: 250,
          fromValue: 0,
          toValue: 1,
          selectorSuffix: `#${itemId} .gallery-item-wrapper>div`,
          animationCss: `opacity :#;`,
        }) +
        ` #${itemId} .gallery-item-wrapper {background-color: ${bgColor} !important;}`
      );
    case BLUR:
      return createScrollSelectors({
        fromPosition: 50,
        toPosition: 200,
        fromValue: 30,
        toValue: 0,
        selectorSuffix: `#${itemId} .gallery-item-content`,
        animationCss: 'filter: blur(#px);',
      });
    case MAIN_COLOR:
      const pixel = item.createUrl('pixel', 'img');
      return (
        createScrollSelectors({
          fromPosition: 100,
          toPosition: 250,
          fromValue: 0,
          toValue: 1,
          selectorSuffix: `#${itemId} .gallery-item-wrapper>div`,
          animationCss: `opacity :#;`,
        }) +
        ` #${itemId} .gallery-item-wrapper {background-image: url(${pixel}) !important;}`
      );
  }
};
