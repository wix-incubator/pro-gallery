
import { GALLERY_CONSTS } from './consts';

export const showColorOverlay = (sp, context = {}) => {
  const hasHoverOnMobile = styleParams => {
    const firstTapSimulatesHover = sp.itemClick === GALLERY_CONSTS.itemClick.NOTHING ||
      (

          (layoutPresentOuterInformation(styleParams) && sp.titlePlacement === GALLERY_CONSTS.placements.SHOW_ON_HOVER) ||
          !layoutPresentOuterInformation(styleParams)

      )
      ;

    return !isSlideshowLayout(styleParams) &&
      firstTapSimulatesHover;
  };
  if (context.isMobile) {
    return hasHoverOnMobile(sp);
  }
  return !isSlideshowLayout(sp);
};


export const isSlideshowLayout = sp => {
  return [GALLERY_CONSTS.layout.SLIDESHOW, GALLERY_CONSTS.layout.FULLSIZE].indexOf(sp.galleryLayout) > -1;
}

export const isHorizontalLayout = sp => {
  return [GALLERY_CONSTS.layout.THUMBNAIL, GALLERY_CONSTS.layout.SLIDER, GALLERY_CONSTS.layout.SLIDESHOW, GALLERY_CONSTS.layout.FULLSIZE, GALLERY_CONSTS.layout.COLUMN].indexOf(sp.galleryLayout) > -1 ||
    ((sp.galleryLayout === GALLERY_CONSTS.layout.GRID || sp.galleryLayout === GALLERY_CONSTS.layout.COLLAGE) && !oneRow(sp));
}

export const layoutPresentOuterInformation = sp =>
  [GALLERY_CONSTS.layout.PANORAMA, GALLERY_CONSTS.layout.COLUMN, GALLERY_CONSTS.layout.SLIDER].indexOf(sp.galleryLayout) > -1 ||
  (sp.galleryLayout === GALLERY_CONSTS.layout.MASONRY && sp.isVertical) ||
  (sp.galleryLayout === GALLERY_CONSTS.layout.GRID && !oneRow(sp))

export const layoutPresentSideOuterInformation = sp =>
  !oneRow(sp) && sp.isVertical && sp.groupSize === 1;

export const showAlignTextVertical = sp => [GALLERY_CONSTS.layout.COLLAGE, GALLERY_CONSTS.layout.MASONRY, GALLERY_CONSTS.layout.GRID, GALLERY_CONSTS.layout.THUMBNAIL, GALLERY_CONSTS.layout.SLIDER, GALLERY_CONSTS.layout.PANORAMA, GALLERY_CONSTS.layout.COLUMN, GALLERY_CONSTS.layout.MAGIC].indexOf(sp.galleryLayout) > -1 && sp.titlePlacement === GALLERY_CONSTS.placements.SHOW_ON_HOVER;
export const presentOuterInformation = sp => layoutPresentOuterInformation(sp) && sp.titlePlacement !== GALLERY_CONSTS.placements.SHOW_ON_HOVER;
export const presentSideOuterInformation = sp => layoutPresentSideOuterInformation(sp) && (sp.titlePlacement === GALLERY_CONSTS.placements.SHOW_ON_THE_RIGHT || sp.titlePlacement === GALLERY_CONSTS.placements.SHOW_ON_THE_LEFT);
export const isTitlePlacementAlwaysShown = sp => layoutPresentOuterInformation(sp) || isSlideshowLayout(sp) || sp.titlePlacement !== GALLERY_CONSTS.placements.SHOW_ON_HOVER;
export const showInfiniteScroll = sp => !oneRow(sp);
export const showItemBorderAndShadowConfig = sp => !(sp.cubeType === 'fit' && showThumbnailResize(sp)) // check cubeType exists
export const showThumbnailResize = sp => [GALLERY_CONSTS.layout.EMPTY, GALLERY_CONSTS.layout.GRID, GALLERY_CONSTS.layout.THUMBNAIL, GALLERY_CONSTS.layout.SLIDER, GALLERY_CONSTS.layout.SLIDESHOW, GALLERY_CONSTS.layout.FULLSIZE].indexOf(sp.galleryLayout) > -1;
export const showShadow = sp => showItemBorderAndShadowConfig(sp) && !isHorizontalLayout(sp) && (sp.imageInfoType === GALLERY_CONSTS.infoType.ATTACHED_BACKGROUND || sp.titlePlacement === GALLERY_CONSTS.placements.SHOW_ON_HOVER);
export const oneRow = sp => sp.oneRow || sp.scrollDirection === GALLERY_CONSTS.scrollDirection.horizontal;
export const showSlideshowSettings = sp => [GALLERY_CONSTS.layout.THUMBNAIL, GALLERY_CONSTS.layout.SLIDER, GALLERY_CONSTS.layout.SLIDESHOW, GALLERY_CONSTS.layout.FULLSIZE, GALLERY_CONSTS.layout.COLUMN].indexOf(sp.galleryLayout) > -1;
export const showAutoSlideshow = sp => [GALLERY_CONSTS.layout.THUMBNAIL, GALLERY_CONSTS.layout.SLIDER, GALLERY_CONSTS.layout.SLIDESHOW, GALLERY_CONSTS.layout.FULLSIZE].indexOf(sp.galleryLayout) > -1;
export const showImagesDisplaySection = sp => [GALLERY_CONSTS.layout.EMPTY, GALLERY_CONSTS.layout.COLLAGE, GALLERY_CONSTS.layout.MASONRY, GALLERY_CONSTS.layout.GRID, GALLERY_CONSTS.layout.THUMBNAIL, GALLERY_CONSTS.layout.SLIDER, GALLERY_CONSTS.layout.SLIDESHOW, GALLERY_CONSTS.layout.FULLSIZE, GALLERY_CONSTS.layout.PANORAMA, GALLERY_CONSTS.layout.COLUMN].indexOf(sp.galleryLayout) > -1;
export const showHoveringBehaviour = sp => showImagesDisplaySection(sp) && !isSlideshowLayout(sp) && ((presentOuterInformation(sp) && sp.titlePlacement === GALLERY_CONSTS.placements.SHOW_ON_HOVER) || !presentOuterInformation(sp));
export const showButtonSection = sp => showInfiniteScroll(sp) && !sp.enableInfiniteScroll && isStore(sp);
export const showExpendSection = sp => sp.itemClick === GALLERY_CONSTS.itemClick.EXPAND || isStore(sp);
export const showScrollAnimations = sp => !oneRow(sp);
export const showGallerySize = sp => ((sp.galleryLayout === GALLERY_CONSTS.layout.GRID || sp.galleryLayout === GALLERY_CONSTS.layout.COLLAGE) && !oneRow(sp)) ? sp.gridStyle === 0 : [GALLERY_CONSTS.layout.EMPTY, GALLERY_CONSTS.layout.COLLAGE, GALLERY_CONSTS.layout.MASONRY].indexOf(sp.galleryLayout) >= 0;

// implement
export const isStore = (sp) => sp.isStore;
export const showAddToCartSection = (sp) => isStore(sp) && sp.showAddToCartSection; // providerApi.hasAddToCart();
export const canUseWatermark = (sp) => isStore(sp) && sp.canUseWatermark; // mediaUploaded || !isDemoImage;

export const always = () => true;

export const isLayout = (sp, layouts) => sp.galleryLayout === -1 || layouts.indexOf(sp.galleryLayout) >= 0;
