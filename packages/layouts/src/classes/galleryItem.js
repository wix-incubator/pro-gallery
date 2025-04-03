import { utils, GALLERY_CONSTS } from 'pro-gallery-lib';
import { Item } from '../logic/item.js';

class GalleryItem {
  constructor(config) {
    this.uniqueId = utils.generateUUID();
    this.isGalleryItem = true;
    this.createdBy = config.createdBy;

    this.createUrl = this.createUrl.bind(this);
    this.createMagnifiedUrl = this.createMagnifiedUrl.bind(this);
    this.createSecondMediaItemIfNeeded(config);

    this.update(config);
  }
  createSecondMediaItemIfNeeded(config) {
    if (config.dto?.secondaryMedia) {
      this.secondaryMediaItem = new GalleryItem(this.mapItemConfig(config));
    }
  }

  updateSecondaryMedia(config) {
    if (this.secondaryMediaItem) {
      this.secondaryMediaItem.update(this.mapItemConfig(config));
    }
  }

  mapItemConfig(config) {
    const dto = {};
    Object.assign(dto, config.dto.secondaryMedia, config.dto.secondaryMedia.metadata);
    return {
      ...config,
      dto,
      scheme: {
        ...config.scheme,
        maxHeight: dto.height,
        maxWidth: dto.width,
      },
    };
  }

  update(config) {
    this.createMediaUrl = config.createMediaUrl;

    if (config.dto && config.dto.dto) {
      config.dto = config.dto.dto; // defence patch due to mis-use of item-core
      if (utils.isDev()) {
        console.warn('Item core is created with already existing item core');
      }
    }
    this.dto = { ...config.dto };

    if (config.scheme) {
      this.processScheme(config.scheme);
    } else {
      const dto = {};
      Object.assign(dto, this.dto, this.metadata);
      this.processScheme(new Item({ dto }).scheme);
    }

    if (this.dto) {
      const itemMetadata = this.dto.metaData || this.dto.metadata;
      if (itemMetadata) {
        // metadata is encoded encoded, parsed if needed
        this.dto.metaData = utils.parseStringObject(itemMetadata);
      }
    }

    this.sharpParams = { ...config.sharpParams };
    if (!this.sharpParams.quality) {
      this.sharpParams.quality = 90;
    }
    if (!this.sharpParams.usm) {
      this.sharpParams.usm = {};
    }
    this.thumbnailSize = config.thumbnailSize || 120;

    this.resetUrls();
    this.updateSharpParams();
    this.updateSecondaryMedia(config);
  }

  processScheme(scheme) {
    this.id = scheme.id;
    this.idx = scheme.idx;
    this.type = scheme.type;
    this.style = scheme.style;
    this.width = scheme.width;
    this.maxWidth = scheme.maxWidth;
    this.infoWidth = scheme.infoWidth;
    this.height = scheme.height;
    this.maxHeight = scheme.maxHeight;
    this.infoHeight = scheme.infoHeight;
    this.margins = scheme.margins;
    this.ratio = scheme.ratio;
    this.cropRatio = scheme.cropRatio;
    this.cubeImages = scheme.isCropped;
    this.cubeType = scheme.cropType || GALLERY_CONSTS.resizeMethods.FILL;
    this.offset = scheme.offset;
    this.group = scheme.group;
    this.orientation = scheme.orientation;
    this.visibility = scheme.visibility;
  }

