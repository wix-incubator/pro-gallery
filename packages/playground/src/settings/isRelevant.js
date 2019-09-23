import {GALLERY_CONSTS} from './consts';

const showColorOverlay = (sp, context) => {
  if (context.isMobile) {
    return hasHoverOnMobile(sp);
  }
  return !isSlideshowLayout(sp);
};

const hasHoverOnMobile = sp => {
   const firstTapSimulatesHover = sp.itemClick === GALLERY_CONSTS.itemClick.NOTHING ||
    (showTexts(sp) &&
      (
        (layoutPresentOuterInformation(sp) && sp.titlePlacement === GALLERY_CONSTS.placements.SHOW_ON_HOVER) ||
        !layoutPresentOuterInformation(sp)
      )
    )
  ;

  return !isSlideshowLayout(sp) &&
    firstTapSimulatesHover;
};

const isSlideshowLayout = sp => {
  return [GALLERY_CONSTS.layout.SLIDESHOW, GALLERY_CONSTS.layout.FULLSIZE].indexOf(sp.galleryLayout) > -1;
}

const isHorizontalLayout = sp => {
  return [GALLERY_CONSTS.layout.THUMBNAIL, GALLERY_CONSTS.layout.SLIDER, GALLERY_CONSTS.layout.SLIDESHOW, GALLERY_CONSTS.layout.FULLSIZE, GALLERY_CONSTS.layout.COLUMN].indexOf(sp.galleryLayout) > -1 ||
  ((sp.galleryLayout === GALLERY_CONSTS.layout.GRID || sp.galleryLayout === GALLERY_CONSTS.layout.COLLAGE) && !oneRow(sp)); 
  }

const layoutPresentOuterInformation = sp => 
  [GALLERY_CONSTS.layout.PANORAMA, GALLERY_CONSTS.layout.COLUMN, GALLERY_CONSTS.layout.SLIDER].indexOf(sp.galleryLayout) > -1 ||
  (sp.galleryLayout === GALLERY_CONSTS.layout.MASONRY && sp.isVertical) ||
  (sp.galleryLayout === GALLERY_CONSTS.layout.GRID && !oneRow(sp))

