import { addPresetStyles, getLayoutName, NEW_PRESETS, defaultStyles, galleryOptions } from 'pro-gallery-lib';

const defaultStyleParams = defaultStyles;
Object.entries(galleryOptions).forEach(([styleParam, settings]) => defaultStyleParams[styleParam] = settings.default);

export const getInitialStyleParams = () => {
  const savedStyleParams = getStyleParamsFromUrl();
  return {
    ...defaultStyleParams,
    ...savedStyleParams,
  };
}

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
}

export const isValidStyleParam = (styleParam, value, styleParams) => {
  if (!styleParam) {
    // console.log(`[STYLE PARAMS - VALIDATION] ${styleParam} is undefined`);
    return false;
  }
  if (typeof value === 'undefined') {
    // console.log(`[STYLE PARAMS - VALIDATION] ${styleParam} value is undefined`);
    return false;
  }
  if (value === defaultStyles[styleParam]) {
    // console.log(`[STYLE PARAMS - VALIDATION] ${styleParam} value is as the default: ${value}`);
    return false;
  }
  styleParams = {...defaultStyles, ...styleParams};
  const preset = NEW_PRESETS[getLayoutName(styleParams.galleryLayout)];
  if (styleParam !== 'galleryLayout' && value === preset[styleParam]) {
    // console.log(`[STYLE PARAMS - VALIDATION] ${styleParam} value is as the preset: ${value}`, preset, getLayoutName(styleParams.galleryLayout));
    return false;
  }
  if (!galleryOptions[styleParam]) {
    // console.log(`[STYLE PARAMS - VALIDATION] ${styleParam} has not galleryOptions`);
    return false;
  }
  if (!galleryOptions[styleParam].isRelevant(styleParams)) {
    // console.log(`[STYLE PARAMS - VALIDATION] ${styleParam} value is not relevant`, galleryOptions[styleParam].isRelevant.toString(), styleParams);
    return false;
  }
  return true;
}

export const getStyleParamsFromUrl = () => {
  try {
    let styleParams = window.location.search
      .replace('?', '').split('&')
      .map(styleParam => styleParam.split('='))
      .reduce((obj, [styleParam, value]) => Object.assign(obj, {[styleParam]: formatValue(value)}), {});
      
    styleParams = addPresetStyles(styleParams);

    const relevantStyleParams = Object.entries(styleParams)
      .reduce((obj, [styleParam, value]) => isValidStyleParam(styleParam, value, styleParams) ? Object.assign(obj, {[styleParam]: formatValue(value)}) : obj, {});

    // console.log(`[STYLE PARAMS - VALIDATION] getting styleParams from the url`, relevantStyleParams);
    return relevantStyleParams;
  } catch (e) {
    console.error('Cannot getStyleParamsFromUrl', e)
    return {};
  }
}

export const setStyleParamsInUrl = (styleParams) => {
  // console.log(`[STYLE PARAMS - VALIDATION] setting styleParams in the url`, styleParams);
  const urlParams = Object
    .entries(styleParams)
    .reduce((arr, [styleParam, value]) => isValidStyleParam(styleParam, value, styleParams) ? arr.concat(`${styleParam}=${value}`) : arr, [])
    .join('&')
  //window.location.search = '?' + Object.entries(styleParams).reduce((arr, [styleParam, value]) => arr.concat(`${styleParam}=${value}`), []).join('&')
  // window.location.hash = '#' + Object.entries(styleParams).reduce((arr, [styleParam, value]) => styleParam && arr.concat(`${styleParam}=${value}`), []).join('&')
  window.history.replaceState({}, 'Pro Gallery Playground', '?' + urlParams);
}
