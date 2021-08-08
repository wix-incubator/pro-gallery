import {
  // addPresetStyles,
  getLayoutName,
  NEW_PRESETS,
  defaultStyles,
  galleryOptions,
  flattenObject,
  flatToNested,
} from 'pro-gallery-lib';

const defaultStyleParams = flattenObject(defaultStyles);
Object.entries(galleryOptions).forEach(
  ([styleParam, settings]) =>
    (defaultStyleParams[styleParam] = settings.default)
);

export const getInitialStyleParams = () => {
  const savedStyleParams = getStyleParamsFromUrl();
  return ({
    ...defaultStyleParams,
    ...savedStyleParams,
  });
};

const formatValue = (val) => {
  if (String(val) === 'true') {
    return true;
  } else if (String(val) === 'false') {
    return false;
  } else if (Number(val) === parseInt(val)) {
    return Number(val);
  } else {
    return String(val);
  }
};

export const isValidStyleParam = (styleParam, value, styleParams) => {
  if (!styleParam) {

    // console.log(`[STYLE PARAMS - VALIDATION] ${styleParam} is undefined`);
    return false;
  }
  if (typeof value === 'undefined') {

    // console.log(`[STYLE PARAMS - VALIDATION] ${styleParam} value is undefined`);
    return false;
  }
  if (value === defaultStyleParams[styleParam]) {

    // console.log(`[STYLE PARAMS - VALIDATION] ${styleParam} value is as the default: ${value}`);
    return false;
  }
  styleParams = { ...defaultStyleParams, ...styleParams };
  const flatFixedPresetStyles = flattenObject(NEW_PRESETS[getLayoutName(styleParams.galleryLayout)]);
  if (styleParam !== 'galleryLayout' && value === flatFixedPresetStyles[styleParam]) {

    // console.log(`[STYLE PARAMS - VALIDATION] ${styleParam} value is as the flatFixedPresetStyles: ${value}`, flatFixedPresetStyles, getLayoutName(styleParams.galleryLayout));
    return false;
  }
  if (!galleryOptions[styleParam]) {

    // console.log(`[STYLE PARAMS - VALIDATION] ${styleParam} has not galleryOptions`);
    return false;
  }
  if (!galleryOptions[styleParam].isRelevant(flatToNested(styleParams))) {

    // console.log(`[STYLE PARAMS - VALIDATION] ${styleParam} value is not relevant`, galleryOptions[styleParam].isRelevant.toString(), styleParams);
    return false;
  }
  return true;
};

export const getStyleParamsFromUrl = () => {
  try {
    let styleParams = window.location.search
    .replace('?', '')
    .split('&')
    .map((styleParam) => styleParam.split('='))
    .reduce(
      (obj, [styleParam, value]) =>
      Object.assign(obj, { [styleParam]: formatValue(value) }),
      {}
      );
      const relevantStyleParams = Object.entries(styleParams).reduce(
        (obj, [styleParam, value]) =>
        isValidStyleParam(styleParam, value, styleParams)
        ? Object.assign(obj, { [styleParam]: formatValue(value) })
        : obj,
        {}
        );
    return relevantStyleParams; //flatStyleParams
  } catch (e) {
    console.error('Cannot getStyleParamsFromUrl', e);
    return {};
  }
};

export const setStyleParamsInUrl = (styleParams) => {
  const flatSP = flattenObject(styleParams);
  // console.log(`[STYLE PARAMS - VALIDATION] setting styleParams in the url`, styleParams);
  const urlParams = Object.entries(flatSP)
    .reduce(
      (arr, [styleParam, value]) =>
        isValidStyleParam(styleParam, value, flatSP)
          ? arr.concat(`${styleParam}=${value}`)
          : arr,
      []
    )
    .join('&');
  //window.location.search = '?' + Object.entries(styleParams).reduce((arr, [styleParam, value]) => arr.concat(`${styleParam}=${value}`), []).join('&')
  // window.location.hash = '#' + Object.entries(styleParams).reduce((arr, [styleParam, value]) => styleParam && arr.concat(`${styleParam}=${value}`), []).join('&')
  window.history.replaceState({}, 'Pro Gallery Playground', '?' + urlParams);
};
