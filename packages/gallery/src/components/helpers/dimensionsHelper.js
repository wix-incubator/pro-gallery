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
    this.domId = domId || this.domId;
    this.styles = styles || this.styles;
    this.container = {...this.container, ...container};
  }

  getDimensionFix() {
    return this.getOrPutInCache('dimensionFix', () => {
      return (
        Number(this.styles.imageMargin) - Number(this.styles.galleryMargin)
      );
    });
  }

  isFullWidth() {
      //if the container width is not a number, it is fullwidth (e.g.: "", "100%", "calc(100% + -160px)")
      return !(this.getGalleryWidth() > 0);
  }

  calcBoundingRect(selector) {
    if (utils.isVerbose()) {
      console.count('calcBoundingRect: ', selector);
    }
    try {
      return window.document
        .querySelector(selector)
        .getBoundingClientRect();
    } catch (e) {
      return false;
    }
  }

  getBoundingRect(selector = `#pro-gallery-${this.domId}`) {
    return this.getOrPutInCache(selector + '|BoundingRect', () => {
      return (
        this.calcBoundingRect(selector) || {
          x: 0,
          y: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        }
      );
    });
  }

  calcScrollBase() {
    return this.getOrPutInCache('scrollBase', () => {
      let { scrollBase } = this.container;
      try {
        if (!(scrollBase >= 0)) {
          scrollBase = this.getBoundingRect().y - this.getBoundingRect('body').y; //clientRect are relative to the viewport, thus affected by scroll and need to be normalized to the body
        }
      } catch (e) {
        //
      }
      return scrollBase;
    });
  }

  getGalleryDimensions() {
    return this.getOrPutInCache('galleryDimensions', () => {
      const container = this.container;
      const res = {
        galleryWidth: Math.ceil(this.getGalleryWidth()),
        galleryHeight: Math.ceil(this.getGalleryHeight()),
        scrollBase: Math.ceil(this.calcScrollBase() || 0),
        height: Math.ceil(container.height),
        width: Math.ceil(container.width),
      };
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
      const domWidth = () => {
        try {
          if (window.isMock) {
            return 0
          } else {
            const {width} = this.getBoundingRect();
            return width;
          }
        } catch (e) {
          console.error('Could not measure gallery width', e)
        }
      }
      let width = (this.container.width >= 0 ? this.container.width : domWidth());
      if (width > 0) {
        width += (width + this.getDimensionFix() * 2); //add margins to width and then remove them in css negative margins
        if (this.styles.arrowsPosition && this.styles.oneRow) {
          width -= 2 * (this.styles.arrowsSize + 40 + this.styles.imageMargin);
        }
        width = Math.ceil(width);
      }

      return width;
    });
  }

  getGalleryHeight() {
    return this.getOrPutInCache('galleryHeight', () => {
      //const offsetTop = this.styles.oneRow ? this.container.offsetTop : 0;
      const dimensionFix = () =>
        this.styles.oneRow ? this.getDimensionFix() : 0;
      const domHeight = () => {
        try {
          if (window.isMock) {
            return 500
          } else {
            const {height} = this.getBoundingRect();
            return height;
          }
        } catch (e) {
          console.error('Could not measure gallery height', e)
        }
      }
      return Math.floor(
        (this.container.height > 0 ? this.container.height : domHeight()) +
          dimensionFix(),
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
