
import utils from '../../utils';
import _ from 'lodash';

class DimensionsHelper {
  constructor() {
    this.styles = {};
    this.container = {};
    this._cache = {};
  }
  dumpCache() {
    this._cache = {};
  }
  updateStyles(newStyles) {
    this.dumpCache();
    this.styles = newStyles;
  }

  updateContainer(newContainer) {
    this.dumpCache();
    this.container = newContainer;
  }

  getDimensionFix() {
    if (!_.isUndefined(this._cache.getDimensionFix)) {
      return this._cache.getDimensionFix;
    }
    this._cache.getDimensionFix = (Number(this.styles.imageMargin) - Number(this.styles.galleryMargin));
    return this._cache.getDimensionFix;
  }

  getGalleryDimensions() {
    if (!_.isUndefined(this._cache.getGalleryDimensions)) {
      return this._cache.getGalleryDimensions;
    }
		// console.count('this is the container in dimentsions helper', container);
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
    this._cache.getGalleryDimensions = res;
    return this._cache.getGalleryDimensions;
  }

  getGalleryWidth() {
    if (!_.isUndefined(this._cache.getGalleryWidth)) {
      return this._cache.getGalleryWidth;
    }
		// const DomWidth = window.innerWidth && document.documentElement.clientWidth ?
	//   Math.min(window.innerWidth, document.documentElement.clientWidth) :
	//   window.innerWidth ||
	//   document.documentElement.clientWidth ||
	//   document.getElementsByTagName('body')[0].clientWidth;
    const domWidth = 980;//() => protectGalleryWidth(utils.isMobile() ? container.documentWidth : container.windowWidth, container); //on mobile we use the document width - which takes in account the pixel ratio fix (width more that 100% and scale down)
    this._cache.getGalleryWidth = Math.floor((this.container.wrapperWidth > 0 ? this.container.wrapperWidth : domWidth) + this.getDimensionFix() * 2); //add margins to width and then remove them in css negative margins
    return this._cache.getGalleryWidth;
  }


  getGalleryHeight() {
    if (!_.isUndefined(this._cache.getGalleryHeight)) {
      return this._cache.getGalleryHeight;
    }
    const offsetTop = this.styles.oneRow ? this.container.offsetTop : 0;
    const domHeight = 500;//() => protectGalleryHeight(this.container.windowHeight, offsetTop);
    this._cache.getGalleryHeight = Math.floor((this.container.wrapperHeight > 0 ? this.container.wrapperHeight : domHeight) + this.getDimensionFix());
    return this._cache.getGalleryHeight;
  }

  getGalleryRatio() {
    if (!_.isUndefined(this._cache.getGalleryRatio)) {
      return this._cache.getGalleryRatio;
    }
    const res = this.getGalleryDimensions();
    this._cache.getGalleryRatio = res.galleryWidth / res.galleryHeight;
    return this._cache.getGalleryRatio;
  }
}


// function getGalleryScroll(params, isHorizontal) {
//   let currentScrollPosition;
//   if (isHorizontal) {
//     currentScrollPosition = document.getElementById('gallery-horizontal-scroll').scrollLeft;
//   } else if (params && _.isNumber(params.customScrollTop)) {
//     currentScrollPosition = params.customScrollTop;
//   } else if (utils.isInWix() || utils.isWixIframe()) {
//     if (params && _.isNumber(params.scrollTop) && _.isNumber(params.y)) {
//       let scrollBase = params.y || 0;
//       if (this.boundingRect) {
//         scrollBase += this.boundingRect.y;
//       }
//       const scrollTop = params.scrollTop;
//       this.pageScale = params.scale || 1;
//       if (this.scrollBase !== scrollBase && _.isNumber(scrollBase) && !_.isNaN(scrollBase)) {
//         if (utils.isDev()) {
//           console.log('gallery ' + this.compId + ' scroll base has changed from ' + this.scrollBase + ' to ' + scrollBase);
//         }
//         this.scrollBase = scrollBase * this.pageScale;
//       }
//       currentScrollPosition = ((scrollTop - this.scrollBase) / utils.getViewportScaleRatio()) * this.pageScale;
//     }
//   } else {
//     currentScrollPosition = window.scrollTop;
//   }
//   return currentScrollPosition;
// }

// function combineScrollParams(innerScroll, outerScroll) {

// }

export default new DimensionsHelper();
