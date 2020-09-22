export default (function layoutFixerImp() { return (function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("pro-gallery", [], factory);
	else if(typeof exports === 'object')
		exports["pro-gallery"] = factory();
	else
		root["pro-gallery"] = factory();
})((typeof self !== 'undefined' ? self : this), function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "http://localhost:9999/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 168);
/******/ })
/************************************************************************/
/******/ ({

/***/ 11:
/*!****************************************************************************!*\
  !*** /Users/guyso/Code/Wix/pro-gallery/packages/layouts/dist/src/utils.js ***!
  \****************************************************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.utils = void 0;

class Utils {
  constructor() {
    this._hash2int = {};
  }

  stripSlashes(str) {
    let newStr = '';

    if (typeof str === 'string') {
      newStr = str.replace(/\\\//g, '/').replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\0/g, '\0').replace(/\\\\/g, '\\');
    }

    return newStr;
  }

  parseStringObject(sObj) {
    if (typeof sObj !== 'string') {
      return sObj;
    }

    const stripedObj = this.stripSlashes(sObj); //eslint-disable-next-line

    if (typeof sObj === 'string' && /^[\],:{}\s]*$/.test(stripedObj.replace(/\\["\\\/bfnrtu]/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
      //this is a json
      try {
        return JSON.parse(stripedObj);
      } catch (e) {// console.error('Parse object error: Catched ', e);
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
      return this._hash2int[str] % (max - min + 1) + min;
    }
  }

  insertIfDefined(obj, field, value) {
    if (typeof value !== 'undefined') {
      obj[field] = value;
    }
  }

  convertStyleParams(styleParams) {
    //default styleParams
    const convertedStyleParams = Object.assign({
      cubeImages: false,
      cubeType: 'fill',
      cubeRatio: 1,
      rotatingCropRatios: '',
      smartCrop: false,
      imageMargin: 10,
      galleryMargin: 0,
      scatter: 0,
      chooseBestGroup: true,
      groupSize: 3,
      groupTypes: '1,2h,2v,3h,3v,3t,3b,3l,3r',
      rotatingGroupTypes: '',
      isVertical: true,
      minItemSize: 120,
      oneRow: false,
      targetItemSize: 500,
      collageDensity: 50,
      fixedColumns: 0,
      columnWidths: ''
    }, styleParams);
    this.insertIfDefined(convertedStyleParams, 'cubeImages', convertedStyleParams.cropItems);
    this.insertIfDefined(convertedStyleParams, 'cubeType', convertedStyleParams.cropType);
    this.insertIfDefined(convertedStyleParams, 'cubeRatio', convertedStyleParams.cropRatio);
    this.insertIfDefined(convertedStyleParams, 'rotatingCropRatios', Array.isArray(convertedStyleParams.rotatingCropRatios) ? convertedStyleParams.rotatingCropRatios.join(',') : undefined);
    this.insertIfDefined(convertedStyleParams, 'smartCrop', convertedStyleParams.smartCrop);
    this.insertIfDefined(convertedStyleParams, 'imageMargin', convertedStyleParams.itemSpacing);
    this.insertIfDefined(convertedStyleParams, 'galleryMargin', convertedStyleParams.layoutSpacing);
    this.insertIfDefined(convertedStyleParams, 'scatter', convertedStyleParams.randomSpacings);
    this.insertIfDefined(convertedStyleParams, 'chooseBestGroup', convertedStyleParams.smartGrouping);
    this.insertIfDefined(convertedStyleParams, 'groupSize', convertedStyleParams.itemsPerGroup);
    this.insertIfDefined(convertedStyleParams, 'groupTypes', Array.isArray(convertedStyleParams.allowedGroupTypes) ? convertedStyleParams.allowedGroupTypes.join(',') : undefined);
    this.insertIfDefined(convertedStyleParams, 'rotatingGroupTypes', Array.isArray(convertedStyleParams.rotatingGroupTypes) ? convertedStyleParams.rotatingGroupTypes.join(',') : undefined);
    this.insertIfDefined(convertedStyleParams, 'isVertical', convertedStyleParams.isColumnsLayout);
    this.insertIfDefined(convertedStyleParams, 'minItemSize', convertedStyleParams.minItemSize);
    this.insertIfDefined(convertedStyleParams, 'oneRow', convertedStyleParams.isVerticalScroll);
    this.insertIfDefined(convertedStyleParams, 'targetItemSize', convertedStyleParams.rowSize || convertedStyleParams.columnSize);
    this.insertIfDefined(convertedStyleParams, 'collageDensity', convertedStyleParams.collageDensity);
    this.insertIfDefined(convertedStyleParams, 'fixedColumns', convertedStyleParams.fixedColumns);
    this.insertIfDefined(convertedStyleParams, 'columnWidths', Array.isArray(convertedStyleParams.columnWidths) ? convertedStyleParams.columnWidths.join(',') : undefined);
    return convertedStyleParams;
  }

  convertContainer(container, styleParams) {
    const convertedContainer = {
      bounds: {},
      ...container
    }; // galleryWidth is a value calculated prior to the layouter. if it exists it is stronger than width. if galleryWidth doesnt exist width(the total container width) is used instead but it then requieres adding margin calculations. Same is true for the height.
    // this is mostly true for "galleries" containing more than one "gallery" such as thumbnails where teh thumbnails are also a gallery and both are contained within container.width/height and have their own galleryWidth/Height

    if (container.width >= 0 && !(container.galleryWidth >= 0)) {
      convertedContainer.galleryWidth = container.width + ((styleParams.imageMargin || 0) - (styleParams.galleryMargin || 0)) * 2;
      delete convertedContainer.width;
    }

    if (container.height >= 0 && !(container.galleryHeight >= 0)) {
      convertedContainer.galleryHeight = container.height + ((styleParams.imageMargin || 0) - (styleParams.galleryMargin || 0));
      delete convertedContainer.height;
    }

    if (styleParams.externalInfoHeight >= 0 && styleParams.oneRow) {
      convertedContainer.galleryHeight -= styleParams.externalInfoHeight;
    }

    return convertedContainer;
  }

}

const utils = new Utils();
exports.utils = utils;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 12:
/*!***************************************************************************!*\
  !*** /Users/guyso/Code/Wix/pro-gallery/packages/layouts/dist/src/item.js ***!
  \***************************************************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.Item = void 0;

var _utils = __webpack_require__(/*! ./utils */ 11);

class Item {
  /* @ngInject */
  constructor(config) {
    this.style = {};
    this.visibility = {};
    config = config || {};

    if (!config.dto) {
      console.error('Item has no DTO', config);
      config.dto = {};
    }

    this.config = config;
    this.dto = config.dto;
    this.idx = config.idx;
    this.inGroupIdx = config.inGroupIdx;
    this.container = config.container;
    this.cubeType = 'fill';

    if (config.styleParams) {
      const _config = config,
            styleParams = _config.styleParams;
      this.cubeType = styleParams.cubeType;
      this.cubeImages = styleParams.cubeImages;
      this._cubeRatio = styleParams.cubeRatio;
      this.rotatingCropRatios = styleParams.rotatingCropRatios;
      this.smartCrop = styleParams.smartCrop;
      this.cropOnlyFill = styleParams.cropOnlyFill;
      this.imageMargin = styleParams.imageMargin;
      this.galleryMargin = styleParams.galleryMargin;
      this.scatter = styleParams.scatter;
      this.smartCrop = styleParams.smartCrop;
    }

    this._groupOffset = {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    };
    this._group = {};

    this.calcPinOffset = () => 0;

    this.resize(1);
  }

  fixMetadataVerticalVideoRatio(metadata) {
    if (metadata.qualities && metadata.qualities[0]) {
      //fix incorrect width height for vertical videos
      const qualities = metadata.qualities;
      const _qualities = qualities[qualities.length - 1],
            height = _qualities.height,
            width = _qualities.width;
      metadata.height = height;
      metadata.width = width;
    }
  }

  resize(scaleOrDimensions) {
    let scale = 1;

    if (scaleOrDimensions === false) {
      return;
    } else if (scaleOrDimensions > 0) {
      scale = scaleOrDimensions;
    } else if (typeof scaleOrDimensions === 'object') {
      if (scaleOrDimensions.width) {
        const w = Math.max(1, scaleOrDimensions.width);
        scale = w / this.width;
      } else if (scaleOrDimensions.height) {
        const h = Math.max(1, scaleOrDimensions.height);
        scale = h / this.height;
      }
    }

    this.width *= scale;
    this.height *= scale;
    this.resized = true;
    return this;
  }

  pinToCorner(cornerName, pinAfter = false) {
    const isTop = cornerName.indexOf('top') >= 0;
    const isLeft = cornerName.indexOf('left') >= 0;
    this.style.top = isTop ? 0 : 'auto';
    this.style.bottom = isTop ? 'auto' : 0;
    this.style.left = isLeft ? 0 : 'auto';
    this.style.right = isLeft ? 'auto' : 0;
    this.pin = cornerName;
    this.isPinnedTop = isTop;
    this.isPinnedLeft = isLeft;
    this.pinAfter = pinAfter;
    this.pinAfterType = isTop ? 'top' : isLeft ? 'left' : '';

    this.calcPinOffset = (groupSize, dir) => {
      if (!this.pinAfter) {
        return 0;
      } else if (this.pin === dir) {
        //this is used only for 3h/3v group types - to calc the offset of the middle item
        const m = this.imageMargin; // return ((groupSize - 6 * m) * this.pinOffset + 2 * m);

        if (dir === 'top') {
          return this.pinAfter.height + 2 * m;
        } else if (dir === 'left') {
          return this.pinAfter.width + 2 * m;
        } else {
          return 0;
        } // return ((groupSize - 6 * m) * this.pinOffset + 4 * m);

      } else {
        return 0;
      }
    };
  }

  setPosition(position) {
    this.style.position = position;
  }

  getPosition(pos) {
    return parseInt(pos, 10) >= 0 ? pos : 'auto';
  }

  calcScatter(offset) {
    if (this.scatter > 0) {
      const m = this.imageMargin;
      const g = this.galleryMargin;
      const spaceLeft = offset.left > 0 ? m : g;
      const spaceRight = this.container.galleryWidth - offset.right > 2 * m ? m : g;
      const spaceUp = offset.top > 0 ? m : g;
      const spaceDown = this.container.galleryHeight - offset.bottom > 2 * m ? m : g;
      const horizontalShift = _utils.utils.hashToInt(this.hash + offset.right + 'x', -1 * spaceLeft, spaceRight) * (this.scatter / 100);
      const verticalShift = _utils.utils.hashToInt(this.hash + offset.top + 'y', -1 * spaceUp, spaceDown) * (this.scatter / 100);
      return {
        x: horizontalShift,
        y: verticalShift
      };
    } else {
      return {
        x: 0,
        y: 0
      };
    }
  }

  get top() {
    return this.getPosition(this.style.top);
  }

  get left() {
    return this.getPosition(this.style.left);
  }

  get right() {
    return this.getPosition(this.style.right);
  }

  get bottom() {
    return this.getPosition(this.style.bottom);
  }

  set group(group) {
    Object.assign(this._group, group);
  }

  get group() {
    return this._group;
  }

  set groupOffset(offset) {
    Object.assign(this._groupOffset, offset);
  }

  get offset() {
    const offset = {
      top: this._groupOffset.top + (this.isPinnedTop ? this.calcPinOffset(this._group.height, 'top') : this._group.height - this.outerHeight) || 0,
      left: this._groupOffset.left + (this.isPinnedLeft ? this.calcPinOffset(this._group.width, 'left') : this._group.width - this.outerWidth) || 0
    };

    const _this$calcScatter = this.calcScatter(offset),
          x = _this$calcScatter.x,
          y = _this$calcScatter.y;

    offset.left += x;
    offset.top += y;
    offset.right = offset.left + this.width;
    offset.bottom = offset.top + this.height;
    return offset;
  }

  get id() {
    return this.dto.id || this.dto.photoId || this.dto.itemId;
  }

  set id(id) {
    this.dto.itemId = this.dto.photoId = this.dto.id = id;
  }

  get hash() {
    return this.dto.hash || this.dto.mediaUrl || this.dto.id;
  }

  get maxWidth() {
    return this.dto.width || this.dto.w;
  }

  set maxWidth(w) {
    this.dto.width = w;
  }

  get outerWidth() {
    return this.width + 2 * this.margins;
  }

  get infoWidth() {
    return this.Group ? this.Group.infoWidth : 0;
  }

  get orgWidth() {
    return this.style.width || this.dto.width || this.dto.w || 1; //make sure the width / height is not undefined (crashes the gallery)
  }

  get width() {
    let width;

    if (this.cubeImages && this.ratio >= this.cubeRatio) {
      width = this.style.cubedWidth || this.orgHeight * this.cubeRatio;
    } else {
      width = this.orgWidth;
    }

    return Math.max(width, 1);
  }

  set width(w) {
    this.style.cubedWidth = this.style.width = Math.max(1, w);
  }

  get outerHeight() {
    return this.height + 2 * this.margins;
  }

  get orgHeight() {
    return this.style.height || this.dto.height || this.dto.h || 1; //make sure the width / height is not undefined (creashes the gallery)
  }

  get height() {
    let height;

    if (this.cubeImages && this.ratio < this.cubeRatio) {
      height = this.style.cubedHeight || this.orgWidth / this.cubeRatio;
    } else {
      height = this.orgHeight;
    }

    return Math.max(height, 1);
  }

  set height(h) {
    this.style.cubedHeight = this.style.height = Math.max(1, h);
  }

  get maxHeight() {
    return this.dto.height || this.dto.h;
  }

  set maxHeight(h) {
    h = this.dto.height;
  }

  get infoHeight() {
    return this.Group ? this.Group.infoHeight : 0;
  }

  get margins() {
    return this.imageMargin || 0;
  }

  set margins(m) {
    this.imageMargin = m;
  }

  get cubeRatio() {
    let ratio;

    if (this.rotatingCropRatio) {
      ratio = this.rotatingCropRatio;
    } else if (this.rotatingCropRatios && this.rotatingCropRatios.length > 0) {
      const cropRatiosArr = String(this.rotatingCropRatios).split(',');
      ratio = this.rotatingCropRatio = cropRatiosArr[this.idx % cropRatiosArr.length];
    }

    if (!ratio && typeof this._cubeRatio === 'function') {
      ratio = this._cubeRatio();
    }

    if (!ratio && this.cropOnlyFill && this.cubeType === 'fit') {
      ratio = this.ratio;
    }

    if (!ratio) {
      ratio = this._cubeRatio || this.ratio;
    }

    if (this.dynamicCropRatios !== null && typeof ratio === 'string') {
      if (!this.dynamicCropRatios) {
        const dynamicCropRegex = /^\d*\.?\d*(%|px)\/\d*\.?\d*(%|px)$/;
        const match = dynamicCropRegex.exec(ratio);

        if (match) {
          this.dynamicCropRatios = ratio.split('/').map((val, idx) => {
            if (val.indexOf('%') > 0) {
              return {
                type: '%',
                val: parseFloat(val.replace('%', '')) / 100,
                dim: idx === 0 ? 'galleryWidth' : 'galleryHeight'
              };
            } else {
              return {
                type: 'px',
                val: parseInt(val.replace('px', ''))
              };
            }
          });
        } else {
          this.dynamicCropRatios = null;
        }
      }

      if (this.dynamicCropRatios) {
        const dynamicCropRatio = this.dynamicCropRatios.map(r => {
          if (r.type === '%') {
            const dim = this.container[r.dim] + (r.dim === 'galleryHeight' ? this.imageMargin : 0);
            const relativeDim = r.val * dim - 2 * this.imageMargin;
            return relativeDim;
          } else {
            return r.val;
          }
        });
        ratio = dynamicCropRatio[0] / dynamicCropRatio[1];
      }
    }

    ratio = Number(ratio);

    if (this.smartCrop === true) {
      if (this.isPortrait) {
        ratio = Math.min(ratio, 1 / ratio);
      } else {
        ratio = Math.max(ratio, 1 / ratio);
      }
    }

    if (this.cubeType === 'min') {
      ratio = Math.max(ratio, this.orgRatio);
    } else if (this.cubeType === 'max') {
      ratio = Math.min(ratio, this.orgRatio);
    }

    return ratio;
  }

  set cubeRatio(ratio) {
    if (typeof this._cubeRatio === 'number') {
      this._cubeRatio = ratio;
      this.style.cubedHeight = this.style.cubedWidth = 0;
    }
  }

  get orientation() {
    return this.ratio < 0.999 ? 'portrait' : 'landscape'; //make sure that almost square images get the same treatment
  }

  get isPortrait() {
    return this.orientation === 'portrait';
  }

  get isLandscape() {
    return this.orientation === 'landscape';
  }

  get ratio() {
    if (!this.orgRatio) {
      this.orgRatio = this.orgWidth / this.orgHeight;
    }

    return this.orgRatio;
  }

  set ratio(r) {
    this.orgRatio = r;
  }

  get scheme() {
    return {
      id: this.id,
      idx: this.idx,
      inGroupIdx: this.inGroupIdx,
      dto: this.dto,
      type: this.type,
      style: this.style,
      width: this.width,
      maxWidth: this.maxWidth,
      outerWidth: this.outerWidth,
      infoWidth: this.infoWidth,
      margins: this.margins,
      ratio: this.ratio,
      cropRatio: this.cubeRatio,
      isCropped: this.cubeImages,
      cropType: this.cubeType,
      height: this.height,
      maxHeight: this.maxHeight,
      outerHeight: this.outerHeight,
      infoHeight: this.infoHeight,
      group: this.group,
      offset: this.offset,
      groupOffset: this._groupOffset,
      orientation: this.orientation,
      isPortrait: this.isPortrait,
      isLandscape: this.isLandscape,
      visibility: this.visibility
    };
  }

}

exports.Item = Item;
//# sourceMappingURL=item.js.map

/***/ }),