const showTexts = sp => sp.allowTitle || sp.allowDescription;
const showAlignTextVertical = sp => [GALLERY_CONSTS.layout.COLLAGE, GALLERY_CONSTS.layout.MASONRY, GALLERY_CONSTS.layout.GRID, GALLERY_CONSTS.layout.THUMBNAIL, GALLERY_CONSTS.layout.SLIDER, GALLERY_CONSTS.layout.PANORAMA, GALLERY_CONSTS.layout.COLUMN, GALLERY_CONSTS.layout.MAGIC].indexOf(sp.galleryLayout) > -1 && sp.titlePlacement === GALLERY_CONSTS.placements.SHOW_ON_HOVER;
const presentOuterInformation = sp => layoutPresentOuterInformation(sp) && sp.titlePlacement !== GALLERY_CONSTS.placements.SHOW_ON_HOVER;
const isTitlePlacementAlwaysShown = sp => layoutPresentOuterInformation(sp) || isSlideshowLayout(sp) || sp.titlePlacement !== GALLERY_CONSTS.placements.SHOW_ON_HOVER;
const showInfiniteScroll = sp => [GALLERY_CONSTS.layout.COLLAGE, GALLERY_CONSTS.layout.MASONRY, GALLERY_CONSTS.layout.GRID, GALLERY_CONSTS.layout.PANORAMA].indexOf(sp.galleryLayout) > -1 && oneRow(sp);
const showItemBorderAndShadowConfig = sp => !(sp.cubeType === 'fit' && showThumbnailResize(sp)) // check cubeType exists 
const showThumbnailResize = sp => [GALLERY_CONSTS.layout.EMPTY, GALLERY_CONSTS.layout.GRID, GALLERY_CONSTS.layout.THUMBNAIL, GALLERY_CONSTS.layout.SLIDER, GALLERY_CONSTS.layout.SLIDESHOW, GALLERY_CONSTS.layout.FULLSIZE].indexOf(sp.galleryLayout) > -1 ;
const showShadow = sp => showItemBorderAndShadowConfig(sp) && !isHorizontalLayout(sp)  && (sp.imageInfoType === GALLERY_CONSTS.infoType.ATTACHED_BACKGROUND || sp.titlePlacement === GALLERY_CONSTS.placements.SHOW_ON_HOVER);
const oneRow = sp => sp.scrollDirection === GALLERY_CONSTS.scrollDirection.horizontal;
const showSlideshowSettings = sp => [GALLERY_CONSTS.layout.THUMBNAIL, GALLERY_CONSTS.layout.SLIDER, GALLERY_CONSTS.layout.SLIDESHOW, GALLERY_CONSTS.layout.FULLSIZE, GALLERY_CONSTS.layout.COLUMN].indexOf(sp.galleryLayout) > -1;
const showAutoSlideshow = sp => [GALLERY_CONSTS.layout.THUMBNAIL, GALLERY_CONSTS.layout.SLIDER, GALLERY_CONSTS.layout.SLIDESHOW, GALLERY_CONSTS.layout.FULLSIZE].indexOf(sp.galleryLayout) > -1;
const showImagesDisplaySection = sp => [GALLERY_CONSTS.layout.EMPTY, GALLERY_CONSTS.layout.COLLAGE, GALLERY_CONSTS.layout.MASONRY, GALLERY_CONSTS.layout.GRID, GALLERY_CONSTS.layout.THUMBNAIL, GALLERY_CONSTS.layout.SLIDER, GALLERY_CONSTS.layout.SLIDESHOW, GALLERY_CONSTS.layout.FULLSIZE, GALLERY_CONSTS.layout.PANORAMA, GALLERY_CONSTS.layout.COLUMN].indexOf(sp.galleryLayout) > -1;
const showHoveringBehaviour = sp => showImagesDisplaySection(sp) && !isSlideshowLayout(sp) && showTexts(sp) && ((presentOuterInformation(sp) && sp.titlePlacement === GALLERY_CONSTS.placements.SHOW_ON_HOVER) || !presentOuterInformation(sp));
const showTextSubSection = sp => showTexts(sp);
const showButtonSection = sp => showInfiniteScroll(sp) && !sp.enableInfiniteScroll && isStore(sp);
const showExpendSection = sp => sp.itemClick === GALLERY_CONSTS.itemClick.EXPAND || isStore(sp);
const showScrollAnimations = sp => [GALLERY_CONSTS.layout.MASONRY, GALLERY_CONSTS.layout.PANORAMA, GALLERY_CONSTS.layout.BRICKS, GALLERY_CONSTS.layout.ALTERNATE, GALLERY_CONSTS.layout.MIX].indexOf(sp.galleryLayout) > -1 || ((sp.galleryLayout === GALLERY_CONSTS.layout.GRID || sp.galleryLayout === GALLERY_CONSTS.layout.COLLAGE) && !oneRow(sp));

// implement
const isStore = (sp) => sp.isStore;
const showAddToCartSection = (sp) => isStore(sp) && sp.showAddToCartSection; // providerApi.hasAddToCart();
const canUseWatermark = (sp) => isStore(sp) && sp.canUseWatermark; // mediaUploaded || !isDemoImage;

const always = () => true;

