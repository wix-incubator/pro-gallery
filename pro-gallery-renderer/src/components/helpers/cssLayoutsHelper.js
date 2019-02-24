import {createLayout} from 'pro-gallery-layouter';
import {cssScrollHelper} from '../helpers/cssScrollHelper.js';

// const CDN_URL = 'https://static.wixstatic.com/media/';
const desktopWidths = [480, 768, 1024, 1280, 1680, 1920, 2560];
const mobileWidths = [320];//, 375, 414, 480, 600, 768, 900]; (mobile is currently fixed to 320px)

const getImageStyle = item => ({
  top: item.offset.top,
  left: item.offset.left,
  width: item.width,
  height: item.height,
  // backgroundImage: `url(${getImageSrc(item)})`
});

const createCssFromLayouts = (layouts, styleParams, widths) => {

  const cssStrs = [];
  layouts.forEach((layout, idx) => {
    let cssStr = '';
    if (layout) {
      const width = widths[idx];
      const lastWidth = widths[idx - 1];
      const isFirstMediaQuery = !lastWidth || cssStrs.length === 0;
      cssStr += isFirstMediaQuery ? '' : `@media only screen and (min-width: ${(lastWidth * 2 + width) / 3}px) {`;
      const layoutWidth = width - styleParams.imageMargin * 2;
      layout.items.forEach((item, i) => {
        const id = cssScrollHelper.getDomId(item);
        if (i < 50) {
          const style = getImageStyle(item);
          const top = `top:${Math.round(10000 * (style.top / layoutWidth)) / 100}vw !important;`;
          // const left = `left:${Math.round(10000 * (style.left / layoutWidth)) / 100}vw !important;`;
          const width = `width:${Math.round(10000 * (style.width / layoutWidth)) / 100}vw !important;`;
          const height = `height:${Math.round(10000 * (style.height / layoutWidth)) / 100}vw !important;`;
          const leftPercent = `left:${Math.round(10000 * (style.left / layoutWidth)) / 100}% !important;`;
          const widthPercent = `width:${Math.round(10000 * (style.width / layoutWidth)) / 100}% !important;`;
          const transition = 'all 0.4s ease';
          cssStr += `#${id} {${top}${leftPercent}${widthPercent}${height}${transition}}`;
          cssStr += `#${id} .gallery-item-wrapper, #${id} .gallery-item-hover, #${id} .gallery-item {${width}${height}}`;
        } else {
          cssStr += `#${id}{display:none;}`;
        }
      });

      cssStr += isFirstMediaQuery ? '' : `}`;
      cssStrs.push(cssStr);
    }
  });

  return cssStrs;
};

export const createCssLayouts = (layoutParams, isMobile) => {
  const widths = (isMobile ? mobileWidths : desktopWidths);
  const cssLayouts = widths.map(width => {
    const _layoutParams = {...layoutParams, ...{container: {...layoutParams.container, galleryWidth: width, width}}};
    return createLayout(_layoutParams);
  });
  return createCssFromLayouts(cssLayouts, layoutParams.styleParams, widths);
};

