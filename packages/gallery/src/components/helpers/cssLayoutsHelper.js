import { GALLERY_CONSTS, optionsMap } from 'pro-gallery-lib';
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

const createItemId = ({ galleryId, item }) => {
  return `#pro-gallery-${galleryId} #${cssScrollHelper.getSellectorDomId(item)}`;
};
const createExactCssForItems = (id = '', galleryItems, options) => {
  const isRTL =
    options[optionsMap.behaviourParams.gallery.layoutDirection] ===
    GALLERY_CONSTS[optionsMap.behaviourParams.gallery.layoutDirection].RIGHT_TO_LEFT;

  let cssStr = '';
  galleryItems.forEach((item) => {
    const itemId = createItemId({ galleryId: id, item });
    const style = getImageStyle(item, options);
    const T = `top:${style.top}px;`;
    const L = isRTL ? `right:${style.left}px;left:auto;` : `left:${style.left}px;`;
    const W = `width:${style.width}px;`;
    const H = `height:${style.height}px;`;
    cssStr += `${itemId} {${T}${L}${W}${H}}`;
    // cssStr += `${id} .gallery-item-wrapper, ${id} .gallery-item-hover, ${id} .gallery-item {${Wvw}${Hvw}}`;
  });
  return cssStr;
};

export const createCssLayouts = ({ galleryItems, layoutParams, id }) => {
  const exactCss = [];
  exactCss.push(createExactCssForItems(id, galleryItems, layoutParams.options));
  return exactCss;
};
