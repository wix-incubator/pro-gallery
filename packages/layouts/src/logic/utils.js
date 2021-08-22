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
    if (typeof sObj === 'string' && (/^[\],:{}\s]*$/.test(stripedObj.replace(/\\["\\\/bfnrtu]/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, '')))) {
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

  assignByString(Obj, string, value) {
    let _obj = { ...Obj };
    let keyArr = string.split('_');
    let assignedProperty = keyArr.pop();
    let pointer = _obj;
    keyArr.forEach((key) => {
      if (!pointer[key]) pointer[key] = {};
      pointer = pointer[key];
    });
    pointer[assignedProperty] = value;
    return _obj;
  }

  flattenObject(ob) {
    var toReturn = {};

    for (var i in ob) {
      // eslint-disable-next-line no-prototype-builtins
      if (!ob.hasOwnProperty(i)) continue;

      if (
        typeof ob[i] == 'object' &&
        ob[i] !== null &&
        Object.keys(ob[i]).length > 0
      ) {
        var flatObject = this.flattenObject(ob[i]);
        for (var x in flatObject) {
          // eslint-disable-next-line no-prototype-builtins
          if (!flatObject.hasOwnProperty(x)) continue;

          toReturn[i + '_' + x] = flatObject[x];
        }
      } else {
        toReturn[i] = ob[i];
      }
    }
    return toReturn;
  }

  flatToNested(ob) {
    return Object.entries(ob).reduce(
      (obj, [styleParam, value]) => this.assignByString(obj, styleParam, value),
      {}
    );
  }

  addDefaultStyleParams(styleParams) {
    //default styleParams
    const defaultSP = {
      layoutParams: {
        gallerySpacing: 0,
        cropRatio: 1,
      },
      cubeImages: false,
      cubeType: 'fill',
      rotatingCropRatios: '',
      smartCrop: false,
      imageMargin: 10,
      scatter: 0,
      rotatingScatter: '',
      chooseBestGroup: true,
      groupSize: 3,
      groupTypes: '1,2h,2v,3h,3v,3t,3b,3l,3r',
      rotatingGroupTypes: '',
      isVertical: true,
      minItemSize: 120,
      scrollDirection: 0,
      targetItemSize: 500,
      collageDensity: 50,
      fixedColumns: 0,
      columnWidths: '',
    };

    const flatSP = this.flattenObject(styleParams);
    const flatDefaultSP = this.flattenObject(defaultSP);
    let _styles = this.flatToNested({ ...flatDefaultSP, ...flatSP });
    return { ..._styles, ..._styles.layoutParams };
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
        ((styleParams.imageMargin / 2 || 0) -
          (styleParams.layoutParams.gallerySpacing || 0)) *
          2;
      delete convertedContainer.width;
    }
    if (container.height >= 0 && !(container.galleryHeight >= 0)) {
      convertedContainer.galleryHeight =
        container.height +
        ((styleParams.imageMargin / 2 || 0) -
          (styleParams.layoutParams.gallerySpacing || 0));
      delete convertedContainer.height;
    }
    if (
      styleParams.externalInfoHeight >= 0 &&
      styleParams.scrollDirection === 1
    ) {
      convertedContainer.galleryHeight -= styleParams.externalInfoHeight;
    }

    return convertedContainer;
  }
}
export const utils = new Utils();