/***/ 15:
/*!*******************************************************************************!*\
  !*** /Users/guyso/Code/Wix/pro-gallery/packages/layouts/dist/src/layouter.js ***!
  \*******************************************************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = void 0;

var _utils = __webpack_require__(/*! ./utils */ 11);

var _item = __webpack_require__(/*! ./item.js */ 12);

var _group = __webpack_require__(/*! ./group.js */ 16);

var _strip = __webpack_require__(/*! ./strip.js */ 20);

var _column = __webpack_require__(/*! ./column.js */ 21);

var _layoutsStore = _interopRequireDefault(__webpack_require__(/*! ./layoutsStore.js */ 22));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Layouter {
  constructor(layoutParams) {
    this.ready = false;
    this.pointer = 0;
    this.layoutItems = [];
    this.findNeighborItem = this.findNeighborItem.bind(this);
    this.updateParams(layoutParams);

    if (this.createLayoutOnInit !== false) {
      this.createLayout(layoutParams);
    }
  }

  updateParams(layoutParams) {
    this.srcItems = layoutParams.items;
    this.styleParams = _utils.utils.convertStyleParams(layoutParams.styleParams);
    this.container = _utils.utils.convertContainer(layoutParams.container, this.styleParams);
    const options = layoutParams.options || {};
    this.useExistingLayout = !!options.useExistingLayout;
    this.createLayoutOnInit = options.createLayoutOnInit;
    this.showAllItems = !!options.showAllItems || !!layoutParams.showAllItems;
    this.useLayoutStore = !!options.useLayoutStore;
  }

  verifyGalleryState() {
    if (!this.container.galleryWidth) {
      this.ready = false;
      throw new Error('Layouter: cannot create layout, galleryWidth is undefined or 0');
    }

    if (!this.styleParams.targetItemSize) {
      this.ready = false;
      throw new Error('Layouter: cannot create layout, targetItemSize is undefined or 0');
    }
  }

  calcNumberOfColumns(galleryWidth, targetItemSize) {
    let numOfCols = 1;

    if (this.styleParams.isVertical) {
      if (this.styleParams.fixedColumns > 0) {
        numOfCols = this.styleParams.fixedColumns;
      } else if (this.styleParams.columnWidths) {
        numOfCols = this.styleParams.columnWidths.split(',').length;
      } else {
        // find the number of columns that makes each column width the closet to the targetItemSize
        const numOfColsFloat = galleryWidth / targetItemSize;
        const roundFuncs = [Math.floor, Math.ceil];
        const diffs = roundFuncs.map(func => func(numOfColsFloat)) //round to top, round to bottom
        .map(n => Math.round(galleryWidth / n)) //width of each col
        .map(w => Math.abs(targetItemSize - w)); //diff from targetItemSize

        const roundFunc = roundFuncs[diffs.indexOf(Math.min(...diffs))]; //choose the round function that has the lowest diff from the targetItemSize

        numOfCols = roundFunc(numOfColsFloat) || 1;
      }
    } else {
      numOfCols = 1;
    }

    return numOfCols;
  }

  findShortestColumn(columns, groupIdx) {
    let minCol = columns[0];

    if (this.styleParams.placeGroupsLtr) {
      minCol = columns[groupIdx % columns.length];
    } else {
      let minColH = -1;

      for (const column of columns) {
        const colH = column.height;

        if (colH < minColH || minColH < 0) {
          minColH = colH;
          minCol = column;
        }
      }
    }

    return minCol;
  }

  saveExistingLayout() {
    if (this.useLayoutStore) {
      _layoutsStore.default.layout = {
        pointer: this.pointer,
        layoutItems: this.layoutItems,
        groups: this.groups,
        strips: this.strips,
        groupIdx: this.groupIdx,
        groupItems: this.groupItems,
        group: this.group,
        strip: this.strip,
        targetItemSize: this.targetItemSize,
        galleryHeight: this.galleryHeight,
        columns: this.columns
      };
    }
  }

  prepareLayoutParams() {
    if (this.useExistingLayout && this.pointer > 0) {
      if (this.useLayoutStore) {
        Object.assign(this, _layoutsStore.default.layout);
      } else {
        if (this.styleParams.isVertical) {
          //---------------------| COLUMNS GALLERY |----------------------//
          //remove items from the last 3 groups;
          const lastGroups = this.groups.slice(-3);
          lastGroups.forEach(group => {
            const column = this.columns[group.columnIdx];

            if (column) {
              column.height -= group.totalHeight;
              column.groups.splice(-1, 1);
            }

            this.groups.splice(-1, 1);
            group.realItems.forEach(() => {
              this.layoutItems.splice(-1, 1);
              this.pointer--;
            });
            this.groupIdx--;
          });
        } else {
          //---------------------| STRIPS GALLERY |----------------------//
          if (this.styleParams.oneRow) {
            //remove items from the last group:
            const lastGroups = this.groups.slice(-1);
            lastGroups.forEach(group => {
              const column = this.columns[0];

              if (column) {
                column.groups.splice(-1, 1);
              }

              const strip = this.strips[0];

              if (strip) {
                strip.setWidth(strip.width - group.width);
                strip.ratio = strip.width / strip.height;
                strip.groups.splice(-1, 1);
                this.strip = strip;
              }

              this.strips = [];
              this.groups.splice(-1, 1);
              group.realItems.forEach(() => {
                this.layoutItems.splice(-1, 1);
                this.pointer--;
              });
              this.groupIdx--;
            });
            this.galleryHeight = 0;
          } else {
            //remove items from the last 2 strips;
            const lastStrips = this.strips.slice(-2);

            if (lastStrips) {
              lastStrips.forEach(lastStrip => {
                if (lastStrip) {
                  this.strips.splice(-1, 1);
                  const groups = lastStrip.groups;
                  groups.forEach(group => {
                    this.groups.splice(-1, 1);
                    group.items.forEach(() => {
                      this.layoutItems.splice(-1, 1);
                      this.pointer--;
                    });
                    this.groupIdx--;
                  });
                }
              });
              this.galleryHeight = this.strips.reduce((totalHeight, strip) => totalHeight += strip.height, 0); // this.strip = this.strips[this.strips.length - 1];

              this.strip = new _strip.Strip({
                idx: this.strips.length + 1,
                container: this.container,
                groupsPerStrip: this.styleParams.groupsPerStrip,
                oneRow: this.styleParams.oneRow,
                targetItemSize: this.targetItemSize
              });
            }
          }

          this.groupItems = [];
        }
      }

      this.item = {};
      this.pointer = Math.max(0, this.pointer);
      this.maxLoops = this.srcItems.length * 10;
    } else {
      this.pointer = 0;
      this.firstGroup = false;
      this.layoutItems = [];
      this.groups = [];
      this.strips = [];

      if (this.styleParams.forceFullHeight) {
        this.targetItemSize = Math.sqrt(this.container.galleryHeight * this.container.galleryWidth / this.srcItems.length);
      } else {
        let gallerySizeVal;

        if (typeof this.styleParams.targetItemSize === 'function') {
          gallerySizeVal = this.styleParams.targetItemSize();
        } else {
          gallerySizeVal = this.styleParams.targetItemSize;
        }

        this.targetItemSize = Math.floor(gallerySizeVal) + Math.ceil(2 * (this.styleParams.imageMargin - this.styleParams.galleryMargin));
      }

      this.galleryWidth = Math.floor(this.container.galleryWidth);
      this.maxGroupSize = this.getMaxGroupSize();
      this.groupIdx = 0;
      this.item = {};
      this.groupItems = [];
      this.group = {};
      this.bounds = this.container.bounds || {};
      this.strip = new _strip.Strip({
        idx: 1,
        container: this.container,
        groupsPerStrip: this.styleParams.groupsPerStrip,
        oneRow: this.styleParams.oneRow,
        targetItemSize: this.targetItemSize
      });
      this.galleryHeight = 0;
      this.numOfCols = this.calcNumberOfColumns(this.galleryWidth, this.targetItemSize);
      this.targetItemSize = this.styleParams.isVertical ? Math.floor(this.galleryWidth / this.numOfCols) : this.targetItemSize;
      const _this$styleParams = this.styleParams,
            columnWidths = _this$styleParams.columnWidths,
            cubeRatio = _this$styleParams.cubeRatio,
            externalInfoWidth = _this$styleParams.externalInfoWidth,
            imageMargin = _this$styleParams.imageMargin;
      const columnWidthsArr = columnWidths && columnWidths.length > 0 ? columnWidths.split(',') : false;
      let totalLeft = 0;
      let remainderWidth = this.galleryWidth;
      let fixedCubeHeight;
      this.columns = Array(this.numOfCols).fill(0).map((column, idx) => {
        //round group widths to fit an even number of pixels
        let colWidth = columnWidthsArr ? columnWidthsArr[idx] : Math.round(remainderWidth / (this.numOfCols - idx));
        const curLeft = totalLeft;
        totalLeft += colWidth;
        remainderWidth -= colWidth; //fix cubeRatio of rounded columns

        const infoWidth = Math.round(externalInfoWidth > 1 // integer represent size in pixels, floats size in percentage
        ? externalInfoWidth : externalInfoWidth * colWidth) || 0;
        colWidth -= infoWidth;
        fixedCubeHeight = fixedCubeHeight || (this.targetItemSize - infoWidth - imageMargin * 2) / cubeRatio + imageMargin * 2; //calc the cube height only once
        //add space for info on the side

        return new _column.Column(idx, colWidth, curLeft, fixedCubeHeight, infoWidth);
      });
      this.maxLoops = this.srcItems.length * 10;
    }
  }

  createLayout(layoutParams) {
    if (typeof layoutParams !== 'undefined') {
      this.updateParams(layoutParams);
    }

    this.verifyGalleryState();
    this.prepareLayoutParams();

    while (this.srcItems[this.pointer]) {
      if (this.imagesLeft === 6) {
        this.saveExistingLayout();
      }

      this.maxLoops--;

      if (this.maxLoops <= 0) {
        console.error('Cannot create layout, maxLoops reached!!!');
        return false;
      }

      this.item = new _item.Item({
        idx: this.pointer,
        inGroupIdx: this.groupItems.length + 1,
        scrollTop: this.galleryHeight,
        dto: this.srcItems[this.pointer],
        container: this.container,
        styleParams: this.styleParams
      });
      this.layoutItems[this.pointer] = this.item; //push the image to a group - until its full

      this.groupItems.push(this.item);

      if (this.groupItems.length < this.maxGroupSize && this.srcItems[this.pointer + 1]) {
        this.pointer++;
        continue;
      }

      this.group = new _group.Group({
        idx: this.groupIdx,
        stripIdx: this.strip.idx,
        inStripIdx: this.strip.groups.length + 1,
        top: this.galleryHeight,
        items: this.groupItems,
        isLastItems: this.isLastImages,
        targetItemSize: this.targetItemSize,
        showAllItems: this.showAllItems,
        container: this.container,
        styleParams: this.styleParams
      });
      this.groups[this.groupIdx] = this.group; //take back the pointer in case the group was created with less items

      this.pointer += this.group.realItems.length - this.groupItems.length;
      this.groupIdx++;
      this.groupItems = []; //resize and fit the group in the strip / column

      if (!this.styleParams.isVertical) {
        //---------------------| STRIPS GALLERY |----------------------//
        if (this.strip.isFull(this.group, this.isLastImage)) {
          //close the current strip
          this.strip.resizeToHeight(this.galleryWidth / this.strip.ratio);
          this.strip.setWidth(this.galleryWidth);
          this.galleryHeight += this.strip.height;
          this.columns[0].addGroups(this.strip.groups);
          this.strips.push(this.strip); //open a new strip

          this.strip = new _strip.Strip({
            idx: this.strip.idx + 1,
            container: this.container,
            groupsPerStrip: this.styleParams.groupsPerStrip,
            oneRow: this.styleParams.oneRow,
            targetItemSize: this.targetItemSize
          }); //reset the group (this group will be rebuilt)

          this.pointer -= this.group.realItems.length - 1;
          this.groupIdx--;
          continue;
        } //add the group to the (current/new) strip


        this.group.setTop(this.galleryHeight);
        this.strip.ratio += this.group.ratio; // this.strip.height = Math.min(targetItemSize, (galleryWidth / this.strip.ratio));

        this.strip.height = this.galleryWidth / this.strip.ratio;
        this.strip.setWidth(this.galleryWidth);
        this.strip.addGroup(this.group);

        if (this.isLastImage && this.strip.hasGroups) {
          if (this.styleParams.oneRow) {
            this.strip.height = this.container.galleryHeight + (this.styleParams.imageMargin - this.styleParams.galleryMargin);
          } else if (this.strip.canRemainIncomplete()) {
            //stretching the this.strip to the full width will make it too high - so make it as high as the targetItemSize and not stretch
            this.strip.height = this.targetItemSize;
            this.strip.markAsIncomplete();
          }

          this.strip.resizeToHeight(this.strip.height);
          this.galleryHeight += this.strip.height;
          this.columns[0].addGroups(this.strip.groups);
          this.strips.push(this.strip);
        }
      } else {
        //---------------------| COLUMNS GALLERY |----------------------//
        //find the shortest column
        const minCol = this.findShortestColumn(this.columns, this.groups.length - 1); //resize the group and images

        this.group.setCubedHeight(minCol.cubedHeight); //fix last column's items ratio (caused by stretching it to fill the screen)

        this.group.resizeToWidth(minCol.width);
        this.group.round(); //update the group's position

        this.group.setTop(minCol.height);
        this.group.setLeft(minCol.left); //add the image to the column

        minCol.addGroup(this.group); //add the image height to the column

        minCol.height += this.group.totalHeight;

        if (this.galleryHeight < minCol.height) {
          this.galleryHeight = minCol.height;
        }
      }

      if (!this.firstGroup) {
        this.firstGroup = this.group;
      }

      this.pointer++;
    }

    if (this.styleParams.forceFullHeight) {
      const stretchRatio = this.container.galleryHeight / this.galleryHeight;
      this.items.map(item => {
        item.cubeImages = true;
        item.cubeRatio = item.ratio = item.width / (item.height * stretchRatio);
        item.height *= stretchRatio;
        return item;
      });
      this.groups.map(group => {
        group.height *= stretchRatio;
        group.setTop(group.top * stretchRatio);
        group.resizeItems();
        return group;
      });
    } //results


    this.lastGroup = this.group;
    this.colWidth = Math.floor(this.galleryWidth / this.numOfCols);
    this.height = this.galleryHeight - (this.styleParams.imageMargin - this.styleParams.galleryMargin) * 2;
    this.width = this.lastGroup.left + this.lastGroup.width;
    this.ready = true;
    return this.scheme;
  }

  lastVisibleItemIdxInHeight(height) {
    for (let i = this.items.length - 1; i >= 0; i--) {
      const item = this.items[i];
      const isVisible = item.offset.top < height;

      if (isVisible) {
        return i;
      }
    }

    return this.items.length - 1;
  }

  lastVisibleItemIdx() {
    //the item must be visible and about the show more button
    return this.lastVisibleItemIdxInHeight(this.container.galleryHeight - 100);
  }

  findNeighborItem(itemIdx, dir) {
    const currentItem = this.layoutItems[itemIdx];
    let neighborItem;

    const findClosestItem = (currentItemX, currentItemY, condition) => {
      let minDistance = null;
      let minDistanceItem = {};
      let itemY;
      let itemX;
      let distance; // each(slice(this.layoutItems, itemIdx - 50, itemIdx + 50), (item) => {

      this.layoutItems.forEach(item => {
        itemY = item.offset.top + item.height / 2;
        itemX = item.offset.left + item.width / 2;
        distance = Math.sqrt(Math.pow(itemY - currentItemY, 2) + Math.pow(itemX - currentItemX, 2));

        if ((minDistance === null || distance > 0 && distance < minDistance) && condition(currentItemX, currentItemY, itemX, itemY)) {
          minDistance = distance;
          minDistanceItem = item;
        }
      });
      return minDistanceItem;
    };

    switch (dir) {
      case 'up':
        neighborItem = findClosestItem(currentItem.offset.left + currentItem.width / 2, currentItem.offset.top, (curX, curY, itmX, itmY) => itmY < curY);
        break;

      case 'left':
        neighborItem = findClosestItem(currentItem.offset.left, currentItem.offset.top + currentItem.height / 2, (curX, curY, itmX) => itmX < curX);
        break;

      case 'down':
        neighborItem = findClosestItem(currentItem.offset.left + currentItem.width / 2, currentItem.offset.bottom, (curX, curY, itmX, itmY) => itmY > curY);
        break;

      default:
      case 'right':
        neighborItem = findClosestItem(currentItem.offset.right, currentItem.offset.top + currentItem.height / 2, (curX, curY, itmX) => itmX > curX);
        break;
    }

    if (neighborItem.idx >= 0) {
      return neighborItem.idx;
    } else {
      console.warn('Could not find offset for itemIdx', itemIdx, dir);
      return itemIdx; //stay on the same item
    }
  }

  getMaxGroupSize() {
    let _maxGroupSize = 1;

    try {
      const groupTypes = typeof this.styleParams.groupTypes === 'string' && this.styleParams.groupTypes.length > 0 ? this.styleParams.groupTypes.split(',') : this.styleParams.groupTypes;
      _maxGroupSize = groupTypes.reduce((curSize, groupType) => {
        return Math.max(curSize, parseInt(groupType));
      }, 1);
      _maxGroupSize = Math.min(_maxGroupSize, this.styleParams.groupSize);
    } catch (e) {
      console.error("couldn't calculate max group size - returing 3 (?)", e);
      _maxGroupSize = 3;
    }

    return _maxGroupSize;
  }

  get isLastImage() {
    return !this.srcItems[this.pointer + 1];
  }

  get isLastImages() {
    if (this.styleParams.layoutsVersion > 1) {
      //layouts version 2+
      return !this.srcItems[this.pointer + 1];
    } else {
      //Backwards compatibility
      return !this.srcItems[this.pointer + 3];
    }
  }

  get imagesLeft() {
    return this.srcItems.length - this.pointer - 1;
  }

  get items() {
    return this.layoutItems;
  }

  get scheme() {
    return {
      items: this.items.map(item => item.scheme),
      groups: this.groups.map(group => group.scheme),
      strips: this.strips.map(strip => strip.scheme),
      columns: this.columns.map(column => column.scheme),
      height: this.height,
      width: this.width
    };
  }

}

