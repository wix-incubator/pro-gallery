import { optionsMap } from 'pro-gallery-lib';
import { utils } from './utils.js';

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
    this.cubeType = 'FILL';

    if (config.styleParams) {
      const { styleParams } = config;
      this.cubeType = styleParams[optionsMap.layoutParams.crop.method];
      this.cubeImages = styleParams[optionsMap.layoutParams.crop.enable];
      this._cropRatio = styleParams[optionsMap.layoutParams.crop.ratios];
      this.rotatingCropRatios =
        styleParams[optionsMap.layoutParams.crop.ratios].length > 1 && styleParams[optionsMap.layoutParams.crop.ratios];
      this.smartCrop = styleParams[optionsMap.layoutParams.crop.enableSmartCrop];
      this.cropOnlyFill = styleParams[optionsMap.layoutParams.crop.cropOnlyFill];
      this.imageMargin = styleParams[optionsMap.layoutParams.structure.itemSpacing];
      this.gallerySpacing = styleParams[optionsMap.layoutParams.structure.gallerySpacing];
      this.scatter = styleParams[optionsMap.layoutParams.structure.scatter.randomScatter];
      this.rotatingScatter = styleParams[optionsMap.layoutParams.structure.scatter.manualScatter];
      this.smartCrop = styleParams[optionsMap.layoutParams.crop.enableSmartCrop];
      this.useMaxDimensions =
        !styleParams[optionsMap.layoutParams.structure.enableStreching] && this.itemType !== 'text';
      this.cubeFitPosition = styleParams[optionsMap.layoutParams.crop.alignment];
    }

    this._groupOffset = {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    };

    this._group = {};
    this.calcPinOffset = () => 0;

    this.resize(1);
  }

  fixMetadataVerticalVideoRatio(metadata) {
    if (metadata.qualities && metadata.qualities[0]) {
      //fix incorrect width height for vertical videos
      const { qualities } = metadata;
      const { height, width } = qualities[qualities.length - 1];
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
        const m = this.imageMargin / 2;
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
    return parseInt(pos, 10) >= 0 ? pos : 'auto';
  }

  calcScatter(offset) {
    const m = this.imageMargin / 2;
    const g = this.gallerySpacing;

    const spaceLeft = offset.left > 0 ? m : g;
    const spaceRight = this.container.galleryWidth - offset.right > 2 * m ? m : g;
    const spaceUp = offset.top > 0 ? m : g;
    const spaceDown = this.container.galleryHeight - offset.bottom > 2 * m ? m : g;

    if (this.rotatingScatter.length > 0) {
      try {
        const scatterArr = this.rotatingScatter.split(',');
        const [x, y] = scatterArr[this.idx % scatterArr.length]
          .split('/')
          .map((dim) => parseInt(dim))
          .map((dim) => dim / 100);
        let horizontalShift = x * (x > 0 ? spaceRight : spaceLeft);
        let verticalShift = y * (y > 0 ? spaceDown : spaceUp);
        return { x: horizontalShift, y: verticalShift };
      } catch (e) {
        console.error('Cannot calculate rotating scatter', e);
      }
    } else if (this.scatter > 0) {
      const minShift = 0.4 * (this.scatter / 100);

      let horizontalShift = utils.hashToRandomInt(this.seed + offset.right + 'x', -spaceLeft, spaceRight);

      horizontalShift *= this.scatter / 100;
      horizontalShift *= 1 - minShift;

      horizontalShift +=
        (horizontalShift > 0 ? minShift * spaceRight : minShift * spaceLeft) * Math.sign(horizontalShift);

      horizontalShift = Math.round(horizontalShift);

      let verticalShift = utils.hashToRandomInt(this.seed + offset.right + 'y', -spaceUp, spaceDown);

      verticalShift *= this.scatter / 100;
      verticalShift *= 1 - minShift;

      verticalShift += (verticalShift > 0 ? minShift * spaceDown : minShift * spaceUp) * Math.sign(verticalShift);

      verticalShift = Math.round(verticalShift);

      return { x: horizontalShift, y: verticalShift };
    } else {
      return { x: 0, y: 0 };
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
      top:
        this._groupOffset.top +
          (this.isPinnedTop ? this.calcPinOffset(this._group.height, 'top') : this._group.height - this.outerHeight) ||
        0,
      left:
        this._groupOffset.left +
          (this.isPinnedLeft ? this.calcPinOffset(this._group.width, 'left') : this._group.width - this.outerWidth) ||
        0,
    };
    const { fixTop = 0, fixLeft = 0, fixRight = 0, fixBottom = 0 } = this.dimensions;

    offset.innerTop = fixTop;
    offset.innerLeft = fixLeft;
    offset.innerRight = fixRight;
    offset.innerBottom = fixBottom;

    offset.right = offset.left + this.width;
    offset.bottom = offset.top + this.height;

    if (this.scatter > 0 || this.rotatingScatter?.length > 0) {
      const { x, y } = this.calcScatter(offset);
      offset.left += x;
      offset.top += y;
      offset.right = offset.left + this.width;
      offset.bottom = offset.top + this.height;
    }

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

  get seed() {
    return this.dto.seed || utils.hashToInt(this.hash);
  }

  get metadata() {
    return this.dto.metadata || this.dto.metaData || {};
  }

  get itemType() {
    return this.metadata.type || 'image';
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
    return this.style.orgWidth || this.dto.width || this.dto.w || 1; //make sure the width / height is not undefined (crashes the gallery)
  }

  get width() {
    let width;
    if (this.cubeImages && this.ratio >= this.cropRatio) {
      width = this.style.cubedWidth || this.orgHeight * this.cropRatio;
    } else {
      width = this.orgWidth;
    }
    return Math.max(width, 1);
  }

  set width(w) {
    // prettier-ignore
    this.style.cubedWidth =
    // prettier-ignore
      this.style.orgWidth =
    // prettier-ignore
      this.style.width =
    // prettier-ignore
        Math.max(1, w);

    const { fixLeft = 0, fixRight = 0 } = this.dimensions;
    this.style.innerWidth = this.style.width - fixLeft - fixRight;
  }

  get outerHeight() {
    return this.height + 2 * this.margins;
  }

  get orgHeight() {
    return this.style.orgHeight || this.dto.height || this.dto.h || 1; //make sure the width / height is not undefined (creashes the gallery)
  }

  get height() {
    let height;
    if (this.cubeImages && this.ratio < this.cropRatio) {
      height = this.style.cubedHeight || this.orgWidth / this.cropRatio;
    } else {
      height = this.orgHeight;
    }
    return Math.max(height, 1);
  }

  set height(h) {
    // prettier-ignore
    this.style.cubedHeight =
    // prettier-ignore
      this.style.orgHeight =
    // prettier-ignore
      this.style.height =
    // prettier-ignore
        Math.max(1, h);

    const { fixTop = 0, fixBottom = 0 } = this.dimensions;
    this.style.innerHeight = this.style.height - fixBottom - fixTop;
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
    return this.imageMargin / 2 || 0;
  }
  set margins(m) {
    this.imageMargin = m;
  }

  get dimensions() {
    const isGridFit = this.cubeImages && this.cubeType === 'FIT';

    let targetWidth = this.width;
    let targetHeight = this.height;

    const setTargetDimensions = (setByWidth, ratio) => {
      if (setByWidth) {
        targetWidth = this.useMaxDimensions ? Math.min(this.width, this.maxWidth) : this.width;
        targetHeight = targetWidth / ratio;
      } else {
        targetHeight = this.useMaxDimensions ? Math.min(this.height, this.maxHeight) : this.height;
        targetWidth = targetHeight * ratio;
      }
    };

    const isLandscape = this.ratio >= this.cropRatio; //relative to container size
    if (isGridFit) {
      setTargetDimensions(isLandscape, this.ratio);
    } else if (this.useMaxDimensions && (this.width > this.maxWidth || this.height > this.maxHeight)) {
      if (this.cubeImages) {
        setTargetDimensions(!isLandscape, this.cropRatio);
      } else {
        setTargetDimensions(!isLandscape, this.ratio);
      }
    }

    let fixVals = {
      fixTop: (this.height - targetHeight) / 2,
      fixLeft: (this.width - targetWidth) / 2,
      fixRight: (this.width - targetWidth) / 2,
      fixBottom: (this.height - targetHeight) / 2,
    };

    switch (this.cubeFitPosition) {
      case 'TOP':
        fixVals.fixTop = 0;
        fixVals.fixBottom *= 2;
        break;
      case 'BOTTOM':
        fixVals.fixTop *= 2;
        fixVals.fixBottom = 0;
        break;
      case 'LEFT':
        fixVals.fixLeft = 0;
        fixVals.fixRight *= 2;
        break;
      case 'RIGHT':
        fixVals.fixLeft *= 2;
        fixVals.fixRight = 0;
        break;
    }

    return fixVals;
  }

  get cropRatio() {
    let ratio;
    if (this.rotatingCropRatio) {
      ratio = this.rotatingCropRatio;
    } else if (this.rotatingCropRatios && this.rotatingCropRatios.length > 1) {
      const cropRatiosArr = this.rotatingCropRatios;
      ratio = this.rotatingCropRatio = cropRatiosArr[this.idx % cropRatiosArr.length];
    }
    if (!ratio && typeof this._cropRatio === 'function') {
      ratio = this._cropRatio();
    }
    if (!ratio && this.cropOnlyFill && this.cubeType === 'FIT') {
      ratio = this.ratio;
    }

    if (!ratio) {
      ratio = (this._cropRatio && this._cropRatio[0]) || this.ratio;
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
                dim: idx === 0 ? 'galleryWidth' : 'galleryHeight',
              };
            } else {
              return {
                type: 'px',
                val: parseInt(val.replace('px', '')),
              };
            }
          });
        } else {
          this.dynamicCropRatios = null;
        }
      }
      if (this.dynamicCropRatios) {
        const dynamicCropRatio = this.dynamicCropRatios.map((r) => {
          if (r.type === '%') {
            const dim = this.container[r.dim] + (r.dim === 'galleryHeight' ? this.imageMargin / 2 : 0);
            const relativeDim = r.val * dim - this.imageMargin;
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

    if (this.cubeType === 'MIN') {
      ratio = Math.max(ratio, this.orgRatio);
    } else if (this.cubeType === 'MAX') {
      ratio = Math.min(ratio, this.orgRatio);
    }

    return ratio;
  }

  set cropRatio(ratio) {
    if (typeof this._cropRatio === 'number') {
      this._cropRatio = ratio;
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

  get roundedStyle() {
    return {
      ...this.style,
      width: Math.round(this.style.width),
      height: Math.round(this.style.height),
    };
  }

  get scheme() {
    return {
      id: this.id,
      idx: this.idx,
      inGroupIdx: this.inGroupIdx,
      dto: this.dto,
      type: this.type,
      style: this.style,
      roundedStyle: this.roundedStyle,
      width: this.width,
      maxWidth: this.maxWidth,
      outerWidth: this.outerWidth,
      infoWidth: this.infoWidth,
      margins: this.margins,
      ratio: this.ratio,
      dimensions: this.dimensions,
      cropRatio: this.cropRatio,
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
      visibility: this.visibility,
    };
  }
}
