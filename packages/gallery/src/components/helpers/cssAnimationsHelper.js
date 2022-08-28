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
  let scrollSelectors = [];

  if (scrollAnimation.includes('FADE_IN')) {
    scrollSelectors.push({
      fromPosition: i * 2,
      toPosition: i * 10,
      fromValue: 0,
      toValue: 1,
      selectorSuffix: `#${itemId} .gallery-item-wrapper`,
      entryAnimationCss: 'opacity: #;',
    });
  }
  if (scrollAnimation.includes('GRAYSCALE')) {
    scrollSelectors.push({
      fromPosition: i * 2, //0-200
      toPosition: i * 10, //0-1000
      fromValue: 100,
      toValue: 0,
      selectorSuffix: `#${itemId} .gallery-item-content`,
      entryAnimationCss: 'filter: grayscale(#%);',
    });
  }
  if (scrollAnimation.includes('EXPAND')) {
    scrollSelectors.push({
      fromPosition: i * 2, //0-200
      toPosition: i * 10, //0-1000
      fromValue: Math.round(95 - i / 4) / 100, // 0.95-0.7
      toValue: 1,
      selectorSuffix: `#${itemId} .gallery-item-wrapper`,
      entryAnimationCss: 'transform: scale(#);',
    });
  }
  if (scrollAnimation.includes('ZOOM_OUT')) {
    scrollSelectors.push({
      fromPosition: i * 2, //0-200
      toPosition: i * 10, //0-1000
      fromValue: Math.round(110 + i / 4) / 100, // 1.1-1.35
      toValue: 1,
      selectorSuffix: `#${itemId} .gallery-item-wrapper`,
      entryAnimationCss: 'transform: scale(#);',
    });
  }
  if (scrollAnimation.includes('SHRINK')) {
    scrollSelectors.push({
      fromPosition: i * 2, // 0-200
      toPosition: i * 10, // 0-1000
      fromValue: Math.round(105 + i / 5) / 100, // 1.05-1.25
      toValue: 1,
      selectorSuffix: `#${itemId}`,
      entryAnimationCss: 'transform: scale(#);',
    });
  }
  if (scrollAnimation.includes('BLUR')) {
    scrollSelectors.push({
      fromPosition: i * 2, // 0-200
      toPosition: i * 8, // 0-800
      fromValue: Math.round(25 + i / 2), // 25-75
      toValue: 0,
      selectorSuffix: `#${itemId} .gallery-item-content`,
      entryAnimationCss: 'filter: blur(#px);',
    });
  }
  if (scrollAnimation.includes('HINGE')) {
    scrollSelectors.push({
      fromPosition: i * 2, // 0-200
      toPosition: i * 8, // 0-800
      fromValue: Math.round(5 + i / 5), // 5-25
      toValue: 0,
      selectorSuffix: `#${itemId}`,
      entryAnimationCss: 'transform: rotate(#deg); transform-origin: top left;',
      exitAnimationCss:
        'transform: rotate(#deg); transform-origin: bottom left;',
    });
  }
  if (scrollAnimation.includes('SQUEEZE')) {
    const prop = isHorizontalScroll ? 'X' : 'Y';
    const entryOrigin = isHorizontalScroll ? (isRTL ? 'right' : 'left') : 'top';
    const exitOrigin = isHorizontalScroll
      ? isRTL
        ? 'left'
        : 'right'
      : 'bottom';
    scrollSelectors.push({
      fromPosition: i * 2, // 0-200
      toPosition: i * 8, // 0-800
      fromValue: Math.round((i * 4) / 5) / 100, // .8-0
      toValue: 1,
      selectorSuffix: `#${itemId} .gallery-item-content img`,
      entryAnimationCss: `transform: scale${prop}(#) !important; object-fit: fill; transform-origin: ${entryOrigin};`,
      exitAnimationCss: `transform: scale${prop}(#) !important; object-fit: fill; transform-origin: ${exitOrigin};`,
    });
  }

  if (scrollAnimation.includes('ROTATE3D')) {
    const h = isHorizontalScroll;
    const prop = isHorizontalScroll ? 'X' : 'Y';
    const entryOrigin = isHorizontalScroll ? (isRTL ? 'right' : 'left') : 'top';
    const exitOrigin = isHorizontalScroll
      ? isRTL
        ? 'left'
        : 'right'
      : 'bottom';
    scrollSelectors.push({
      fromPosition: 0, // 0-100
      toPosition: i * 3, // 0-400
      fromValue: (i * 10) / 10, // 0-90
      toValue: 0,
      selectorSuffix: `#${itemId}>div`,
      entryAnimationCss: `transform: rotate3d(-${h ? 0 : 1}, ${
        h ? 1 : 0
      }, 0, #deg); transform-origin: ${entryOrigin};`,
      exitAnimationCss: `transform: rotate3d(${h ? 0 : 1}, -${
        h ? 1 : 0
      }, 0, #deg); transform-origin: ${exitOrigin};`,
    }) + `#${itemId} {perspective: 1000px;}`;
  }

  if (scrollAnimation.includes('ONE_COLOR')) {
    const bgColor =
      oneColorAnimationColor?.value || oneColorAnimationColor || 'transparent';
    scrollSelectors.push({
      fromPosition: i * 2, // 0-200
      toPosition: i * 8, // 0-800
      fromValue: 0,
      toValue: 1,
      selectorSuffix: `#${itemId} .gallery-item-wrapper>div`,
      entryAnimationCss: `opacity :#;`,
    }) +
      ` #${itemId} .gallery-item-wrapper {background-color: ${bgColor} !important;}`;
  }
  if (scrollAnimation.includes('MAIN_COLOR')) {
    const pixel = item.createUrl('pixel', 'img');
    scrollSelectors.push({
      fromPosition: i * 2, // 0-200
      toPosition: i * 8, // 0-800
      fromValue: 0,
      toValue: 1,
      selectorSuffix: `#${itemId} .gallery-item-wrapper>div`,
      entryAnimationCss: `opacity :#;`,
    }) +
      ` #${itemId} .gallery-item-wrapper {background-image: url(${pixel}) !important;}`;
  }
  if (scrollAnimation.includes('SLIDE_UP')) {
    const rtlFix = isHorizontalScroll && isRTL ? -1 : 1;
    const slideGap = i * 2 * rtlFix; // 0-200
    const r = Math.round((Math.random() * slideGap) / 10);
    if (isHorizontalScroll) {
      scrollSelectors.push({
        fromPosition: 0 - slideGap + r,
        toPosition: i * 6 + r, // 0-600
        fromValue: slideGap,
        toValue: 0,
        selectorSuffix: `#${itemId} > div`,
        entryAnimationCss: `transform: translateX(#px);`,
        reverseOnExit: true,
      }) + ` #${itemId} {overflow: visible !important;}`;
    } else {
      scrollSelectors.push({
        fromPosition: 0 - slideGap + r,
        toPosition: i * 4 + r, // 0-400
        fromValue: slideGap,
        toValue: 0,
        selectorSuffix: `#${itemId}`,
        entryAnimationCss: `transform: translateY(#px);`,
        reverseOnExit: true,
      });
    }
  }

  if (scrollAnimation.includes('SLIDE_IN')) {
    if (isHorizontalScroll) {
      scrollSelectors.push({
        fromPosition: 0,
        toPosition: i * 6, // 0-600
        fromValue: 100,
        toValue: 0,
        selectorSuffix: `#${itemId} .gallery-item-wrapper>div`,
        entryAnimationCss: `transform: translateY(#%);`,
        reverseOnExit: true,
      }) + ` #${itemId} {overflow: visible !important;}`;
    } else {
      scrollSelectors.push({
        fromPosition: 0,
        toPosition: i * 4, // 0-400
        fromValue: 100,
        toValue: 0,
        selectorSuffix: `#${itemId} .gallery-item-wrapper>div`,
        entryAnimationCss: `transform: translateX(#%);`,
        reverseOnExit: true,
      });
    }
  }

  if (scrollAnimation.includes('SLIDE_IN_REVERSED')) {
    if (isHorizontalScroll) {
      scrollSelectors.push({
        fromPosition: 0,
        toPosition: i * 6, // 0-600
        fromValue: 100,
        toValue: 0,
        selectorSuffix: `#${itemId} .gallery-item-wrapper>div`,
        entryAnimationCss: `transform: translateY(-#%);`,
        reverseOnExit: true,
        noEasing: true,
      }) + ` #${itemId} {overflow: visible !important;}`;
    } else {
      scrollSelectors.push({
        fromPosition: 0,
        toPosition: i * 4, // 0-400
        fromValue: 100,
        toValue: 0,
        selectorSuffix: `#${itemId} .gallery-item-wrapper>div`,
        entryAnimationCss: `transform: translateX(-#%);`,
        reverseOnExit: true,
        noEasing: true,
      });
    }
  }

  // TODO - merge all scroll selectors into several objects for different ranges

  //   const mergeSelectors = (selectors, fromPosition, toPosition) => {};
  //   let pointData = {};
  //   let points = [];
  //   for (let selector of scrollSelectors) {
  //     const { fromPosition, toPosition } = selector;
  //     if (points.indexOf(fromPosition) === -1) points.push(fromPosition);
  //     if (points.indexOf(toPosition) === -1) points.push(toPosition);
  //   }
  //   points = points.sort((p1, p2) => p1 - p2);

  //   for (let point of points) {
  //     for (let selector of scrollSelectors) {
  //       const { fromPosition, toPosition } = selector;
  //       if (point === fromPosition) {
  //         console.log('pointData[point]', pointData[point]);
  //         pointData[point] = [...(pointData[point] || []), selector];
  //       }
  //       if (point > fromPosition && point < toPosition) {
  //         console.log('pointData[point]', pointData[point]);
  //         pointData[point] = [...(pointData[point] || []), selector];
  //       }
  //     }
  //   }

  //   console.log({ points, pointData });

  return scrollSelectors.map(createScrollSelectors).join(';\n');
};