  renderProps(config) {
    const style = {
      ratio: this.ratio,
      bgColor: this.bgColor,
      maxWidth: this.maxWidth,
      maxHeight: this.maxHeight,
      infoWidth: this.infoWidth,
      infoHeight: this.infoHeight,
      orientation: this.orientation,
      ...this.style,
    };
    const itemProps = {
      className: 'image',
      key: this.key,
      idx: this.idx,
      photoId: this.photoId,
      id: this.id,
      hash: this.id,
      html: this.html,
      type: this.type,
      isVideoPlaceholder: this.isVideoPlaceholder,
      videoPlaceholderUrl: this.videoPlaceholderUrl,
      url: this.url,
      alt: this.alt,
      htmlContent: this.htmlContent,
      directLink: this.directLink,
      directShareLink: this.directShareLink,
      linkUrl: this.linkUrl,
      linkType: this.linkType,
      linkOpenType: this.linkOpenType,
      linkData: this.linkData,
      title: this.title,
      fileName: this.fileName,
      description: this.description,
      createUrl: this.createUrl,
      createMagnifiedUrl: this.createMagnifiedUrl,
      cubeImages: this.cubeImages,
      cubeType: this.cubeType,
      cropRatio: this.cropRatio,
      isTransparent: this.isTransparent,
      offset: this.offset,
      style,
      isDemo: this.isDemo,
      videoUrl: this.videoUrl,
      isExternalVideo: this.isExternalVideo,
      hasSecondaryMedia: this.hasSecondaryMedia,
      scene: this.scene,
      ...config,
    };
    if (this.hasSecondaryMedia) {
      itemProps.secondaryMediaItem = {
        ...this.secondaryMediaItem.renderProps(),
        style: {
          ...style,
          bgColor: this.secondaryMediaItem.bgColor,
        },
      };
    }
    return itemProps;
  }

  getDataForShop() {
    const focalPoint = this.focalPoint;
    const metadata = this.metadata;
    return {
      isDemo: metadata.isDemo,
      orderIndex: this.orderIndex,
      itemId: this.dto.itemId,
      itemUrl: this.url,
      itemHeight: metadata.height,
      title: metadata.title,
      itemWidth: metadata.width,
      itemType: metadata.type || 'image',
      imageUrl: this.processedMediaUrl(GALLERY_CONSTS.resizeMethods.FIT, 200, 200, null, null).img(),
      imagePurchasedUrl: this.dto.mediaUrl,
      fpX: focalPoint[0],
      fpY: focalPoint[1],
    };
  }

  getHighestMp4Resolution(qualities) {
    const mp4s = qualities.filter((video) => video.formats[0] === 'mp4');
    const { width, height } = mp4s.sort((a, b) => b.width - a.width)[0];
    return { width, height };
  }

  processedMediaUrl(resizeMethod, requiredWidth, requiredHeight, sharpParams, createMultipleUrls = false) {
    const mediaUrl = (
      item,
      url,
      resizeMethod,
      requiredWidth,
      requiredHeight,
      sharpParams = null,
      focalPoint = null
    ) => {
      let mediaUrl;
      if (typeof this.createMediaUrl === 'function') {
        try {
          const str = String(
            utils.hashCode(
              JSON.stringify({
                url,
                resizeMethod,
                requiredWidth,
                requiredHeight,
                sharpParams,
                focalPoint,
              })
            )
          );
          if (!this._cachedUrls[str]) {
            this._cachedUrls[str] =
              this.createMediaUrl({
                item,
                originalUrl: url,
                resizeMethod,
                requiredWidth,
                requiredHeight,
                sharpParams,
                focalPoint,
                createMultiple: createMultipleUrls,
              }) || '';
          }
          mediaUrl = this._cachedUrls[str];
        } catch (e) {
          console.error(
            'Cannot create url',
            e,
            item,
            url,
            resizeMethod,
            requiredWidth,
            requiredHeight,
            sharpParams,
            focalPoint
          );
          mediaUrl = String(url);
        }
      } else {
        mediaUrl = String(url);
      }
      return mediaUrl;
    };

    requiredWidth = Math.ceil(requiredWidth);
    requiredHeight = Math.ceil(requiredHeight);
    const thumbSize = 250;

    const focalPoint = resizeMethod === GALLERY_CONSTS.resizeMethods.FILL && this.isCropped && this.focalPoint;

    const urls = {};
    let imgUrl = this.url;

    urls[GALLERY_CONSTS.urlTypes.THREE_D] = () => this.url;
    if (this.is3D) {
      imgUrl = this.poster.url;
    }
    if (this.isText) {
      return Object.assign(
        {},
        ...Object.values(GALLERY_CONSTS.urlTypes).map((value) => ({
          [value]: () => '',
        }))
      );
    } else if (this.isVideo || this.isVideoPlaceholder) {
      imgUrl = this.poster?.url;

      if (utils.isExternalUrl(this.url)) {
        urls[GALLERY_CONSTS.urlTypes.VIDEO] = () => this.url;
      } else {
        urls[GALLERY_CONSTS.urlTypes.VIDEO] = () =>
          mediaUrl(this, this.url, GALLERY_CONSTS.resizeMethods.VIDEO, requiredWidth, requiredHeight);
      }
    }

    urls[GALLERY_CONSTS.urlTypes.HIGH_RES] = () =>
      mediaUrl(this, imgUrl, resizeMethod, requiredWidth, requiredHeight, sharpParams, focalPoint);

    urls[GALLERY_CONSTS.urlTypes.LOW_RES] = () => {
      const resizedRatio = this.resizeWidth / this.resizeHeight;
      return mediaUrl(
        this,
        imgUrl,
        this.cubeImages && resizeMethod !== GALLERY_CONSTS.resizeMethods.FIT
          ? GALLERY_CONSTS.resizeMethods.FILL
          : GALLERY_CONSTS.resizeMethods.FIT,
        thumbSize * resizedRatio,
        thumbSize,
        { ...sharpParams, quality: 30, blur: 30 },
        focalPoint
      );
    };
    return urls;
  }

