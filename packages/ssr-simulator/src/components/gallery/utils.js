import { GALLERY_CONSTS as Consts } from 'pro-gallery';
import { defaultStyles } from 'pro-gallery-lib';

export const defaultStyleParams = defaultStyles;

export function formatValue(val) {
  if (Number(val) === parseInt(val)) {
    return Number(val);
  } else if (val === 'true') {
    return true;
  } else if (val === 'false') {
    return false;
  }
  if (val === 'undefined') {
    return undefined;
  } else {
    return String(val);
  }
}

export function getStyleParamsFromUrl(searchString) {
  try {
    const styleParams = searchString
      .replace('?', '')
      .split('&')
      .map(styleParam => styleParam.split('='))
      .reduce(
        (obj, [styleParam, value]) =>
          Object.assign(obj, { [styleParam]: formatValue(value) }),
        {}
      );
    return styleParams;
  } catch (e) {
    return {};
  }
}

export function mixAndSlice(array, length, seed) {
  const numFromId = id => Number(id.replace(/\D/g, '')) % Number(seed || 1);

  return array
    .sort((itm1, itm2) => numFromId(itm1.itemId) - numFromId(itm2.itemId))
    .slice(0, length)
    .map((item, idx) => ({
      ...item,
      metadata: {
        ...item.metadata,
        title: `Item #${idx}`
      }
    }));
}
