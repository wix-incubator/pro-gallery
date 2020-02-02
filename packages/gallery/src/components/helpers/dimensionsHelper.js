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
      if (this.isUnknownWidth() && !utils.isSSR() && !this.container.avoidGallerySelfMeasure) {
        this.tryCalcAndSetContainerWidth(); //will try to set container.width
      }
      if (this.isUnknownHeight() && !utils.isSSR() && !this.container.avoidGallerySelfMeasure) {
        this.tryCalcAndSetContainerHeight(); //will try to set container.height
      }
      if (typeof this.container.scrollBase === 'undefined' && !utils.isSSR() && !this.container.avoidGallerySelfMeasure) {
        this.calcScrollBase(); //will set container.scrollBase
      }
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

  isUnknownWidth(container = this.container) {
      //if the container width is not a number, it is unknownWidth (e.g.: "", "100%", "calc(100% + -160px)")
      return !(container.width > 0);
  }

  isUnknownHeight(container = this.container) {
    //if the container height is not a number, it is unknownHeight (e.g.: "", "100%", "calc(100% + -160px)")
    return !(container.height > 0);
  }

  tryCalcAndSetContainerWidth() {
    const boundingRect = this.calcBoundingRect();
    const calcWidth = boundingRect && boundingRect.width;
    if (calcWidth) {
      this.container.width = calcWidth;
      if (utils.isVerbose()) {
        console.log('Pro-Gallery calculated width');
      }
    }
  }

  tryCalcAndSetContainerHeight() {
    const boundingRect = this.calcBoundingRect();
    const calcHeight = boundingRect && boundingRect.height;
    if (calcHeight > 0) {
      this.container.height = calcHeight;
      if (utils.isVerbose()) {
        console.log('Pro-Gallery calculated height');
      }
    } else if (calcHeight === 0) {
      this.container.height = 200; //default height, just to not be 0
      if (utils.isVerbose()) {
        console.log('Pro-Gallery calculated height of 0, will set manually to 200');
      }
    }
  }

  getGalleryWidth() {
    return this.getOrPutInCache('galleryWidth', () => {
      const domWidth = () =>
        window.isMock ? utils.getScreenWidth() : window.innerWidth;
      let width = Math.floor(
        (this.container.width > 0 ? this.container.width : domWidth()) +
        this.getDimensionFix() * 2,
      ); //add margins to width and then remove them in css negative margins

      if (this.styles.arrowsPosition && this.styles.oneRow) {
        width -= 2 * (this.styles.arrowsSize + 40 + this.styles.imageMargin);
      }
      return width;
    });
  }

  getGalleryHeight() {
    return this.getOrPutInCache('galleryHeight', () => {
      //const offsetTop = this.styles.oneRow ? this.container.offsetTop : 0;
      const dimensionFix = () =>
        this.styles.oneRow ? this.getDimensionFix() : 0;
      const domHeight = () =>
        window.isMock ? utils.getScreenHeight() : window.innerHeight; //() => protectGalleryHeight(this.container.windowHeight, offsetTop);
      return Math.floor(
        (this.container.height > 0 ? this.container.height : domHeight()) +
        dimensionFix(),
      );
    });
  }

  calcScrollBase() {
    return this.getOrPutInCache('scrollBase', () => {
      let scrollBase = 0;
      try {
        const offset = this.getBoundingRect().y - this.getBodyBoundingRect().y; //clientRect are relative to the viewport, thus affected by scroll and need to be normalized to the body
        if (offset >= 0) {
          scrollBase += offset;
        }
        if (utils.isVerbose()) {
          console.log('Pro-Gallery calculated scrollBase');
        }
      } catch (e) {
        //
      }
      this.container.scrollBase = scrollBase;
      return scrollBase;
    });
  }

  getBoundingRect() {
    return this.getOrPutInCache('boundingRect', () => {
      return (
        this.calcBoundingRect() || {
          x: 0,
          y: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        }
      );
    });
  }

  calcBoundingRect() {
    if (utils.isVerbose()) {
      console.count('calcBoundingRect');
    }
    try {
      const proGalleryElement = window.document.getElementById(`pro-gallery-${this.domId}`);
      utils.isVerbose() && console.log('pro gallery element =', proGalleryElement);
      return proGalleryElement.getBoundingClientRect();
    } catch (e) {
      return false;
    }
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
      return (
        this.calcBodyBoundingRect() || {
          x: 0,
          y: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        }
      );
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