exports.default = Layouter;
//# sourceMappingURL=layouter.js.map

/***/ }),

/***/ 16:
/*!****************************************************************************!*\
  !*** /Users/guyso/Code/Wix/pro-gallery/packages/layouts/dist/src/group.js ***!
  \****************************************************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.Group = void 0;

var _item = __webpack_require__(/*! ./item.js */ 12);

var _utils = __webpack_require__(/*! ./utils */ 11);

const GROUP_TYPES_BY_RATIOS_V = {
  lll: '1,2h',
  llp: '1,3r',
  lpl: '1,2h',
  pll: '1,2h,3l',
  lpp: '1,2h,3r,3h',
  plp: '1,2h,3l,3r,3h',
  ppl: '1,2h,3l,3h',
  ppp: '1,2h,3l,3r,3h'
};
const GROUP_TYPES_BY_RATIOS_H = {
  lll: '1,2v,3t,3b,3v',
  llp: '1,2v,3t,3v',
  lpl: '1,2v,3t,3b,3v',
  pll: '1,2v,3b,3v',
  lpp: '1,2v,3t',
  plp: '1,2v',
  ppl: '1,3b',
  ppp: '1,2h'
};
const GROUP_SIZES_BY_MAX_SIZE = {
  1: [[1]],
  2: [[1], [1, 2], [2]],
  3: [[1], [1, 2], [1, 2, 3], [2, 3], [3]]
};

