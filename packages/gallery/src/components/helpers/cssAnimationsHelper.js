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
    SLIDE_IN,
    SLIDE_IN_REVERSED,
    EXPAND,
    SHRINK,
    ZOOM_OUT,
    ONE_COLOR,
    MAIN_COLOR,
    BLUR,
    HINGE,
    SQUEEZE,
    ROTATE3D,
    FLIP,
  } = GALLERY_CONSTS.scrollAnimations;

  const i = scrollAnimationIntensity || 25;
  const r = (num) => num + Math.round((Math.random() * i) / 4);

  switch (scrollAnimation) {
    case FADE_IN:
      return createScrollSelectors({
        fromPosition: r(i * 2),
        toPosition: r(100 + i * 10),
        fromValue: 0,
        toValue: 1,
        selectorSuffix: `#${itemId} .gallery-item-wrapper`,
        entryAnimationCss: 'opacity: #;',
      });
    case GRAYSCALE:
      return createScrollSelectors({
        fromPosition: r(i * 2), //0-200
        toPosition: r(100 + i * 10), //0-1000
        fromValue: 100,
        toValue: 0,
        selectorSuffix: `#${itemId} .gallery-item-content`,
        entryAnimationCss: 'filter: grayscale(#%);',
      });
    case EXPAND:
      return createScrollSelectors({
        fromPosition: r(i * 2), //0-200
        toPosition: r(100 + i * 10), //0-1000
        fromValue: Math.round(95 - i / 4) / 100, // 0.95-0.7
        toValue: 1,
        selectorSuffix: `#${itemId} .gallery-item-wrapper`,
        entryAnimationCss: 'transform: scale(#);',
      });
    case ZOOM_OUT:
      return createScrollSelectors({
        fromPosition: r(i * 2), //0-200
        toPosition: r(100 + i * 10), //0-1000
        fromValue: Math.round(110 + i / 4) / 100, // 1.1-1.35
        toValue: 1,
        selectorSuffix: `#${itemId} .gallery-item-wrapper`,
        entryAnimationCss: 'transform: scale(#);',
      });
    case SHRINK:
      return createScrollSelectors({
        fromPosition: r(i * 2), // 0-200
        toPosition: r(100 + i * 10), // 0-1000
        fromValue: Math.round(101 + i / 20) / 100, // 1.05-1.25
        toValue: 1,
        selectorSuffix: `#${itemId}`,
        entryAnimationCss: 'transform: scale(#);',
      });
    case BLUR:
      return createScrollSelectors({
        fromPosition: r(i * 2), // 0-200
        toPosition: r(100 + i * 5), // 0-800
        fromValue: Math.round(i / 2), // 0-50
        toValue: 0,
        selectorSuffix: `#${itemId} .gallery-item-content`,
        entryAnimationCss: 'filter: blur(#px);',
      });
    case HINGE:
      return createScrollSelectors({
        fromPosition: r(i * 2), // 0-200
        toPosition: r(100 + i * 8), // 0-800
        fromValue: Math.round(5 + i / 5), // 5-25
        toValue: 0,
        selectorSuffix: `#${itemId}`,
        entryAnimationCss:
          'transform: rotate(#deg); transform-origin: top left;',
        exitAnimationCss:
          'transform: rotate(#deg); transform-origin: bottom left;',
      });
    case SQUEEZE: {
      const prop = isHorizontalScroll ? 'X' : 'Y';
      const entryOrigin = isHorizontalScroll
        ? isRTL
          ? 'right'
          : 'left'
        : 'top';
      const exitOrigin = isHorizontalScroll
        ? isRTL
          ? 'left'
          : 'right'
        : 'bottom';
      return createScrollSelectors({
        fromPosition: r(i), // 0-200
        toPosition: r(100 + i * 4), // 0-800
        fromValue: Math.round((i * 4) / 5) / 100, // .8-0
        toValue: 1,
        selectorSuffix: `#${itemId} .gallery-item-content img`,
        entryAnimationCss: `transform: scale${prop}(#) !important; object-fit: fill; transform-origin: ${entryOrigin};`,
        exitAnimationCss: `transform: scale${prop}(#) !important; object-fit: fill; transform-origin: ${exitOrigin};`,
      });
    }
    case ROTATE3D: {
      const h = isHorizontalScroll;
      const prop = isHorizontalScroll ? 'X' : 'Y';
      const entryOrigin = isHorizontalScroll
        ? isRTL
          ? 'right'
          : 'left'
        : 'top';
      const exitOrigin = isHorizontalScroll
        ? isRTL
          ? 'left'
          : 'right'
        : 'bottom';
      return (
        createScrollSelectors({
          fromPosition: r(0), //) 0-100
          toPosition: r(100 + i * 3), // 0-400
          fromValue: (i * 9) / 10, // 0-90
          toValue: 0,
          selectorSuffix: `#${itemId}>div`,
          entryAnimationCss: `transform: rotate3d(-${h ? 0 : 1}, ${
            h ? 1 : 0
          }, 0, #deg); transform-origin: ${entryOrigin};`,
          exitAnimationCss: `transform: rotate3d(${h ? 0 : 1}, -${
            h ? 1 : 0
          }, 0, #deg); transform-origin: ${exitOrigin};`,
        }) + `#${itemId} {perspective: 1000px;}`
      );
    }
    case ONE_COLOR:
      const bgColor =
        oneColorAnimationColor?.value ||
        oneColorAnimationColor ||
        'transparent';
      return (
        createScrollSelectors({
          fromPosition: r(i), // 0-200
          toPosition: r(100 + i * 7), // 0-800
          fromValue: 0,
          toValue: 1,
          selectorSuffix: `#${itemId} .gallery-item-wrapper>div`,
          entryAnimationCss: `opacity :#;`,
        }) +
        ` #${itemId} .gallery-item-wrapper {background-color: ${bgColor} !important;}`
      );
    case MAIN_COLOR:
      const pixel = item.createUrl('pixel', 'img');
      return (
        createScrollSelectors({
          fromPosition: r(i),
          toPosition: r(100 + i * 7),
          fromValue: 0,
          toValue: 1,
          selectorSuffix: `#${itemId} .gallery-item-wrapper>div`,
          entryAnimationCss: `opacity :#;`,
        }) +
        ` #${itemId} .gallery-item-wrapper {background-image: url(${pixel}) !important;}`
      );
    case SLIDE_UP: {
      const rtlFix = isHorizontalScroll && isRTL ? -1 : 1;
      const slideGap = i * 2 * rtlFix; // 0-200
      if (isHorizontalScroll) {
        return (
          createScrollSelectors({
            fromPosition: r(0 - slideGap),
            toPosition: r(100 + i * 6), // 0-600
            fromValue: slideGap,
            toValue: 0,
            selectorSuffix: `#${itemId} > div`,
            entryAnimationCss: `transform: translateX(#px);`,
            reverseOnExit: true,
          }) + ` #${itemId} {overflow: visible !important;}`
        );
      } else {
        return createScrollSelectors({
          fromPosition: r(0 - slideGap),
          toPosition: r(100 + i * 4), // 0-400
          fromValue: slideGap,
          toValue: 0,
          selectorSuffix: `#${itemId}`,
          entryAnimationCss: `transform: translateY(#px);`,
          reverseOnExit: true,
        });
      }
    }
    case SLIDE_IN: {
      if (isHorizontalScroll) {
        return (
          createScrollSelectors({
            fromPosition: r(0),
            toPosition: r(100 + i * 6), // 0-600
            fromValue: 100,
            toValue: 0,
            selectorSuffix: `#${itemId} .gallery-item-wrapper>div`,
            entryAnimationCss: `transform: translateY(#%);`,
            reverseOnExit: true,
          }) + ` #${itemId} {overflow: visible !important;}`
        );
      } else {
        return createScrollSelectors({
          fromPosition: r(0),
          toPosition: r(100 + i * 4), // 0-400
          fromValue: 100,
          toValue: 0,
          selectorSuffix: `#${itemId} .gallery-item-wrapper>div`,
          entryAnimationCss: `transform: translateX(#%);`,
          reverseOnExit: true,
        });
      }
    }
    case SLIDE_IN_REVERSED: {
      if (isHorizontalScroll) {
        return (
          createScrollSelectors({
            fromPosition: r(0),
            toPosition: r(100 + i * 6), // 0-600
            fromValue: 100,
            toValue: 0,
            selectorSuffix: `#${itemId} .gallery-item-wrapper>div`,
            entryAnimationCss: `transform: translateY(-#%);`,
            reverseOnExit: true,
            noEasing: true,
          }) + ` #${itemId} {overflow: visible !important;}`
        );
      } else {
        return createScrollSelectors({
          fromPosition: r(0),
          toPosition: r(100 + i * 4), // 0-400
          fromValue: 100,
          toValue: 0,
          selectorSuffix: `#${itemId} .gallery-item-wrapper>div`,
          entryAnimationCss: `transform: translateX(-#%);`,
          reverseOnExit: true,
          noEasing: true,
        });
      }
    }
  }
};
