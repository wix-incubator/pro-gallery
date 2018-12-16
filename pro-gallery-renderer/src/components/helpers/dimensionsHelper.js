import utils from '../../utils';
import _ from 'lodash';

class DimensionsHelper {
  constructor() {
    this.styles = {};
    this.container = {};
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
  updateParams({styles, container}) {
    this.dumpCache();
    this.styles = styles || this.styles;
    this.container = container || this.container;
  }

  getDimensionFix() {
    return this.getOrPutInCache('dimensionFix', () => {
      return (Number(this.styles.imageMargin) - Number(this.styles.galleryMargin));
    });
  }

  getGalleryDimensions() {
    return this.getOrPutInCache('galleryDimensions', () => {
      const res = {
        galleryWidth: this.getGalleryWidth(),
        galleryHeight: this.getGalleryHeight()
      };
      if (this.styles.hasThumbnails) {
        const fixedThumbnailSize = this.styles.thumbnailSize + this.styles.galleryMargin + 3 * this.styles.thumbnailSpacings;
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
      const domWidth = utils.getScreenWidth();//() => protectGalleryWidth(utils.isMobile() ? container.documentWidth : container.windowWidth, container); //on mobile we use the document width - which takes in account the pixel ratio fix (width more that 100% and scale down)
      return Math.floor((this.container.width > 0 ? this.container.width : domWidth) + this.getDimensionFix() * 2); //add margins to width and then remove them in css negative margins
    });
  }


  getGalleryHeight() {
    return this.getOrPutInCache('galleryHeight', () => {
      //const offsetTop = this.styles.oneRow ? this.container.offsetTop : 0;
      const domHeight = utils.getScreenHeight();//() => protectGalleryHeight(this.container.windowHeight, offsetTop);
      return Math.floor((this.container.height > 0 ? this.container.height : domHeight) + this.getDimensionFix());
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
