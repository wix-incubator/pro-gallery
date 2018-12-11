import {createLayout} from 'pro-gallery-layouter';
import {cssScrollHelper} from '../helpers/cssScrollHelper.js';

// const CDN_URL = 'https://static.wixstatic.com/media/';
const desktopWidths = [1024, 1280, 1360, 1440, 1680, 1920];
const mobileWidths = [320, 480, 600, 720, 800, 900];
const popularWidths = [...mobileWidths, ...desktopWidths];

/*
    TODO:
    - check run time and minimize layouts width
    - remove !important if possible
    - fix default width of gallery (currently 990???)
    - check if is mobile and select the widths accordinly
*/

// const getImgSize = (item, dimension) => {
//   const scale = 1;
//   return Math.ceil(Math.min(
//       scale * item[dimension],
//       item[`max${dimension[0].toUpperCase() + dimension.substring(1)}`]
//     ));
// };

// const getImageSrc = item => {
//   const h = getImgSize(item, 'height');
//   const w = getImgSize(item, 'width');
//   return `${CDN_URL}${item.dto.url}/v1/fit/w_${w},h_${h},al_c,q_80/file.jpg`;
// };

const getImageStyle = item => ({
  top: item.offset.top,
  left: item.offset.left,
  width: item.width,
  height: item.height,
  // backgroundImage: `url(${getImageSrc(item)})`
});

const createCssFromLayouts = (layouts, styleParams) => {

  const cssStrs = [];
  layouts.forEach((layout, idx) => {
    let cssStr = '';
    if (layout) {
      const width = popularWidths[idx];
      const isFirstMediaQuery = cssStrs.length === 0;
      cssStr += isFirstMediaQuery ? '' : `@media only screen and (min-width: ${width}px) {`;
      const layoutWidth = width - styleParams.imageMargin * 2;
      layout.items.forEach((item, i) => {
        const id = cssScrollHelper.getDomId(item);
        if (i < 100) {
          const style = getImageStyle(item);
          cssStr += `#${id} {` +
              `top:${Math.round(10000 * (style.top / layoutWidth)) / 100}vw !important;` +
              `left:${Math.round(10000 * (style.left / layoutWidth)) / 100}vw !important;` +
              `width:${Math.round(10000 * (style.width / layoutWidth)) / 100}vw !important;` +
              `height:${Math.round(10000 * (style.height / layoutWidth)) / 100}vw !important;` +
            `}`;
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

export const createCssLayouts = layoutParams => {
  const cssLayouts = popularWidths.map(width => {
    const _layoutParams = {...layoutParams, ...{container: {...layoutParams.container, galleryWidth: width, width}}};
    return createLayout(_layoutParams);
  });
  return createCssFromLayouts(cssLayouts, layoutParams.styleParams);
};