class Group {
  constructor(config) {
    this.idx = config.idx;
    this.stripIdx = config.stripIdx;
    this.inStripIdx = config.inStripIdx;
    this.top = config.top;
    this.showAllItems = config.showAllItems;
    this.isLastItems = config.isLastItems;
    this.dummyItems = [];
    this.targetItemSize = config.targetItemSize;
    this.items = config.items.map(item => {
      item.Group = this;
      return item;
    });

    if (config.styleParams) {
      const styleParams = config.styleParams;
      this.oneRow = styleParams.oneRow;
      this.cubeType = styleParams.cubeType;
      this.cubeImages = styleParams.cubeImages;
      this.isVertical = styleParams.isVertical;
      this.minItemSize = styleParams.minItemSize;
      this.collageAmount = styleParams.collageAmount;
      this.collageDensity = styleParams.collageDensity;
      this.groupTypes = styleParams.groupTypes;
      this.rotatingGroupTypes = styleParams.rotatingGroupTypes;
      this.rotatingCropRatios = styleParams.rotatingCropRatios;
      this.chooseBestGroup = styleParams.chooseBestGroup;
      this.layoutsVersion = styleParams.layoutsVersion;
      this.externalInfoHeight = styleParams.externalInfoHeight;
      this.externalInfoWidth = styleParams.externalInfoWidth;
      this.imageMargin = styleParams.imageMargin;
      this.groupSize = styleParams.groupSize;
    }

    this.visible = true;
    this.rendered = true;
    this.required = true; //prepare the group

    let forcedGroupSize = this.items.length; //todo - check if minItem size is really working

    while (!this.isWithinMinItemSize && forcedGroupSize > 0) {
      this.placeItems(forcedGroupSize);
      this.resize();
      forcedGroupSize--;
    }
  }

