import { optionsMap } from 'pro-gallery-lib';

class Utils {
  constructor() {
    this._hash2int = {};
  }

  stripSlashes(str) {
    let newStr = '';
    if (typeof str === 'string') {
      newStr = str
        .replace(/\\\//g, '/')
        .replace(/\\'/g, "'")
        .replace(/\\"/g, '"')
        .replace(/\\0/g, '\0')
        .replace(/\\\\/g, '\\');
    }
    return newStr;
  }

  parseStringObject(sObj) {
    if (typeof sObj !== 'string') {
      return sObj;
    }

    const stripedObj = this.stripSlashes(sObj);
    //eslint-disable-next-line
    if (
      typeof sObj === 'string' &&
      /^[\],:{}\s]*$/.test(
        stripedObj
          .replace(/\\["\\/bfnrtu]/g, '@')
          .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?/g, ']')
          .replace(/(?:^|:|,)(?:\s*\[)+/g, '')
      )
    ) {
      //this is a json
      try {
        return JSON.parse(stripedObj);
      } catch (e) {
        // console.error('Parse object error: Catched ', e);
      }
    }
    return stripedObj;
  }

  hashToInt(str, min, max) {
    let int = 0;

    if (typeof str === 'undefined' || str.length === 0) {
      return int;
    }

    if (!this._hash2int[str]) {
      for (let i = 0; i < str.length; i++) {
        int += str.charCodeAt(i);
      }
      this._hash2int[str] = int;
    }

    if (typeof min === 'undefined' || typeof max === 'undefined') {
      return this._hash2int[str];
    } else {
      return (this._hash2int[str] % (max - min + 1)) + min;
    }
  }

  hashToRandomInt(str, min = 0, max = 100000) {
    if (typeof str === 'undefined' || str.length === 0) {
      return 0;
    }

    min = Math.round(min);
    max = Math.round(max);
    str += str.length + min + max;

    if (!this._hash2int[str]) {
      this._hash2int[str] = Math.round(Math.random() * (max - min) + min);
    }
    return this._hash2int[str];
  }

  addDefaultStyleParams(styleParams) {
    function populateWithDefaultOptions(options) {
      //This will override only undefined values with default values
      const mergedOptions = Object.assign({}, defaultLayouterSP, options);
      Object.keys(mergedOptions).forEach((key) => {
        if (typeof mergedOptions[key] === 'undefined') {
          mergedOptions[key] = defaultLayouterSP[key];
        }
      });
      return mergedOptions;
    }
    //default styleParams
    const defaultLayouterSP = {
      [optionsMap.layoutParams.structure.gallerySpacing]: 0,
      [optionsMap.layoutParams.groups.repeatingGroupTypes]: [],
      [optionsMap.layoutParams.crop.enable]: false,
      [optionsMap.layoutParams.crop.method]: 'FILL',
      [optionsMap.layoutParams.crop.ratios]: [1],
      [optionsMap.layoutParams.crop.enableSmartCrop]: false,
      [optionsMap.layoutParams.structure.itemSpacing]: 10,
      [optionsMap.layoutParams.structure.scatter.randomScatter]: 0,
      [optionsMap.layoutParams.structure.scatter.manualScatter]: '',
      [optionsMap.layoutParams.groups.groupByOrientation]: true,
      [optionsMap.layoutParams.groups.groupSize]: 3,
      [optionsMap.layoutParams.groups.allowedGroupTypes]: ['1', '2h', '2v', '3h', '3v', '3t', '3b', '3l', '3r'],
      [optionsMap.layoutParams.structure.layoutOrientation]: 'VERTICAL',
      [optionsMap.layoutParams.targetItemSize.minimum]: 120,
      [optionsMap.layoutParams.structure.scrollDirection]: 'VERTICAL',
      targetItemSize: 500,
      [optionsMap.layoutParams.groups.density]: 50,
      fixedColumns: 0,
      [optionsMap.layoutParams.structure.columnRatios]: [],
    };

    return populateWithDefaultOptions(styleParams);
  }

  convertContainer(container, styleParams) {
    const convertedContainer = {
      bounds: {},
      ...container,
    };
    // galleryWidth is a value calculated prior to the layouter. if it exists it is stronger than width. if galleryWidth doesnt exist width(the total container width) is used instead but it then requieres adding margin calculations. Same is true for the height.
    // this is mostly true for "galleries" containing more than one "gallery" such as thumbnails where teh thumbnails are also a gallery and both are contained within container.width/height and have their own galleryWidth/Height
    if (container.width >= 0 && !(container.galleryWidth >= 0)) {
      convertedContainer.galleryWidth =
        container.width +
        ((styleParams[optionsMap.layoutParams.structure.itemSpacing] / 2 || 0) -
          (styleParams[optionsMap.layoutParams.structure.gallerySpacing] || 0)) *
          2;
      delete convertedContainer.width;
    }
    if (container.height >= 0 && !(container.galleryHeight >= 0)) {
      convertedContainer.galleryHeight =
        container.height +
        ((styleParams[optionsMap.layoutParams.structure.itemSpacing] / 2 || 0) -
          (styleParams[optionsMap.layoutParams.structure.gallerySpacing] || 0));
      delete convertedContainer.height;
    }
    if (
      styleParams.externalInfoHeight >= 0 &&
      styleParams[optionsMap.layoutParams.structure.scrollDirection] === 'HORIZONTAL'
    ) {
      convertedContainer.galleryHeight -= styleParams.externalInfoHeight;
    }

    return convertedContainer;
  }
}
export const utils = new Utils();
