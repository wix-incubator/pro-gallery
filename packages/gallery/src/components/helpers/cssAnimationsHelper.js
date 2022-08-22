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
      return createScrollSelectors(
        [0, 100],
        `#${itemId} .gallery-item-wrapper`,
        'opacity: #;',
        [0, 1]
      );
    case SLIDE_UP:
      const rtlFix = oneRow && isRTL ? -1 : 1;
      const slideGap = rtlFix * 50;
      if (oneRow) {
        return (
          createScrollSelectors(
            [0, 80],
            `#${itemId} > div`,
            `transform: translateX(#px);`,
            [slideGap, 0],
            [-1 * slideGap, 0]
          ) + ` #${itemId} {overflow: visible !important;}`
        );
      } else {
        return createScrollSelectors(
          [0, 500],
          `#${itemId}`,
          `transform: translateY(#px);`,
          [slideGap, 0],
          [-1 * slideGap, 0]
        );
      }
    case GRAYSCALE:
      return createScrollSelectors(
        [0, 200],
        `#${itemId} .gallery-item-content`,
        'filter: grayscale(#%);',
        [100, 0]
      );
    case EXPAND:
      return createScrollSelectors(
        [0, 100],
        `#${itemId} .gallery-item-wrapper`,
        'transform: scale(#);',
        [0.95, 1]
      );
    case ZOOM_OUT:
      return createScrollSelectors(
        [0, 100],
        `#${itemId} .gallery-item-wrapper`,
        'transform: scale(#);',
        [1.15, 1]
      );
    case SHRINK:
      return createScrollSelectors(
        [0, 100],
        `#${itemId}`,
        'transform: scale(#);',
        [1.02, 1]
      );
    case ONE_COLOR:
      const bgColor =
        oneColorAnimationColor?.value ||
        oneColorAnimationColor ||
        'transparent';
      return (
        createScrollSelectors(
          [0, 100],
          `#${itemId} .gallery-item-wrapper>div`,
          `opacity :#;`,
          [0, 1]
        ) +
        ` #${itemId} .gallery-item-wrapper {background-color: ${bgColor} !important;}`
      );
    case BLUR:
      return createScrollSelectors(
        [0, 100],
        `#${itemId} .gallery-item-content`,
        'filter: blur(#px);',
        [30, 0]
      );
    case MAIN_COLOR:
      const pixel = item.createUrl('pixel', 'img');
      return (
        createScrollSelectors(
          [0, 100],
          `#${itemId} .gallery-item-wrapper>div`,
          `opacity :#;`,
          [0, 1]
        ) +
        ` #${itemId} .gallery-item-wrapper {background-image: url(${pixel}) !important;}`
      );
  }
};