  resize() {
    if (this.isVertical) {
      this.resizeToWidth(this.targetItemSize);
    } else {
      this.resizeToHeight(this.targetItemSize);
    }

    this.setLeft(this.left);
    this.setTop(this.top);
  }

  safeGetItem(idx) {
    if (this.items[idx]) {
      return this.items[idx];
    } else if (this.dummyItems[idx]) {
      return this.dummyItems[idx];
    } else {
      // dummy created from the last item config
      const item = new _item.Item({ ...this.items[this.items.length - 1].config
      }); // const item = {...(this.items[this.items.length - 1])};
      // item.id += 'dummy';
      // item.idx given to dummy items starting from the last item
      // item.config.idx = last item index (all gallery items, not group items)
      // idx = in group item index
      // this.items = the group's items

      item.idx = item.config.idx + idx - (this.items.length - 1);
      item.type = 'dummy';
      this.dummyItems[idx] = item;
      return item;
    }
  }

  setCubedHeight(height) {
    const shouldUseFixedHeight = this.cubeImages && this.groupSize === 1 && ['fill', 'fit'].includes(this.cubeType) && this.rotatingGroupTypes.length === 0 && this.rotatingCropRatios.length === 0;
    this.cubedHeight = shouldUseFixedHeight ? height : null;
  }

  round() {
    //round all sizes to full pixels
    if (this.isLastGroup && !this.oneRow) {
      this.width = this.stripWidth - this.left;
    } else {
      this.width = Math.round(this.width);
    }

    this.height = Math.round(this.height);

    for (const item of this.items) {
      item.width = Math.round(item.width);
      item.height = Math.round(item.height);
      item.group = {
        width: this.width,
        height: this.height
      };
    }

    const m = this.imageMargin * 2;

    switch (this.type) {
      default:
      case '1':
        this.safeGetItem(0).width = this.width - m;
        this.safeGetItem(0).height = this.height - m;
        break;

      case '2v':
        this.safeGetItem(0).width = this.safeGetItem(1).width = this.width - m;
        this.safeGetItem(0).height = this.height - this.safeGetItem(1).height - 2 * m;
        break;

      case '2h':
        this.safeGetItem(0).height = this.safeGetItem(1).height = this.height - m;
        this.safeGetItem(0).width = this.width - this.safeGetItem(1).width - 2 * m;
        break;

      case '3t':
        this.safeGetItem(0).width = this.width - m;
        this.safeGetItem(0).height = this.height - this.safeGetItem(1).height - 2 * m;
        this.safeGetItem(1).width = this.width - this.safeGetItem(2).width - 2 * m;
        this.safeGetItem(2).height = this.safeGetItem(1).height;
        break;

      case '3b':
        this.safeGetItem(0).width = this.width - this.safeGetItem(1).width - 2 * m;
        this.safeGetItem(1).height = this.safeGetItem(0).height;
        this.safeGetItem(2).height = this.height - this.safeGetItem(1).height - 2 * m;
        this.safeGetItem(2).width = this.width - m;
        break;

      case '3l':
        this.safeGetItem(1).height = this.height - this.safeGetItem(2).height - 2 * m;
        this.safeGetItem(2).width = this.safeGetItem(1).width;
        this.safeGetItem(0).width = this.width - this.safeGetItem(1).width - 2 * m;
        this.safeGetItem(0).height = this.height - m;
        break;

      case '3r':
        this.safeGetItem(0).height = this.height - this.safeGetItem(1).height - 2 * m;
        this.safeGetItem(1).width = this.safeGetItem(0).width;
        this.safeGetItem(2).width = this.width - this.safeGetItem(1).width - 2 * m;
        this.safeGetItem(2).height = this.height - m;
        break;

      case '3v':
        this.safeGetItem(0).width = this.width - m;
        this.safeGetItem(1).width = this.width - m;
        this.safeGetItem(2).width = this.width - m;
        this.safeGetItem(2).height = this.height - this.safeGetItem(0).height - this.safeGetItem(1).height - 3 * m;
        break;

      case '3h':
        this.safeGetItem(0).height = this.height - m;
        this.safeGetItem(1).height = this.height - m;
        this.safeGetItem(2).height = this.height - m;
        this.safeGetItem(2).width = this.width - this.safeGetItem(0).width - this.safeGetItem(1).width - 3 * m;
        break;
    }
  }

