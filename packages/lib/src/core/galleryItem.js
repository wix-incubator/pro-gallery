import utils from '../common/utils/index';
import { Item } from 'pro-layouts';
import RESIZE_METHODS from '../common/constants/resizeMethods';
import { URL_TYPES } from '../common/constants/urlTypes';

class GalleryItem {
  constructor(config) {
    this.uniqueId = utils.generateUUID();
    this.isGalleryItem = true;
    this.createdBy = config.createdBy;

    this.createUrl = this.createUrl.bind(this);

    this.update(config);
  }

  update(config) {
    this.resizeMediaUrl = config.resizeMediaUrl;

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
    this.cubeRatio = scheme.cropRatio;
    this.cubeImages = scheme.isCropped;
    this.cubeType = scheme.cropType || RESIZE_METHODS.FILL;
    this.offset = scheme.offset;
    this.group = scheme.group;
    this.orientation = scheme.orientation;
    this.visibility = scheme.visibility;
  }

  renderProps(config) {
    return {
      className: 'image',
      key: this.key,
      idx: this.idx,
      photoId: this.photoId,
      id: this.id,
      hash: this.id,
      html: this.html,
      type: this.type,
      isVideoPlaceholder: this.isVideoPlaceholder,
      url: this.url,
      alt: this.alt,
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
      cubeImages: this.cubeImages,
      cubeType: this.cubeType,
      cubeRatio: this.cubeRatio,
      offset: this.offset,
      style: {
        ratio: this.ratio,
        bgColor: this.bgColor,
        maxWidth: this.maxWidth,
        maxHeight: this.maxHeight,
        infoWidth: this.infoWidth,
        infoHeight: this.infoHeight,
        orientation: this.orientation,
        ...this.style,
      },
      isDemo: this.isDemo,
      videoUrl: this.videoUrl,
      isExternalVideo: this.isExternalVideo,
      ...config,
    };
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
      imageUrl: this.resizedUrl(RESIZE_METHODS.FIT, 200, 200, null, null).img(),
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

  resizedUrl(resizeMethod, requiredWidth, requiredHeight, sharpParams) {
    const resizeUrl = (item, url, ...args) => {
      let resizedUrl;
      if (typeof this.resizeMediaUrl === 'function') {
        try {
          const str = String(utils.hashCode(JSON.stringify({ url, ...args })));
          if (!this._cachedUrls[str]) {
            this._cachedUrls[str] = String(
              this.resizeMediaUrl(item, url, ...args) || '',
            );
          }
          resizedUrl = this._cachedUrls[str];
        } catch (e) {
          resizedUrl = String(url);
        }
      } else {
        resizedUrl = String(url);
      }
      return resizedUrl;
    };

    requiredWidth = Math.ceil(requiredWidth);
    requiredHeight = Math.ceil(requiredHeight);
    const thumbSize = 250;

    const focalPoint =
      resizeMethod === RESIZE_METHODS.FILL && this.isCropped && this.focalPoint;

    const urls = {};
    let imgUrl = this.url;

    if (this.isText) {
      return Object.assign(
        {},
        ...Object.values(URL_TYPES).map((value) => ({
          [value]: () => '',
        })),
      );
    } else if (this.isVideo || this.isVideoPlaceholder) {
      imgUrl = this.poster;

      if (utils.isExternalUrl(this.url)) {
        urls[URL_TYPES.VIDEO] = () => this.url;
      } else {
        urls[URL_TYPES.VIDEO] = () =>
          resizeUrl(
            this,
            this.url,
            RESIZE_METHODS.VIDEO,
            requiredWidth,
            requiredHeight,
          );
      }
    }

    urls[URL_TYPES.HIGH_RES] = () =>
      resizeUrl(
        this,
        imgUrl,
        resizeMethod,
        requiredWidth,
        requiredHeight,
        sharpParams,
        focalPoint,
      );

    urls[URL_TYPES.LOW_RES] = () =>
      resizeUrl(
        this,
        imgUrl,
        (this.cubeImages && resizeMethod !== RESIZE_METHODS.FIT ? RESIZE_METHODS.FILL : RESIZE_METHODS.FIT),
        thumbSize,
        thumbSize,
        { ...sharpParams, quality: 30, blur: 30 },
        focalPoint,
      );

    urls[URL_TYPES.SEO] = () =>
      urls[URL_TYPES.HIGH_RES]().replace(/\.webp$/i, `.${this.fileType}`); // SEO needs the original file type (jpg or png, etc..) instead of .webp, replace does not mutate

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

  get resized_url() {
    if (!this.urls.resized_url) {
      this.urls.resized_url = this.resizedUrl(
        this.cubeType,
        this.resizeWidth,
        this.resizeHeight,
        this.sharpParams,
      );
    }
    return this.urls.resized_url;
  }

  get pixel_url() {
    if (!this.urls.pixel_url) {
      this.urls.pixel_url = this.resizedUrl(RESIZE_METHODS.FILL, 1, 1, {
        quality: 5,
      });
    }
    return this.urls.pixel_url;
  }

  get thumbnail_url() {
    if (!this.urls.thumbnail_url) {
      this.urls.thumbnail_url = this.resizedUrl(
        RESIZE_METHODS.FILL,
        this.thumbnailSize,
        this.thumbnailSize,
        { quality: 70 },
      );
    }
    return this.urls.thumbnail_url;
  }

  get square_url() {
    if (!this.urls.square_url) {
      this.urls.square_url = this.resizedUrl(RESIZE_METHODS.FILL, 100, 100, {
        quality: 80,
      });
    }
    return this.urls.square_url;
  }

  get full_url() {
    if (!this.urls.full_url) {
      this.urls.full_url = this.resizedUrl(
        RESIZE_METHODS.FULL,
        this.maxWidth,
        this.maxHeight,
        this.sharpParams,
      );
    }
    return this.urls.full_url;
  }

  get sample_url() {
    if (!this.urls.sample_url) {
      this.urls.sample_url = this.resizedUrl(
        RESIZE_METHODS.FIT,
        500,
        500,
        this.sharpParams,
      );
    }
    return this.urls.sample_url;
  }

  get preload_url() {
    if (!this.urls.preload_url) {
      this.urls.preload_url = this.resized_url;
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
      }
    }
    return this.urls.download_url;
  }

  updateSharpParams() {
    // override sharpParams with item sharpParams
    if (
      this.dto.metaData &&
      this.dto.metaData.sharpParams &&
      this.dto.metaData.sharpParams.L
    ) {
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
        ((this.metadata.textStyle && this.metadata.textStyle.backgroundColor) ||
          this.metadata.backgroundColor);
    } else {
      bg = 'none';
    }
    return bg;
  }

  get isCropped() {
    return this.cubeImages && this.cubeType === RESIZE_METHODS.FILL;
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
      this._key = (
        this.dto.key ||
        this.id ||
        this.dto.url ||
        'no_key_found'
      ).replace(/\W/g, '');
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
    return (
      this.dto.file_url || this.dto.mediaUrl || this.dto.url || this.dto.src
    );
  }

  get fileType() {
    return this.url.split('.').pop();
  }

  get mediaUrl() {
    return this.url;
  }

  get html() {
    return (
      this.dto.html || this.dto.text || this.metadata.html || this.metadata.text
    );
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
      (this.metadata.customPoster && this.metadata.customPoster.url) ||
      (this.metadata.posters
        ? this.metadata.posters[this.metadata.posters.length - 1].url
        : null)
    );
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
    switch (
    this._type ||
    this.dto.type ||
    this.metadata.type ||
    this.dto.media_type
    ) {
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

  get isVideoPlaceholder() {
    return !!(
      this.dto.isVideoPlaceholder ||
      this.metadata.isVideoPlaceholder ||
      this.dto.media_isVideoPlaceholder
    );
  }

  get alt() {
    return this.metadata.alt || this.title || this.description;
  }

  get title() {
    return this.metadata.title || '';
  }

  set title(value) {
    this.metadata.title = value;
  }

  get fileName() {
    return this.metadata.fileName || 'file';
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
        return this.linkTitleFromUrl || this.linkUrl;
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
    return (
      (this.metadata.link && this.metadata.link.text) || this.defaultLinkText
    );
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

  get linkTitleFromUrl() {
    const regex = /[^/]*\.\w+$/g;
    const regexRes = regex.exec(this.linkUrl);
    const match = regexRes && regexRes[0];
    return match && match.split('.')[0];
  }

  get unprotectedLinkOpenType() {
    return utils.get(this, 'metadata.link.target');
  }

  get linkOpenType() {
    if (this.metadata.link && !utils.isUndefined(this.metadata.link.target)) {
      return this.unprotectedLinkOpenType;
    } else if (
      this.metadata.link &&
      !utils.isUndefined(this.metadata.link.targetBlank)
    ) {
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
      (this.metadata.tags &&
        Array.isArray(this.metadata.tags) &&
        this.metadata.tags.indexOf('_paid') >= 0)
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
    return (
      this.url && (this.url.indexOf('.png') > 0 || this.url.indexOf('.gif') > 0)
    );
  }

  get directLink() {
    return this.dto.directLink || '';
  }
  get directShareLink() {
    return this.dto.directShareLink || '';
  }
}

export default GalleryItem;
