import { getLayoutName, NEW_PRESETS, defaultStyles, galleryOptions } from 'pro-gallery-lib';

export const getInitialStyleParams = () => {
  const savedStyleParams = getStyleParamsFromUrl();
  const styleParams = styleParamsByLayout();
  return {
    ...defaultStyleParams,
    ...styleParams[savedStyleParams.galleryLayout],
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
    const styleParams = window.location.search
      .replace('?', '').split('&')
      .map(styleParam => styleParam.split('='))
      .reduce((obj, [styleParam, value]) => Object.assign(obj, {[styleParam]: formatValue(value)}), {});
      
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

const defaultStyleParams = defaultStyles;
Object.entries(galleryOptions).forEach(([styleParam, settings]) => defaultStyleParams[styleParam] = settings.default);

const styleParamsByLayout = () => ({
  collage: {
    galleryLayout: 0,
    showArrows: false,
    cubeImages: false,
    groupSize: 3,
    groupTypes: '1,2h,2v,3t,3b,3l,3r',
    fixedColumns: 0,
    hasThumbnails: false,
    enableScroll: true,
    isGrid: false,
    isSlider: false,
    isMasonry: false,
    isColumns: false,
    isSlideshow: false,
    cropOnlyFill: false,
  },
  masonry: {
    galleryLayout: 1,
    showArrows: false,
    cubeImages: false,
    groupSize: 1,
    groupTypes: '1',
    fixedColumns: 0,
    hasThumbnails: false,
    enableScroll: true,
    isGrid: false,
    isSlider: false,
    isMasonry: true,
    isColumns: false,
    isSlideshow: false,
    cropOnlyFill: false,
    oneRow: false,
  },
  grid: {
    galleryLayout: 2,
    showArrows: false,
    cubeImages: true,
    smartCrop: false,
    cubeType: 0,
    isVertical: true,
    galleryType: 'Columns',
    groupSize: 1,
    groupTypes: '1',
    fixedColumns: undefined,
    hasThumbnails: false,
    enableScroll: true,
    cropOnlyFill: false,
    isSlider: false,
    isColumns: false,
    isGrid: true,
    placeGroupsLtr: true,
    isMasonry: false,
    isSlideshow: false,
    minItemSize: 50,
  },
  thumbnails: {
    galleryLayout: 3,
    showArrows: true,
    cubeImages: true,
    smartCrop: false,
    cubeType: 'fill',
    cubeRatio: '100%/100%',
    isVertical: false,
    galleryType: 'Strips',
    groupSize: 1,
    gallerySize: Infinity,
    groupTypes: '1',
    oneRow: true,
    hasThumbnails: true,
    enableScroll: false,
    isGrid: false,
    isSlider: false,
    isMasonry: false,
    isColumns: false,
    isSlideshow: false,
    cropOnlyFill: false,
    floatingImages: 0,
    galleryMargin: 0,
    imageMargin: 0,
    thumbnailSize: 120
  },
  slider: {
    galleryLayout: 4,
    showArrows: true,
    cubeImages: true,
    smartCrop: false,
    isVertical: false,
    galleryType: 'Strips',
    groupSize: 1,
    groupTypes: '1',
    gallerySize: Infinity,
    oneRow: true,
    hasThumbnails: false,
    enableScroll: true,
    isGrid: false,
    isSlider: true,
    isColumns: false,
    isMasonry: false,
    isSlideshow: false,
    cropOnlyFill: true,
  },
  slideshow: {
    galleryLayout: 5,
    showArrows: true,
    cubeImages: true,
    smartCrop: false,
    cubeRatio: '100%/100%',
    cubeType: 'fill',
    isVertical: false,
    gallerySize: 550,
    galleryType: 'Strips',
    groupSize: 1,
    groupTypes: '1',
    fixedColumns: 1,
    oneRow: true,
    hasThumbnails: false,
    enableScroll: false,
    isGrid: false,
    isColumns: false,
    isMasonry: false,
    isSlider: false,
    isSlideshow: true,
    cropOnlyFill: false,
    floatingImages: 0,
    galleryMargin: 0,
    imageMargin: 0,
  },
  panorama: {
    galleryLayout: 6,
    showArrows: false,
    cubeImages: false,
    isVertical: true,
    galleryType: 'Columns',
    groupSize: 1,
    groupTypes: '1',
    gallerySize: Infinity,
    oneRow: false,
    fixedColumns: 1,
    hasThumbnails: false,
    enableScroll: true,
    isGrid: false,
    isColumns: false,
    isMasonry: false,
    isSlider: false,
    isSlideshow: false,
    cropOnlyFill: false,
  },
  column: {
    galleryLayout: 7,
    showArrows: true,
    cubeImages: true,
    smartCrop: false,
    cubeType: 'fill',
    cubeRatio: 0.35,
    isVertical: false,
    galleryType: 'Strips',
    groupSize: 1,
    groupTypes: '1',
    gallerySize: Infinity,
    fixedColumns: 0,
    hasThumbnails: false,
    oneRow: true,
    enableScroll: true,
    isGrid: false,
    isColumns: true,
    isMasonry: false,
    isSlider: false,
    isSlideshow: false,
    cropOnlyFill: false,
  },
  fullsize: {
    showArrows: true,
    cubeImages: true,
    smartCrop: false,
    cubeType: 'fill',
    cubeRatio: '100%/100%',
    isVertical: false,
    galleryType: 'Strips',
    groupSize: 1,
    gallerySize: Infinity,
    groupTypes: '1',
    oneRow: true,
    hasThumbnails: false,
    enableScroll: false,
    isGrid: false,
    isSlider: false,
    isColumns: false,
    isMasonry: false,
    isSlideshow: true,
    cropOnlyFill: false,
    floatingImages: 0,
    galleryMargin: 0,
    imageMargin: 0,
  },
  magic: {
    galleryLayout: 8,
    showArrows: false,
    cubeImages: true,
    smartCrop: false,
    cubeType: 'fill',
    cubeRatio: '100%/100%',
    isVertical: false,
    galleryType: 'Strips',
    groupSize: 1,
    gallerySize: Infinity,
    groupTypes: '1',
    oneRow: true,
    hasThumbnails: false,
    enableScroll: false,
    isGrid: false,
    isSlider: false,
    isColumns: false,
    isMasonry: false,
    isSlideshow: false,
    cropOnlyFill: false,
    floatingImages: 0,
    galleryMargin: 0,
    imageMargin: 0,
  },
  empty: {
    galleryLayout: -1,
  },
});

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
