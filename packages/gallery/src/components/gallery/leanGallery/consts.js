import { GALLERY_CONSTS } from 'pro-gallery-lib';

//these styles can get any value, the lean gallery will handle them
export const handledStyleParams = {
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
  
//these params must be set to these exact values in order for the lean gallery to render well
export const fixedStyleParams = {
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
  itemEnableShadow: false,
  itemClick: [GALLERY_CONSTS.itemClick.NOTHING, GALLERY_CONSTS.itemClick.LINK, GALLERY_CONSTS.itemClick.FULLSCREEN, GALLERY_CONSTS.itemClick.EXPAND],
  scrollAnimation: GALLERY_CONSTS.scrollAnimations.NO_EFFECT,
  titlePlacement: sp => GALLERY_CONSTS.isVerticalPlacement(sp.titlePlacement) || sp.hoveringBehaviour === GALLERY_CONSTS.infoBehaviourOnHover.NEVER_SHOW,
  imageHoverAnimation: GALLERY_CONSTS.imageHoverAnimations.NO_EFFECT,
  loveButton: false,
  loveCounter: false,
  allowDownload: false,
  allowSocial: false,
  isAccessible: false
};
