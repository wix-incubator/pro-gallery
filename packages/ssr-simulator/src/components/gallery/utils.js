import { GALLERY_CONSTS as Consts } from 'pro-gallery';

export const defaultStyleParams = {
  isRTL: false,
  isVertical: 0,
  gallerySize: 30,
  minItemSize: 120,
  chooseBestGroup: true,
  groupSize: 3,
  groupTypes: '1,2h,2v,3t,3b,3l,3r',
  rotatingGroupTypes: '',
  collageDensity: 0.8, //80, // should be 0.8 after
  cubeImages: false,
  cubeType: 'fill',
  cubeRatio: 1,
  cropOnlyFill: false,
  smartCrop: false,
  rotatingCubeRatio: '',
  galleryImageRatioFromWix: 1, //galleryImageRatio translates to galleryImageRatioFromWix
  fixedColumns: 0,
  numberOfImagesPerRow: 3,
  numberOfImagesPerCol: 1,
  groupsPerStrip: 0,
  imageMargin: 10,
  galleryMargin: 0,
  scatter: 0,
  rotatingScatter: '',
  gridStyle: 0,
  placeGroupsLtr: false,
  showArrows: false,
  enableInfiniteScroll: true,
  thumbnailSpacings: 4,
  galleryThumbnailsAlignment: Consts.thumbnailsAlignment.bottom,
  enableScroll: true,
  hasThumbnails: false,
  isGrid: false,
  isSlider: false,
  isColumns: false,
  isMasonry: false,
  isSlideshow: false,
  isAutoSlideshow: false,
  slideshowLoop: false,
  autoSlideshowInterval: 4,
  autoSlideshowSpeed: 4,
  autoSlideshowType: Consts.autoSlideshowType.INTERVAL,
  titlePlacement: Consts.placements.SHOW_ON_HOVER,
  galleryTextAlign: 'center',
  scrollSnap: false,
  itemClick: Consts.itemClick.EXPAND,
  fullscreen: true,
  videoPlay: Consts.videoPlay.HOVER,
  scrollAnimation: Consts.scrollAnimations.NO_EFFECT,
  scrollDirection: Consts.scrollDirection.VERTICAL,
  overlayAnimation: Consts.overlayAnimations.NO_EFFECT,
  arrowsPosition: 0,
  arrowsVerticalPosition: Consts.arrowsVerticalPosition.ITEM_CENTER,
  arrowsSize: 23,
  arrowsPadding: 23,
  loadMoreAmount: Consts.loadMoreAmount.ALL,
  // bgColorExpand: color-1
  // actionsColorExpand: color-5
  // titleFontExpand: font_5
  // titleColorExpand: color-5
  // descriptionFontExpand: font_8
  // descriptionColorExpand: color-5,
  // addToCartBackColorExpand: color-5,
  // addToCartFontExpand: font-8
  // addToCartColorExpand: color-1
  //addToCartBorderColor: color-5,
  slideshowInfoSize: 200,
  playButtonForAutoSlideShow: false,
  allowSlideshowCounter: false,
  hoveringBehaviour: Consts.infoBehaviourOnHover.APPEARS,
  thumbnailSize: 120,
  magicLayoutSeed: 1,
  //itemOpacity:'color-5', startWithOpacity: 0.60,
  //itemIconColorSlideshow: 'color-5'
  // itemIconColor: color-1
  // arrowsColor: 'color-1'
  imageHoverAnimation: Consts.imageHoverAnimations.NO_EFFECT,
  // itemFont: 'font_5'  // startWithSize: 22,
  // itemFontColor: 'color-1'
  // itemFontSlideshow:'font_5' // startWithSize: 22,
  // itemFontColorSlideshow: 'color-5'
  // itemDescriptionFont: 'font_8' // startWithSize: 15
  // itemDescriptionFontColor: 'color-1'
  // itemDescriptionFontSlideshow: 'font_8' // startWithSize: 15
  // itemDescriptionFontColorSlideshow: 'color-5'
  // textBoxFillColor: 'color-2', //startWithOpacity: 1,
  textBoxHeight: 200,
  textImageSpace: 10,
  textBoxBorderRadius: 0,
  textBoxBorderWidth: 0,
  loadMoreButtonText: '',
  //loadMoreButtonFont: font_8
  // loadMoreButtonFontColor: color-5
  // loadMoreButtonColor: startWithOpacity: '1', startWithColor: 'color-1'
  // loadMoreButtonBorderColor:  startWithColor: 'color-5'
  imageInfoType: Consts.infoType.NO_BACKGROUND,
  itemBorderWidth: 0,
  // itemBorderColor: 'color-5'
  itemBorderRadius: 0,
  itemEnableShadow: false,
  // itemShadowOpacityAndColor: startWithColor: 'color-5', startWithOpacity: 0.2
  itemShadowBlur: 20,
  itemShadowDirection: 135,
  itemShadowSize: 10,
  imageLoadingMode: Consts.loadingMode.BLUR,
  // imageLoadingColor: startWithColor: 'color-3'
  // oneColorAnimationColor: startWithColor: 'color-1',
  videoSound: false,
  videoSpeed: '1',
  videoLoop: true,
};

export function formatValue(val) {
  if (!isNaN(Number(val))) {
    return Number(val);
  } else if (val === 'true') {
    return true;
  } else if (val === 'false') {
    return false;
  }
  if (val === 'undefined') {
    return undefined;
  } else {
    return String(val);
  }
}

export function getStyleParamsFromUrl(searchString) {
  try {
    const styleParams = searchString
      .replace('?', '')
      .split('&')
      .map((styleParam) => styleParam.split('='))
      .reduce(
        (obj, [styleParam, value]) =>
          Object.assign(obj, { [styleParam]: formatValue(value) }),
        {}
      );
    return styleParams;
  } catch (e) {
    return {};
  }
}

export function mixAndSlice(array, length, seed) {
  const numFromId = (id) => Number(id.replace(/\D/g, '')) % Number(seed || 1);

  return array
    .sort((itm1, itm2) => numFromId(itm1.itemId) - numFromId(itm2.itemId))
    .slice(0, length)
    .map((item, idx) => ({
      ...item,
      metadata: {
        ...item.metadata,
        title: `Item #${idx}`,
      },
    }));
}