  resetUrls() {
    const maxWidth = this.maxWidth || this.dto.width || this.metadata.width;
    const maxHeight = this.maxHeight || this.dto.height || this.metadata.height;

    this.resizeWidth = Math.min(maxWidth, Math.ceil(this.width));
    this.resizeHeight = Math.min(maxHeight, Math.ceil(this.height));

    this._cachedUrls = {};
    this.urls = {};
  }

  createUrl(size, type) {
    try {
      return this[size + '_url'][type]();
    } catch (e) {
      return '';
    }
  }

  get cubeTypeResizeMethod() {
    return {
      [GALLERY_CONSTS.layoutParams_crop_method.FIT]: GALLERY_CONSTS.resizeMethods.FIT,
      [GALLERY_CONSTS.layoutParams_crop_method.FILL]: GALLERY_CONSTS.resizeMethods.FILL,
    }[this.cubeType];
  }

  createMagnifiedUrl(scale = 1) {
    if (!this.urls.magnified_url) {
      const { innerWidth, innerHeight } = this.style;
      this.urls.magnified_url = this.processedMediaUrl(
        this.cubeTypeResizeMethod,
        innerWidth * scale,
        innerHeight * scale,
        this.sharpParams,
        true
      );
    }
    return this.urls.magnified_url[GALLERY_CONSTS.urlTypes.HIGH_RES]();
  }

  get resized_url() {
    if (!this.urls.resized_url) {
      this.urls.resized_url = this.processedMediaUrl(
        this.cubeTypeResizeMethod,
        this.resizeWidth,
        this.resizeHeight,
        this.sharpParams
      );
    }
    return this.urls.resized_url;
  }

  get multi_url() {
    if (!this.urls.multi_url) {
      this.urls.multi_url = this.processedMediaUrl(
        this.cubeTypeResizeMethod,
        this.resizeWidth,
        this.resizeHeight,
        this.sharpParams,
        true
      );
    }
    return this.urls.multi_url;
  }

  get scaled_url() {
    if (!this.urls.scaled_url) {
      const orgRatio = this.maxWidth / this.maxHeight;
      const resizedRatio = this.resizeWidth / this.resizeHeight;
      const isOrgWider = resizedRatio < orgRatio;
      this.urls.scaled_url = this.processedMediaUrl(
        GALLERY_CONSTS.resizeMethods.FILL,
        isOrgWider ? orgRatio * this.resizeHeight : this.resizeWidth,
        isOrgWider ? this.resizeHeight : this.resizeWidth / orgRatio,
        this.sharpParams
      );
    }
    return this.urls.scaled_url;
  }

  get pixel_url() {
    if (!this.urls.pixel_url) {
      this.urls.pixel_url = this.processedMediaUrl(GALLERY_CONSTS.resizeMethods.FILL, 1, 1, {
        quality: 90,
      });
    }
    return this.urls.pixel_url;
  }

