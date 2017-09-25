import * as _ from 'lodash';
import { utils } from '../utils'

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
  
    if (!utils.isSemiNative()) {
      this.resize(1);
    }
  
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
    this.thumbnailWidth = Math.min(maxWidth, this.width, utils.getScreenWidth(), maxDimension);
    this.thumbnailHeight = Math.min(maxHeight, this.height, utils.getScreenHeight(), maxDimension);
    this.thumbnail_url = this.resizedUrl('fit', this.thumbnailWidth, this.thumbnailHeight, { quality: 30 }, false);

    this.square_url = this.resizedUrl('fill', 100, 100, { quality: 80 }, false);

    this.full_url = this.resizedUrl(this.cubeType, this.maxWidth, this.maxHeight, this.sharpParams, false);

    this.download_url = utils.isStoreGallery() ? this.resizedUrl('fit', 500, 500, this.sharpParams, false, true) : { img: this.getOriginalsUrl() }
    this.download_url.mp4 = this.full_url.mp4

    return this;
  }

  getDataForShop() {
    const fp = this.focalPoint;
    const md = this.metadata;
    return {
      isDemo: md.isDemo,
      orderIndex: this.orderIndex,
      itemId: this.dto.itemId,
      originalUrl: this.getOriginalsUrl(),
      itemUrl: this.url,
      itemHeight: md.height,
      title: md.title,
      itemWidth: md.width,
      itemType: (md.type || 'image'),
      imageUrl: this.resizedUrl('fit', 200, 200, null, null)['img'],
      imagePurchasedUrl: this.dto.mediaUrl,
      fpX: fp[0],
      fpY: fp[1]
    };
  }

  resizedUrl(resizeMethod, requiredWidth, requiredHeight, sharpParams, showFaces, noCrop) {
    requiredWidth = Math.round(requiredWidth);
    requiredHeight = Math.round(requiredHeight);
    var thumbSize = this.isVideo ? 180 : 90;

    var urls = {};

    if (this.isVideo || this.metadata.customPoster) {
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

  getTranslatedValue(val) {
    if (window['TranslationUtil'] && val != '') {
      var translated = window['TranslationUtil'].getByKey(val);
      return translated;
    }
    return val;
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
  
  updateOrderIndex(value) {
    let ret = this.orderIndex !== value;
    this.orderIndex = value;
    return ret;
  }
  
  get hash() {
    return this.id;
  }
  
  get seed() {
    return utils.hashToInt(this.url);
  }
  
  get key() {
    if (!this._key) {
      this._key = (this.dto.key || this.id || this.dto.url || 'no_key_found').replace(/\W/g, '');
    }
    return this._key;
  }
  
  get demoTitle() {
    return 'I am a title, only a sample title but still a title. ';
  }
  
  get demoDescription() {
    return 'I am a description, the best description ever! Here is some lorem ipsum for you: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
  }
  
  get demoExif() {
    return {
      "GPSVersionID": "2.2.0.0",
      "GPSAltitudeRef": "1.8",
      "GPSAltitude": "0",
      "Make": "LG Electronics",
      "Model": "LG-H815L",
      "Orientation": "right-top",
      "XResolution": "72",
      "YResolution": "72",
      "ResolutionUnit": "2",
      "Software": "Picasa",
      "DateTime": "2016:04:17 07:19:25",
      "YCbCrPositioning": "1",
      "ExposureTime": "0.041666666666666664",
      "FNumber": "1.8",
      "ExifIFDPointer": "214",
      "ExposureProgram": "Undefined",
      "GPSInfoIFDPointer": "1262",
      "PhotographicSensitivity": "200",
      "ExifVersion": "0220",
      "DateTimeOriginal": "2016:04:17 07:19:25",
      "DateTimeDigitized": "2016:04:17 07:19:25",
      "ComponentsConfiguration": "YCbCr",
      "ShutterSpeedValue": "4.585",
      "ApertureValue": "1.69",
      "BrightnessValue": "-0.88",
      "ExposureBias": "0",
      "MeteringMode": "CenterWeightedAverage",
      "Flash": "Flash did not fire, compulsory flash mode",
      "FocalLength": "4.42",
      "UserComment": "32,32,32,70,77,49,32,32,32,70,67,48,48,48,48,48,48,48,48,48,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0",
      "SubSecTime": "802528",
      "SubSecTimeOriginal": "802528",
      "SubSecTimeDigitized": "802528",
      "FlashpixVersion": "0100",
      "ColorSpace": "1",
      "PixelXDimension": "5312",
      "PixelYDimension": "2988",
      "InteroperabilityIFDPointer": "1320",
      "SensingMethod": "Undefined",
      "SceneType": "Directly photographed",
      "ExposureMode": "0",
      "WhiteBalance": "Auto white balance",
      "DigitalZoomRatio": "1",
      "SceneCaptureType": "Standard",
      "ImageUniqueID": "36f6e92221e27c830000000000000000"
    };
  }
  
  get isImage() {
    return this.type == 'image';
  }
  
  get isImportant() {
    return !!(this.dto.i);
  }
  
  get videoUrl() {
    return this.metadata.videoUrl;
  }
  
  get isExternalVideo() {
    return this.metadata.isExternal;
  }
  
  get orderIndex() {
    return this.dto.orderIndex || this.dto.o;
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

  get photoId() {
    return this.id;
  }

  get itemId() {
    return this.id;
  }

  set id(id) {
    this.dto.itemId = id;
  }

  get name() {
    return this.metadata.fileName || '';
  }

  get url() { //todo :change from mediaUrl
    return this.dto.file_url || this.dto.mediaUrl || this.dto.url;
  }

  get mediaUrl() {
    return this.url;
  }

  get orderIndex() {
    return this.dto.orderIndex || 0;
  }

  set orderIndex(value) {
    this.dto.orderIndex = value;
  }

  get maxWidth() {
    return this.dto.width || this.dto.w || this.metadata.width;
  }

  get maxHeight() {
    return this.dto.height || this.dto.h || this.metadata.height;
  }

  get lastModified() {
    return this.metadata.lastModified;
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
      if (!bg && !utils.isSemiNative()) {
        bg = Wix.Styles.getColorByreference('color-5').value;
      }
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

  get isVideo() {
    return this.type == 'video';
  }

  get isExternal() {
    return this.metadata.isExternal === true;
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

  get html() {
    return this.dto.html || this.dto.text || this.metadata.html || this.metadata.text;
  }

  set type(type) {
    this._type = type;
  }

  get type() {
    switch (this._type || this.dto.type || this.metadata.type || this.dto.media_type) {
      case 'dummy':
        return 'dummy';
      case 'v':
      case 'video':
        return 'video';
      case 'h':
      case 'html':
      case 'text':
        return 'text';
      case 'i':
      case 'image':
      default:
        return 'image';
    }
  }

  get alt() {
    return this.metadata.alt || this.title || this.description;
  }

  get title() {
    return this.metadata.title || '';
    // if (!this.metadata.isDemo) {
    //   return this.metadata.title || '';
    // }
    // return this.getTranslatedValue(this.metadata.title);
  }

  set title(value) {
    this.metadata.title = value;
  }

  get fileName() {
    return this.metadata.fileName || '';
  }

  set fileName(value) {
    this.metadata.fileName = value;
  }

  get description() {
    return this.metadata.description || '';
    // if (!this.metadata.isDemo) {
    //   return this.metadata.description || '';
    // }
    // return this.getTranslatedValue(this.metadata.description);
  }

  set description(value) {
    this.metadata.description = value;
  }

  get exif() {
    return this.metadata.exif || '';
  }

  get hasLink() {
    switch (this.linkType) {
      case 'wix':
        return !!this.linkData.type;
      default:
        return !!this.linkUrl;
    }
  }

  get link() {
    return (this.metadata.link) || {}
  }

  get linkData() {
    if (this.metadata.link) {
      return this.metadata.link.data || {};
    }
  }

  set linkData(value) {
    if (!this.metadata.link) {
      this.metadata.link = {};
    }
    this.metadata.link.data = value;
  }

  get linkType() {
    if (this.metadata.link) {
      return this.metadata.link.type;
    }
  }

  set linkType(value) {
    if (!this.metadata.link) {
      this.metadata.link = {};
    }

    // reset metadata.link when 'none' is selected - that's the way wix galleries work
    this.metadata.link = {
      type: value,
      url: undefined,
      text: undefined,
      title: undefined,
      target: '_blank'
    };
  }

  get defaultLinkText() {
    const linkData = this.linkData;

    switch (this.linkType) {
      case 'wix':
        if (linkData) {
          switch (linkData.type) {
            case 'PageLink':
              return `Go to Page ${linkData.pageName}`;
            case 'AnchorLink':
              return `Scroll to ${linkData.anchorName}`;
            case 'ExternalLink':
              return `${linkData.url}`;
            case 'EmailLink':
              return `Email ${linkData.recipient}`;
            case 'PhoneLink':
              return `Call ${linkData.phoneNumber}`;
            case 'DocumentLink':
              return `Open ${linkData.name}`;
            default:
              return 'Go To Link';
          }
        } else {
          return 'Go To Link';
        }
      case 'web':
        return this.linkUrl;
      case 'page':
        return this.linkTitle;
      default:
        return '';
    }
    /*
        const wixLinkDataSamples = {
          page: {
            pageId: "#c1dmp",
            type: "PageLink"
          },
          anchor: {
            anchorDataId: "",
            anchorName: "Anchor 1",
            pageId: "#masterPage",
            type: "AnchorLink"
          },
          web: {
            target: "_self",
            type: "ExternalLink",
            url: "http://google.com"
          },
          email: {
            recipient: "guyso@wix.com",
            subject: "subject",
            type: "EmailLink"
          },
          phone: {
            phoneNumber: "0547787444",
            type: "PhoneLink"
          },
          document: {
            docId: "0d72ac_7395fddc29a84899a472b5fcf0dee3ed.doc",
            name: "חוזה-שכירות-משנה-בלתי-מוגנת.doc",
            type: "DocumentLink"
          },
          scroll: {
            anchorDataId: "SCROLL_TO_TOP",
            anchorName: "Top of Page",
            pageId: "#masterPage",
            type: "AnchorLink"
          },
          lightbox: {
            pageId: "#zwjzg",
            type: "PageLink"
          }

        }
    */

  }

  get defaultLinkValue() {
    const linkData = this.linkData;

    switch (this.linkType) {
      case 'wix':
        if (linkData) {
          switch (linkData.type) {
            case 'PageLink':
              if (linkData.pageName) {
                return `PAGE - ${linkData.pageName}`;
              } else {
                return 'PAGE';
              }
            case 'AnchorLink':
              return `ANCHOR - ${linkData.anchorName}`;
            case 'ExternalLink':
              return `LINK - ${linkData.url}`;
            case 'EmailLink':
              return `EMAIL - ${linkData.recipient}`;
            case 'PhoneLink':
              return `PHONE - ${linkData.phoneNumber}`;
            case 'DocumentLink':
              return `DOCUMENT - ${linkData.name}`;
            default:
              return 'Add a Link';
          }
        } else {
          return 'Add a Link';
        }
      case 'web':
        return this.linkUrl;
      case 'page':
        return this.linkTitle;
      default:
        return '';
    }
  }

  get linkText() {
    if (this.metadata.link) {
      return this.metadata.link.text || this.defaultLinkText;
    }
  }

  set linkText(value) {
    if (!this.metadata.link) {
      this.metadata.link = {};
    }
    this.metadata.link.text = value;
  }

  get linkTitle() {
    if (this.metadata.link) {
      return this.metadata.link.title;
    }
  }

  set linkTitle(value) {
    if (!this.metadata.link) {
      this.metadata.link = {};
    }
    this.metadata.link.title = value;
  }

  get linkUrl() {
    if (this.metadata.link) {
      return this.metadata.link.url;
    }
  }

  set linkUrl(value) {
    if (!this.metadata.link) {
      this.metadata.link = {};
    }
    this.metadata.link.url = value;
  }

  get unprotectedLinkOpenType() {
    return _.get(this, 'metadata.link.target');
  }

  get linkOpenType() {
    if (utils.isEditor() || utils.isPreview()) {
      //in preview never open link in current window (causes many errors)
      return '_blank';
    } else if (this.metadata.link) {
      return this.unprotectedLinkOpenType;
    }
  }

  set linkOpenType(value) {
    if (!this.metadata.link) {
      this.metadata.link = {};
    }
    this.metadata.link.target = value;
  }

  get initialLinkObject() {
    return {
      type: 'none',
      url: undefined,
      text: undefined,
      title: undefined,
      target: '_blank'
    };
  }

  get isDemo() {
    return this.metadata.isDemo || this.dto.isDemo || this.metadata.sourceName === 'public' || (this.metadata.sourceName === 'private' && _.includes(this.metadata.tags, '_bigstock'))
  }

  set isDemo(val) {
    this.metadata.isDemo = val
  }

  get isText() {
    return this.type == 'text';
  }
}
