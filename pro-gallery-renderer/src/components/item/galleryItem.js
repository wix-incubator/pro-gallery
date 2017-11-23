////// <reference path="../../reference.ts" />
import utils from '../../utils/index';
import {Item} from 'pro-gallery-layouter';
import * as _ from 'lodash';
import {watermarkApi} from 'photography-client-lib';

class GalleryItem {

  constructor(config) {

    this.uniqueId = utils.generateUUID();
    this.isGalleryItem = true;

    if (config.dto && config.dto.dto) {
      config.dto = config.dto.dto; //defence patch due to mis-use of item-core
      if (utils.isDev()) {
        console.warn('Item core is created with already existing item core');
      }
    }
    this.dto = _.merge({}, config.dto);
    _.merge(this, config.dto);

    if (config.scheme) {
      this.processScheme(config.scheme);
    } else {
      this.processScheme(new Item({dto: config.dto}).scheme);
    }

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
      const itemMetadata = this.dto.metaData || this.dto.metadata;
      if (itemMetadata) { //metadata is encoded encoded, parsed if needed
        this.dto.metaData = utils.parseStringObject(itemMetadata);
      }
    }

    if (utils.isStoreGallery() && !this.isVideo) {
      this.watermark = config.watermark;
      if (!this.watermark) {
        watermarkApi.getWatermarkData() //this request should be sync (the watermark should have been cached by the gallery or the fullscreen)
          .then(data => {
            this.watermark = data;
            this.watermarkStr = (this.watermark && this.watermark.imageUrl) ? `,wm_${this.watermark.imageUrl}-${this.watermark.opacity}-${this.watermark.position}-${this.watermark.size}` : '';
          });
      } else {
        // protect against watermark being a string - it happens some times.
        if (typeof this.watermark === 'string') {
          try {
            this.watermark = JSON.parse(this.watermark);
          } catch (error) {
            console.error(`item-core - given watermark (${this.watermark}) is not an object`, error);
          }
        }
        this.watermarkStr = '';
        if (this.watermark.imageUrl) {
          this.watermarkStr = `,wm_${this.watermark.imageUrl}-${this.watermark.opacity}-${this.watermark.position}-${this.watermark.size}`;
        }
      }
    }

    this.sharpParams = _.merge({}, config.sharpParams);
    if (!this.sharpParams.quality) {
      this.sharpParams.quality = 90;
    }
    if (!this.sharpParams.usm) {
      this.sharpParams.usm = {};
    }
    this.updateSharpParams();

