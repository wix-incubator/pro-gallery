import utils from '../../common/utils';
import window from '../../common/window/windowWrapper';

class DimensionsHelper {
  constructor() {
    this.styles = {};
    this.container = {};
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

  updateParams({ styles, container, domId }) {
    this.dumpCache();
    this.domId = domId || this.domId;
    this.styles = styles || this.styles;
    this.container = container || this.container;
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
      if (this.container.externalScrollBase) { //if was provided from the wrapper
        res.scrollBase += this.container.externalScrollBase;
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
      let width = Math.floor(this.container.width) + (this.getDimensionFix() * 2); //add margins to width and then remove them in css negative margins
      if ( this.styles.oneRow) {
        if (this.styles.arrowsPosition) {
          width -= 2 * (this.styles.arrowsSize + 40 + this.styles.imageMargin);
        }
        if (this.styles.slideshowInfoPlacement === 'ON_THE_RIGHT') {
          width -= this.styles.slideshowInfoWidth;
        }
      }
      return width;
    });
  }

  getGalleryHeight() {
    return this.getOrPutInCache('galleryHeight', () => {
      //const offsetTop = this.styles.oneRow ? this.container.offsetTop : 0;
      const dimensionFix = () =>
        this.styles.oneRow ? this.getDimensionFix() : 0;
      const res = Math.floor(
        (this.container.height > 0 ? this.container.height : 0) +
        dimensionFix(),
      )
      return res;
    });
  }

  getDimensionFix() {
    return this.getOrPutInCache('dimensionFix', () => {
      return (
        Number(this.styles.imageMargin) - Number(this.styles.galleryMargin)
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
