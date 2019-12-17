import consts from '../../common/constants/index';

export default ({items, styles}) => {
    return items.length <= 100 &&
    items.every(item => isImage(item)) &&
    Object.entries(styles).every(([styleParams, value]) => isValidStyleParam(styleParams, value)) 
}

const isImage = item => {
  const meta = item.metadata || item.metaData;
  if (!meta.type || meta.type === 'image') return true;
  if (item.type === 'image') return true;
  if (!item.type === 'image') return true;
}

const isValidStyleParam = (styleParam, value) => {
  if (typeof handledStyleParams[styleParam] !== 'undefined') return true;
  if (typeof ignoredStyleParams[styleParam] !== 'undefined') return true;
  if (typeof fixedStyleParams[styleParam] !== 'undefined') return fixedStyleParams[styleParam] === value;
  return false;
}

const handledStyleParams = { //these styles can get any value, the lean gallery will handle them
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

const ignoredStyleParams = { //these params are not relevant when a lean gallery is rendered - the fixed styles will override them
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
  videoSound: false,
  videoSpeed: '1',
  videoLoop: true,

};

const fixedStyleParams = { //these params must be set to these exact values in order for the lean gallery to render well
  galleryLayout: [-1, 2],
  isVertical: true,
  oneRow: false,
  isRTL: false,
  titlePlacement: consts.placements.DONT_SHOW,
  groupSize: 1,
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
  bottomInfoHeight: 0,
  itemEnableShadow: false,
  usmToggle: false,

};

const defaultStyleParams = {
};

/*

gridStyle, 
numberOfImagesPerRow, 
imageMargin, 
gallerySizePx
cubeType,
itemBorderWidth: borderWidth,
itemBorderColor: borderColor,
itemBorderRadius: borderRadius
cubeRatio
*/