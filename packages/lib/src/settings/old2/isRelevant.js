import { default as GALLERY_CONSTS } from '../../common/constants';
import {
  showColorOverlay,
  isSlideshowLayout,
  isHorizontalLayout,
  layoutPresentOuterInformation,
  presentOuterInformation,
  showInfiniteScroll,
  showItemBorderAndShadowConfig,
  showThumbnailResize,
  showShadow,
  oneRow,
  showSlideshowSettings,
  showAutoSlideshow,
  showHoveringBehaviour,
  showTextSubSection,
  showButtonSection,
  showExpendSection,
  showScrollAnimations,
  showGallerySize,
  isStore,
  showAddToCartSection,
  always,
  isLayout,
} from './utils';

export default {
  isStore: always,
  allowLeanGallery: (sp) => isLayout(sp, [GALLERY_CONSTS.layout.GRID]),
  showAddToCartSection: (sp) => isStore(sp),
  canUseWatermark: (sp) => isStore(sp),
  galleryLayout: always,
  slideshowLoop: showSlideshowSettings,
  isAutoSlideshow: showAutoSlideshow,
  autoSlideshowInterval: (sp) => showAutoSlideshow(sp) && sp.isAutoSlideshow,
  slideshowInfoSize: isSlideshowLayout,
  playButtonForAutoSlideShow: isSlideshowLayout,
  scrollDirection: (sp) =>
    [
      GALLERY_CONSTS.layout.EMPTY,
      GALLERY_CONSTS.layout.COLLAGE,
      GALLERY_CONSTS.layout.GRID,
    ].indexOf(sp.galleryLayout) > -1,
  isVertical: (sp) =>
    [GALLERY_CONSTS.layout.COLLAGE, GALLERY_CONSTS.layout.MASONRY].indexOf(
      sp.galleryLayout
    ) > -1,
  isRTL: (sp) =>
    [GALLERY_CONSTS.layout.PANORAMA].indexOf(sp.galleryLayout) === -1,
  allowSlideshowCounter: (sp) => isSlideshowLayout(sp) && sp.isAutoSlideshow,
  titlePlacement: (sp) => layoutPresentOuterInformation(sp),
  hoveringBehaviour: showHoveringBehaviour,
  cubeImages: showThumbnailResize,
  cubeType: showThumbnailResize,
  cubeRatio: (sp) => sp.cubeType === GALLERY_CONSTS.cubeType.CROP,
  gallerySliderImageRatio: (sp) =>
    sp.galleryLayout === GALLERY_CONSTS.layout.SLIDER &&
    sp.cubeType === GALLERY_CONSTS.cubeType.CROP,
  galleryThumbnailsAlignment: (sp) =>
    [GALLERY_CONSTS.layout.THUMBNAIL].indexOf(sp.galleryLayout) >= 0,
  thumbnailSize: (sp) =>
    [GALLERY_CONSTS.layout.THUMBNAIL].indexOf(sp.galleryLayout) >= 0,
  gridStyle: (sp) =>
    isLayout(sp, [GALLERY_CONSTS.layout.GRID, GALLERY_CONSTS.layout.COLLAGE]) &&
    !oneRow(sp),
  gallerySizeType: showGallerySize,
  gallerySize: (sp) =>
    showGallerySize(sp) &&
    [
      GALLERY_CONSTS.gallerySizeType.PIXELS,
      GALLERY_CONSTS.gallerySizeType.RATIO,
    ].indexOf(sp.gallerySizeType) < 0,
  gallerySizePx: (sp) =>
    showGallerySize(sp) &&
    GALLERY_CONSTS.gallerySizeType.PIXELS === sp.gallerySizeType,
  gallerySizeRatio: (sp) =>
    showGallerySize(sp) &&
    GALLERY_CONSTS.gallerySizeType.RATIO === sp.gallerySizeType,
  numberOfImagesPerRow: (sp) =>
    isLayout(sp, [GALLERY_CONSTS.layout.GRID, GALLERY_CONSTS.layout.COLLAGE]) &&
    !oneRow(sp) &&
    sp.gridStyle === 1,
  numberOfImagesPerCol: (sp) =>
    [GALLERY_CONSTS.layout.GRID].indexOf(sp.galleryLayout) >= 0 &&
    isLayout(sp, [GALLERY_CONSTS.layout.COLLAGE]) &&
    !oneRow(sp),
  groupSize: (sp) => isLayout(sp, [GALLERY_CONSTS.layout.COLLAGE]),
  groupTypes: (sp) => isLayout(sp, [GALLERY_CONSTS.layout.COLLAGE]),
  rotatingGroupTypes: (sp) => isLayout(sp, [GALLERY_CONSTS.layout.COLLAGE]),
  rotatingCropRatios: (sp) => sp.cubeImages,
  groupsPerStrip: (sp) => isLayout(sp, [GALLERY_CONSTS.layout.COLLAGE]),
  thumbnailSpacings: (sp) =>
    [GALLERY_CONSTS.layout.EMPTY, GALLERY_CONSTS.layout.THUMBNAIL].indexOf(
      sp.galleryLayout
    ) > -1,
  imageMargin: (sp) =>
    [
      GALLERY_CONSTS.layout.EMPTY,
      GALLERY_CONSTS.layout.COLLAGE,
      GALLERY_CONSTS.layout.MASONRY,
      GALLERY_CONSTS.layout.GRID,
      GALLERY_CONSTS.layout.SLIDER,
      GALLERY_CONSTS.layout.PANORAMA,
      GALLERY_CONSTS.layout.COLUMN,
      GALLERY_CONSTS.layout.BRICKS,
      GALLERY_CONSTS.layout.MIX,
      GALLERY_CONSTS.layout.ALTERNATE,
    ].indexOf(sp.galleryLayout) > -1,
  galleryMargin: always,
  scatter: always,
  collageDensity: (sp) =>
    [GALLERY_CONSTS.layout.EMPTY, GALLERY_CONSTS.layout.COLLAGE].indexOf(
      sp.galleryLayout
    ) >= 0,
  enableInfiniteScroll: (sp) =>
    [
      GALLERY_CONSTS.layout.COLLAGE,
      GALLERY_CONSTS.layout.MASONRY,
      GALLERY_CONSTS.layout.GRID,
      GALLERY_CONSTS.layout.PANORAMA,
    ].indexOf(sp.galleryLayout) > -1 && !oneRow(sp),
  loadMoreAmount: (sp) =>
    [
      GALLERY_CONSTS.layout.COLLAGE,
      GALLERY_CONSTS.layout.MASONRY,
      GALLERY_CONSTS.layout.GRID,
      GALLERY_CONSTS.layout.PANORAMA,
    ].indexOf(sp.galleryLayout) > -1 &&
    !oneRow(sp) &&
    sp.enableInfiniteScroll,
  magicLayoutSeed: (sp) =>
    [GALLERY_CONSTS.layout.MAGIC].indexOf(sp.galleryLayout) > -1,
  scrollSnap: (sp) => isHorizontalLayout(sp),
  itemClick: (sp) => !isStore(sp),
  itemOpacity: showColorOverlay,
  itemIconColorSlideshow: isSlideshowLayout,
  itemIconColor: (sp) => !isSlideshowLayout(sp),
  arrowsSize: isHorizontalLayout,
  arrowsColor: isHorizontalLayout,
  arrowsPosition: isHorizontalLayout, // && showOldGalleryFeaturesDesign,
  overlayAnimation: (sp) =>
    !isSlideshowLayout(sp) &&
    !(
      sp.titlePlacement === GALLERY_CONSTS.placements.SHOW_ON_HOVER &&
      sp.hoveringBehaviour === GALLERY_CONSTS.infoBehaviourOnHover.NO_CHANGE
    ),
  imageHoverAnimation: (sp) => !isSlideshowLayout(sp),
  textBoxFillColor: (sp) =>
    showTextSubSection(sp) &&
    !isSlideshowLayout(sp) &&
    presentOuterInformation(sp) &&
    (sp.infoType === GALLERY_CONSTS.infoType.ATTACHED_BACKGROUND ||
      sp.infoType === GALLERY_CONSTS.infoType.SEPARATED_BACKGROUND),
  calculateTextBoxWidthMode: always,
  textBoxHeight: (sp) =>
    showTextSubSection(sp) &&
    !isSlideshowLayout(sp) &&
    presentOuterInformation(sp),
  textBoxWidth: always,
  textBoxWidthPercent: always,
  textImageSpace: (sp) =>
    showTextSubSection(sp) &&
    !isSlideshowLayout(sp) &&
    presentOuterInformation(sp) &&
    sp.infoType === GALLERY_CONSTS.infoType.SEPARATED_BACKGROUND,
  textBoxBorderRadius: (sp) =>
    showTextSubSection(sp) &&
    !isSlideshowLayout(sp) &&
    presentOuterInformation(sp) &&
    sp.infoType === GALLERY_CONSTS.infoType.SEPARATED_BACKGROUND,
  textBoxBorderWidth: (sp) =>
    showTextSubSection(sp) &&
    !isSlideshowLayout(sp) &&
    presentOuterInformation(sp) &&
    sp.infoType === GALLERY_CONSTS.infoType.SEPARATED_BACKGROUND,
  textBoxBorderColor: (sp) =>
    showTextSubSection(sp) &&
    !isSlideshowLayout(sp) &&
    presentOuterInformation(sp) &&
    sp.infoType === GALLERY_CONSTS.infoType.SEPARATED_BACKGROUND,
  loadMoreButtonText: (sp) =>
    showButtonSection(sp) && showInfiniteScroll(sp) && !sp.enableInfiniteScroll,
  loadMoreButtonFont: (sp) =>
    showButtonSection(sp) && showInfiniteScroll(sp) && !sp.enableInfiniteScroll,
  loadMoreButtonFontColor: (sp) =>
    showButtonSection(sp) && showInfiniteScroll(sp) && !sp.enableInfiniteScroll,
  loadMoreButtonColor: (sp) =>
    showButtonSection(sp) && showInfiniteScroll(sp) && !sp.enableInfiniteScroll,
  loadMoreButtonBorderWidth: (sp) =>
    showButtonSection(sp) && showInfiniteScroll(sp) && !sp.enableInfiniteScroll,
  loadMoreButtonBorderColor: (sp) =>
    showButtonSection(sp) && showInfiniteScroll(sp) && !sp.enableInfiniteScroll,
  loadMoreButtonBorderRadius: (sp) =>
    showButtonSection(sp) && showInfiniteScroll(sp) && !sp.enableInfiniteScroll,
  imageInfoType: (sp) => presentOuterInformation(sp),
  itemBorderWidth: showItemBorderAndShadowConfig,
  itemBorderColor: showItemBorderAndShadowConfig,
  itemBorderRadius: showItemBorderAndShadowConfig,
  itemEnableShadow: showShadow,
  itemShadowOpacityAndColor: (sp) => showShadow(sp) && sp.itemEnableShadow,
  itemShadowBlur: (sp) => showShadow(sp) && sp.itemEnableShadow,
  itemShadowDirection: (sp) => showShadow(sp) && sp.itemEnableShadow,
  itemShadowSize: (sp) => showShadow(sp) && sp.itemEnableShadow,
  imageLoadingMode: always,
  imageLoadingColor: (sp) =>
    sp.imageLoadingMode === GALLERY_CONSTS.loadingMode.COLOR,
  expandAnimation: (sp) =>
    sp.itemClick === GALLERY_CONSTS.itemClick.EXPAND || isStore(sp),
  scrollAnimation: (sp) => showScrollAnimations(sp),
  oneColorAnimationColor: (sp) =>
    showScrollAnimations(sp) &&
    sp.scrollAnimation === GALLERY_CONSTS.scrollAnimations.ONE_COLOR,
  allowLinkExpand: (sp) => showExpendSection(sp),
  expandInfoPosition: (sp) => showExpendSection(sp) && !isStore(sp),
  defaultShowInfoExpand: (sp) =>
    showExpendSection(sp) && sp.expandInfoPosition !== 1 && !isStore(sp),
  allowFullscreenExpand: (sp) => showExpendSection(sp) && !isStore(sp),
  fullscreenLoop: (sp) => showExpendSection(sp) && !isStore(sp),
  bgColorExpand: (sp) => showExpendSection(sp),
  actionsColorExpand: (sp) => showExpendSection(sp),
  galleryAlignExpand: (sp) => showExpendSection(sp) && !isStore(sp),
  addToCartBackColorExpand: (sp) => showExpendSection(sp) && isStore(sp),
  addToCartFontExpand: (sp) =>
    showExpendSection(sp) && showAddToCartSection(sp),
  addToCartColorExpand: (sp) =>
    showExpendSection(sp) && showAddToCartSection(sp),
  addToCartBorderWidth: (sp) =>
    showExpendSection(sp) && showAddToCartSection(sp),
  addToCartBorderColor: (sp) =>
    showExpendSection(sp) && showAddToCartSection(sp),
  addToCartButtonText: (sp) =>
    showExpendSection(sp) && showAddToCartSection(sp),
  imageQuality: always,
  usmToggle: always,
  usm_a: (sp) => sp.usmToggle,
  usm_r: (sp) => sp.usmToggle,
  usm_t: (sp) => sp.usmToggle,
  hidePlay: always,
  videoPlay: always,
  videoSound: (sp) => sp.videoPlay !== GALLERY_CONSTS.videoPlay.ON_CLICK,
  videoSpeed: always,
  videoLoop: always,
};
