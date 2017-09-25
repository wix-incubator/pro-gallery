import * as _ from 'lodash';
import { utils } from './utils'

export class Item {

  /* @ngInject */
  constructor(config) {
    this.style = {};
    this.isReadMoreOpen = false;

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
    this.dto = _.merge({}, config.dto);

    if (config.wixImage && _.isNumber(config.orderIndex)) {
      this.createFromWixImage(config.wixImage, config.orderIndex, config.addWithTitles, config.isSecure);
    }

    if (config.wixVideo && _.isNumber(config.orderIndex)) {
      this.createFromWixVideo(config.wixVideo, config.orderIndex, config.addWithTitles, config.isSecure);
    }

    if (config.wixExternal && _.isNumber(config.orderIndex)) {
      this.createFromExternal(config.wixExternal, config.orderIndex, config.addWithTitles, config.isSecure);
    }

    if (this.dto) {
      var itemMetadata = this.dto.metaData || this.dto.metadata;
      if (itemMetadata) { //metadata is encoded encoded, parsed if needed
        this.dto.metaData = this.parseStringObject(itemMetadata);
      }
    }
    if (_.isEmpty(this.dto)) {
      throw new Error('Item core: no dto');
    }

    this.sharpParams = _.merge({}, config.sharpParams);
    if (!this.sharpParams.quality) {
      this.sharpParams.quality = 90;
    }
    if (!this.sharpParams.usm) {
      this.sharpParams.usm = {};
    }

    this.updateSharpParams();

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

    this.style = {
      bgColor: this.bgColor,
      maxWidth: this.maxWidth,
      maxHeight: this.maxHeight,
      ratio: this.ratio,
      orientation: this.orientation
    };
  
    this.resize(1);
  
  }

  updateSharpParams() {
    //override sharpParams with item sharpParams
    if (this.dto.metaData && this.dto.metaData.sharpParams && this.dto.metaData.sharpParams['L']) {
      const sharpParams = this.dto.metaData.sharpParams['L'];
      if (sharpParams.quality && sharpParams.overrideQuality == true) {
        this.sharpParams.quality = sharpParams.quality;
      }

      if (sharpParams.usm && sharpParams.overrideUsm == true) {
        this.sharpParams.usm = sharpParams.usm;
      }
    }
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
    const devicePixelRatio = utils.getDevicePixelRatio();
    const maxWidth = this.maxWidth;
    const maxHeight = this.maxHeight;
    // const maxWidth = this.cubeImages ? Math.min(this.maxWidth, this.maxHeight) : this.maxWidth;
    // const maxHeight = this.cubeImages ? Math.min(this.maxWidth, this.maxHeight) : this.maxHeight;
    this.resizeWidth = Math.min(maxWidth, Math.ceil(this.width * devicePixelRatio));
    this.resizeHeight = Math.min(maxHeight, Math.ceil(this.height * devicePixelRatio));
    this.resized_url = this.resizedUrl(this.cubeType, this.resizeWidth, this.resizeHeight, this.sharpParams, false);

    this.pixel_url = this.resizedUrl('fill', 1, 1, { quality: 30 }, false);

    const maxDimension = 500;
    this.thumbnailWidth = Math.min(maxWidth, this.width, maxDimension);
    this.thumbnailHeight = Math.min(maxHeight, this.height, maxDimension);
    this.thumbnail_url = this.resizedUrl('fit', this.thumbnailWidth, this.thumbnailHeight, { quality: 30 }, false);

    this.square_url = this.resizedUrl('fill', 100, 100, { quality: 80 }, false);

    this.full_url = this.resizedUrl(this.cubeType, this.maxWidth, this.maxHeight, this.sharpParams, false);

    this.download_url = { img: this.getOriginalsUrl() };
    this.sample_url = this.resizedUrl('fit', 500, 500, this.sharpParams, false, true);
    
    this.download_url.mp4 = this.full_url.mp4;

    return this;
  }


