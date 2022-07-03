import { default as GALLERY_CONSTS } from '../../common/constants/index';
import { default as includeExternalInfo } from '../../settings/options/layoutParams_structure_galleryRatio_includeExternalInfo';
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
        scrollBase: this.container.scrollBase
          ? Math.ceil(this.container.scrollBase)
          : 0,
        height: Math.ceil(this.container.height),
        width: Math.ceil(this.container.width),
      };

      if (this.container.externalScrollBase) {
        //if was provided from the wrapper
        res.scrollBase += this.container.externalScrollBase;
      }

      if (this.options.hasThumbnails) {
        res.galleryHeight -= this.getThumbnailHeightDelta();
        res.galleryWidth -= this.getThumbnailWidthDelta();
      }

      return res;
    });
  }

  getGalleryWidth() {
    return this.getOrPutInCache('galleryWidth', () => {
      let width = Math.floor(this.container.width) + this.getDimensionFix() * 2; //add margins to width and then remove them in css negative margins
      if (
        this.options.arrowsPosition ===
          GALLERY_CONSTS.arrowsPosition.OUTSIDE_GALLERY &&
        this.options.scrollDirection ===
          GALLERY_CONSTS.scrollDirection.HORIZONTAL
      ) {
        width -=
          2 * (this.options.arrowsSize + 40 + this.options.imageMargin / 2);
      }
      return width;
    });
  }

  getGalleryHeight() {
    return this.getOrPutInCache('galleryHeight', () => {
      //const offsetTop = this.options.scrollDirection === GALLERY_CONSTS.scrollDirection.HORIZONTAL ? this.container.offsetTop : 0;
      const dimensionFix = () =>
        this.options.scrollDirection ===
        GALLERY_CONSTS.scrollDirection.HORIZONTAL
          ? this.getDimensionFix()
          : 0;
      const res = Math.floor(
        (this.container.height > 0 ? this.container.height : 0) + dimensionFix()
      );
      return res;
    });
  }

  getDimensionFix() {
    return this.getOrPutInCache('dimensionFix', () => {
      return (
        Number(this.options.imageMargin / 2) -
        Number(this.options.layoutParams.gallerySpacing)
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
      this.options.thumbnailSize +
      this.options.layoutParams.gallerySpacing +
      3 * this.options.thumbnailSpacings;
    return fixedThumbnailSize;
  }

  getThumbnailHeightDelta() {
    switch (this.options.galleryThumbnailsAlignment) {
      case 'top':
      case 'bottom':
        return this.getThumbnailSize();
      case 'left':
      case 'right':
        return 0;
      default:
        break;
    }
  }
  getThumbnailWidthDelta() {
    switch (this.options.galleryThumbnailsAlignment) {
      case 'top':
      case 'bottom':
        return 0;
      case 'left':
      case 'right':
        return this.getThumbnailSize();
      default:
        break;
    }
  }

  fixHeightForHorizontalGalleryIfNeeded() {
    if (
      this.options.scrollDirection ===
        GALLERY_CONSTS.scrollDirection.HORIZONTAL &&
      this.options.layoutParams.structure.galleryRatio.value > 0
    ) {
      if (this.options.hasThumbnails) {
        switch (this.options.galleryThumbnailsAlignment) {
          case 'top':
          case 'bottom':
            this.container.height =
              this.container.width *
                this.options.layoutParams.structure.galleryRatio.value +
              this.getThumbnailHeightDelta();
            break;
          case 'left':
          case 'right':
            this.container.height =
              (this.container.width - this.getThumbnailWidthDelta()) *
              this.options.layoutParams.structure.galleryRatio.value;
            break;
          default:
            break;
        }
      } else {
        this.container.height =
          this.container.width *
          this.options.layoutParams.structure.galleryRatio.value;
        if (
          !this.options.layoutParams.structure.galleryRatio
            .includeExternalInfo &&
          includeExternalInfo.isRelevant(this.options)
        ) {
          this.container.height += this.options.externalInfoHeight;
        }
      }
    }
  }
}

export default new DimensionsHelper();
