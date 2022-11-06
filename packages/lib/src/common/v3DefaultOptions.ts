import GALLERY_CONSTS from './constants';

const v3DefaultOptions = {
  layoutParams: {
    structure: {
      galleryRatio: {
        includeExternalInfo: false,
        value: 0,
      },
    },
    thumbnails: {
      position: 'OUTSIDE_GALLERY',
    },
    gallerySpacing: 0,
    cropRatio: 1, // determine the ratio of the images when using grid (use 1 for squares grid)
    repeatingGroupTypes: '',
    navigationArrows: {
      type: GALLERY_CONSTS.arrowsType.DEFAULT_ARROW,
      container: {
        type: GALLERY_CONSTS.arrowsContainerStyleType.SHADOW,
        backgroundColor: 'rgba(0,0,0,0)',
        borderRadius: 0,
      },
    },
  },
  behaviourParams: {
    item: {
      secondaryMedia: {
        behaviour: 'APPEARS',
        trigger: 'OFF',
      },
    },
  },
  galleryMargin: 0,
  cubeRatio: 1,
  rotatingGroupTypes: '',
  galleryLayout: -1,
  gallerySizePx: 0,
  gallerySizeRatio: 0,
  gallerySizeType: 'smart',
  itemShadowOpacityAndColor: '',
  arrowsColor: '',
  textBoxBorderColor: '',
  itemBorderColor: '',
  allowContextMenu: false,
  showVideoPlayButton: false,
  gallerySize: 30,
  cropOnlyFill: false,
  rotatingCropRatios: '',
  columnWidths: '',
  numberOfImagesPerCol: 1,
  groupsPerStrip: 0,
  scatter: 0,
  rotatingScatter: '',
  placeGroupsLtr: false,
  enableInfiniteScroll: true,
  thumbnailSpacings: 4,
  enableScroll: true,
  scrollSnap: false,
  itemClick: 'nothing',
  slideAnimation: 'SCROLL',
  scrollDuration: 400,
  arrowsPosition: 0,
  arrowsVerticalPosition: 'ITEM_CENTER',
  arrowsPadding: 23,
  thumbnailSize: 120,
  imagePlacementAnimation: 'NO_EFFECT',
  calculateTextBoxWidthMode: 'PERCENT',
  textBoxWidth: 200,
  textBoxWidthPercent: 50,
  loadMoreButtonText: '',
  showVideoControls: false,
  shouldIndexDirectShareLinkInSEO: true,
  slideTransition: 'cubic-bezier(0.46,0.1,0.25,1)',
  useMaxDimensions: false,
  enableVideoPlaceholder: true,
  overlayPosition: 'LEFT',
  overlaySize: 100,
  overlaySizeType: 'PERCENT',
  overlayPadding: 0,
  cubeFitPosition: 'MIDDLE',

  isRTL: false,
  isVertical: false,
  minItemSize: 120,
  groupSize: 3,
  chooseBestGroup: true,
  groupTypes: '1,2h,2v,3t,3b,3l,3r',
  cubeImages: false,
  cubeType: 'fill',
  smartCrop: false,
  videoLoop: true,
  videoSound: false,
  videoPlay: 'hover',
  videoSpeed: '1',
  numberOfImagesPerRow: 3,
  collageDensity: 0.8,
  galleryTextAlign: 'center',
  imageMargin: 10, // The renderer will do the /2 *2 for his pictures, the default is the margin between images (thats how it is in the settings menu. 50 = 50 between images)
  fixedColumns: 0, // determine the number of columns regardless of the screen size (use 0 to ignore)
  showArrows: true,
  hasThumbnails: false,
  galleryThumbnailsAlignment: 'bottom',
  gridStyle: 0,
  titlePlacement: 'SHOW_ON_HOVER',
  hoveringBehaviour: 'APPEARS',
  isAutoSlideshow: false,
  slideshowLoop: false,
  playButtonForAutoSlideShow: false,
  pauseAutoSlideshowOnHover: true,
  allowSlideshowCounter: false,
  autoSlideshowInterval: 4,
  arrowsSize: 23,
  slideshowInfoSize: 200,
  imageLoadingMode: 'BLUR',
  scrollAnimation: 'NO_EFFECT',
  overlayAnimation: 'NO_EFFECT',
  imageHoverAnimation: 'NO_EFFECT',
  itemBorderWidth: 0,
  itemBorderRadius: 0,
  itemEnableShadow: false,
  itemShadowBlur: 20,
  loadMoreAmount: 'all',
  itemShadowDirection: 135,
  itemShadowSize: 10,
  imageInfoType: 'NO_BACKGROUND',
  textBoxBorderRadius: 0,
  textBoxBorderWidth: 0,
  textBoxHeight: 200,
  textImageSpace: 10,
  scrollDirection: 0,
  autoSlideshowType: 'interval',
  autoSlideshowContinuousSpeed: 200,
  //duplicated from lib
  magnificationLevel: 2,
  magicLayoutSeed: 1,
};
export default v3DefaultOptions;
