import { defaultStyles } from 'pro-gallery';
import { galleryOptions } from 'pro-gallery-lib';

export const getInitialStyleParams = () => {
  const savedStyleParams = getStyleParamsFromUrl();
  return {
    ...defaultStyles,
    ...savedStyleParams,
  };
}

const formatValue = (val) => {
  if (Number(val) === parseInt(val)) {
    return Number(val);
   } else if (val === 'true') {
     return true;
   } else if (val === 'false') {
     return false;
   } else {
     return String(val);
   }
}

export const isValidStyleParam = (styleParam, value, styleParams) => {
  if (typeof value === 'undefined' || !styleParam) {
    return false;
  }
  if (value === defaultStyles[styleParam]) {
    return false;
  }
  if (styleParams && (!galleryOptions[styleParam] || !galleryOptions[styleParam].isRelevant(styleParams))) {
    return false;
  }
  return true;
}

export const getStyleParamsFromUrl = () => {
  try {
    const styleParams = window.location.search
      .replace('?', '').split('&')
      .map(styleParam => styleParam.split('='))
      .reduce((obj, [styleParam, value]) => isValidStyleParam(styleParam, value) ? Object.assign(obj, {[styleParam]: formatValue(value)}) : obj, {});

    return styleParams;
  } catch (e) {
    return {};
  }
}

export const setStyleParamsInUrl = (styleParams) => {
  const urlParams = Object
    .entries(styleParams)
    .reduce((arr, [styleParam, value]) => isValidStyleParam(styleParam, value, styleParams) ? arr.concat(`${styleParam}=${value}`) : arr, [])
    .join('&')
  //window.location.search = '?' + Object.entries(styleParams).reduce((arr, [styleParam, value]) => arr.concat(`${styleParam}=${value}`), []).join('&')
  // window.location.hash = '#' + Object.entries(styleParams).reduce((arr, [styleParam, value]) => styleParam && arr.concat(`${styleParam}=${value}`), []).join('&')
  window.history.replaceState({}, 'Pro Gallery Playground', '?' + urlParams);
}

// Object.entries(galleryOptions).forEach(([styleParam, settings]) => defaultStyles[styleParam] = settings.default);

export const galleryLayoutId = {
  empty: -1,
  collage: 0,
  masonry: 1,
  grid: 2,
  thumbnails: 3,
  slider: 4,
  slideshow: 5,
  panorama: 6,
  column: 7,
  magic: 8,
  fullsize: 9,
};
