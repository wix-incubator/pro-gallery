import consts from '../../../common/constants/index';
import { addLayoutStyles } from '../../helpers/layoutHelper';

//example: http://pro-gallery.surge.sh/?titlePlacement=DONT_SHOW&itemClick=nothing&allowTitle=true&allowHover=false&galleryLayout=2&allowLeanGallery=true

export default ({items, styles, options}) => {

    styles = {...styles, ...options};

    const allowLeanGallery = !!styles.allowLeanGallery;
    
    if (!allowLeanGallery) {
      return false;
    }
    if (items.length > 25) {
      console.log(`[LEAN GALLERY] NOT ALLOWED - more than 25 items`, items.length);
      return false;
    }
    for (const item of items) {
      if (!isImage(item)) {
        console.log(`[LEAN GALLERY] NOT ALLOWED - an item that is not an image`, item);
        return false;
      }
    }
    const fullStyles = addLayoutStyles(styles);
    for (const [styleParam, value] of Object.entries(fullStyles)) {
      if (!isValidStyleParam(styleParam, value)) {
        console.log(`[LEAN GALLERY] NOT ALLOWED - invalid styleParam`, styleParam, value);
        return false;
      }
    }

    console.log(`[LEAN GALLERY] ALLOWED!`, fullStyles);
    return true;
    
}

const isImage = item => {
  const meta = item.metadata || item.metaData;
  const isImageItem = !!(
    (!meta.type || meta.type === 'image') &&
    (item.url || item.mediaUrl || item.src)
  );
  return isImageItem;
}

const isValidStyleParam = (styleParam, value) => {
  if (typeof handledStyleParams[styleParam] !== 'undefined') return true;
  if (typeof ignoredStyleParams[styleParam] !== 'undefined') return true;
  if (typeof fixedStyleParams[styleParam] !== 'undefined') {
    const sp = fixedStyleParams[styleParam];
    if (sp && sp.length > 0) {
      return sp.includes(value);
    } else {
      return sp === value;
    }
  }
  if (value === undefined || value === null) return true;
  return false;
}

//these styles can get any value, the lean gallery will handle them
const handledStyleParams = { 
  numberOfImagesPerRow: 3,
  gallerySize: 30,
  cubeType: 'fill',
  cubeRatio: 1,
  fixedColumns: 0,
  borderRadius: 0,
  imageMargin: 10,
  gridStyle: 0,
  itemBorderWidth: 0,
  itemBorderRadius: 0,
  imageQuality: 90,
};

//these params are not relevant when a lean gallery is rendered - the fixed styles will override them
const ignoredStyleParams = { 
  galleryType: null,
  collageAmount: 0,
  numberOfImagesPerCol: 2,
  minItemSize: 120,
  chooseBestGroup: true,
  groupTypes: '1,2h,2v,3t,3b,3l,3r',
  collageDensity: 0.8, //80, // should be 0.8 after
  cropOnlyFill: false,
  gallerySliderImageRatio: 16 / 9,
  groupsPerStrip: 0,
  showArrows: false,
  viewMode: 'preview',
  thumbnailSpacings: 4,
  enableScroll: true,
  hasThumbnails: true,
  isGrid: false,
  isSlider: false,
  isColumns: false,
  isMasonry: false,
  isSlideshow: false,
  isAutoSlideshow: false,
  slideshowLoop: false,
  autoSlideshowInterval: 4,
  galleryTextAlign: 'center',
  scrollSnap: false,
  fullscreen: true,
  allowSocial: true,
  allowDownload: false,
  allowTitle: true,
  allowDescription: false,
  allowHover: true,
  loveButton: true,
  loveCounter: false,
  arrowsPosition: 0,
  arrowsSize: 23,
  defaultShowInfoExpand: 1,
  allowTitleExpand: true,
  allowDescriptionExpand: true,
  allowLinkExpand: true,
  expandInfoPosition: 0,
  allowFullscreenExpand: true,
  fullscreenLoop: false,
  galleryAlignExpand: 'left',
  slideshowInfoSize: 200,
  playButtonForAutoSlideShow: false,
  allowSlideshowCounter: false,
  galleryThumbnailsAlignment: 'bottom',
  thumbnailSize: 250,
  magicLayoutSeed: 1,
  textBoxHeight: 200,
  textImageSpace: 10,
  textBoxBorderRadius: 0,
  textBoxBorderWidth: 0,
  textsVerticalPadding: 0,
  textsHorizontalPadding: 0,
  titleDescriptionSpace: 6,
  customButtonText: '',
  customButtonBorderWidth: 1,
  customButtonBorderRadius: 0,
  loadMoreButtonText: '',
  loadMoreButtonBorderWidth: 1,
  loadMoreButtonBorderRadius: 0,
  itemShadowBlur: 20,
  itemShadowDirection: 135,
  itemShadowSize: 10,
  usm_a: 0,
  usm_r: 0,
  usm_t: 0,
  videoPlay: 'hover',
  videoSound: false,
  videoSpeed: '1',
  videoLoop: true,
  galleryHorizontalAlign: 'center',
  galleryVerticalAlign: 'center',
  overlayAnimation: consts.overlayAnimations.NO_EFFECT,
  watermarkOpacity: 40,
  watermarkSize: 40,
  useWatermark: false,
  watermarkDock: null,
  loadMoreAmount: 'all',
  addToCartBorderWidth: 1,
  imageLoadingMode: consts.loadingMode.BLUR,
  calculateTextBoxHeightMode: consts.calculationOptions.AUTOMATIC,
  hoveringBehaviour: consts.infoBehaviourOnHover.APPEARS,
  expandAnimation: consts.expandAnimations.NO_EFFECT,
  imageHoverAnimation: consts.imageHoverAnimations.NO_EFFECT,
  selectedLayout: '',
  layoutsVersion: 2,
  selectedLayoutV2: 2,
  isSlideshowFont: false,
  addToCartButtonText: '',
  imageInfoType: consts.infoType.NO_BACKGROUND
};

//these params must be set to these exact values in order for the lean gallery to render well
const fixedStyleParams = { 
  allowLeanGallery: true,
  galleryLayout: [-1, 2],
  isVertical: true,
  oneRow: false,
  isRTL: false,
  scrollDirection: [0, undefined],
  groupSize: 1,
  allowHover: false,
  rotatingGroupTypes: '',
  cubeImages: true,
  smartCrop: false,
  rotatingCubeRatio: '',
  boxShadow: 0,
  galleryMargin: 0,
  floatingImages: 0,
  placeGroupsLtr: false,
  mobilePanorama: false,
  enableInfiniteScroll: true,
  useCustomButton: false,
  externalInfoHeight: 0,
  bottomInfoHeight: 0,
  itemEnableShadow: false,
  usmToggle: false,
  itemClick: consts.itemClick.NOTHING,
  scrollAnimation: consts.scrollAnimations.NO_EFFECT,
  titlePlacement: consts.placements.DONT_SHOW,
};
