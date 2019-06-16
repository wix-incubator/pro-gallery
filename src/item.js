import {utils} from './utils';

export class Item {

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
      const {styleParams} = config;
      this.cubeType = styleParams.cubeType;
      this.cubeImages = styleParams.cubeImages;
      this._cubeRatio = styleParams.cubeRatio;
      this.rotatingCropRatios = styleParams.rotatingCropRatios;
      this.smartCrop = styleParams.smartCrop;
      this.cropOnlyFill = styleParams.cropOnlyFill;
      this.imageMargin = styleParams.imageMargin;
      this.galleryMargin = styleParams.galleryMargin;
      this.floatingImages = styleParams.floatingImages;
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
    if (metadata.qualities && metadata.qualities[0]) { //fix incorrect width height for vertical videos
      const {qualities} = metadata;
      const {height, width} = qualities[qualities.length - 1];
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
    this.pinAfterType = isTop ? 'top' : (isLeft ? 'left' : '');
    this.calcPinOffset = (groupSize, dir) => {
      if (!this.pinAfter) {
        return 0;
      } else if (this.pin === dir) {
        //this is used only for 3h/3v group types - to calc the offset of the middle item
        const m = this.imageMargin;
        // return ((groupSize - 6 * m) * this.pinOffset + 2 * m);
        if (dir === 'top') {
          return this.pinAfter.height + 2 * m;
        } else if (dir === 'left') {
          return this.pinAfter.width + 2 * m;
        } else {
          return 0;
        }
        // return ((groupSize - 6 * m) * this.pinOffset + 4 * m);
      } else {
        return 0;
      }
    };

  }

  setPosition(position) {
    this.style.position = position;
  }

  getPosition(pos) {
    return (parseInt(pos, 10) >= 0 ? pos : 'auto');
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
      top: this._groupOffset.top + (this.isPinnedTop ? this.calcPinOffset(this._group.height, 'top') : (this._group.height - this.outerHeight)) || 0,
      left: this._groupOffset.left + (this.isPinnedLeft ? this.calcPinOffset(this._group.width, 'left') : (this._group.width - this.outerWidth)) || 0,
    };
    offset.right = offset.left + this.width;
    offset.bottom = offset.top + this.height;
    return offset;
  }

  get transform() {
    if (this.floatingImages > 0) {

      const m = this.imageMargin;
      const g = this.galleryMargin;

      const spaceLeft = (this.offset.left > 0) ? m : g;
      const spaceRight = (this.container.galleryWidth - this.offset.right > 2 * m) ? m : g;
      const spaceUp = (this.offset.top > 0) ? m : g;
      const spaceDown = (this.container.galleryHeight - this.offset.bottom > 2 * m) ? m : g;

      const horizontalShift = utils.hashToInt(this.hash + this.offset.right + 'x', -1 * spaceLeft, spaceRight) * this.floatingImages;
      const verticalShift = utils.hashToInt(this.hash + this.offset.top + 'y', -1 * spaceUp, spaceDown) * this.floatingImages;

      return {
        transform: `translate3d(${horizontalShift}px, ${verticalShift}px, 0)`
      };
    } else {
      return {};
    }

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
    return this.width + (2 * this.margins);
  }

  get orgWidth() {
    return this.style.width || this.dto.width || this.dto.w || 1; //make sure the width / height is not undefined (crashes the gallery)
  }

  get width() {
    let width;
    if (this.cubeImages && (this.ratio >= this.cubeRatio)) {
      width = this.style.cubedWidth || (this.orgHeight * this.cubeRatio);
    } else {
      width = this.orgWidth;
    }
    return Math.max(width, 1);
  }

  set width(w) {
    this.style.cubedWidth = this.style.width = Math.max(1, w);
  }

  get outerHeight() {
    return this.height + (2 * this.margins);
  }

  get orgHeight() {
    return this.style.height || this.dto.height || this.dto.h || 1; //make sure the width / height is not undefined (creashes the gallery)
  }

  get height() {
    let height;
    if (this.cubeImages && (this.ratio < this.cubeRatio)) {
      height = this.style.cubedHeight || (this.orgWidth / this.cubeRatio);
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

  get margins() {
    return this.imageMargin || 0;
  }
  set margins(m) {
    this.imageMargin = m;
  }

  get cubeRatio() {
    let ratio;
    if (this.rotatingCropRatios && this.rotatingCropRatios.length > 0) {
      const cropRatiosArr = String(this.rotatingCropRatios).split(',');
      ratio = cropRatiosArr[(this.idx) % cropRatiosArr.length];
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
          console.error(match);
          this.dynamicCropRatios = ratio.split('/').map((val, idx) => {
            if (val.indexOf('%') > 0) {
              return {
                type: '%',
                val: (parseFloat(val.replace('%', ''))) / 100,
                dim: (idx === 0) ? 'galleryWidth' : 'galleryHeight'
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
            const relativeDim = r.val * dim - (2 * this.imageMargin);
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
        return Math.min(ratio, (1 / ratio));
      } else {
        return Math.max(ratio, (1 / ratio));
      }
    } else {
      return ratio;
    }
  }

  set cubeRatio(ratio) {
    if (typeof this._cubeRatio === 'number') {
      this._cubeRatio = ratio;
      this.style.cubedHeight = this.style.cubedWidth = 0;
    }
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
      inGroupIdx: this.inGroupIdx,
      dto: this.dto,
      type: this.type,
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
      group: this.group,
      offset: this.offset,
      groupOffset: this._groupOffset,
      transform: this.transform,
      orientation: this.orientation,
      isPortrait: this.isPortrait,
      isLandscape: this.isLandscape,
      visibility: this.visibility
    };
  }
}