  resizedUrl(resizeMethod, requiredWidth, requiredHeight, sharpParams, showFaces, noCrop) {
    requiredWidth = Math.round(requiredWidth);
    requiredHeight = Math.round(requiredHeight);
    var thumbSize = 180;

    var urls = {};

    if (this.metadata.posters || this.metadata.customPoster) {
      var maxHeight = 720;
      var qualities = this.metadata.qualities;
      var poster = this.metadata.customPoster || (this.metadata.posters ? this.metadata.posters[this.metadata.posters.length - 1] : null);

      if (poster) {
        if (qualities && qualities.length) {
          var suffix = '/';

          //search for the first quality bigger that the required one
          for (var quality, q = 0; quality = qualities[q]; q++) {
            if (quality.height >= requiredHeight || quality.height >= maxHeight || !qualities[q + 1]) {
              suffix += quality.quality; //e.g. 720p
              for (var format, i = 0; format = quality.formats[i]; i++) {
                urls[format] = window.location.protocol + '//video.wixstatic.com/video/' + this.url + suffix + '/' + format + '/file.' + format;
              }
              break;
            }
          }
          var ratio = poster.width / poster.height;
          var isWider = ratio > 1;
          if (isWider) {
            requiredWidth = Math.ceil(requiredHeight * ratio);
          } else {
            requiredHeight = Math.ceil(requiredWidth / ratio);
          }
        }

        urls['img'] = this.resizeUrlImp(poster.url, resizeMethod, requiredWidth, requiredHeight, sharpParams, showFaces, false);
        urls['thumb'] = this.resizeUrlImp(poster.url, 'fit', thumbSize, thumbSize, sharpParams, false, false);
      }
    } else {
      urls['img'] = this.resizeUrlImp(this.url, resizeMethod, requiredWidth, requiredHeight, sharpParams, showFaces, true, (noCrop !== true && this.isCropped && this.focalPoint));
      urls['thumb'] = this.resizeUrlImp(this.url, 'fit', thumbSize, thumbSize, sharpParams, false, true);
    }

    return urls;
  }

  createFromWixImage(wixData, orderIndex, addWithTitles, isSecure) {
    let url = wixData.uri || wixData.relativeUri || wixData.url;
    let itemId = url.slice(0, url.length - 4);
    let metadata = {
      height: wixData.height,
      width: wixData.width,
      lastModified: new Date().getTime(),
      focalPoint: wixData.focalPoint,
      name: wixData.fileName,
      type: wixData.type,
      link: this.initialLinkObject,
      sourceName: wixData.sourceName,
      tags: wixData.tags,
      wm: wixData.wm,
      // title: wixData.title || '',
      // description: wixData.description || '',
    };

    if (addWithTitles) {
      metadata['title'] = wixData.title;
    }

    this.dto = {itemId, mediaUrl:url, orderIndex, metadata, isSecure};
  }

  createFromWixVideo(wixData, orderIndex, addWithTitles, isSecure) {

    let qualities = _.map(wixData.fileOutput.video, (q) => {
      return {
        height: q.height,
        width: q.width,
        quality: q.quality,
        formats: [q.format]
      };
    });

    let posters = _.map(wixData.fileOutput.image, _.partialRight(_.pick, ['url', 'width', 'height']));
    posters = _.map(posters, (p) => {
      p.url = p.url.replace('media/', '');
      return p;
    });

    let metaData = {
      name: wixData.title,
      lastModified: new Date().getTime(),
      width: wixData.fileInput.width,
      height: wixData.fileInput.height,
      type: 'video',
      posters: posters,
      customPoster: '',
      isExternal: false,
      duration: wixData.fileInput.duration,
      qualities: qualities,
      link: this.initialLinkObject,
      // title: wixData.title,
      // description: wixData.description,
    };

    if (addWithTitles) {
      metaData['title'] = wixData.title;
    }

    this.dto = {itemId:wixData.id, mediaUrl:wixData.id, orderIndex, metaData, isSecure};
  }

