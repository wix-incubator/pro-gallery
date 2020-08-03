import { NEW_PRESETS, utils } from 'pro-gallery-lib';
import { formatLeanGalleryStyles } from './leanGallery';
import { handledStyleParams, fixedStyleParams } from './consts';
//example: http://pro-gallery.surge.sh/?titlePlacement=DONT_SHOW&itemClick=nothing&allowHover=false&galleryLayout=2&allowLeanGallery=true

const MAX_ITEMS_COUNT = 25;

export default ({items, styles, totalItemsCount = 0}) => {
  styles = formatLeanGalleryStyles(styles);
  const allowLeanGallery = !!styles.allowLeanGallery;

  if (!allowLeanGallery) {
    return false;
  }

  if (totalItemsCount > items.length) {
    utils.isVerbose() && console.log(`[LEAN GALLERY] NOT ALLOWED - not all items arrived`, totalItemsCount, items.length );
    return false;
  }

  const totalItems = Math.max(items.length, totalItemsCount);
  if (totalItems > MAX_ITEMS_COUNT) {
    utils.isVerbose() && console.log(`[LEAN GALLERY] NOT ALLOWED - more than ${MAX_ITEMS_COUNT} items`, totalItems);
    return false;
  }
  for (const item of items) {
    if (!isImage(item)) {
      utils.isVerbose() && console.log(`[LEAN GALLERY] NOT ALLOWED - an item that is not an image`, item);
      return false;
    }
  }
  for (const [styleParam, value] of Object.entries(styles)) {
    if (!isValidStyleParam(styleParam, value, styles)) {
      utils.isVerbose() && console.log(`[LEAN GALLERY] NOT ALLOWED - invalid styleParam`, styleParam, value);
      return false;
    }
  }

  utils.isVerbose() && console.log(`[LEAN GALLERY] ALLOWED!`, styles);
  return true;
}

export const notEligibleReasons = ({items, styles}) => {
  const s = {...styles, ...NEW_PRESETS.grid, allowLeanGallery: true};
  const res = [];
  if (String(styles.galleryLayout) !== '2') {
    res.push('not a Grid layout');
  }
  if (items.length > MAX_ITEMS_COUNT) {
    res.push(`more than ${MAX_ITEMS_COUNT} items`);
  }
  let nonImagesCount = 0;
  for (const item of items) {
    if (!isImage(item)) {
      nonImagesCount++;
    }
  }
  if (nonImagesCount > 0) {
    res.push(`${nonImagesCount} items are not an image`);
  }
  for (const [styleParam, value] of Object.entries(s)) {
    if (!isValidStyleParam(styleParam, value, s)) {
      res.push(`invalid style: ${styleParam} => ${value}`);
    }
  }

  return res;
}

//#region Helper Functions
const isImage = item => {
  const meta = item.metadata || item.metaData;
  const isImageItem = !!(
    (!meta.type || meta.type === 'image') &&
    (item.url || item.mediaUrl || item.src)
  );
  return isImageItem;
}

const isValidStyleParam = (styleParam, value, allStyles) => {
  if (typeof handledStyleParams[styleParam] !== 'undefined') return true;
  // if (typeof ignoredStyleParams[styleParam] !== 'undefined') return true;
  if (typeof fixedStyleParams[styleParam] !== 'undefined') {
    const sp = fixedStyleParams[styleParam];
    if (sp && typeof sp === 'function') {
      return sp(allStyles);
    } else if (sp && sp.length > 0) {
      return sp.includes(value);
    } else {
      return sp === value;
    }
  }
  return true;
}
//#endregion
