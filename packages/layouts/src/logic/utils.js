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

  insertIfDefined(obj, field, value) {
    if (typeof value !== 'undefined') {
      obj[field] = value;
    }
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
          (styleParams.galleryMargin || 0)) *
          2;
      delete convertedContainer.width;
    }
    if (container.height >= 0 && !(container.galleryHeight >= 0)) {
      convertedContainer.galleryHeight =
        container.height +
        ((styleParams.imageMargin / 2 || 0) - (styleParams.galleryMargin || 0));
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