  createFromExternal(wixData, orderIndex, addWithTitles, isSecure) {
    let metaData = {
      name: wixData.id,
      videoId: wixData.id,
      lastModified: new Date().getTime(),
      height: 1080,
      width: 1920,
      source: wixData.source || '',
      videoUrl: wixData.videoUrl || '',
      isExternal: true,
      type: 'video',
      posters: wixData.posters,
      customPoster: '',
      duration: 0,
      qualities: [],
    };

    this.dto = {itemId:wixData.id, mediaUrl:metaData.posters[0].url, orderIndex, metaData, isSecure};
  }

  resizeUrlImp(originalUrl, resizeMethod, requiredWidth, requiredHeight, sharpParams, faces = false, allowWatermark = false, focalPoint) {

    const requiredRatio = requiredWidth / requiredHeight;
    const showWatermark = allowWatermark && this.watermarkStr;

    if (!utils.isMobile()) {
      requiredWidth = Math.ceil(requiredWidth / 250) * 250;
      requiredHeight = Math.ceil(requiredWidth / requiredRatio);
    }

    // assign sharp default parameters
    sharpParams = sharpParams || {};

    // calc default quality
    if (!sharpParams.quality) {
      sharpParams.quality = 90;
    }

    //don't allow quality above 90 till we have proper UI indication
    sharpParams.quality = Math.min(90, sharpParams.quality);

    if (sharpParams.usm && sharpParams.usm.usm_r) {
      sharpParams.usm.usm_a = Math.min(5, Math.max(0, (sharpParams.usm.usm_a || 0)));
      sharpParams.usm.usm_r = Math.min(128, Math.max(0, (sharpParams.usm.usm_r || 0))); //should be max 500 - but it's returning a 404
      sharpParams.usm.usm_t = Math.min(1, Math.max(0, (sharpParams.usm.usm_t || 0)));
    }

    if (utils.isExternalUrl(originalUrl)) {
      return originalUrl;
    } else if (!focalPoint) { //todo remove when supporting focal point
      var retUrl = 'https://static.wixstatic.com/media/' + originalUrl + '/v1/' + resizeMethod + '/';
      retUrl += 'w_' + requiredWidth;
      retUrl += ',h_' + requiredHeight;
      retUrl += ',al_' + (faces ? 'fs' : 'c');
      retUrl += ',q_' + sharpParams.quality;

      retUrl += (sharpParams.usm && sharpParams.usm.usm_r) ? ',usm_' + sharpParams.usm.usm_r.toFixed(2) + '_' + sharpParams.usm.usm_a.toFixed(2) + '_' + sharpParams.usm.usm_t.toFixed(2) : '';
      // Important to use this as the last param
      if (showWatermark) {
        retUrl += this.watermarkStr;
      }
      retUrl += '/' + originalUrl;
      return retUrl;
    } else {

      var scale;
      var x;
      var y;
      var orgW;
      var orgH;

      //find the scale
      if (this.ratio > requiredRatio) {
        //wide image (relative to required ratio
        scale = (requiredHeight / this.maxHeight);
        orgW = Math.floor(requiredHeight * this.ratio);
        y = 0;
        x = Math.round((orgW * focalPoint[0]) - (requiredWidth / 2));
        x = Math.min((orgW - requiredWidth), x);
        x = Math.max(0, x);
      } else {
        //narrow image

        scale = (requiredWidth / this.maxWidth);
        orgH = Math.floor(requiredWidth / this.ratio);
        x = 0;
        y = Math.round((orgH * focalPoint[1]) - (requiredHeight / 2));
        y = Math.min((orgH - requiredHeight), y);
        y = Math.max(0, y);
      }

      //make sure scale is not lower than needed
      //scale must be higher to prevent cases that there will be white margins (or 404)
      scale = Math.ceil(scale * 100) / 100;

      var retUrl = 'https://static.wixstatic.com/media/' + originalUrl + '/v1/crop/';
      retUrl += 'w_' + requiredWidth;
      retUrl += ',h_' + requiredHeight;
      retUrl += ',x_' + x;
      retUrl += ',y_' + y;
      retUrl += ',scl_' + scale.toFixed(2);
      retUrl += ',q_' + sharpParams.quality;
      retUrl += (sharpParams.usm && sharpParams.usm.usm_r) ? ',usm_' + sharpParams.usm.usm_r.toFixed(2) + '_' + sharpParams.usm.usm_a.toFixed(2) + '_' + sharpParams.usm.usm_t.toFixed(2) : '';
      // Important to use this as the last param
      if (showWatermark) {
        retUrl += this.watermarkStr;
      }
      retUrl += '/' + originalUrl;
      return retUrl;
    }

  }

