const styleParams = {
  titlePlacement: 'SHOW_ON_HOVER',
  hoveringBehaviour: 'NO_CHANGE',
  galleryLayout: 2,
  scrollDirection: 1,
  numberOfImagesPerRow: 3,
  numberOfImagesPerCol: 2,
  isRTL: false,
  isVertical: false,
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
  fixedColumns: 0,
  groupsPerStrip: 0,
  imageMargin: 10,
  galleryMargin: 0,
  scatter: 0,
  rotatingScatter: '',
  gridStyle: 0,
  placeGroupsLtr: false,
  showArrows: true,
  enableInfiniteScroll: true,
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
  arrowsVerticalPosition: 'ITEM_CENTER',
  arrowsSize: 23,
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
  pauseAutoSlideshowOnHover: true,
  allowSlideshowCounter: false,
  galleryThumbnailsAlignment: 'bottom',
  thumbnailSize: 250,
  magicLayoutSeed: 1,
  //itemOpacity:'color-5', startWithOpacity: 0.60,
  //itemIconColorSlideshow: 'color-5'
  // itemIconColor: color-1
  // arrowsColor: 'color-1'
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
  // textBoxBorderColor: color-5,
  loadMoreButtonText: '',
  //loadMoreButtonFont: font_8
  // loadMoreButtonFontColor: color-5
  // loadMoreButtonColor: startWithOpacity: '1', startWithColor: 'color-1'
  // loadMoreButtonBorderColor:  startWithColor: 'color-5'
  itemBorderWidth: 0,
  // itemBorderColor: 'color-5'
  itemBorderRadius: 0,
  itemEnableShadow: false,
  // itemShadowOpacityAndColor: startWithColor: 'color-5', startWithOpacity: 0.2
  itemShadowBlur: 20,
  itemShadowDirection: 135,
  itemShadowSize: 10,
  // imageLoadingColor: startWithColor: 'color-3'
  // oneColorAnimationColor: startWithColor: 'color-1',
  videoSound: false,
  videoSpeed: '1',
  videoLoop: true,
  shouldIndexDirectShareLinkInSEO: true,
};

const container = {
  width: 1150,
  height: 850,
  scrollBase: 0,
};

const customRenderers = {
  customHoverRenderer: () => {},
  customInfoRenderer: () => {},
  customSlideshowInfoRenderer: () => {},
};

export { container, styleParams, customRenderers };