  getGroupType(forcedGroupSize) {
    //---------| Override with specifically defined rotating group types (ignores everything else)
    if (this.rotatingGroupTypes) {
      const groupTypesArr = String(this.rotatingGroupTypes).split(',');
      return groupTypesArr[this.idx % groupTypesArr.length]; // } else if (this.isLastItems) {
      //   return this.groupTypes.split(',')[0] || '1';
    } else {
      //isVertical - is the gallery vertical (pinterest style) or horizontal (flickr style)
      //---------| Find the best groupType for each ratios case
      //optional types:
      //  1   => single photo
      //  2v  => 2 photos one above the other
      //  2h  => 2 photos one alongside the other
      //  3b  => 3 photos - one large at the bottom and two small on top, one alongside the other
      //  3t  => 3 photos - one large on top and two small at the bottom, one alongside the other
      //  3l  => 3 photos - one large on the left and two small on the right, one above the other
      //  3r  => 3 photos - one large on the right and two small on the left, one above the other
      //define optional ratios for each type:
      //  1   => all
      //  2v  => lll,llp,ppp     (horizontal only)
      //  2h  => ppp,ppl,lll     (vertical only)
      //  3b  => lll,lpl,pll,ppl (horizontal only)
      //  3t  => lll,lpl,llp,lpp (horizontal only)
      //  3l  => ppp,plp,ppl,pll (vertical only)
      //  3r  => ppp,plp,lpp,llp (vertical only)
      const isV = this.isVertical;
      let optionalTypes; //optional groupTypes (separated by ,). 1 is always optional

      if (this.chooseBestGroup) {
        //map the group to l=landscape and p=portrait
        //create a string to state the images group's type
        const ratios = this.items.map(item => item.orientation.slice(0, 1)).join('');
        optionalTypes = (isV ? GROUP_TYPES_BY_RATIOS_V : GROUP_TYPES_BY_RATIOS_H)[ratios];
      } else if (this.items.length === 3 || forcedGroupSize === 3) {
        optionalTypes = isV ? '1,2h,3l,3r,3h' : '1,2v,3t,3b,3v';
      }

      if (this.items.length === 2 || forcedGroupSize === 2) {
        optionalTypes = isV ? '1,2h' : '1,2v';
      }

      if (this.items.length === 1 || forcedGroupSize === 1) {
        optionalTypes = '1';
      }

      let groupTypes = optionalTypes.length > 0 ? optionalTypes.split(',') : []; //---------| Override with specifically defined group types

      if (this.groupTypes) {
        // let groupTypesArr = union(['1'], this.groupTypes.split(','));
        const groupTypesArr = this.groupTypes.split(',');

        if (groupTypesArr.length > 1) {
          groupTypes = groupTypes.filter(gt => groupTypesArr.indexOf(gt) >= 0);

          if (groupTypes.length === 0) {
            //there is no match between required group types and the optional ones - use
            groupTypes = ['1'];
          }
        } else {
          groupTypes = groupTypesArr;
        }
      } //---------| Calc collage density


      if (this.layoutsVersion > 1 && this.collageDensity >= 0) {
        //th new calculation of the collage amount
        const collageDensity = this.collageDensity; //use the collage amount to determine the optional groupsize

        const maxGroupType = parseInt(groupTypes[groupTypes.length - 1]);
        const optionalGroupSizes = GROUP_SIZES_BY_MAX_SIZE[maxGroupType];
        const targetGroupSizes = optionalGroupSizes[Math.floor(collageDensity * (optionalGroupSizes.length - 1))]; // seed += ((collageDensity * 1.5) - 0.75) * numOfOptions;

        groupTypes = groupTypes.filter(groupType => targetGroupSizes.indexOf(parseInt(groupType)) >= 0);

        if (groupTypes.length === 0) {
          groupTypes = ['1'];
        }
      }

      const seed = this.calculateRandomSeed(groupTypes.length); //---------| Final group type to render according to:
      // - the number of options
      // - the collageAmount (if 0 - always renders 1 image, if 1 always renders the max amount)
      // - random seed (determined by the hash)

      return groupTypes[seed] || '1';
    }
  }

  calculateRandomSeed(numOfOptions) {
    let seed;

    if (this.isVertical) {
      //vertical galleries random is not relevant (previous group is in another column)
      seed = _utils.utils.hashToInt(this.items[0].hash) % numOfOptions;
    } else {
      seed = (this.inStripIdx + this.stripIdx) % numOfOptions;
    }

    if (this.layoutsVersion === 1 && this.collageAmount >= 0) {
      //backwards compatibility
      seed += (this.collageAmount - 0.5) * numOfOptions;
    }

    return Math.round(Math.min(Math.max(0, seed), numOfOptions - 1));
  }

  placeItems(forcedGroupSize) {
    this.type = this.getGroupType(forcedGroupSize); //---------| Render the images by the groupType

    let items = [];
    let item;
    let w = 0;
    let h = 0;

    switch (this.type) {
      default:
      case '1':
        item = this.safeGetItem(0);
        item.pinToCorner('top-left');
        items.push(item);
        w = item.width;
        h = item.height;
        break;

      case '2v':
        item = this.safeGetItem(0);
        item.pinToCorner('top-left');
        items.push(item);
        w = item.width;
        h = item.height;
        item = this.safeGetItem(1);
        item.pinToCorner('bottom-left');
        item.resize(w / item.width);
        h += item.height;
        items.push(item);
        break;

      case '2h':
        item = this.safeGetItem(0);
        item.pinToCorner('top-left');
        item.innerOffset = [0, 0];
        items.push(item);
        w = item.width;
        h = item.height;
        item = this.safeGetItem(1);
        item.pinToCorner('top-right');
        item.innerOffset = [0, 0];
        item.resize(h / item.height);
        w += item.width;
        items.push(item);
        break;

      case '3b':
        item = this.safeGetItem(0);
        item.pinToCorner('top-left');
        items.push(item);
        w = item.width;
        h = item.height;
        item = this.safeGetItem(1);
        item.pinToCorner('top-right');
        item.resize(h / item.height);
        w += item.width;
        items.push(item);
        item = this.safeGetItem(2);
        item.pinToCorner('bottom-left');
        item.resize(w / item.width);
        h += item.height;
        items.push(item);
        break;

      case '3t':
        item = this.safeGetItem(1);
        item.pinToCorner('bottom-left');
        items.push(item);
        w = item.width;
        h = item.height;
        item = this.safeGetItem(2);
        item.pinToCorner('bottom-right');
        item.resize(h / item.height);
        w += item.width;
        items.push(item);
        item = this.safeGetItem(0);
        item.pinToCorner('top-left');
        item.resize(w / item.width);
        h += item.height;
        items = [item].concat(items);
        break;

      case '3r':
        item = this.safeGetItem(0);
        item.pinToCorner('top-left');
        items.push(item);
        w = item.width;
        h = item.height;
        item = this.safeGetItem(1);
        item.pinToCorner('bottom-left');
        item.resize(w / item.width);
        h += item.height;
        items.push(item);
        item = this.safeGetItem(2);
        item.pinToCorner('top-right');
        item.resize(h / item.height);
        w += item.width;
        items.push(item);
        break;

      case '3l':
        item = this.safeGetItem(1);
        item.pinToCorner('top-right');
        items.push(item);
        w = item.width;
        h = item.height;
        item = this.safeGetItem(2);
        item.pinToCorner('bottom-right');
        item.resize(w / item.width);
        h += item.height;
        items.push(item);
        item = this.safeGetItem(0);
        item.pinToCorner('top-left');
        item.resize(h / item.height);
        w += item.width;
        items = [item].concat(items);
        break;

      case '3v':
        item = this.safeGetItem(0);
        item.pinToCorner('top-left');
        item.setPosition('relative');
        items.push(item);
        w = item.width;
        h = item.height;
        item = this.safeGetItem(2);
        item.pinToCorner('bottom-left');
        item.setPosition('relative');
        item.resize(w / item.width);
        h += item.height;
        items.push(item); //the middle item must be last to position it in the middle (h must be full height)

        item = this.safeGetItem(1);
        item.setPosition('relative');
        item.resize(w / item.width);
        h += item.height;
        item.pinToCorner('top', items[0]);
        items = [items[0], item, items[1]];
        break;

      case '3h':
        item = this.safeGetItem(0);
        item.pinToCorner('top-left');
        item.setPosition('relative');
        items.push(item);
        w = item.width;
        h = item.height;
        item = this.safeGetItem(2);
        item.pinToCorner('top-right');
        item.setPosition('relative');
        item.resize(h / item.height);
        w += item.width;
        items.push(item); //the middle item must be last to position it in the middle (w must be full width)

        item = this.safeGetItem(1);
        item.setPosition('relative');
        item.resize(h / item.height);
        w += item.width;
        item.pinToCorner('left', items[0]);
        items = [items[0], item, items[1]];
        break;
    }

    this.width = w;
    this.height = h;
    this.items = items;
    this.placed = true;
  }

  resizeToHeight(height) {
    this.height = height;
    this.width = this.getWidthByHeight(height);
    this.resizeItems();
  }

  resizeToWidth(width) {
    this.width = width;
    this.height = this.getHeightByWidth(width);
    this.resizeItems();
  }

  resizeItems() {
    const items = ['3b', '3r'].indexOf(this.type) >= 0 ? this.items.slice().reverse() : this.items;
    items.forEach((item, i) => {
      item.resize(this.getItemDimensions(items, i));
      item.group = {
        top: this.top,
        left: this.left,
        width: this.width,
        height: this.height
      };
      item.groupOffset = {
        bottom: this.top + this.height,
        right: this.left + this.width
      };
    });
  }

  getItemDimensions(items, idx) {
    const m = this.imageMargin * 2;

    switch (this.type) {
      default:
      case '1':
      case '2v':
      case '3v':
        {
          const w = this.width - m;
          return {
            width: w
          };
        }

      case '2h':
      case '3h':
        {
          const h = this.height - m;
          return {
            height: h
          };
        }

      case '3t':
      case '3b':
        if (idx === 0) {
          const w = this.width - m;
          return {
            width: w
          };
        } else {
          const h = this.height - items[0].height - 2 * m;
          return {
            height: h
          };
        }

      case '3r':
      case '3l':
        if (idx === 0) {
          const h = this.height - m;
          return {
            height: h
          };
        } else {
          const w = this.width - items[0].width - 2 * m;
          return {
            width: w
          };
        }

    }
  }

