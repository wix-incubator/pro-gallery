import { default as GALLERY_CONSTS } from '../../common/constants/index';

class DimensionsHelper {
  constructor() {
    this.styles = {};
    this.dimensions = {};
    this.domId = '';
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

  updateParams({ styles, dimensions, domId }) {
    this.dumpCache();
    this.domId = domId || this.domId;
    this.styles = styles || this.styles;
    this.dimensions = dimensions || this.dimensions;
  }

  getGalleryDimensions() {
    return this.getOrPutInCache('galleryDimensions', () => {
      const res = {
        galleryWidth: Math.ceil(this.getGalleryWidth()),
        galleryHeight: Math.ceil(this.getGalleryHeight()),
        scrollBase: this.dimensions.scrollBase
          ? Math.ceil(this.dimensions.scrollBase)
          : 0,
        height: Math.ceil(this.dimensions.height),
        width: Math.ceil(this.dimensions.width),
      };
      if (this.dimensions.externalScrollBase) {
        //if was provided from the wrapper
        res.scrollBase += this.dimensions.externalScrollBase;
      }
      if (this.styles.hasThumbnails) {
        const fixedThumbnailSize =
          this.styles.thumbnailSize +
          this.styles.galleryMargin +
          3 * this.styles.thumbnailSpacings;
        switch (this.styles.galleryThumbnailsAlignment) {
          case 'top':
          case 'bottom':
            res.galleryHeight -= fixedThumbnailSize;
            break;
          case 'left':
          case 'right':
            res.galleryWidth -= fixedThumbnailSize;
            break;
          default:
            break;
        }
      } else if (this.styles.isSlideshow) {
        res.galleryHeight -= this.styles.slideshowInfoSize;
      }
      return res;
    });
  }

  getGalleryWidth() {
    return this.getOrPutInCache('galleryWidth', () => {
      let width =
        Math.floor(this.dimensions.width) + this.getDimensionFix() * 2; //add margins to width and then remove them in css negative margins
      if (
        this.styles.arrowsPosition ===
          GALLERY_CONSTS.arrowsPosition.OUTSIDE_GALLERY &&
        this.styles.scrollDirection ===
          GALLERY_CONSTS.scrollDirection.HORIZONTAL
      ) {
        width -=
          2 * (this.styles.arrowsSize + 40 + this.styles.imageMargin / 2);
      }
      return width;
    });
  }

  getGalleryHeight() {
    return this.getOrPutInCache('galleryHeight', () => {
      const dimensionFix = () =>
        this.styles.scrollDirection ===
        GALLERY_CONSTS.scrollDirection.HORIZONTAL
          ? this.getDimensionFix()
          : 0;
      const res = Math.floor(
        (this.dimensions.height > 0 ? this.dimensions.height : 0) +
          dimensionFix()
      );
      return res;
    });
  }

  getDimensionFix() {
    return this.getOrPutInCache('dimensionFix', () => {
      return (
        Number(this.styles.imageMargin / 2) - Number(this.styles.galleryMargin)
      );
    });
  }

  getGalleryRatio() {
    return this.getOrPutInCache('galleryRatio', () => {
      const res = this.getGalleryDimensions();
      return res.galleryWidth / res.galleryHeight;
    });
  }
}

export default new DimensionsHelper();
