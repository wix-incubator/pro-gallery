import * as _ from 'lodash';
import {utils} from './utils';

export class Item {

  /* @ngInject */
  constructor(config) {
    this.style = {};

    //Item core can be initialized with:
    // {dto: ItemDto(..)}
    // or {wixVideo: ... }
    // or {wixImage: ...}

    //in addition - support of {sharpParam: {quality}}

    config = config || {};

    if (config.dto && config.dto.dto) {
      config.dto = config.dto.dto; //defence patch due to mis-use of item-core
      if (utils.isDev()) {
        console.warn('Item core is created with already existing item core');
      }
    }
    this.dto = _.merge({}, config.dto, (config.dto.metadata || config.dto.metaData || {}));

    if (_.isEmpty(this.dto)) {
      throw new Error('Item: no dto');
    }
    
    this.cubeType = config.cubeType || 'fill';
    this.cubeImages = config.cubeImages;
    this._cubeRatio = config.cubeRatio;
    this.smartCrop = config.smartCrop;
    this.cropOnlyFill = config.cropOnlyFill;
    this.imageMargin = config.imageMargin;
    this.galleryMargin = config.galleryMargin;
    this.floatingImages = config.floatingImages;
    this.idx = config.idx;
    this.smartCrop = config.smartCrop;
    this.createdBy = config.createdBy;
    this.container = config.container;
    this._offset = {};
    this._group = {};

    this.resize(1);

  }
  
  resize(scaleOrDimensions) {

    if (utils.shouldLog('spacing')) {
      console.log(`SPACING - Item  resize `, scaleOrDimensions);
    }

    let scale = 1;
    if (scaleOrDimensions === false) {
      return;
    } else if (_.isNumber(scaleOrDimensions)) {
      scale = scaleOrDimensions;
    } else if (_.isObject(scaleOrDimensions)) {
      if (scaleOrDimensions.width) {
        scale = scaleOrDimensions.width / this.width;
      } else if (scaleOrDimensions.height) {
        scale = scaleOrDimensions.height / this.height;
      }
    }

    this.width *= scale;
    this.height *= scale;

    if (utils.shouldLog('spacing')) {
      console.log(`SPACING - Item  W: ${this.width}`);
      console.log(`SPACING - Item  H: ${this.height}`);
    }

    this.resized = true;
    
    return this;
  }
  
  pinToCorner(cornerName) {

    const isTop = cornerName.indexOf('top') >= 0;
    const isLeft = cornerName.indexOf('left') >= 0;

    this.style.top = isTop ? 0 : 'auto';
    this.style.bottom = isTop ? 'auto' : 0;
    this.style.left = isLeft ? 0 : 'auto';
    this.style.right = isLeft ? 'auto' : 0;

    this.pin = cornerName;
    this.isPinnedTop = isTop;
    this.isPinnedLeft = isLeft;

  }

  setPosition(position) {
    this.style.position = position;
  }

  getPosition(pos) {
    return (parseInt(pos, 10) >= 0 ? pos : 'auto');
  }

  get hash() {
    return this.id;
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
    _.merge(this._group, group);
  }

  set offset(offset) {
    _.merge(this._offset, offset);
  }

  get offset() {
    return {
      top: this._offset.top + (this.isPinnedTop ? 0 : (this._group.height - this.height)),
      left: this._offset.left + (this.isPinnedLeft ? 0 : (this._group.width - this.width)),
      right: this._offset.right - (this.isPinnedLeft ? (this._group.width - this.width) : 0),
      bottom: this._offset.bottom - (this.isPinnedTop ? (this._group.height - this.height) : 0),
    };
  }

  get transform() {
    if (this.floatingImages > 0) {

      const m = this.imageMargin;
      const g = this.galleryMargin;

      const spaceLeft = (this.offset.left > 0) ? m : g;
      const spaceRight = (this.container.galleryWidth - this.offset.right > 2 * m) ? m : g;
      const spaceUp = (this.offset.top > 0) ? m : g;
      const spaceDown = (this.container.galleryHeight - this.offset.bottom > 2 * m) ? m : g;

      const horizontalShift = utils.hashToInt(this.hash, -1 * spaceLeft, spaceRight) * this.floatingImages;
      const verticalShift = utils.hashToInt(this.full_url.img, -1 * spaceUp, spaceDown) * this.floatingImages;

      return {
        transform: `translate3d(${horizontalShift}px, ${verticalShift}px, 0)`
      };
    } else {
      return {};
    }

  }

  get id() {
    return this.dto.photoId || this.dto.itemId;
  }

  set id(id) {
    this.dto.itemId = id;
  }
  
  get maxWidth() {
    return this.dto.width || this.dto.w
  }
  set maxWidth(w) {
    return this.dto.width = w;
  }

  get outerWidth() {
    return this.width + (2 * this.margins);
  }

  get orgWidth() {
    return this.style.width || this.dto.width || this.dto.w ||  1; //make sure the width / height is not undefined (creashes the gallery)
  }

  get width() {
    if (this.cubeImages && (this.ratio >= this.cubeRatio)) {
      return this.style.cubedWidth || (this.orgHeight * this.cubeRatio);
    } else {
      return this.orgWidth;
    }
  }

  set width(w) {
    this.style.cubedWidth = this.style.width = Math.max(1, w);
  }

  get outerHeight() {
    return this.height + (2 * this.margins);
  }

  get orgHeight() {
    return this.style.height || this.dto.height || this.dto.h ||  1; //make sure the width / height is not undefined (creashes the gallery)
  }

  get height() {
    if (this.cubeImages && (this.ratio < this.cubeRatio)) {
      return this.style.cubedHeight || (this.orgWidth / this.cubeRatio);
    } else {
      return this.orgHeight;
    }
  }

  set height(h) {
    this.style.cubedHeight = this.style.height = Math.max(1, h);
  }
  
  get maxHeight() {
    return this.dto.height || this.dto.h
  }
  set maxHeight(h) {
    h = this.dto.height;
  }
  
  get margins() {
    return this.imageMargin || 0;
  }
  set margins(m) {
    this.imageMargin = m;
  }
  
  get cubeRatio() {
    let ratio;
    if (_.isFunction(this._cubeRatio)) {
      ratio = this._cubeRatio();
    } else if (this.cropOnlyFill && this.cubeType === 'fit') {
      ratio = this.ratio;
    } else {
      ratio = this._cubeRatio;
    }

    if (this.smartCrop === true) {
      if (this.isPortrait) {
        return Math.min(ratio, (1 / ratio));
      } else {
        return Math.max(ratio, (1 / ratio));
      }
    } else {
      return ratio;
    }
  }

  set cubeRatio(ratio) {
    this._cubeRatio = ratio;
    this.style.cubedHeight = this.style.cubedWidth = 0;
  }

  get orientation() {
    return ((this.ratio < 0.999) ? 'portrait' : 'landscape'); //make sure that almost square images get the same treatment
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
      style: this.style,
      width: this.width,
      maxWidth: this.maxWidth,
      outerWidth: this.outerWidth,
      height: this.height,
      maxHeight: this.maxHeight,
      outerHeight: this.outerHeight,
      margins: this.margins,
      ratio: this.ratio,
      cropRatio: this.cubeRatio,
      isCropped: this.cubeImages,
      cropType: this.cubeType,
      offset: this.offset,
      transform: this.transform,
      orientation: this.orientation
    }
  }
}
