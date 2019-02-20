import utils from '../../utils';
import _ from 'lodash';
import window from 'photography-client-lib/dist/src/sdk/windowWrapper';

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
  updateParams({styles, container, domId}) {
    this.dumpCache();
    this.domId = domId || this.domId;
    this.styles = styles || this.styles;
    if (container) {
      container = this.fixContainerIfNeeded(container);
      this.container = container || this.container;
    }
  }

  getDimensionFix() {
    return this.getOrPutInCache('dimensionFix', () => {
      return (Number(this.styles.imageMargin) - Number(this.styles.galleryMargin));
    });
  }

  isFullWidth(container = this.container) {
    return this.getOrPutInCache('isFullWidth', () => {
      //if the container width is not a number, it is fullwidth (e.g.: "", "100%", "calc(100% + -160px)")
      return (container && (String(parseInt(container.width)) !== String(container.width)));
    });
  }

  fixContainerIfNeeded(container)	{
    const isFullWidth = this.isFullWidth(container);
    if (isFullWidth) {
      const _container = {...container};
      const calcWidth = this.getBoundingRect().width;
      _container.width = calcWidth;
      return _container;
    } else {
      return container;
    }

  }

  calcBoundingRect() {
    if (utils.isVerbose()) {
      console.count('calcBoundingRect');
    }
    try {
      return window.document.getElementById(`pro-gallery-${this.domId}`).getBoundingClientRect();
    } catch (e) {
      return false;
    }
  }

  getBoundingRect() {
    return this.getOrPutInCache('boundingRect', () => {
      return this.calcBoundingRect() || {
        x: 0,
        y: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    });
  }
  calcBodyBoundingRect() {
    if (utils.isVerbose()) {
      console.count('calcBodyBoundingRect');
    }
    try {
      return window.document.body.getBoundingClientRect();
    } catch (e) {
      return false;
    }
  }

  getBodyBoundingRect() {
    return this.getOrPutInCache('bodyBoundingRect', () => {
      return this.calcBodyBoundingRect() || {
        x: 0,
        y: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    });
  }
  calcScrollBase() {
    return this.getOrPutInCache('scrollBase', () => {
      let {scrollBase} = this.container;
      try {
        if (!(scrollBase >= 0)) {
          scrollBase = 0;
        }
        const offset = this.getBoundingRect().y - this.getBodyBoundingRect().y; //clientRect are relative to the viewport, thus affected by scroll and need to be normalized to the body
        if (offset >= 0) {
          scrollBase += offset;
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
        galleryWidth: this.getGalleryWidth(),
        galleryHeight: this.getGalleryHeight(),
        scrollBase: this.calcScrollBase(),
        height: container.height,
        width: container.width,
        documentHeight: window.document.body.scrollHeight,
        windowWidth: window.innerWidth,
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
      const domWidth = () => window.isMock ? utils.getScreenWidth() : window.innerWidth;
      return Math.floor((this.container.width > 0 ? this.container.width : domWidth()) + this.getDimensionFix() * 2); //add margins to width and then remove them in css negative margins
    });
  }


  getGalleryHeight() {
    return this.getOrPutInCache('galleryHeight', () => {
      //const offsetTop = this.styles.oneRow ? this.container.offsetTop : 0;
      const dimensionFix = () => this.styles.oneRow ? this.getDimensionFix() : 0;
      const domHeight = () => window.isMock ? utils.getScreenHeight() : window.innerHeight;//() => protectGalleryHeight(this.container.windowHeight, offsetTop);
      return Math.floor((this.container.height > 0 ? this.container.height : domHeight()) + dimensionFix());
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
