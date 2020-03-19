import Consts from './constants';

//this is the one place for the default styles !!!

export default {
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
    gallerySliderImageRatio: 16 / 9,
    fixedColumns: 0,
    numberOfImagesPerRow: 3,
    numberOfImagesPerCol: 1,
    groupsPerStrip: 0,
    borderRadius: 0,
    boxShadow: 0,
    imageMargin: 10,
    galleryMargin: 0,
    floatingImages: 0,
    gridStyle: 0,
    mobilePanorama: false,
    placeGroupsLtr: false,
    viewMode: 'preview',
    oneRow: false,
    showArrows: true,
    enableInfiniteScroll: true,
    thumbnailSpacings: 4,
    galleryThumbnailsAlignment: Consts.thumbnailsAlignment.BOTTOM,
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
    useCustomButton: false,
    bottomInfoHeight: 0,
    titlePlacement: Consts.placements.SHOW_ON_HOVER,
    galleryHorizontalAlign: Consts.horizontalAlign.CENTER,
    galleryTextAlign: 'center',
    galleryVerticalAlign: Consts.verticalAlign.CENTER,
    scrollSnap: false,
    itemClick: Consts.itemClick.EXPAND,
    fullscreen: true,
    allowSocial: true,
    allowDownload: false,
    allowTitle: true,
    allowDescription: false,
    loveButton: true,
    loveCounter: false,
    videoPlay: Consts.videoPlay.HOVER,
    scrollAnimation:  Consts.scrollAnimations.NO_EFFECT,
    scrollDirection: 0,
    overlayAnimation: Consts.overlayAnimations.NO_EFFECT,
    arrowsPosition: 0,
    arrowsSize: 23,
    watermarkOpacity: 40,
    watermarkSize: 40,
    useWatermark: true,
    watermarkDock: Consts.watermarkDock.RIGHT_DOWN,
    loadMoreAmount: Consts.loadMoreAmount.ALL,
    defaultShowInfoExpand: 1,
    allowTitleExpand: true,
    allowDescriptionExpand: true,
    allowLinkExpand: true,
    expandInfoPosition: 0,
    allowFullscreenExpand: true,
    fullscreenLoop: false,
    // bgColorExpand: color-1
    // actionsColorExpand: color-5
    // titleFontExpand: font_5
    // titleColorExpand: color-5
    // descriptionFontExpand: font_8
    // descriptionColorExpand: color-5,
    galleryAlignExpand: 'left',
    // addToCartBackColorExpand: color-5,
    // addToCartFontExpand: font-8
    // addToCartColorExpand: color-1
    addToCartBorderWidth: 1,
    //addToCartBorderColor: color-5,
    addToCartButtonText: '',
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
    calculateTextBoxHeightMode: Consts.textBoxHeightCalculationOptions.AUTOMATIC,
    calculateTextBoxWidthMode: Consts.textBoxWidthCalculationOptions.PERCENT,
    textBoxHeight: 200,
    textBoxWidth: 200,
    textBoxWidthPercent: 50,
    textImageSpace: 10,
    textBoxBorderRadius: 0,
    textBoxBorderWidth: 0,
    // textBoxBorderColor: color-5,
    textsVerticalPadding: 0,
    textsHorizontalPadding: 0,
    titleDescriptionSpace: 6,
    customButtonText: '',
    // customButtonFontForHover: 'font_8', startWithSize: 15
    // customButtonFontColorForHover: color-5
    // customButtonFont: 'font_8', startWithSize: 15
    // customButtonFontColor: color-1'
    // customButtonColor: startWithOpacity: '0', startWithColor: 'color-1'
    customButtonBorderWidth: 1,
    // customButtonBorderColor: startWithColor: 'color-1'
    customButtonBorderRadius: 0,
    loadMoreButtonText: '',
    //loadMoreButtonFont: font_8
    // loadMoreButtonFontColor: color-5
    // loadMoreButtonColor: startWithOpacity: '1', startWithColor: 'color-1'
    loadMoreButtonBorderWidth: 1,
    // loadMoreButtonBorderColor:  startWithColor: 'color-5'
    loadMoreButtonBorderRadius: 0,
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
    expandAnimation: Consts.expandAnimations.NO_EFFECT,
    // oneColorAnimationColor: startWithColor: 'color-1',
    imageQuality: 90,
    usmToggle: false,
    usm_a: 0,
    usm_r: 0,
    usm_t: 0,
    videoSound: false,
    videoSpeed: '1',
    videoLoop: true,
  };