  getOriginalsUrl() {
    return 'https://static.wixstatic.com/media/' + this.url;
  }

  parseStringObject(sObj) {
    if (typeof sObj != 'string') {
      return sObj;
    }

    let stripedObj = utils.stripSlashes(sObj);
    if (typeof sObj == 'string' && (/^[\],:{}\s]*$/.test(stripedObj.replace(/\\["\\\/bfnrtu]/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, '')))) {
      //this is a json
      try {
        return JSON.parse(stripedObj);
      } catch (e) {
        console.error('Parse object error: Catched ', e);
      }
    }
    return stripedObj;
  }
  
  pinToCorner(cornerName) {
    
    var isTop = cornerName.indexOf('top') >= 0;
    var isLeft = cornerName.indexOf('left') >= 0;
    
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
      const verticalShift = utils.hashToInt(this.full_url['img'], -1 * spaceUp, spaceDown) * this.floatingImages;
      
      return {
        transform: `translate3d(${horizontalShift}px, ${verticalShift}px, 0)`
      };
    } else {
      return {}
    }
    
  }
  
  get id() {
    return this.dto.photoId || this.dto.itemId;
  }

  set id(id) {
    this.dto.itemId = id;
  }
  
  get photoId() {
    return this.id;
  }
  
  get itemId() {
    return this.id;
  }
  
  get maxWidth() {
    return this.dto.width || this.dto.w || this.metadata.width;
  }

  get maxHeight() {
    return this.dto.height || this.dto.h || this.metadata.height;
  }

  get metadata() {
    var md = (this.dto.metaData || this.dto.metadata);
    if (_.isUndefined(md)) {
      console.error('Item with no metadata' + JSON.stringify(this.dto));
    }
    return md;
  }

  get metaData() {
    return this.metadata;
  }

  get margins() {
    return this.imageMargin || 0;
  }

  get outerWidth() {
    return this.width + 2 * this.margins;
  }

  get orgWidth() {
    return this.style.width || this.dto.width || this.dto.w || this.metadata.width || 1; //make sure the width / height is not undefined (creashes the gallery)
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
    return this.height + 2 * this.margins;
  }

  get orgHeight() {
    return this.style.height || this.dto.height || this.dto.h || this.metadata.height || 1; //make sure the width / height is not undefined (creashes the gallery)
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

  get cubeRatio() {
    let ratio;
    if (_.isFunction(this._cubeRatio)) {
      ratio = this._cubeRatio();
    } else {
      if (this.cropOnlyFill && this.cubeType == 'fit') {
        ratio = this.ratio;
      } else {
        ratio = this._cubeRatio;
      }
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
    return this.orientation == 'portrait';
  }

  get isLandscape() {
    return this.orientation == 'landscape';
  }

  get bgColor() {
    let bg;
    if (this.isText) {
      bg = this.metadata && this.metadata.textStyle && this.metadata.textStyle.backgroundColor;
    } else {
      bg = 'none';
    }
    return bg;
  }

  get ratio() {
    if (!this.orgRatio) {
      this.orgRatio = this.orgWidth / this.orgHeight;
    }
    return this.orgRatio;
  }

  get isCropped() {
    return this.cubeImages && this.cubeType == 'fill';
  }

  get focalPoint() {
    return this.metadata.focalPoint || [0.5, 0.5];
  }

  set focalPoint(value) {
    this.metadata.focalPoint = value;
  }

  
  //---- not needed
}