    this.createUrls();

  }

  processScheme(scheme) {
    this.id = scheme.id;
    this.idx = scheme.idx;
    this.style = scheme.style;
    this.width = scheme.width;
    this.maxWidth = scheme.maxWidth;
    this.height = scheme.height;
    this.maxHeight = scheme.maxHeight;
    this.margins = scheme.margins;
    this.ratio = scheme.ratio;
    this.cubeRatio = scheme.cropRatio;
    this.cubeImages = scheme.isCropped;
    this.cubeType = scheme.cropType;
    this.offset = scheme.offset;
    this.group = scheme.group;
    this.transform = scheme.transform;
    this.orientation = scheme.orientation;
  }

  renderProps(config) {

    return _.merge({
      className: 'image',
      key: this.key,
      idx: this.idx,
      photoId: this.photoId,
      id: this.id,
      hash: this.id,
      html: this.html,
      type: this.type,
      url: this.url,
      alt: this.alt,
      linkUrl: this.linkUrl,
      linkOpenType: this.linkOpenType,
      originalsUrl: this.getOriginalsUrl(),
      title: this.title,
      fileName: this.fileName,
      description: this.description,
      full_url: this.full_url,
      download_url: this.download_url,
      square_url: this.square_url,
      pixel_url: this.pixel_url,
      resized_url: this.resized_url,
      thumbnail_url: this.thumbnail_url,
      cubeImages: this.cubeImages,
      cubeType: this.cubeType,
      cubeRatio: this.cubeRatio,
      transform: this.transform,
      offset: this.offset,
      style: _.merge({
        bgColor: this.bgColor,
        maxWidth: this.maxWidth,
        maxHeight: this.maxHeight,
        ratio: this.ratio,
        orientation: this.orientation
      }, this.style),
      isDemo: this.isDemo,
      videoUrl: this.videoUrl,
      isExternalVideo: this.isExternalVideo,
      scroll: config.scroll,
      visible: config.visible,
      styleParams: config.styleParams,
      actions: config.actions,
      currentIdx: config.currentIdx
    }, config);

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
      imageUrl: this.resizedUrl('fit', 200, 200, null, null).img,
      imagePurchasedUrl: this.dto.mediaUrl,
      fpX: fp[0],
      fpY: fp[1]
    };
  }

  createFromWixImage(wixData, orderIndex, addWithTitles, isSecure) {
    const url = wixData.uri || wixData.relativeUri || wixData.url;
    const itemId = url.slice(0, url.length - 4);
    const metadata = {
      createdOn: new Date().getTime(),
      height: wixData.height,
      width: wixData.width,
      lastModified: new Date().getTime(),
      focalPoint: wixData.focalPoint,
      name: wixData.fileName,
      fileName: wixData.title,
      title: '',
      type: wixData.type,
      link: this.initialLinkObject,
      sourceName: wixData.sourceName,
      tags: wixData.tags,
      wm: wixData.wm,
      // title: wixData.title || '',
      // description: wixData.description || '',
    };

    if (addWithTitles) {
      metadata.title = wixData.title;
    }

    this.dto = {itemId, mediaUrl: url, orderIndex, metadata, isSecure};
  }

  createFromWixVideo(wixData, orderIndex, addWithTitles, isSecure) {

    const qualities = _.map(wixData.fileOutput.video, q => {
      return {
        height: q.height,
        width: q.width,
        quality: q.quality,
        formats: [q.format]
      };
    });

    let posters = _.map(wixData.fileOutput.image, _.partialRight(_.pick, ['url', 'width', 'height']));
    posters = _.map(posters, p => {
      p.url = p.url.replace('media/', '');
      return p;
    });

    const metaData = {
      createdOn: new Date().getTime(),
      name: wixData.title,
      lastModified: new Date().getTime(),
      width: qualities[qualities.length - 1].width,
      height: qualities[qualities.length - 1].height,
      type: 'video',
      posters,
      customPoster: '',
      isExternal: false,
      duration: wixData.fileInput.duration,
      qualities,
      link: this.initialLinkObject,
      // title: wixData.title,
      // description: wixData.description,
    };

    if (addWithTitles) {
      metaData.title = wixData.title;
    }

    this.dto = {itemId: wixData.id, mediaUrl: wixData.id, orderIndex, metaData, isSecure};
  }

  createFromExternal(wixData, orderIndex, addWithTitles, isSecure) {
    const metaData = {
      createdOn: new Date().getTime(),
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

    this.dto = {itemId: wixData.id, mediaUrl: metaData.posters[0].url, orderIndex, metaData, isSecure};
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
      let retUrl = 'https://static.wixstatic.com/media/' + originalUrl + '/v1/' + resizeMethod + '/';
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

      let scale;
      let x;
      let y;
      let orgW;
      let orgH;

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

      let retUrl = 'https://static.wixstatic.com/media/' + originalUrl + '/v1/crop/';
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

  createUrls() {
    const devicePixelRatio = utils.getDevicePixelRatio();
    const maxWidth = this.maxWidth || this.dto.width;
    const maxHeight = this.maxHeight || this.dto.height;
    // const maxWidth = this.cubeImages ? Math.min(this.maxWidth, this.maxHeight) : this.maxWidth;
    // const maxHeight = this.cubeImages ? Math.min(this.maxWidth, this.maxHeight) : this.maxHeight;
    this.resizeWidth = Math.min(maxWidth, Math.ceil(this.width * devicePixelRatio));
    this.resizeHeight = Math.min(maxHeight, Math.ceil(this.height * devicePixelRatio));
    this.resized_url = this.resizedUrl(this.cubeType, this.resizeWidth, this.resizeHeight, this.sharpParams, false);

    this.pixel_url = this.resizedUrl('fill', 1, 1, {quality: 30}, false);

    const maxDimension = 500;
    this.thumbnailWidth = Math.min(maxWidth, this.width, maxDimension);
    this.thumbnailHeight = Math.min(maxHeight, this.height, maxDimension);
    this.thumbnail_url = this.resizedUrl('fit', this.thumbnailWidth, this.thumbnailHeight, {quality: 30}, false);

    this.square_url = this.resizedUrl('fill', 100, 100, {quality: 80}, false);

    this.full_url = this.resizedUrl(this.cubeType, this.maxWidth, this.maxHeight, this.sharpParams, false);

    this.download_url = {img: this.getOriginalsUrl()};
    this.sample_url = this.resizedUrl('fit', 500, 500, this.sharpParams, false, true);

    this.download_url.mp4 = this.full_url.mp4;
  }

  resizedUrl(resizeMethod, requiredWidth, requiredHeight, sharpParams, showFaces, noCrop) {
    requiredWidth = Math.round(requiredWidth);
    requiredHeight = Math.round(requiredHeight);
    const thumbSize = 180;

    const urls = {};

    if (this.metadata.posters || this.metadata.customPoster) {
      const maxHeight = 720;
      const qualities = this.metadata.qualities;
      const poster = this.metadata.customPoster || (this.metadata.posters ? this.metadata.posters[this.metadata.posters.length - 1] : null);

      if (poster) {
        if (qualities && qualities.length) {
          let suffix = '/';

          //search for the first quality bigger that the required one
          for (let quality, q = 0; quality = qualities[q]; q++) {
            if (quality.height >= requiredHeight || quality.height >= maxHeight || !qualities[q + 1]) {
              suffix += quality.quality; //e.g. 720p
              for (let format, i = 0; format = quality.formats[i]; i++) {
                urls[format] = window.location.protocol + '//video.wixstatic.com/video/' + this.url + suffix + '/' + format + '/file.' + format;
              }
              break;
            }
          }
          const ratio = poster.width / poster.height;
          const isWider = ratio > 1;
          if (isWider) {
            requiredWidth = Math.ceil(requiredHeight * ratio);
          } else {
            requiredHeight = Math.ceil(requiredWidth / ratio);
          }
        }

        urls.img = this.resizeUrlImp(poster.url, resizeMethod, requiredWidth, requiredHeight, sharpParams, showFaces, false);
        urls.thumb = this.resizeUrlImp(poster.url, 'fit', thumbSize, thumbSize, sharpParams, false, false);
      }
    } else {
      urls.img = this.resizeUrlImp(this.url, resizeMethod, requiredWidth, requiredHeight, sharpParams, showFaces, true, (noCrop !== true && this.isCropped && this.focalPoint));
      urls.thumb = this.resizeUrlImp(this.url, 'fit', thumbSize, thumbSize, sharpParams, false, true);
    }

    return urls;
  }

  getOriginalsUrl() {
    return 'https://static.wixstatic.com/media/' + this.url;
  }

  updateSharpParams() {
    //override sharpParams with item sharpParams
    if (this.dto.metaData && this.dto.metaData.sharpParams && this.dto.metaData.sharpParams.L) {
      const sharpParams = this.dto.metaData.sharpParams.L;
      if (sharpParams.quality && sharpParams.overrideQuality === true) {
        this.sharpParams.quality = sharpParams.quality;
      }

      if (sharpParams.usm && sharpParams.overrideUsm === true) {
        this.sharpParams.usm = sharpParams.usm;
      }
    }
  }


  get itemId() {
    return this.id;
  }

  updateId(id) {
    this.dto.itemId = this.id = id;
  }

  get metadata() {
    const md = (this.dto.metaData || this.dto.metadata);
    if (_.isUndefined(md)) {
      console.error('Item with no metadata' + JSON.stringify(this.dto));
    }
    return md;
  }

  get metaData() {
    return this.metadata;
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

  get isCropped() {
    return this.cubeImages && this.cubeType === 'fill';
  }

  get focalPoint() {
    return this.metadata.focalPoint || [0.5, 0.5];
  }

  set focalPoint(value) {
    this.metadata.focalPoint = value;
  }

  //----------------------------------------------------------------//

  get demoTitle() {
    return 'I am a title, only a sample title but still a title. ';
  }

  get demoDescription() {
    return 'I am a description, the best description ever! Here is some lorem ipsum for you: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
  }

  get demoExif() {
    return {
      GPSVersionID: '2.2.0.0',
      GPSAltitudeRef: '1.8',
      GPSAltitude: '0',
      Make: 'LG Electronics',
      Model: 'LG-H815L',
      Orientation: 'right-top',
      XResolution: '72',
      YResolution: '72',
      ResolutionUnit: '2',
      Software: 'Picasa',
      DateTime: '2016:04:17 07:19:25',
      YCbCrPositioning: '1',
      ExposureTime: '0.041666666666666664',
      FNumber: '1.8',
      ExifIFDPointer: '214',
      ExposureProgram: 'Undefined',
      GPSInfoIFDPointer: '1262',
      PhotographicSensitivity: '200',
      ExifVersion: '0220',
      DateTimeOriginal: '2016:04:17 07:19:25',
      DateTimeDigitized: '2016:04:17 07:19:25',
      ComponentsConfiguration: 'YCbCr',
      ShutterSpeedValue: '4.585',
      ApertureValue: '1.69',
      BrightnessValue: '-0.88',
      ExposureBias: '0',
      MeteringMode: 'CenterWeightedAverage',
      Flash: 'Flash did not fire, compulsory flash mode',
      FocalLength: '4.42',
      UserComment: '32,32,32,70,77,49,32,32,32,70,67,48,48,48,48,48,48,48,48,48,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0',
      SubSecTime: '802528',
      SubSecTimeOriginal: '802528',
      SubSecTimeDigitized: '802528',
      FlashpixVersion: '0100',
      ColorSpace: '1',
      PixelXDimension: '5312',
      PixelYDimension: '2988',
      InteroperabilityIFDPointer: '1320',
      SensingMethod: 'Undefined',
      SceneType: 'Directly photographed',
      ExposureMode: '0',
      WhiteBalance: 'Auto white balance',
      DigitalZoomRatio: '1',
      SceneCaptureType: 'Standard',
      ImageUniqueID: '36f6e92221e27c830000000000000000'
    };
  }

  get photoId() {
    return this.id;
  }

  get key() {
    if (!this._key) {
      this._key = (this.dto.key || this.id || this.dto.url || 'no_key_found').replace(/\W/g, '');
    }
    return this._key;
  }

  get orderIndex() {
    return this.dto.orderIndex || this.dto.o || 0;
  }

  set orderIndex(value) {
    this.dto.orderIndex = value;
  }

  updateOrderIndex(value) {
    const ret = this.orderIndex !== value;
    this.orderIndex = value;
    return ret;
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

  get html() {
    return this.dto.html || this.dto.text || this.metadata.html || this.metadata.text;
  }

  get lastModified() {
    return this.metadata.lastModified;
  }

  get seed() {
    return utils.hashToInt(this.url);
  }

  get isImage() {
    return this.type === 'image';
  }

  get isImportant() {
    return !!(this.dto.i);
  }

  get isVideo() {
    return this.type === 'video';
  }

  get videoUrl() {
    return this.metadata.videoUrl;
  }

  get isExternalVideo() {
    return this.metadata.isExternal;
  }

  get isExternal() {
    return this.metadata.isExternal === true;
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
    return (this.metadata.link) || {};
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
    return this.metadata.isDemo || this.dto.isDemo || this.metadata.sourceName === 'public' || (this.metadata.sourceName === 'private' && _.includes(this.metadata.tags, '_bigstock'));
  }

  set isDemo(val) {
    this.metadata.isDemo = val;
  }

  get isText() {
    return this.type === 'text';
  }

}

/*
 <img onLoad={() => this.setItemLoaded()} className={'image' + (this.state.loaded ? '' : '-preload')}
 src={this.props.resized_url}/>
 */

export default GalleryItem;
