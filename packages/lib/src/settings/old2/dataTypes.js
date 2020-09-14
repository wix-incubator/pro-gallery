


import {INPUT_TYPES, GALLERY_CONSTS} from './consts';

const formatTitle = title => title.replace(/_/g, ' ').split(' ').map(word => word[0].toUpperCase() + word.substr(1).toLowerCase()).join(' ');
const createOptions = constName => Object.entries(GALLERY_CONSTS[constName]).map(([title, value]) => ({ value, title: formatTitle(title) }));

export default {
  allowLeanGallery: {
    type: INPUT_TYPES.BOOLEAN,
  },
  isStore: {
    type: INPUT_TYPES.BOOLEAN,
    alert: 'MOCK PARAM',
  },
  showAddToCartSection: {
    type: INPUT_TYPES.BOOLEAN,
    alert: 'MOCK PARAM',
  },
  canUseWatermark: {
    type: INPUT_TYPES.BOOLEAN,
    alert: 'MOCK PARAM',
  },

  galleryLayout: {
    type: INPUT_TYPES.OPTIONS,
    options: createOptions('layout')
  },
  slideshowLoop: {
    type: INPUT_TYPES.BOOLEAN,
  },
  isAutoSlideshow: {
    type: INPUT_TYPES.BOOLEAN,
  },
  autoSlideshowInterval: {
    type: INPUT_TYPES.NUMBER,
    min: 2,
    max: 30,
  },
  slideshowInfoSize: {
    type: INPUT_TYPES.NUMBER,
    min: 0,
    max: 500,
  },
  playButtonForAutoSlideShow: {
    type: INPUT_TYPES.BOOLEAN,
  },
  scrollDirection: {
    type: INPUT_TYPES.OPTIONS,
    options: [
      { value: 0, title: "Vertical" },
      { value: 1, title: "Horizontal" }
    ],
    alert: 'should be "oneRow" instead of "scrollDirection" - but the clientlib and renderer uses both parameters\n Also if "oneRow" - "isVertical" should be set to false - maybe add it to not relevant',
  },
  isVertical: {
    type: INPUT_TYPES.OPTIONS,
    options: [{ value: false, title: "Rows" }, { value: true, title: "Columns" }],
  },
  isRTL: {
    type: INPUT_TYPES.OPTIONS,
    options: [{ value: false, title: "Left to Right" }, { value: true, title: "Right to Left" }],
  },
  allowSlideshowCounter: {
    type: INPUT_TYPES.BOOLEAN,
  },
  titlePlacement: {
    type: INPUT_TYPES.OPTIONS,
    options: createOptions('placements')
  },
  hoveringBehaviour: {
    type: INPUT_TYPES.OPTIONS,
    options: createOptions('infoBehaviourOnHover')
  },
  cubeImages: {
    type: INPUT_TYPES.BOOLEAN,
  },
  cubeType: {
    type: INPUT_TYPES.OPTIONS,
    options: [{ value: GALLERY_CONSTS.cubeType.CROP, title: "Crop" }, { value: GALLERY_CONSTS.cubeType.FIT, title: "Fit" }],
    alert: " this sets cubeType, cubeImages -> check proGalleryStyleBuilder",
  },
  cubeRatio: {
    type: INPUT_TYPES.TEXT,
  },
  gallerySliderImageRatio: {
    type: INPUT_TYPES.OPTIONS,
    options: [
      { value: 16 / 9, title: "16:9" },
      { value: 4 / 3, title: "4:3" },
      { value: 1, title: "1:1" },
      { value: 3 / 4, title: "3:4" },
      { value: 9 / 16, title: "9:16" }
    ],
    alert: 'is "cubeRatio" is undefined (a value that is only in wixers) that this is set to a default value of 16/9',
  },
  galleryThumbnailsAlignment: {
    type: INPUT_TYPES.OPTIONS,
    options: createOptions('thumbnailsAlignment')
  },
  thumbnailSize: {
    type: INPUT_TYPES.NUMBER,
    min: 80,
    max: 300,
  },
  gridStyle: {
    type: INPUT_TYPES.OPTIONS,
    options: [
      { value: 0, title: "Fit To Screen" },
      { value: 1, title: "Set Items Per Row" }
    ],
  },
  gallerySizeType: {
    type: INPUT_TYPES.OPTIONS,
    options: [
      { value: 'smart', title: "Adjust to Layout" },
      { value: 'ratio', title: "Adjust to Container Width" },
      { value: 'px', title: "Fixed size (in pixels)" },
    ],
  },
  gallerySize: {
    type: INPUT_TYPES.NUMBER,
    min: 0,
    max: 100,
  },
  gallerySizeRatio: {
    type: INPUT_TYPES.NUMBER,
    min: 0,
    max: 100,
  },
  gallerySizePx: {
    type: INPUT_TYPES.NUMBER,
    min: 0,
    max: 1000,
  },
  numberOfImagesPerRow: {
    type: INPUT_TYPES.NUMBER,
    min: 1,
    max: 5,
  },
  numberOfImagesPerCol: {
    type: INPUT_TYPES.NUMBER,
    min: 0,
    max: 3,
  },
  groupSize: {
    type: INPUT_TYPES.NUMBER,
    min: 0,
    max: 3,
  },
  groupsPerStrip: {
    type: INPUT_TYPES.NUMBER,
    min: 0,
    max: 10,
  },
  groupTypes: {
    type: INPUT_TYPES.MULTISELECT,
    repeat: false,
    options: createOptions('groupTypes')
  },
  rotatingGroupTypes: {
    type: INPUT_TYPES.MULTISELECT,
    repeat: true,
    options: createOptions('groupTypes')
  },
  thumbnailSpacings: {
    type: INPUT_TYPES.NUMBER,
    min: 0,
    max: 30,
    units: "px",
    alert: 'Should be set as / 2',
  },
  imageMargin: {
    type: INPUT_TYPES.NUMBER,
    min: 0,
    max: 300,
    units: "px",
  },
  galleryMargin: {
    type: INPUT_TYPES.NUMBER,
    min: 0,
    max: 50,
    units: "px",
  },
  scatter: {
    type: INPUT_TYPES.NUMBER,
    min: 0,
    max: 1,
    step: 0.1,
  },
  collageDensity: {
    type: INPUT_TYPES.NUMBER,
    min: 0,
    max: 1,
    step: 0.1,
  },
  enableInfiniteScroll: {
    type: INPUT_TYPES.BOOLEAN,
  },
  loadMoreAmount: {
    type: INPUT_TYPES.OPTIONS,
    options: createOptions('loadMoreAmount')
  },
  //----------| SETTINGS SECTION |---------//
  scrollSnap: {
    type: INPUT_TYPES.BOOLEAN,
  },
  itemClick: {
    options: createOptions('itemClick')
  },
  watermarkOpacity: {
    type: INPUT_TYPES.NUMBER,
    min: 0,
    max: 100,
    unit: '%',
    alert: 'now is being saved in "appSettings"',
  },
  watermarkSize: {
    type: INPUT_TYPES.NUMBER,
    min: 0,
    max: 100,
    unit: '%',
    alert: 'now is being saved in "appSettings"',
  },
  watermarkDock: {
    type: INPUT_TYPES.OPTIONS,
    options: createOptions('watermarkDock'),
    alert: 'now is being saved in "appSettings"',
  },
  //------------------------ Design ----------------------//
  itemOpacity: {
    type: INPUT_TYPES.COLOR_PICKER,
    alert: 'implement! - this is a colorPickerSlider component - I think only to set opacity',
  },
  itemIconColorSlideshow: {
    type: INPUT_TYPES.COLOR_PICKER,
    alert: 'implement!',
  },
  itemIconColor: {
    type: INPUT_TYPES.COLOR_PICKER,
    alert: 'implement!',
  },
  arrowsSize: {
    type: INPUT_TYPES.NUMBER,
    min: 8,
    max: 80,
  },
  arrowsColor: {
    type: INPUT_TYPES.COLOR_PICKER,
    alert: 'implement!',
  },
  arrowsPosition: {
    type: INPUT_TYPES.OPTIONS,
    options: [
      { value: 0, title: "On gallery" },
      { value: 1, title: "Outside gallery" },
    ],
  },
  overlayAnimation:  {
    type: INPUT_TYPES.OPTIONS,
    options: createOptions('overlayAnimations')
  },
  imageHoverAnimation: {
    type: INPUT_TYPES.OPTIONS,
    options: createOptions('imageHoverAnimations')
  },
  imagePlacementAnimation: {
    type: INPUT_TYPES.OPTIONS,
    options: createOptions('imagePlacementAnimations')
  },
  itemFont: {
    type: INPUT_TYPES.FONT_PICKER,
    alert: 'implement',
  },
  itemFontColor: {
    type: INPUT_TYPES.COLOR_PICKER,
    alert: 'implement!',
  },
  itemFontSlideshow: {
    type: INPUT_TYPES.FONT_PICKER,
    alert: 'implement',
  },
  itemFontColorSlideshow: {
    type: INPUT_TYPES.COLOR_PICKER,
    alert: 'implement!',
  },
  itemDescriptionFont: {
    type: INPUT_TYPES.FONT_PICKER,
    alert: 'implement',
  },
  itemDescriptionFontColor: {
    type: INPUT_TYPES.COLOR_PICKER,
    alert: 'implement!',
  },
  itemDescriptionFontSlideshow: {
    type: INPUT_TYPES.Font,
  },
  itemDescriptionFontColorSlideshow: {
    type: INPUT_TYPES.COLOR_PICKER,
    alert: 'implement!',
  },
  textBoxFillColor: {
    type: INPUT_TYPES.COLOR_PICKER,
    alert: 'implement!',
  },
  textBoxHeight: {
    type: INPUT_TYPES.NUMBER,
    min: 1,
    max: 400,
    units: 'px',
  },
  textImageSpace: {
    type: INPUT_TYPES.NUMBER,
    min: 0,
    max: 100,
    units: 'px',
  },
  textBoxBorderRadius: {
    type: INPUT_TYPES.NUMBER,
    min: 0,
    max: 900,
    units: 'px',
  },
  textBoxBorderWidth: {
    type: INPUT_TYPES.NUMBER,
    min: 0,
    max: 20,
    units: 'px',
  },
  textBoxBorderColor: {
    type: INPUT_TYPES.COLOR_PICKER,
    alert: 'implement!',
  },
  loadMoreButtonText: {
    type: INPUT_TYPES.TEXT,
  },
  loadMoreButtonFont: {
    type: INPUT_TYPES.FONT_PICKER,
    alert: 'implement',
  },
  loadMoreButtonFontColor: {
    type: INPUT_TYPES.COLOR_PICKER,
    alert: 'implement!',
  },
  loadMoreButtonColor: {
    type: INPUT_TYPES.COLOR_PICKER,
    alert: 'implement!',
  },
  loadMoreButtonBorderWidth: {
    type: INPUT_TYPES.NUMBER,
    min: 0,
    max: 5,
  },
  loadMoreButtonBorderColor: {
    type: INPUT_TYPES.COLOR_PICKER,
    alert: 'implement!',
  },
  loadMoreButtonBorderRadius: {
    type: INPUT_TYPES.NUMBER,
    min: 0,
    max: 30,
  },
  imageInfoType: {
    type: INPUT_TYPES.OPTIONS,
    options: createOptions('infoType')
  },
  itemBorderWidth: {
    type: INPUT_TYPES.NUMBER,
    min: 0,
    max: 20,
    units: 'px',
  },
  itemBorderColor: {
    type: INPUT_TYPES.COLOR_PICKER,
    alert: 'implement!',
  },
  itemBorderRadius: {
    type: INPUT_TYPES.NUMBER,
    min: 0,
    max: 900,
    units: 'px',
  },
  itemEnableShadow: {
    type: INPUT_TYPES.BOOLEAN,
  },
  itemShadowOpacityAndColor: {
    type: INPUT_TYPES.COLOR_PICKER,
    alert: 'implement!',
  },
  itemShadowBlur: {
    type: INPUT_TYPES.NUMBER,
    min: 0,
    max: 80,
    units: 'px',
  },
  itemShadowDirection: {
    type: INPUT_TYPES.NUMBER,
    min: 0,
    max: 360,
    units: '°',
  },
  itemShadowSize: {
    type: INPUT_TYPES.NUMBER,
    min: 0,
    max: 150,
    units: 'px',
  },
  imageLoadingMode: {
    type: INPUT_TYPES.OPTIONS,
    options: createOptions('loadingMode')
  },
  imageLoadingColor: {
    type: INPUT_TYPES.COLOR_PICKER,
    alert: 'implement!',
  },
  expandAnimation: {
    type: INPUT_TYPES.OPTIONS,
    options: createOptions('expandAnimations')
  },
  scrollAnimation: {
    type: INPUT_TYPES.OPTIONS,
    options: createOptions('scrollAnimations')
  },
  oneColorAnimationColor: {
    type: INPUT_TYPES.COLOR_PICKER,
    alert: 'implement!',
  },
  allowLinkExpand: {
    type: INPUT_TYPES.BOOLEAN,
  },
  expandInfoPosition: {
    type: INPUT_TYPES.OPTIONS,
    options: [
      { value: 0, title: "Side" },
      { value: 1, title: "Bottom" },
    ],
  },
  defaultShowInfoExpand: {
    type: INPUT_TYPES.OPTIONS,
    options: [
      { value: 0, title: "When clicking info icon" },
      { value: 1, title: "Always" },
    ],
    alert: '"showInfoExpandButton" property is set accordingly',
  },
  allowFullscreenExpand: {
    type: INPUT_TYPES.BOOLEAN,
  },
  fullscreenLoop: {
    type: INPUT_TYPES.BOOLEAN,
  },
  bgColorExpand: {
    type: INPUT_TYPES.COLOR_PICKER,
    alert: 'implement!',
  },
  actionsColorExpand: {
    type: INPUT_TYPES.COLOR_PICKER,
    alert: 'implement!',
  },
  titleFontExpand: {
    type: INPUT_TYPES.FONT_PICKER,
    alert: 'implement',
  },
  titleColorExpand: {
    type: INPUT_TYPES.COLOR_PICKER,
    alert: 'implement!',
  },
  descriptionFontExpand: {
    type: INPUT_TYPES.FONT_PICKER,
    alert: 'implement',
  },
  descriptionColorExpand: {
    type: INPUT_TYPES.COLOR_PICKER,
    alert: 'implement!',
  },
  galleryAlignExpand: {
    type: INPUT_TYPES.OPTIONS,
    options: [
      { value: 'left', title: "left" },
      { value: 'center', title: "center" },
      { value: 'right', title: "right" },
    ],
    alert: '"galleryAlignExpandIcons" property is being accordingly set',
  },
  addToCartBackColorExpand: {
    type: INPUT_TYPES.COLOR_PICKER,
    alert: 'implement!',
  },
  addToCartFontExpand: {
    type: INPUT_TYPES.FONT_PICKER,
    alert: 'implement',
  },
  addToCartColorExpand: {
    type: INPUT_TYPES.COLOR_PICKER,
    alert: 'implement!',
  },
  addToCartBorderWidth: {
    type: INPUT_TYPES.NUMBER,
    min: 0,
    max: 5,
    units: 'px',
  },
  addToCartBorderColor: {
    type: INPUT_TYPES.COLOR_PICKER,
    alert: 'implement!',
  },
  addToCartButtonText: {
    type: INPUT_TYPES.TEXT,
    maxLength: 30,
  },
  imageQuality: {
    type: INPUT_TYPES.NUMBER,
    min: 30,
    max: 100,
    alert: 'doesn\'t influence - this builds "sharpParams" object - as "imageQuality" property',
  },
  usmToggle: {
    type: INPUT_TYPES.BOOLEAN,
  },
  usm_a: {
    type: INPUT_TYPES.NUMBER,
    min: 0,
    max: 500,
    units: '%',
    alert: 'inside "sharpParams" object as "usm_a" property + percentage - should be divided by 100',
  },
  usm_r: {
    type: INPUT_TYPES.NUMBER,
    min: 0,
    max: 50,
    units: 'px',
    step: 0.1,
    alert: 'inside "sharpParams" object as "usm_r" property',
  },
  usm_t: {
    type: INPUT_TYPES.NUMBER,
    min: 0,
    max: 255,
    units: 'lv',
    alert: 'inside "sharpParams" object as "usm_t" property + percentage - should be divided by 255',
  },
  hidePlay: {
    type: INPUT_TYPES.BOOLEAN,
  },
  videoPlay: {
    type: INPUT_TYPES.OPTIONS,
    options: createOptions('videoPlay')
  },
  videoSound: {
    type: INPUT_TYPES.BOOLEAN,
  },
  videoSpeed: {
    type: INPUT_TYPES.OPTIONS,
    options: [
      { value: '0.25', title: ".25x"   },
      { value: '0.5', title: ".50x"},
      { value: '1', title: "Normal"   },
      { value: '1.25', title: "1.25x"   },
      { value: '1.5', title: "1.50x"},
      { value: '2', title: "2.00x"   },
    ],
  },
  videoLoop: {
    type: INPUT_TYPES.BOOLEAN,
  }
};

