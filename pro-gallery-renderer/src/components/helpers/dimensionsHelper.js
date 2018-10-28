
import utils from '../../utils';

function getDimensionFix(styles) {
  return (Number(styles.imageMargin) - Number(styles.galleryMargin));
}

function getGalleryDimensions(styles, container) {
  //console.count('this is the container in dimentsions helper', container);
  const res = {
    galleryWidth: getGalleryWidth(styles, container),
    galleryHeight: getGalleryHeight(styles, container)
  };


  if (styles.hasThumbnails) {
    const fixedThumbnailSize = styles.thumbnailSize + styles.galleryMargin + 3 * styles.thumbnailSpacings;
    switch (styles.galleryThumbnailsAlignment) {
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
  } else if (styles.isSlideshow) {
    res.galleryHeight -= styles.slideshowInfoSize;
  }
  return res;
}

function getGalleryWidth(styles, container) {
	// const DomWidth = window.innerWidth && document.documentElement.clientWidth ?
//   Math.min(window.innerWidth, document.documentElement.clientWidth) :
//   window.innerWidth ||
//   document.documentElement.clientWidth ||
//   document.getElementsByTagName('body')[0].clientWidth;
  const domWidth = 980;//() => protectGalleryWidth(utils.isMobile() ? container.documentWidth : container.windowWidth, container); //on mobile we use the document width - which takes in account the pixel ratio fix (width more that 100% and scale down)
  return Math.floor((container.width > 0 ? container.width : domWidth) + getDimensionFix(styles) * 2); //add margins to width and then remove them in css negative margins
}


function getGalleryHeight(styles, container) {
  const offsetTop = styles.oneRow ? container.offsetTop : 0;
  const domHeight = 500;//() => protectGalleryHeight(container.windowHeight, offsetTop);
  return Math.floor((container.height > 0 ? container.height : domHeight) + getDimensionFix(styles));
}

function getGalleryRatio(styles, container) {
  return getGalleryWidth(styles, container) / getGalleryHeight(styles, container);
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

export {
  getGalleryDimensions,
  getGalleryHeight,
  getGalleryWidth,
  getGalleryRatio
};
