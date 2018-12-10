import {createLayout} from 'pro-gallery-layouter';
import {cssScrollHelper} from '../helpers/cssScrollHelper.js';

const CDN_URL = 'https://static.wixstatic.com/media/';
const popularWidths = [5120, 4096, 3840, 3000, 2880, 2732, 2560, 2304, 2160, 2048, 1920, 1680, 1600, 1536, 1440, 1366, 1280, 1200, 1080, 1024, 960, 900, 854, 800, 768, 720, 640, 600, 540, 480, 320];

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
  layouts.each((layout, idx) => {
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

