import {createLayout} from 'pro-gallery-layouter';
import {cssScrollHelper} from '../helpers/cssScrollHelper.js';

const CDN_URL = 'https://static.wixstatic.com/media/';
const desktopWidths = [1024, 1280, 1360, 1440, 1680, 1920];
const mobileWidths = [320, 480, 600, 720, 800, 900];
const popularWidths = desktopWidths;

/*
    TODO:
    - check run time and minimize layouts width
    - remove !important if possible
    - fix default width of gallery (currently 990???)
*/

const getImgSize = (item, dimension) => {
  const scale = 1;
  return Math.ceil(Math.min(
      scale * item[dimension],
      item[`max${dimension[0].toUpperCase() + dimension.substring(1)}`]
    ));
};

const getImageSrc = item => {
  const h = getImgSize(item, 'height');
  const w = getImgSize(item, 'width');
  return `${CDN_URL}${item.dto.url}/v1/fit/w_${w},h_${h},al_c,q_80/file.jpg`;
};

const getImageStyle = item => ({
  top: item.offset.top,
  left: item.offset.left,
  width: item.width,
  height: item.height,
  backgroundImage: `url(${getImageSrc(item)})`
});

const createCssFromLayouts = (layouts, styleParams) => {

  const cssStrs = [];
  layouts.forEach((layout, idx) => {
    let cssStr = '';
    const width = popularWidths[idx];
    const isFirstMediaQuery = cssStrs.length === 0;
    if (layout) {
      cssStr += isFirstMediaQuery ? '' : `@media only screen and (min-width: ${width}px) {`;
        // cssStr += `\n.pro-gallery-root-style {
        //   width: ${width}px;
        // }`;
      const layoutWidth = layout.columns.reduce((sum, col) => (sum + col.width), 0) - styleParams.imageMargin * 2;
      layout.items.forEach(item => {
        const style = getImageStyle(item);
        cssStr += `\n#${cssScrollHelper.getDomId(item)} {
            top: ${100 * (style.top / layoutWidth)}vw !important;
            left: ${100 * (style.left / layoutWidth)}vw !important;
            width: ${100 * (style.width / layoutWidth)}vw !important;
            height: ${100 * (style.height / layoutWidth)}vw !important;
          }`;
      });

      cssStr += isFirstMediaQuery ? '' : `}`;
      cssStrs.push(cssStr);
    }
  });

  return cssStrs.join(`\n`);
};

export const createCssLayouts = layoutParams => {
  const cssLayouts = popularWidths.map(width => createLayout({...layoutParams, ...{container: {...layoutParams.container, width}}}));
  return createCssFromLayouts(cssLayouts, layoutParams.styleParams);
};

