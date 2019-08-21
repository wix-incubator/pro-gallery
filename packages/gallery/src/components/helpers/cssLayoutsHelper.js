import { createLayout } from 'pro-layouts';
import { cssScrollHelper } from './cssScrollHelper.js';

// const CDN_URL = 'https://static.wixstatic.com/media/';
const desktopWidths = [480, 768, 1024, 1280, 1440, 1680, 1920, 2560];
const mobileWidths = [320]; //, 375, 414, 480, 600, 768, 900]; (mobile is currently fixed to 320px)

const getImageStyle = item => ({
  top: item.offset.top,
  left: item.offset.left,
  width: item.width,
  height: item.height,
});

const createExactCssForItems = galleryItems => {
  let cssStr = '';
  galleryItems.forEach((item, i) => {
    const id = cssScrollHelper.getDomId(item);
    const style = getImageStyle(item);
    const T = `top:${style.top}px;`;
    const L = `left:${style.left}px;`;
    const W = `width:${style.width}px;`;
    const H = `height:${style.height}px;`;
    cssStr += `#${id} {${T}${L}${W}${H}}`;
    // cssStr += `#${id} .gallery-item-wrapper, #${id} .gallery-item-hover, #${id} .gallery-item {${Wvw}${Hvw}}`;
  });
  return cssStr;
};

const createCssFromLayout = (layout, styleParams, width) => {
  let cssStr = '';
  const layoutWidth = width - styleParams.imageMargin * 2;
  const getRelativeDimension = val =>
    Math.round(10000 * (val / layoutWidth)) / 100;
  layout.items.forEach((item, i) => {
    const id = cssScrollHelper.getDomId(item);
    if (i < 50) {
      const style = getImageStyle(item);
      const Tvw = `top:${getRelativeDimension(style.top)}vw;`;
      const Wvw = `width:${getRelativeDimension(style.width)}vw;`;
      const Hvw = `height:${getRelativeDimension(style.height)}vw;`;
      const Lpc = `left:${getRelativeDimension(style.left)}%;`;
      const Wpc = `width:${getRelativeDimension(style.width)}%;`;
      cssStr += `#${id} {${Tvw}${Lpc}${Wpc}${Hvw}}`;
      cssStr += `#${id} .gallery-item-wrapper, #${id} .gallery-item-hover, #${id} .gallery-item {${Wvw}${Hvw}}`;
    } else {
      cssStr += `#${id}{display:none;}`;
    }
  });
  return cssStr;
};

const createCssFromLayouts = (layouts, styleParams, widths) => {
  const cssStrs = [];
  layouts.forEach((layout, idx) => {
    let cssStr = '';
    if (layout) {
      const width = widths[idx];
      const lastWidth = widths[idx - 1];
      const isFirstMediaQuery = !lastWidth || cssStrs.length === 0;
      cssStr += isFirstMediaQuery
        ? ''
        : `@media only screen and (min-width: ${(lastWidth * 2 + width) /
            3}px) {`;
      cssStr += createCssFromLayout(layout, styleParams, width);
      cssStr += isFirstMediaQuery ? '' : `}`;
      cssStrs.push(cssStr);
    }
  });

  return cssStrs;
};

export const createCssLayouts = ({
  isApproximation,
  galleryStructure,
  layoutParams,
  isMobile,
}) => {
  if (isApproximation) {
    const widths = isMobile ? mobileWidths : desktopWidths;
    const cssLayouts = widths.map(width => {
      const _layoutParams = {
        ...layoutParams,
        ...{
          container: { ...layoutParams.container, galleryWidth: width, width },
        },
      };
      return createLayout(_layoutParams);
    });
    return createCssFromLayouts(cssLayouts, layoutParams.styleParams, widths);
  } else {
    const chunkSize = 10;
    const itemsBatchs = [];
    for (let i = 0; i < galleryStructure.galleryItems.length; i += chunkSize) {
      itemsBatchs.push(galleryStructure.galleryItems.slice(i, i + chunkSize));
    }
    return itemsBatchs.map(galleryItems =>
      createExactCssForItems(galleryItems),
    );
  }
};