export default {
  isStore: always,
  showAddToCartSection: sp => isStore(sp),
  canUseWatermark: sp => isStore(sp),
  galleryLayout: always,
  slideshowLoop: showSlideshowSettings,
  isAutoSlideshow: showAutoSlideshow,
  autoSlideshowInterval: (sp) => showAutoSlideshow(sp) && sp.isAutoSlideshow,
  slideshowInfoSize: isSlideshowLayout,
  playButtonForAutoSlideShow: isSlideshowLayout,
  scrollDirection: sp => [GALLERY_CONSTS.layout.EMPTY, GALLERY_CONSTS.layout.COLLAGE, GALLERY_CONSTS.layout.GRID].indexOf(sp.galleryLayout) > -1,
  isVertical: sp => [GALLERY_CONSTS.layout.COLLAGE, GALLERY_CONSTS.layout.MASONRY].indexOf(sp.galleryLayout) > -1,
  isRTL: sp => [GALLERY_CONSTS.layout.PANORAMA].indexOf(sp.galleryLayout) === -1,
  allowTitle: showImagesDisplaySection,
  allowDescription: showImagesDisplaySection,
  allowSlideshowCounter: (sp) => isSlideshowLayout(sp) && sp.isAutoSlideshow,
  titlePlacement: (sp) => layoutPresentOuterInformation(sp) && showTexts(sp),
  hoveringBehaviour: showHoveringBehaviour,
  cubeType: showThumbnailResize,
  cubeRatio: sp => [GALLERY_CONSTS.layout.EMPTY, GALLERY_CONSTS.layout.GRID, GALLERY_CONSTS.layout.SLIDER].indexOf(sp.galleryLayout) > -1 && sp.cubeType === GALLERY_CONSTS.cubeType.crop,
  gallerySliderImageRatio: sp => sp.galleryLayout === GALLERY_CONSTS.layout.SLIDER && sp.cubeType === GALLERY_CONSTS.cubeType.crop,
  galleryThumbnailsAlignment: sp => [GALLERY_CONSTS.layout.THUMBNAIL].indexOf(sp.galleryLayout) >= 0,
  thumbnailSize: sp => [GALLERY_CONSTS.layout.THUMBNAIL].indexOf(sp.galleryLayout) >= 0,
  gridStyle: sp => ((sp.galleryLayout === GALLERY_CONSTS.layout.GRID || sp.galleryLayout === GALLERY_CONSTS.layout.COLLAGE) && !oneRow(sp)),
  gallerySize: sp => ((sp.galleryLayout === GALLERY_CONSTS.layout.GRID || sp.galleryLayout === GALLERY_CONSTS.layout.COLLAGE) && !oneRow(sp)) ? sp.gridStyle ===  0 : [GALLERY_CONSTS.layout.EMPTY, GALLERY_CONSTS.layout.COLLAGE, GALLERY_CONSTS.layout.MASONRY].indexOf(sp.galleryLayout) >= 0 ,
  numberOfImagesPerRow: sp => ((sp.galleryLayout === GALLERY_CONSTS.layout.GRID || sp.galleryLayout === GALLERY_CONSTS.layout.COLLAGE) && !oneRow(sp)) && sp.gridStyle === 1,
  numberOfImagesPerCol: sp => [GALLERY_CONSTS.layout.GRID].indexOf(sp.galleryLayout) >= 0  && (sp.galleryLayout === GALLERY_CONSTS.layout.COLLAGE && !oneRow(sp)),
  groupSize: sp => sp.galleryLayout === GALLERY_CONSTS.layout.COLLAGE,
  groupTypes: sp => sp.galleryLayout === GALLERY_CONSTS.layout.COLLAGE,
  rotatingGroupTypes: sp => sp.galleryLayout === GALLERY_CONSTS.layout.COLLAGE,
  groupsPerStrip: sp => sp.galleryLayout === GALLERY_CONSTS.layout.COLLAGE,
  thumbnailSpacings: sp => [GALLERY_CONSTS.layout.EMPTY, GALLERY_CONSTS.layout.THUMBNAIL].indexOf(sp.galleryLayout) > -1,
  imageMargin: sp => [GALLERY_CONSTS.layout.EMPTY, GALLERY_CONSTS.layout.COLLAGE, GALLERY_CONSTS.layout.MASONRY, GALLERY_CONSTS.layout.GRID, GALLERY_CONSTS.layout.SLIDER, GALLERY_CONSTS.layout.PANORAMA, GALLERY_CONSTS.layout.COLUMN, GALLERY_CONSTS.layout.BRICKS, GALLERY_CONSTS.layout.MIX, GALLERY_CONSTS.layout.ALTERNATE].indexOf(sp.galleryLayout) > -1,
  galleryMargin: always,
  floatingImages: always,
  collageDensity: sp => [GALLERY_CONSTS.layout.EMPTY, GALLERY_CONSTS.layout.COLLAGE].indexOf(sp.galleryLayout) >= 0,
  enableInfiniteScroll: sp => [GALLERY_CONSTS.layout.COLLAGE,  GALLERY_CONSTS.layout.MASONRY,  GALLERY_CONSTS.layout.GRID,  GALLERY_CONSTS.layout.PANORAMA].indexOf(sp.galleryLayout) > -1 && !oneRow(sp) ,
  loadMoreAmount: sp => [GALLERY_CONSTS.layout.COLLAGE,  GALLERY_CONSTS.layout.MASONRY,  GALLERY_CONSTS.layout.GRID,  GALLERY_CONSTS.layout.PANORAMA].indexOf(sp.galleryLayout) > -1 && !oneRow(sp) && sp.enableInfiniteScroll, 
  magicLayoutSeed: sp => [GALLERY_CONSTS.layout.MAGIC].indexOf(sp.galleryLayout) > -1,
  scrollSnap: sp => isHorizontalLayout(sp),
  itemClick: sp => !isStore(sp),
  useWatermark: sp => canUseWatermark(sp),
  watermarkOpacity: sp => canUseWatermark(sp) && sp.useWatermark,
  watermarkSize: sp => canUseWatermark(sp) && sp.useWatermark,
  watermarkDock: sp => canUseWatermark(sp) && sp.useWatermark,
  allowDownload: always,
  allowSocial: always,
  loveButton: always,
  loveCounter: (sp) => sp.loveButton,
  itemOpacity: showColorOverlay,
  itemIconColorSlideshow: isSlideshowLayout,
  itemIconColor: sp => !isSlideshowLayout(sp),
  arrowsSize: isHorizontalLayout,
  arrowsColor: isHorizontalLayout,
  arrowsPosition: isHorizontalLayout, // && showOldGalleryFeaturesDesign,
  overlayAnimation:  sp => !isSlideshowLayout(sp) && !(sp.titlePlacement === GALLERY_CONSTS.placements.SHOW_ON_HOVER &&  sp.hoveringBehaviour === GALLERY_CONSTS.infoBehaviourOnHover.NO_CHANGE),
  imageHoverAnimation: sp => !isSlideshowLayout(sp),
  itemFont: sp => showTextSubSection(sp) && (sp.allowTitle && !(isSlideshowLayout(sp) || presentOuterInformation(sp))),
  itemFontColor: sp => showTextSubSection(sp) && (sp.allowTitle && !(isSlideshowLayout(sp) || presentOuterInformation(sp))),
  itemFontSlideshow: sp => showTextSubSection(sp) && (sp.allowTitle && (isSlideshowLayout(sp) || presentOuterInformation(sp))),
  itemFontColorSlideshow: sp => showTextSubSection(sp) && (sp.allowTitle && (isSlideshowLayout(sp) || presentOuterInformation(sp))),
  itemDescriptionFont: sp => showTextSubSection(sp) && (sp.allowDescription && !(isSlideshowLayout(sp) || presentOuterInformation(sp))),
  itemDescriptionFontColor: sp => showTextSubSection(sp) && (sp.allowDescription && !(isSlideshowLayout(sp) || presentOuterInformation(sp))),
  itemDescriptionFontSlideshow: sp => showTextSubSection(sp) && (sp.allowDescription && (isSlideshowLayout(sp) || presentOuterInformation(sp))),
  itemDescriptionFontColorSlideshow: sp => showTextSubSection(sp) && (sp.allowDescription && (isSlideshowLayout(sp) || presentOuterInformation(sp))),
  galleryHorizontalAlign: sp => showTextSubSection(sp), // ALSO sets galleryTextAlign ---sp => showTextSubSection(sp),
  galleryVerticalAlign: sp => showTextSubSection(sp) && showAlignTextVertical(sp),
  textBoxFillColor: sp => showTextSubSection(sp) && (!isSlideshowLayout(sp) && presentOuterInformation(sp) && (sp.infoType === GALLERY_CONSTS.infoType.ATTACHED_BACKGROUND || sp.infoType === GALLERY_CONSTS.infoType.SEPARATED_BACKGROUND)) ,
  calculateTextBoxHeightMode: sp => showTextSubSection(sp) && (!isSlideshowLayout(sp) && presentOuterInformation(sp)) ,
  textBoxHeight: sp => showTextSubSection(sp) && (!isSlideshowLayout(sp) && presentOuterInformation(sp) && sp.calculateTextBoxHeightMode === GALLERY_CONSTS.calculationOptions.MANUAL) ,
  textImageSpace: sp =>  showTextSubSection(sp) && (!isSlideshowLayout(sp) && presentOuterInformation(sp) && sp.infoType === GALLERY_CONSTS.infoType.SEPARATED_BACKGROUND)  ,
  textBoxBorderRadius: sp =>  showTextSubSection(sp) && (!isSlideshowLayout(sp) && presentOuterInformation(sp) && sp.infoType === GALLERY_CONSTS.infoType.SEPARATED_BACKGROUND)  ,
  textBoxBorderWidth: sp =>  showTextSubSection(sp) && (!isSlideshowLayout(sp) && presentOuterInformation(sp) && sp.infoType === GALLERY_CONSTS.infoType.SEPARATED_BACKGROUND)  ,
  textBoxBorderColor: sp =>  showTextSubSection(sp) && (!isSlideshowLayout(sp) && presentOuterInformation(sp) && sp.infoType === GALLERY_CONSTS.infoType.SEPARATED_BACKGROUND)  ,
  textsVerticalPadding: sp =>  showTextSubSection(sp) && (!isSlideshowLayout(sp) && (sp.titlePlacement !== GALLERY_CONSTS.placements.SHOW_ON_HOVER || !sp.galleryVerticalAlign === 'center')),
  textsHorizontalPadding: sp =>  showTextSubSection(sp) && (!isSlideshowLayout(sp)) ,
  titleDescriptionSpace: sp =>  showTextSubSection(sp) && (!isSlideshowLayout(sp) && sp.allowTitle && sp.allowDescription),
  useCustomButton: sp => showButtonSection(sp),
  customButtonText: sp => showButtonSection(sp) && sp.useCustomButton,
  customButtonFontForHover: sp => showButtonSection(sp) && sp.useCustomButton && isTitlePlacementAlwaysShown(sp),
  customButtonFontColorForHover: sp => showButtonSection(sp) && sp.useCustomButton && isTitlePlacementAlwaysShown(sp),
  customButtonFont: sp =>showButtonSection(sp) &&  sp.useCustomButton && !isTitlePlacementAlwaysShown(sp),
  customButtonFontColor: sp => showButtonSection(sp) && sp.useCustomButton && !isTitlePlacementAlwaysShown(sp),
  customButtonColor: sp => showButtonSection(sp) && sp.useCustomButton && !isTitlePlacementAlwaysShown(sp),
  customButtonBorderWidth: sp => showButtonSection(sp) && sp.useCustomButton && !isTitlePlacementAlwaysShown(sp),
  customButtonBorderColor: sp => showButtonSection(sp) && sp.useCustomButton && !isTitlePlacementAlwaysShown(sp),
  customButtonBorderRadius: sp => showButtonSection(sp) && sp.useCustomButton && !isTitlePlacementAlwaysShown(sp),
  loadMoreButtonText: sp => showButtonSection(sp) && showInfiniteScroll(sp) && !sp.enableInfiniteScroll ,
  loadMoreButtonFont: sp => showButtonSection(sp) && showInfiniteScroll(sp) && !sp.enableInfiniteScroll ,
  loadMoreButtonFontColor: sp => showButtonSection(sp) && showInfiniteScroll(sp) && !sp.enableInfiniteScroll ,
  loadMoreButtonColor: sp => showButtonSection(sp) && showInfiniteScroll(sp) && !sp.enableInfiniteScroll ,
  loadMoreButtonBorderWidth: sp => showButtonSection(sp) && showInfiniteScroll(sp) && !sp.enableInfiniteScroll ,
  loadMoreButtonBorderColor: sp => showButtonSection(sp) && showInfiniteScroll(sp) && !sp.enableInfiniteScroll , 
  loadMoreButtonBorderRadius: sp => showButtonSection(sp) && showInfiniteScroll(sp) && !sp.enableInfiniteScroll ,
  imageInfoType: sp => presentOuterInformation(sp) && showTexts(sp),
  itemBorderWidth: showItemBorderAndShadowConfig,
  itemBorderColor: showItemBorderAndShadowConfig,
  itemBorderRadius: showItemBorderAndShadowConfig,
  itemEnableShadow: showShadow,
  itemShadowOpacityAndColor: sp => showShadow(sp) && sp.itemEnableShadow,
  itemShadowBlur: sp => showShadow(sp) && sp.itemEnableShadow,
  itemShadowDirection: sp => showShadow(sp) && sp.itemEnableShadow,
  itemShadowSize: sp => showShadow(sp) && sp.itemEnableShadow,
  imageLoadingMode: always,
  imageLoadingColor: sp => sp.imageLoadingMode === GALLERY_CONSTS.loadingMode.COLOR,
  expandAnimation: sp => sp.itemClick === GALLERY_CONSTS.itemClick.EXPAND || isStore(sp),
  scrollAnimation: sp => showScrollAnimations(sp),
  oneColorAnimationColor: sp => showScrollAnimations(sp) && sp.scrollAnimation === GALLERY_CONSTS.scrollAnimations.ONE_COLOR,
  allowTitleExpand: sp => showExpendSection(sp),
  allowDescriptionExpand: sp => showExpendSection(sp),
  allowLinkExpand: sp => showExpendSection(sp),
  expandInfoPosition: sp => showExpendSection(sp) && !isStore(sp),
  defaultShowInfoExpand: sp => showExpendSection(sp) && sp.expandInfoPosition !== 1 && !isStore(sp),
  allowFullscreenExpand: sp => showExpendSection(sp) && !isStore(sp),
  fullscreenLoop: sp => showExpendSection(sp) && !isStore(sp),
  bgColorExpand: sp => showExpendSection(sp),
  actionsColorExpand: sp => showExpendSection(sp),
  titleFontExpand: sp => showExpendSection(sp) && sp.allowTitleExpand,
  titleColorExpand: sp => showExpendSection(sp) && sp.allowTitleExpand ,
  descriptionFontExpand: sp => showExpendSection(sp) && sp.allowDescriptionExpand,
  descriptionColorExpand: sp => showExpendSection(sp) && sp.allowDescriptionExpand,
  galleryAlignExpand: sp => showExpendSection(sp) && (sp.allowDescriptionExpand || sp.allowTitleExpand) && !isStore(sp),
  addToCartBackColorExpand: sp => showExpendSection(sp) && isStore(sp), 
  addToCartFontExpand: sp => showExpendSection(sp) && showAddToCartSection(sp) ,
  addToCartColorExpand: sp => showExpendSection(sp) && showAddToCartSection(sp),
  addToCartBorderWidth: sp => showExpendSection(sp) && showAddToCartSection(sp),
  addToCartBorderColor: sp => showExpendSection(sp) && showAddToCartSection(sp),
  addToCartButtonText: sp => showExpendSection(sp) && showAddToCartSection(sp),
  imageQuality: always,
  usmToggle: always,
  usm_a: sp => sp.usmToggle,
  usm_r: sp => sp.usmToggle,
  usm_t: sp => sp.usmToggle,
  videoPlay: always,
  videoSound: sp => sp.videoPlay !== GALLERY_CONSTS.videoPlay.ON_CLICK,
  videoSpeed: always,
  videoLoop: always
}