  getHeightByWidth(W) {
    let Rg = 1;
    let Rm = 1;
    const M = this.imageMargin * 2;
    const R = this.items.map(item => item.width / item.height);

    switch (this.type) {
      // ---------------------------------
      // GENERAL FORMULA:
      // ---------------------------------
      // Rg = Group ratio [layout specific calculation]
      // M = margin space between items ( = margin around item * 2)
      // Rm = Margin ratio [layout specific calculation]
      // ---------------------------------
      // | H = W * R + M * Rm |
      // ---------------------------------
      //    const H = W * Rg + M * (Vi - Hi * Rg);
      default:
      case '1':
        Rg = 1 / R[0];
        Rm = 1 - Rg;
        break;

      case '2h':
        Rg = 1 / (R[0] + R[1]);
        Rm = 1 - 2 * Rg;
        break;

      case '2v':
        Rg = 1 / R[0] + 1 / R[1];
        Rm = 2 - Rg;
        break;

      case '3h':
        Rg = 1 / (R[0] + R[1] + R[2]);
        Rm = 1 - 3 * Rg;
        break;

      case '3v':
        Rg = 1 / R[0] + 1 / R[1] + 1 / R[2];
        Rm = 3 - Rg;
        break;

      case '3t':
        Rg = 1 / (R[2] + R[1]) + 1 / R[0];
        Rm = 2 - 2 / (R[2] + R[1]) + 1 / R[0];
        break;

      case '3b':
        Rg = 1 / (R[0] + R[1]) + 1 / R[2];
        Rm = 2 - 2 / (R[0] + R[1]) + 1 / R[2];
        break;

      case '3l':
        Rg = (R[1] + R[2]) / (R[0] * R[1] + R[1] * R[2] + R[0] * R[2]);
        Rm = 2 - Rg * (2 + R[0]);
        break;

      case '3r':
        Rg = (R[0] + R[1]) / (R[0] * R[1] + R[1] * R[2] + R[0] * R[2]);
        Rm = 2 - Rg * (2 + R[2]);
        break;
    }

    const H = W * Rg + M * Rm;
    return H;
  }

  getWidthByHeight(H) {
    let Rg = 1;
    let Rm = 1;
    const M = this.imageMargin * 2;
    const R = this.items.map(item => item.width / item.height);

    switch (this.type) {
      // ---------------------------------
      // GENERAL FORMULA:
      // ---------------------------------
      // Rh = Group ratio [layout specific calculation]
      // M = margin space between items ( = margin around item * 2)
      // Rm = Margin ratio [layout specific calculation]
      // ---------------------------------
      // | W = H * Rg + M * Rm |
      // ---------------------------------
      default:
      case '1':
        Rg = R[0];
        Rm = 1 - Rg;
        break;

      case '2h':
        Rg = R[0] + R[1];
        Rm = 2 - Rg;
        break;

      case '2v':
        Rg = 1 / (1 / R[0] + 1 / R[1]);
        Rm = 1 - 2 * Rg;
        break;

      case '3h':
        Rg = R[0] + R[1] + R[2];
        Rm = 3 - Rg;
        break;

      case '3v':
        Rg = 1 / (1 / R[0] + 1 / R[1] + 1 / R[2]);
        Rm = 1 - 3 * Rg;
        break;

      case '3t':
        Rg = 1 / (1 / (R[2] + R[1]) + 1 / R[0]);
        Rm = (2 / (R[2] + R[1]) + 1 / R[0] - 2) * Rg;
        break;

      case '3b':
        Rg = 1 / (1 / (R[0] + R[1]) + 1 / R[2]);
        Rm = (2 / (R[0] + R[1]) + 1 / R[2] - 2) * Rg;
        break;

      case '3l':
        Rg = (R[0] * R[1] + R[1] * R[2] + R[0] * R[2]) / (R[1] + R[2]);
        Rm = 2 + R[0] - 2 * Rg;
        break;

      case '3r':
        Rg = (R[0] * R[1] + R[1] * R[2] + R[0] * R[2]) / (R[0] + R[1]);
        Rm = 2 + R[2] - 2 * Rg;
        break;
    }

    const W = H * Rg + M * Rm;
    return W;
  }

  setTop(top) {
    this.top = top || 0;

    for (const item of this.items) {
      item.groupOffset = {
        top,
        bottom: top + this.height
      };
    }
  }

  setLeft(left) {
    this.left = left || 0;

    for (const item of this.items) {
      item.groupOffset = {
        left,
        right: left + this.width
      };
    }
  }

  get id() {
    return 'g' + this.idx + '_' + (this.items[0] || {}).id;
  }

  get ratio() {
    const w = this.width;
    const h = this.height;
    return w / h;
  }

  get height() {
    return this.cubedHeight || this._height;
  }

  set height(h) {
    this._height = h;
  }

  get totalHeight() {
    return this.height + this.infoHeight;
  }

  get infoHeight() {
    return this.externalInfoHeight || 0;
  }

  get infoWidth() {
    return this.Column ? this.Column.infoWidth : this.externalInfoWidth || 0;
  }

  get bottom() {
    return this.top + this.height;
  }

  get right() {
    return this.left + this.width;
  }

  set items(items) {
    this._items = items;
  }

  get items() {
    return this._items;
  }

  get realItems() {
    return this._items.filter(item => item.type !== 'dummy');
  }

  get isWithinMinItemSize() {
    if (this.items.length === 0 || !this.placed) {
      return false;
    }

    if (this.items.length === 1) {
      return true;
    } else {
      return this.items.reduce((i, item) => {
        const isInSize = Math.min(item.width, item.height) >= this.minItemSize;
        return i && isInSize;
      }, true);
    }
  }

  get scheme() {
    return {
      id: this.id,
      idx: this.idx,
      stripIdx: this.stripIdx,
      inStripIdx: this.inStripIdx,
      isLastGroup: this.isLastGroup,
      items: this.items.map(item => item.scheme),
      type: this.type,
      width: this.width,
      height: this.height,
      infoHeight: this.infoHeight,
      infoWidth: this.infoWidth,
      ratio: this.ratio,
      top: this.top,
      left: this.left,
      right: this.right,
      bottom: this.bottom,
      visible: this.visible,
      rendered: this.rendered,
      required: this.required
    };
  }

}

exports.Group = Group;
//# sourceMappingURL=group.js.map

/***/ }),

/***/ 168:
/*!*************************************!*\
  !*** ./common/utils/layoutFixer.js ***!
  \*************************************/
/*! no exports provided */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is an entry point */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var pro_layouts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pro-layouts */ 9);
/* harmony import */ var pro_layouts__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(pro_layouts__WEBPACK_IMPORTED_MODULE_0__);
function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



var setAttributes = function setAttributes(node, attributes) {
  return node && attributes && Object.keys(attributes).forEach(function (attr) {
    return node.setAttribute(attr, attributes[attr]);
  });
};

var setStyle = function setStyle(node, styleProperties) {
  return node && styleProperties && Object.keys(styleProperties).forEach(function (prop) {
    var propValue = styleProperties[prop];

    if (propValue !== undefined) {
      node.style[prop] = propValue;
    } else {
      node.style.removeProperty(prop);
    }
  });
};

var getItemWrapperStyle = function getItemWrapperStyle(item, styleParams) {
  return {
    width: item.width + 'px',
    height: item.height + (styleParams.externalInfoHeight || 0) + 'px'
  };
};

var getItemContainerStyle = function getItemContainerStyle(item, styleParams) {
  var itemWrapperStyles = getItemWrapperStyle(item, styleParams);
  var isRTL = styleParams.isRTL;
  return _objectSpread({
    opacity: 1,
    transition: 'opacity .8s ease',
    top: item.offset.top + 'px',
    left: isRTL ? 'auto' : item.offset.left + 'px',
    right: !isRTL ? 'auto' : item.offset.left + 'px'
  }, itemWrapperStyles);
};

