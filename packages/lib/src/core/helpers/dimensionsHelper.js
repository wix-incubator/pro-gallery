import { default as GALLERY_CONSTS } from '../../common/constants/index';
import { default as includeExternalInfo } from '../../settings/options/layoutParams_structure_galleryRatio_includeExternalInfo';
import optionsMap from './optionsMap';

class DimensionsHelper {
  constructor() {
    this.options = {};
    this.container = {};
    this.id = '';
    this._cache = {};
  }

  getOrPutInCache(field, createValue) {
    if (this._cache[field]) return this._cache[field];
    this._cache[field] = createValue();
    return this._cache[field];
  }

  dumpCache() {
    this._cache = {};
  }

  updateParams({ options, container, id }) {
    this.dumpCache();
    this.id = id || this.id;
    this.options = options || this.options;
    this.container = container || this.container;
    this.fixHeightForHorizontalGalleryIfNeeded();
  }

  getGalleryDimensions() {
    return this.getOrPutInCache('galleryDimensions', () => {
      const res = {
        galleryWidth: Math.ceil(this.getGalleryWidth()),
        galleryHeight: Math.ceil(this.getGalleryHeight()),
        scrollBase: this.container.scrollBase ? Math.ceil(this.container.scrollBase) : 0,
        height: Math.ceil(this.container.height),
        width: Math.ceil(this.container.width),
      };

      if (this.container.externalScrollBase) {
        //if was provided from the wrapper
        res.scrollBase += this.container.externalScrollBase;
      }
      if (
        this.options[optionsMap.layoutParams.thumbnails.enable] &&
        this.options[optionsMap.layoutParams.thumbnails.position] ===
          GALLERY_CONSTS[optionsMap.layoutParams.thumbnails.position].OUTSIDE_GALLERY
      ) {
        res.galleryHeight -= this.getThumbnailHeightDelta();
        res.galleryWidth -= this.getThumbnailWidthDelta();
      }
      if (this.options[optionsMap.layoutParams.thumbnails.enable]) {
        res.navigationBarHeight = this.getThumbnailHeightDelta() || res.galleryHeight;
        res.navigationBarWidth = this.getThumbnailWidthDelta() || res.galleryWidth;
      }
      return res;
    });
  }

  getGalleryWidth() {
    return this.getOrPutInCache('galleryWidth', () => {
      let width = Math.floor(this.container.width) + this.getDimensionFix() * 2; //add margins to width and then remove them in css negative margins
      if (
        this.options[optionsMap.layoutParams.navigationArrows.position] ===
          GALLERY_CONSTS[optionsMap.layoutParams.navigationArrows.position].OUTSIDE_GALLERY &&
        this.options[optionsMap.layoutParams.structure.scrollDirection] ===
          GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].HORIZONTAL
      ) {
        width -=
          2 *
          (this.options[optionsMap.layoutParams.navigationArrows.size] +
            40 +
            this.options[optionsMap.layoutParams.structure.itemSpacing] / 2);
      }
      return width;
    });
  }

  getGalleryHeight() {
    return this.getOrPutInCache('galleryHeight', () => {
      //const offsetTop = this.options.scrollDirection === GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].HORIZONTAL ? this.container.offsetTop : 0;
      const dimensionFix = () =>
        this.options[optionsMap.layoutParams.structure.scrollDirection] ===
        GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].HORIZONTAL
          ? this.getDimensionFix()
          : 0;
      const res = Math.floor((this.container.height > 0 ? this.container.height : 0) + dimensionFix());
      return res;
    });
  }

  getDimensionFix() {
    return this.getOrPutInCache('dimensionFix', () => {
      return (
        Number(this.options[optionsMap.layoutParams.structure.itemSpacing] / 2) -
        Number(this.options[optionsMap.layoutParams.structure.gallerySpacing])
      );
    });
  }

  getGalleryRatio() {
    return this.getOrPutInCache('galleryRatio', () => {
      const res = this.getGalleryDimensions();
      return res.galleryWidth / res.galleryHeight;
    });
  }

  getThumbnailSize() {
    const fixedThumbnailSize =
      this.options[optionsMap.layoutParams.thumbnails.size] +
      this.options[optionsMap.layoutParams.structure.gallerySpacing] +
      this.options[optionsMap.layoutParams.thumbnails.marginToGallery];
    return fixedThumbnailSize;
  }

  getThumbnailHeightDelta() {
    switch (this.options[optionsMap.layoutParams.thumbnails.alignment]) {
      case GALLERY_CONSTS[optionsMap.layoutParams.thumbnails.alignment].TOP:
      case GALLERY_CONSTS[optionsMap.layoutParams.thumbnails.alignment].BOTTOM:
        return this.getThumbnailSize();
      case GALLERY_CONSTS[optionsMap.layoutParams.thumbnails.alignment].RIGHT:
      case GALLERY_CONSTS[optionsMap.layoutParams.thumbnails.alignment].LEFT:
        return 0;
      default:
        break;
    }
  }
  getThumbnailWidthDelta() {
    switch (this.options[optionsMap.layoutParams.thumbnails.alignment]) {
      case GALLERY_CONSTS[optionsMap.layoutParams.thumbnails.alignment].TOP:
      case GALLERY_CONSTS[optionsMap.layoutParams.thumbnails.alignment].BOTTOM:
        return 0;
      case GALLERY_CONSTS[optionsMap.layoutParams.thumbnails.alignment].RIGHT:
      case GALLERY_CONSTS[optionsMap.layoutParams.thumbnails.alignment].LEFT:
        return this.getThumbnailSize();
      default:
        break;
    }
  }

  fixHeightForHorizontalGalleryIfNeeded() {
    if (
      this.options[optionsMap.layoutParams.structure.scrollDirection] ===
        GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].HORIZONTAL &&
      this.options[optionsMap.layoutParams.structure.galleryRatio.value] > 0
    ) {
      if (
        this.options[optionsMap.layoutParams.thumbnails.enable] &&
        this.options[optionsMap.layoutParams.thumbnails.position] ===
          GALLERY_CONSTS[optionsMap.layoutParams.thumbnails.position].OUTSIDE_GALLERY
      ) {
        switch (this.options[optionsMap.layoutParams.thumbnails.alignment]) {
          case GALLERY_CONSTS[optionsMap.layoutParams.thumbnails.alignment].TOP:
          case GALLERY_CONSTS[optionsMap.layoutParams.thumbnails.alignment].BOTTOM:
            this.container.height =
              this.container.width * this.options[optionsMap.layoutParams.structure.galleryRatio.value] +
              this.getThumbnailHeightDelta();
            break;
          case GALLERY_CONSTS[optionsMap.layoutParams.thumbnails.alignment].RIGHT:
          case GALLERY_CONSTS[optionsMap.layoutParams.thumbnails.alignment].LEFT:
            this.container.height =
              (this.container.width - this.getThumbnailWidthDelta()) *
              this.options[optionsMap.layoutParams.structure.galleryRatio.value];
            break;
          default:
            break;
        }
      } else {
        this.container.height =
          this.container.width * this.options[optionsMap.layoutParams.structure.galleryRatio.value];
        if (
          !this.options[optionsMap.layoutParams.structure.galleryRatio.includeExternalInfo] &&
          includeExternalInfo.isRelevant(this.options)
        ) {
          this.container.height += this.options.externalInfoHeight;
        }
      }
    }
  }
}

export default new DimensionsHelper();