  get thumbnail_url() {
    if (!this.urls.thumbnail_url) {
      this.urls.thumbnail_url = this.processedMediaUrl(
        GALLERY_CONSTS.resizeMethods.FILL,
        this.thumbnailSize,
        this.thumbnailSize,
        { quality: 70 }
      );
    }
    return this.urls.thumbnail_url;
  }

  get square_url() {
    if (!this.urls.square_url) {
      this.urls.square_url = this.processedMediaUrl(GALLERY_CONSTS.resizeMethods.FILL, 100, 100, {
        quality: 80,
      });
    }
    return this.urls.square_url;
  }

  get full_url() {
    if (!this.urls.full_url) {
      this.urls.full_url = this.processedMediaUrl(
        GALLERY_CONSTS.resizeMethods.FULL,
        this.maxWidth,
        this.maxHeight,
        this.sharpParams
      );
    }
    return this.urls.full_url;
  }

  get sample_url() {
    if (!this.urls.sample_url) {
      this.urls.sample_url = this.processedMediaUrl(GALLERY_CONSTS.resizeMethods.FIT, 500, 500, this.sharpParams);
    }
    return this.urls.sample_url;
  }

  get preload_url() {
    if (!this.urls.preload_url) {
      this.urls.preload_url = this.processed_url;
    }
    return this.urls.preload_url;
  }

  get download_url() {
    return this.createDownloadUrl(this.full_url);
  }

  get download_sample_url() {
    return this.createDownloadUrl(this.sample_url);
  }

  createDownloadUrl(url) {
    if (!this.urls.download_url) {
      this.urls.download_url = url;
      this.urls.download_url._img = this.urls.download_url.img;
      this.urls.download_url.img = () => {
        const downloadUrl = this.urls.download_url._img();
        return downloadUrl + (downloadUrl.includes('?') ? '&' : '?') + `dn=${this.fileName}`;
      };
    }
    return this.urls.download_url;
  }

  updateSharpParams() {
    // override sharpParams with item sharpParams
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

  get hasSecondaryMedia() {
    return !!this.secondaryMediaItem;
  }
  get itemId() {
    return this.id;
  }

  updateId(id) {
    this.dto.itemId = this.id = id;
  }

  get metadata() {
    let md = this.dto.metaData || this.dto.metadata;
    if (utils.isUndefined(md)) {
      // console.error('Item with no metadata' + JSON.stringify(this.dto));
      md = {};
    }
    return md;
  }

  get metaData() {
    return this.metadata;
  }

  get bgColor() {
    let bg;
    if (this.isText) {
      bg =
        this.metadata &&
        ((this.metadata.textStyle && this.metadata.textStyle.backgroundColor) || this.metadata.backgroundColor);
    } else {
      bg = 'none';
    }
    return bg;
  }

  get isCropped() {
    return this.cubeImages && this.cubeTypeResizeMethod === GALLERY_CONSTS.resizeMethods.FILL;
  }

  get focalPoint() {
    return this.metadata.focalPoint || [0.5, 0.5];
  }

  set focalPoint(value) {
    this.metadata.focalPoint = value;
  }

  // ----------------------------------------------------------------//

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

  get url() {
    // todo :change from mediaUrl
    return this.dto.file_url || this.dto.mediaUrl || this.dto.url || this.dto.src || '';
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
    return !!this.dto.i;
  }

  get videoUrl() {
    return this.metadata.videoUrl;
  }

  get poster() {
    return (
      this.metadata.poster ||
      (this.metadata.customPoster && this.metadata.customPoster) ||
      (this.metadata.posters ? this.metadata.posters[this.metadata.posters.length - 1] : null)
    );
  }

  get scene() {
    return this.metadata.scene;
  }

  get qualities() {
    return this.metadata.qualities;
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
      case '3d':
        return '3d';
      case 'i':
      case 'image':
      default:
        return 'image';
    }
  }

  get isVideoPlaceholder() {
    return !!(this.dto.isVideoPlaceholder || this.metadata.isVideoPlaceholder || this.dto.media_isVideoPlaceholder);
  }

