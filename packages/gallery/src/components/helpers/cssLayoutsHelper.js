import { cssScrollHelper } from './cssScrollHelper.js';

// // const CDN_URL = 'https://static.wixstatic.com/media/';
// const desktopWidths = [480, 768, 1024, 1280, 1440, 1680, 1920, 2560];
// const mobileWidths = [320]; //, 375, 414, 480, 600, 768, 900]; (mobile is currently fixed to 320px)

const getImageStyle = (item) => ({
  top: item.offset.top,
  left: item.offset.left,
  width: item.width + item.infoWidth,
  height: item.height + item.infoHeight,
  innerHeight: item.height,
});

const createItemId = (domId, item) => {
  return `#pro-gallery-${domId} #${cssScrollHelper.getSellectorDomId(item)}`;
}
const createExactCssForItems = (domId = '', galleryItems, styleParams) => {
  const {isRTL} = styleParams;

  let cssStr = '';
  galleryItems.forEach(item => {
    const id = createItemId(domId, item);
    const style = getImageStyle(item, styleParams);
    const T = `top:${style.top}px;`;
    const L = isRTL ? `right:${style.left}px;left:auto;` : `left:${style.left}px;`;
    const W = `width:${style.width}px;`;
    const H = `height:${style.height}px;`;
    cssStr += `${id} {${T}${L}${W}${H}}`;
    // cssStr += `${id} .gallery-item-wrapper, ${id} .gallery-item-hover, ${id} .gallery-item {${Wvw}${Hvw}}`;
  });
  return cssStr;
};

const createCssFromLayout = (domId = '', layout, styleParams, width) => {
  let cssStr = '';
  const layoutWidth = width - styleParams.imageMargin * 2;
  const getRelativeDimension = val =>
    Math.round(10000 * (val / layoutWidth)) / 100;
  layout.items.forEach((item, i) => {
    const id = createItemId(domId, item);
    if (i < 50) {
      const style = getImageStyle(item, styleParams);
      const Tvw = `top:${getRelativeDimension(style.top)}vw;`;
      const Wvw = `width:${getRelativeDimension(style.width)}vw;`;
      const Hvw = `height:${getRelativeDimension(style.height)}vw;`;
      const iHvw = `height:${getRelativeDimension(style.innerHeight)}vw;`;
      const Lpc = `left:${getRelativeDimension(style.left)}%;`;
      const Wpc = `width:${getRelativeDimension(style.width)}%;`;
      cssStr += `${id} {${Tvw}${Lpc}${Wpc}${Hvw}}`;
      cssStr += `${id} .gallery-item-wrapper, ${id} .gallery-item-hover, ${id} .gallery-item {${Wvw}${iHvw}}`;
    } else {
      cssStr += `${id}{display:none;}`;
    }
  });
  return cssStr;
};

// const createCssFromLayouts = (domId, layouts, styleParams, widths) => {
//   const cssStrs = [];
//   layouts.forEach((layout, idx) => {
//     let cssStr = '';
//     if (layout) {
//       const width = widths[idx];
//       const lastWidth = widths[idx - 1];
//       const isFirstMediaQuery = !lastWidth || cssStrs.length === 0;
//       cssStr += isFirstMediaQuery
//         ? ''
//         : `@media only screen and (min-width: ${(lastWidth * 2 + width) /
//             3}px) {`;
//       cssStr += createCssFromLayout(domId, layout, styleParams, width);
//       cssStr += isFirstMediaQuery ? '' : `}`;
//       cssStrs.push(cssStr);
//     }
//   });

//   return cssStrs;
// };

export const createCssLayouts = ({
  galleryItems,
  layoutParams,
  domId
}) => {
  const exactCss = [];
    exactCss.push(createExactCssForItems(domId, galleryItems, layoutParams.styleParams));
    return exactCss;
};
