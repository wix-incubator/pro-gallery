import GALLERY_CONSTS from './constants';
const coreStyles = {
  //duplicated from lib
  layoutParams: { gallerySpacing: 0 },
  isRTL: false,
  isVertical: false,
  minItemSize: 120,
  groupSize: 3,
  chooseBestGroup: true,
  groupTypes: '1,2h,2v,3t,3b,3l,3r',
  cubeImages: false,
  cubeType: 'fill',
  smartCrop: false,
  fullscreen: true,
  videoLoop: true,
  videoSound: false,
  videoPlay: 'hover',
  videoSpeed: 1,
  numberOfImagesPerRow: 3,
  collageDensity: 0.8,
  galleryTextAlign: 'center',
  imageMargin: 10, // The renderer will do the /2 *2 for his pictures, the default is the margin between images (thats how it is in the settings menu. 50 = 50 between images)
  fixedColumns: 0, // determine the number of columns regardless of the screen size (use 0 to ignore)
  cropRatio: 1, // determine the ratio of the images when using grid (use 1 for squares grid)
  showArrows: true,
  hasThumbnails: false,
  isSlideshow: false,
  galleryThumbnailsAlignment: 'bottom',
  gridStyle: 0,
  titlePlacement: GALLERY_CONSTS.placements.SHOW_ON_HOVER,
  hoveringBehaviour: GALLERY_CONSTS.infoBehaviourOnHover.APPEARS,
  isAutoSlideshow: false,
  slideshowLoop: false,
  playButtonForAutoSlideShow: false,
  pauseAutoSlideshowOnHover: true,
  allowSlideshowCounter: false,
  autoSlideshowInterval: 4,
  arrowsSize: 23,
  slideshowInfoSize: 200,
  imageLoadingMode: GALLERY_CONSTS.loadingMode.BLUR,
  scrollAnimation: GALLERY_CONSTS.scrollAnimations.NO_EFFECT,
  overlayAnimation: GALLERY_CONSTS.overlayAnimations.NO_EFFECT,
  imageHoverAnimation: GALLERY_CONSTS.imageHoverAnimations.NO_EFFECT,
  itemBorderWidth: 0,
  itemBorderRadius: 0,
  itemEnableShadow: false,
  itemShadowBlur: 20,
  loadMoreAmount: 'all',
  itemShadowDirection: 135,
  itemShadowSize: 10,
  imageInfoType: GALLERY_CONSTS.infoType.NO_BACKGROUND,
  textBoxBorderRadius: 0,
  textBoxBorderWidth: 0,
  textBoxHeight: 200,
  textImageSpace: 10,
  scrollDirection: 0,
  slideAnimation: GALLERY_CONSTS.slideAnimations.SCROLL,
  jsonStyleParams: '',
  autoSlideshowType: GALLERY_CONSTS.autoSlideshowTypes.INTERVAL,
  autoSlideshowContinuousSpeed: 200,
  //duplicated from lib
  overlayPosition: GALLERY_CONSTS.overlayPositions.LEFT,
  overlaySize: 100,
  overlaySizeType: GALLERY_CONSTS.overlaySizeType.PERCENT,
  overlayPadding: 0,
};

export default coreStyles;
