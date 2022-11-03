import {
  getLayoutName,
  NEW_PRESETS,
  galleryOptions,
  optionsMap,
  flatV4DefaultOptions,
  extendNestedOptionsToIncludeOldAndNew,
  addPresetOptions,
} from 'pro-gallery-lib';
import {optionsList} from './settings'

optionsList.forEach( 
  (option) => {
    if(galleryOptions[option]?.default !== undefined) { 
    flatV4DefaultOptions[option] = galleryOptions[option].default
    }
  }
);

export const getInitialOptions = () => {
  const savedOptions = getOptionsFromUrl(window.location.search);

  return {
    newSPs: true,
    ...flatV4DefaultOptions,
    ...savedOptions,
  };
};
const arrayKeys = [
  optionsMap.layoutParams.crop.ratios,
  optionsMap.layoutParams.structure.columnRatios,
  optionsMap.layoutParams.groups.allowedGroupTypes,
  optionsMap.layoutParams.groups.repeatingGroupTypes,
]
const formatValue = (val, option) => {
  if(typeof val === 'object') {
    return val;
  }
  if(arrayKeys.includes(option)){
    return val.split(',')
  }
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
  const fixedPresetOptions = NEW_PRESETS['newSPs_' + getLayoutName(options[optionsMap.layoutParams.structure.galleryLayout])];
  options = { ...options, ...fixedPresetOptions, }
  if (option !== optionsMap.layoutParams.structure.galleryLayout && value === fixedPresetOptions[option]) {
    // console.log(`[STYLE PARAMS - VALIDATION] ${option} value is as the fixedPresetOptions: ${value}`, fixedPresetOptions, getLayoutName(options.galleryLayout));
    return false;
  }
  if (!galleryOptions[option]) {

    // console.log(`[STYLE PARAMS - VALIDATION] ${option} has not galleryOptions`);
    return false;
  }
  if (!galleryOptions[option].isRelevant(options)) {
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
      Object.assign(obj, { [option]: formatValue(value, option) }),
      {}
      );
      options = extendNestedOptionsToIncludeOldAndNew(addPresetOptions({newSPs:true, ...options}))
      const relevantOptions = Object.entries(options).reduce(
        (obj, [option, value]) =>
        isValidOption(option, value, options)
        ? Object.assign(obj, { [option]: formatValue(value, option) })
        : obj,
        {}
        );
    return relevantOptions; 
  } catch (e) {
    console.error('Cannot getOptionsFromUrl', e);
    return {};
  }
};

export const setOptionsInUrl = (options) => {
  // console.log(`[STYLE PARAMS - VALIDATION] setting options in the url`, options);
  const urlParams = Object.entries(options).filter(option => optionsList.includes(option[0])).reduce(
      (arr, [option, value]) =>
        isValidOption(option, value, options)
          ? arr.concat(`${option}=${value}`)
          : arr,
      []
    )
    .join('&');
  //window.location.search = '?' + Object.entries(options).reduce((arr, [option, value]) => arr.concat(`${option}=${value}`), []).join('&')
  // window.location.hash = '#' + Object.entries(options).reduce((arr, [option, value]) => option && arr.concat(`${option}=${value}`), []).join('&')
  window.history.replaceState({}, 'Pro Gallery Playground', '?' + urlParams);
};
