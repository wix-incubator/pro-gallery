import GALLERY_CONSTS from '../../../common/constants/index';
import {isVerticalPlacement} from '../../../common/constants/placements';
import { fixedStyles } from '../presets/gridGallery';
//example: http://pro-gallery.surge.sh/?titlePlacement=DONT_SHOW&itemClick=nothing&allowHover=false&galleryLayout=2&allowLeanGallery=true

export const notEligibleReasons = ({items, styles}) => {
  const s = {...styles, ...fixedStyles, allowLeanGallery: true};
  const res = [];
  if (String(styles.galleryLayout) !== '2') {
    res.push('not a Grid layout');
  }
  if (items.length > MAX_ITEMS_COUNT) {
    res.push(`more than ${MAX_ITEMS_COUNT} items`);
  }
  for (const item of items) {
    if (!isImage(item)) {
      res.push(`at least one item is not an image`);
    }
  }
  for (const [styleParam, value] of Object.entries(s)) {
    if (!isValidStyleParam(styleParam, value, s)) {
      res.push(`invalid style: ${styleParam} => ${value}`);
    }
  }

  return res;
}

export default ({items, styles}) => {

    const allowLeanGallery = !!styles.allowLeanGallery;

    if (!allowLeanGallery) {
      return false;
    }
    if (items.length > MAX_ITEMS_COUNT) {
      console.log(`[LEAN GALLERY] NOT ALLOWED - more than ${MAX_ITEMS_COUNT} items`, items.length);
      return false;
    }
    for (const item of items) {
      if (!isImage(item)) {
        console.log(`[LEAN GALLERY] NOT ALLOWED - an item that is not an image`, item);
        return false;
      }
    }
    for (const [styleParam, value] of Object.entries(styles)) {
      if (!isValidStyleParam(styleParam, value, styles)) {
        console.log(`[LEAN GALLERY] NOT ALLOWED - invalid styleParam`, styleParam, value);
        return false;
      }
    }

    console.log(`[LEAN GALLERY] ALLOWED!`, styles);
    return true;

}

const MAX_ITEMS_COUNT = 25;

const isImage = item => {
  const meta = item.metadata || item.metaData;
  const isImageItem = !!(
    (!meta.type || meta.type === 'image') &&
    (item.url || item.mediaUrl || item.src)
  );
  return isImageItem;
}

const isValidStyleParam = (styleParam, value, allStyles) => {
  if (typeof handledStyleParams[styleParam] !== 'undefined') return true;
  // if (typeof ignoredStyleParams[styleParam] !== 'undefined') return true;
  if (typeof fixedStyleParams[styleParam] !== 'undefined') {
    const sp = fixedStyleParams[styleParam];
    if (sp && typeof sp === 'function') {
      return sp(allStyles);
    } else if (sp && sp.length > 0) {
      return sp.includes(value);
    } else {
      return sp === value;
    }
  }
  return true;
}

//these styles can get any value, the lean gallery will handle them
const handledStyleParams = {
  numberOfImagesPerRow: 3,
  gallerySizeType: 'smart',
  gallerySizeRatio: 1,
  gallerySizePx: 300,
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
  textBoxHeight: 200,
};

//these params are not relevant when a lean gallery is rendered - the fixed styles will override them
/*
const ignoredStyleParams = {
  gotStyleParams: true,
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
  arrowsPosition: 0,
  arrowsSize: 23,
  defaultShowInfoExpand: 1,
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
  textImageSpace: 10,
  textBoxBorderRadius: 0,
  textBoxBorderWidth: 0,
  textsVerticalPadding: 0,
  textsHorizontalPadding: 0,
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
  overlayAnimation: GALLERY_CONSTS.overlayAnimations.NO_EFFECT,
  watermarkOpacity: 40,
  watermarkSize: 40,
  useWatermark: false,
  watermarkDock: null,
  loadMoreAmount: 'all',
  addToCartBorderWidth: 1,
  imageLoadingMode: GALLERY_CONSTS.loadingMode.BLUR,
  hoveringBehaviour: GALLERY_CONSTS.infoBehaviourOnHover.APPEARS,
  expandAnimation: GALLERY_CONSTS.expandAnimations.NO_EFFECT,
  imageHoverAnimation: GALLERY_CONSTS.imageHoverAnimations.NO_EFFECT,
  selectedLayout: '',
  layoutsVersion: 2,
  selectedLayoutV2: 2,
  isSlideshowFont: false,
  addToCartButtonText: '',
  imageInfoType: GALLERY_CONSTS.infoType.NO_BACKGROUND,
  galleryImageRatio: 2,
  sharpParams: {},
  itemBorderColor: {},
};
*/

//these params must be set to these exact values in order for the lean gallery to render well
const fixedStyleParams = {
  allowLeanGallery: true,
  galleryLayout: [-1, 2],
  isVertical: true,
  oneRow: false,
  isRTL: false,
  scrollDirection: [0, undefined],
  groupSize: 1,
  hoveringBehaviour: [GALLERY_CONSTS.infoBehaviourOnHover.NEVER_SHOW, GALLERY_CONSTS.infoBehaviourOnHover.APPEARS],
  rotatingGroupTypes: '',
  cubeImages: true,
  smartCrop: false,
  rotatingCubeRatio: '',
  boxShadow: 0,
  galleryMargin: 0,
  floatingImages: 0,
  placeGroupsLtr: false,
  mobilePanorama: false,
  enableInfiniteScroll: [true, 1],
  useCustomButton: false,
  itemEnableShadow: false,
  itemClick: [GALLERY_CONSTS.itemClick.NOTHING, GALLERY_CONSTS.itemClick.LINK, GALLERY_CONSTS.itemClick.FULLSCREEN, GALLERY_CONSTS.itemClick.EXPAND],
  scrollAnimation: GALLERY_CONSTS.scrollAnimations.NO_EFFECT,
  titlePlacement: sp => isVerticalPlacement(sp.titlePlacement) || sp.hoveringBehaviour === GALLERY_CONSTS.infoBehaviourOnHover.NEVER_SHOW,
};