  get videoPlaceholderUrl() {
    return this.dto.videoPlaceholderUrl || this.metadata.videoPlaceholderUrl || this.dto.media_videoPlaceholderUrl;
  }

  get htmlContent() {
    return this.html?.replace(/<[^<>]*>/g, '').trim();
  }

  get alt() {
    return (utils.isMeaningfulString(this.metadata.alt) && this.metadata.alt) || '';
  }

  set alt(value) {
    this.metadata.alt = value;
  }

  get title() {
    return this.metadata.title || '';
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
    return this.metadata.link || {};
  }

  get linkData() {
    if (this.metadata.link && this.metadata.link.data) {
      return this.metadata.link.data;
    } else if (this.isWixUrl) {
      return {
        type: 'web',
        url: this.linkUrl,
      };
    } else {
      return {};
    }
  }

  set linkData(value) {
    if (!this.metadata.link) {
      this.metadata.link = {};
    }
    this.metadata.link.data = value;
  }

  get linkType() {
    if (this.metadata.link && !utils.isUndefined(this.metadata.link.type)) {
      return this.metadata.link.type;
    } else if (this.linkUrl) {
      return 'web';
    } else {
      return 'none';
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
      target: '_blank',
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
              return 'Go to Link';
          }
        } else {
          return 'Go to Link';
        }
      case 'web':
        return this.linkUrl;
      case 'page':
        return this.linkTitle;
      default:
        return '';
    }
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
    return (this.metadata.link && this.metadata.link.text) || this.defaultLinkText;
  }

  set linkText(value) {
    if (!this.metadata.link) {
      this.metadata.link = {};
    }
    this.metadata.link.text = value;
  }

  get linkTitle() {
    return this.metadata.link && this.metadata.link.title;
  }

  set linkTitle(value) {
    if (!this.metadata.link) {
      this.metadata.link = {};
    }
    this.metadata.link.title = value;
  }

  get linkUrl() {
    return this.metadata.link && this.metadata.link.url;
  }

  set linkUrl(value) {
    if (!this.metadata.link) {
      this.metadata.link = {};
    }
    this.metadata.link.url = value;
  }

  get isWixUrl() {
    return this.linkUrl && this.linkUrl.indexOf('wix') === 0;
  }

  get unprotectedLinkOpenType() {
    return utils.get(this, 'metadata.link.target');
  }

  get linkOpenType() {
    if (this.metadata.link && !utils.isUndefined(this.metadata.link.target)) {
      return this.unprotectedLinkOpenType;
    } else if (this.metadata.link && !utils.isUndefined(this.metadata.link.targetBlank)) {
      return this.metadata.link.targetBlank ? '_blank' : '_top';
    } else {
      return '_blank';
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
      target: '_blank',
    };
  }

  get isDemo() {
    return (
      this.metadata.isDemo ||
      this.dto.isDemo ||
      this.metadata.sourceName === 'public' ||
      (this.metadata.tags && Array.isArray(this.metadata.tags) && this.metadata.tags.indexOf('_paid') >= 0)
    );
  }

  set isDemo(val) {
    this.metadata.isDemo = val;
  }

  get isText() {
    return this.type === 'text';
  }

  get isVideo() {
    return this.type === 'video';
  }

  get is3D() {
    return this.type === '3d';
  }

  get isVisible() {
    return true;
  }

  get isRendered() {
    return true;
  }

  get isDimensionless() {
    return !(this.maxWidth > 1 || this.maxHeight > 1);
  }

  get isTransparent() {
    return this.url && (this.url.indexOf('.png') > 0 || this.url.indexOf('.gif') > 0);
  }

  get webLink() {
    if (this.linkUrl?.length > 0 && this.linkType === 'web') {
      return { url: this.linkUrl, target: this.linkOpenType };
    } else {
      return {};
    }
  }

  get directLink() {
    return this.dto.directLink || this.webLink || {};
  }
  get directShareLink() {
    return this.dto.directShareLink || '';
  }
}

export default GalleryItem;