// store and mobile
// cubeRatio: { -- It's defined in styleBuilder
// parseStyleParams - for expand mode need to investigate file - sets lots of other params.SECTIONS.EXPAND_MODE
// second parameter in proGalleryStyleBuilder - 'scrollDirection', 'oneRow'
// Maybe to add the default to this interface ?
// cubeRatio didnt
// is store
// is mobile
// check expand conditions
// decity should have precents - precents conversion

// defined in wixers!?
// if (canSet('cubeRatio')) {
//   stateStyles.cubeRatio = Number(eval(wixStyles.cubeRatio));
// }

// if (canSet('cubeType', 'cubeType')) {
//   stateStyles.cubeType = ((String(wixStyles.cubeType) === '1') ? 'fit' : 'fill');
//   if (stateStyles.cubeType === 'fit') {
//     if (stateStyles.cropOnlyFill === true) {
//       stateStyles.cubeImages = false;
//     }
//   }
// }
// //TODO, I changed it so that we will have the wixStyles, in the renderer I need to change the function to have the functionality of isSlider / isGrid - V
// //TODO should I add the new style names to the defaults as undefined? - no, i dont (should check with guy to make sure)
// if (canSet('gallerySliderImageRatio', 'cubeRatio')) {
//   stateStyles.gallerySliderImageRatio = Number(eval(['16/9', '4/3', '1', '3/4', '9/16'][Number(wixStyles.gallerySliderImageRatio)]));
// } else if (isUndefined(stateStyles.cubeRatio)) {
//   stateStyles.gallerySliderImageRatio = Number(eval(['16/9', '4/3', '1', '3/4', '9/16'][Number(defaultStateStyles.gallerySliderImageRatio)]));
// }
// if (canSet('galleryImageRatio', 'cubeRatio')) {
//   stateStyles.galleryImageRatioFromWix = Number(eval(['16/9', '4/3', '1', '3/4', '9/16'][Number(wixStyles.galleryImageRatio)]));
// }

// if (canSet('fixedColumns')) {
//   stateStyles.fixedColumns = Number(wixStyles.fixedColumns);
// }

// if (canSet('groupsPerStrip')) {
//   stateStyles.groupsPerStrip = Number(wixStyles.groupsPerStrip);
// }

// if (canSet('scrollDirection', 'oneRow')) {
//   stateStyles.oneRow = (String(wixStyles.scrollDirection) === '1');

//   if (stateStyles.oneRow) {
//     //if oneRow is true, use horizontal layouts only
//     stateStyles.isVertical = false;
//   }
// }
