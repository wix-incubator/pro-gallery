import {
  getLayoutName,
  NEW_PRESETS,
  galleryOptions,
  flattenObject,
  flatToNested,
  optionsMap,
  flatV4DefaultOptions,
} from 'pro-gallery-lib';

// Object.entries(galleryOptions).forEach( //NEW STYPEPARAMS METHOD - after the old are gone we can use this again
//   ([option, settings]) =>
//     (flatV4DefaultOptions[option] = settings.default)
// );

export const getInitialOptions = () => {
  const savedOptions = getOptionsFromUrl(window.location.search);

  return {
    newSPs: true,
    ...flatV4DefaultOptions,
    ...savedOptions,
  };
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

export const isValidOption = (option, value, options) => {
  if (!option) {

    // console.log(`[STYLE PARAMS - VALIDATION] ${option} is undefined`);
    return false;
  }
  if (typeof value === 'undefined') {

    // console.log(`[STYLE PARAMS - VALIDATION] ${option} value is undefined`);
    return false;
  }
  if (value === flatV4DefaultOptions[option]) {

    // console.log(`[STYLE PARAMS - VALIDATION] ${option} value is as the default: ${value}`);
    return false;
  }
  options = { ...flatV4DefaultOptions, ...options };
  const flatFixedPresetOptions = NEW_PRESETS['newSPs_' + getLayoutName(options[optionsMap.layoutParams.structure.galleryLayout])];
  options = { ...options, ...flatFixedPresetOptions, }
  if (option !== optionsMap.layoutParams.structure.galleryLayout && value === flatFixedPresetOptions[option]) {

    // console.log(`[STYLE PARAMS - VALIDATION] ${option} value is as the flatFixedPresetStyles: ${value}`, flatFixedPresetStyles, getLayoutName(options.galleryLayout));
    return false;
  }
  if (!galleryOptions[option]) {

    // console.log(`[STYLE PARAMS - VALIDATION] ${option} has not galleryOptions`);
    return false;
  }
  if (!galleryOptions[option].isRelevant(flatToNested(options))) {
    // console.log(`[STYLE PARAMS - VALIDATION] ${option} value is not relevant`, galleryOptions[option].isRelevant.toString(), options);
    return false;
  }
  return true;
};

export const getOptionsFromUrl = (locationSearchString) => {
  try {
    let options = locationSearchString
    .replace('?', '')
    .split('&')
    .map((option) => option.split('='))
    .reduce(
      (obj, [option, value]) =>
      Object.assign(obj, { [option]: formatValue(value) }),
      {}
      );
      const relevantOptions = Object.entries(options).reduce(
        (obj, [option, value]) =>
        isValidOption(option, value, options)
        ? Object.assign(obj, { [option]: formatValue(value) })
        : obj,
        {}
        );
    return relevantOptions; //flatOptions
  } catch (e) {
    console.error('Cannot getOptionsFromUrl', e);
    return {};
  }
};

export const setOptionsInUrl = (options) => {
  const flatSP = flattenObject(options);
  // console.log(`[STYLE PARAMS - VALIDATION] setting options in the url`, options);
  const urlParams = Object.entries(flatSP)
    .reduce(
      (arr, [option, value]) =>
        isValidOption(option, value, flatSP)
          ? arr.concat(`${option}=${value}`)
          : arr,
      []
    )
    .join('&');
  //window.location.search = '?' + Object.entries(options).reduce((arr, [option, value]) => arr.concat(`${option}=${value}`), []).join('&')
  // window.location.hash = '#' + Object.entries(options).reduce((arr, [option, value]) => option && arr.concat(`${option}=${value}`), []).join('&')
  window.history.replaceState({}, 'Pro Gallery Playground', '?' + urlParams);
};