var createLayoutFixer = function createLayoutFixer() {
  if (window.layoutFixerCreated === true) {
    return;
  }

  window.layoutFixerCreated = true; //console.log('[LAYOUT FIXER] createLayoutFixer');

  var LayoutFixerElement = /*#__PURE__*/function (_HTMLElement) {
    _inheritsLoose(LayoutFixerElement, _HTMLElement);

    function LayoutFixerElement() {
      return _HTMLElement.apply(this, arguments) || this;
    }

    var _proto = LayoutFixerElement.prototype;

    _proto.connectedCallback = function connectedCallback() {
      var _this = this;

      if (this.setStylesDone) {
        return;
      } // console.log('[LAYOUT FIXER] connectedCallback');


      this.parentId = this.getAttribute('parentid');
      this.parent = this.parentNode; // && document.getElementById(this.parentId)
      // console.log('[LAYOUT FIXER] parent', this.parent);

      this.useLayouter = true;
      this.items = JSON.parse(this.getAttribute('items'));

      if (!(this.items && this.items.length > 0)) {
        this.useLayouter = false;
      } // console.log('[LAYOUT FIXER] items', this.items.map(item => item.mediaUrl));


      this.styleParams = JSON.parse(this.getAttribute('styles'));

      if (!(this.styleParams && typeof this.styleParams === 'object')) {
        this.useLayouter = false;
      }

      this.measures = this.parent && this.parent.getBoundingClientRect();

      if (this.measures && this.useLayouter && typeof pro_layouts__WEBPACK_IMPORTED_MODULE_0__["createLayout"] === 'function') {
        this.layout = Object(pro_layouts__WEBPACK_IMPORTED_MODULE_0__["createLayout"])({
          items: this.items,
          styleParams: this.styleParams,
          container: this.measures
        }); // console.log('[LAYOUT FIXER] layout', this.layout);
      }

      if (typeof this.measures === 'object') {
        // console.log('[LAYOUT FIXER] measures', this.measures);
        setAttributes(this.parent, {
          'data-top': this.measures.top,
          'data-width': this.measures.width,
          'data-height': this.measures.height
        });
      }

      if (this.useLayouter && this.layout && this.layout.items && this.layout.items.length > 0) {
        this.parent.querySelectorAll('.gallery-item-container').forEach(function (element, idx) {
          // console.log('[LAYOUT FIXER] setStyle', idx, getItemContainerStyle(this.layout.items[idx], this.styleParams));
          setStyle(element, getItemContainerStyle(_this.layout.items[idx], _this.styleParams));
        });
        this.parent.querySelectorAll('.gallery-item-wrapper').forEach(function (element, idx) {
          setStyle(element, getItemWrapperStyle(_this.layout.items[idx], _this.styleParams));
        });
        this.setStylesDone = true;
        console.log('[LAYOUT FIXER] setStyles Done');
      }
    };

    return LayoutFixerElement;
  }( /*#__PURE__*/_wrapNativeSuper(HTMLElement)); //console.log('[LAYOUT FIXER] customElements.define', window, window.customElements);


  window.customElements.define('layout-fixer', LayoutFixerElement);
};

if (typeof window !== 'undefined') {
  try {
    console.log('[LAYOUT FIXER] v2');
    createLayoutFixer();
  } catch (e) {
    console.error('Cannot create layout fixer', e);
  }
}

/***/ }),

/***/ 20:
/*!****************************************************************************!*\
  !*** /Users/guyso/Code/Wix/pro-gallery/packages/layouts/dist/src/strip.js ***!
  \****************************************************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.Strip = void 0;

class Strip {
  constructor(config) {
    this.ratio = 0;
    this.groups = [];
    this.width = 0;
    this.height = 0;
    this.isFullWidth = true;
    this.idx = config.idx;
    this.groupsPerStrip = config.groupsPerStrip;
    this.oneRow = config.oneRow;
    this.targetItemSize = config.targetItemSize;
    this.container = config.container;
  }

  addGroup(group) {
    if (this.hasGroups) {
      this.lastGroup.isLastGroup = false;
    }

    this.groups.push(group);
    group.stripIdx = this.idx;
    group.Strip = this;
    this.lastGroup.isLastGroup = true;
    this.lastGroup.stripWidth = this.height * this.ratio;
  }

  markAsIncomplete() {
    //prevent from the last group to be streched
    this.isFullWidth = false;
    this.lastGroup.isLastGroup = false;
  }

  canRemainIncomplete() {
    return this.targetItemSize * 1.5 < this.height;
  }

  setWidth(width) {
    this.width = width;

    if (this.hasGroups) {
      this.lastGroup.stripWidth = width;
    }
  }

  resizeToHeight(height) {
    this.height = height;
    let left = 0;
    let remainder = 0;

    for (const group of this.groups) {
      group.setLeft(left); // group.left = (left);

      group.width += remainder; //add the remainder from the last group round

      group.resizeToHeight(height);
      remainder = group.width;
      group.round();
      remainder -= group.width;
      left += group.width;
    }
  }

  isFull(newGroup, isLastImage) {
    if (!this.hasGroups) {
      return false;
    }

    const groupsPerStrip = this.groupsPerStrip,
          oneRow = this.oneRow,
          targetItemSize = this.targetItemSize;

    if (groupsPerStrip > 0) {
      return this.groups.length >= groupsPerStrip;
    }

    const galleryWidth = this.container.galleryWidth;
    let isStripSmallEnough;

    if (oneRow) {
      isStripSmallEnough = false; //onerow layout is one long strip
    } else {
      const withNewGroup = galleryWidth / (this.ratio + newGroup.ratio) - targetItemSize; //start a new strip BEFORE adding the current group

      const withoutNewGroup = galleryWidth / this.ratio - targetItemSize; //start a new strip AFTER adding the current group

      if (isNaN(withNewGroup) || isNaN(withoutNewGroup)) {
        isStripSmallEnough = false;
      } else if (withoutNewGroup < 0) {
        //the strip is already too small
        isStripSmallEnough = true;
      } else if (withNewGroup < 0) {
        //adding the new group makes is small enough
        // check if adding the new group makes the strip TOO small
        //so - without the new group, the strip is larger than the required size - but adding the new group might make it too small
        isStripSmallEnough = Math.abs(withoutNewGroup) < Math.abs(withNewGroup);
      } else {
        isStripSmallEnough = false;
      }

      if (isStripSmallEnough && isLastImage) {
        //if it is the last image - prefer adding it to the last strip rather putting it on a new strip
        isStripSmallEnough = Number(Math.abs(withoutNewGroup)) < Math.abs(withNewGroup);
      }
    }

    return isStripSmallEnough;
  }

  get hasGroups() {
    return this.groups.length > 0;
  }

  get lastGroup() {
    return this.groups[this.groups.length - 1];
  }

  get scheme() {
    return {
      idx: this.idx,
      groups: this.groups.map(group => group.scheme),
      width: this.width,
      height: this.height,
      ratio: this.ratio,
      isFullWidth: this.isFullWidth
    };
  }

}

exports.Strip = Strip;
//# sourceMappingURL=strip.js.map

/***/ }),

/***/ 21:
/*!*****************************************************************************!*\
  !*** /Users/guyso/Code/Wix/pro-gallery/packages/layouts/dist/src/column.js ***!
  \*****************************************************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.Column = void 0;

class Column {
  constructor(idx, width, left, cubedHeight, infoWidth) {
    this.idx = idx;
    this.groups = [];
    this.height = 0;
    this.width = width;
    this.left = left;
    this.cubedHeight = cubedHeight;
    this.infoWidth = infoWidth || 0;
  }

  addGroup(group) {
    this.addGroups([group]);
  }

  addGroups(groups) {
    this.groups = this.groups.concat(groups);
    groups.forEach(group => {
      group.columnIdx = this.idx;
      group.Column = this;
    });
  }

  get totalWidth() {
    return this.width + this.infoWidth;
  }

  get scheme() {
    return {
      idx: this.idx,
      groups: this.groups.map(group => group.scheme),
      width: this.width,
      height: this.height
    };
  }

}

exports.Column = Column;
//# sourceMappingURL=column.js.map

/***/ }),

/***/ 22:
/*!***********************************************************************************!*\
  !*** /Users/guyso/Code/Wix/pro-gallery/packages/layouts/dist/src/layoutsStore.js ***!
  \***********************************************************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = void 0;

class LayoutsStore {
  set layout(_layout) {
    this._layout = { ..._layout
    };
  }

  get layout() {
    return this._layout;
  }

}

var _default = new LayoutsStore();

exports.default = _default;
//# sourceMappingURL=layoutsStore.js.map

/***/ }),

/***/ 23:
/*!************************************************************************************!*\
  !*** /Users/guyso/Code/Wix/pro-gallery/packages/layouts/dist/src/create-layout.js ***!
  \************************************************************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = createLayout;

var _layouter = _interopRequireDefault(__webpack_require__(/*! ./layouter */ 15));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createLayout(...args) {
  return new _layouter.default(...args).createLayout();
}
//# sourceMappingURL=create-layout.js.map

/***/ }),

/***/ 9:
/*!****************************************************************************!*\
  !*** /Users/guyso/Code/Wix/pro-gallery/packages/layouts/dist/src/index.js ***!
  \****************************************************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.Group = exports.Item = exports.createLayout = exports.Layouter = void 0;

var _layouter = _interopRequireDefault(__webpack_require__(/*! ./layouter */ 15));

exports.Layouter = _layouter.default;

var _item = __webpack_require__(/*! ./item */ 12);

exports.Item = _item.Item;

var _group = __webpack_require__(/*! ./group */ 16);

exports.Group = _group.Group;

var _createLayout = _interopRequireDefault(__webpack_require__(/*! ./create-layout */ 23));

exports.createLayout = _createLayout.default;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=index.js.map

/***/ })

/******/ });
})}).toString();