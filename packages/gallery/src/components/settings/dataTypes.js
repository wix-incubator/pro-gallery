import Consts from '../../constants';
import {INPUT_TYPES} from './consts';

export default {
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
    options: [
      { value: Consts.layout.EMPTY, title: "EMPTY" },
      { value: Consts.layout.COLLAGE, title: "COLLAGE" },
      { value: Consts.layout.MASONRY, title: "MASONRY" },
      { value: Consts.layout.GRID, title: "GRID" },
      { value: Consts.layout.THUMBNAIL, title: "THUMBNAIL" },
      { value: Consts.layout.SLIDER, title: "SLIDER" },
      { value: Consts.layout.SLIDESHOW, title: "SLIDESHOW" },
      { value: Consts.layout.PANORAMA, title: "PANORAMA" },
      { value: Consts.layout.COLUMN, title: "COLUMN" },
      { value: Consts.layout.MAGIC, title: "MAGIC" },
      { value: Consts.layout.FULLSIZE, title: "FULLSIZE" },
      { value: Consts.layout.BRICKS, title: "BRICKS" },
      { value: Consts.layout.MIX, title: "MIX" },
      { value: Consts.layout.ALTERNATE, title: "ALTERNATE" },
    ],
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
  allowTitle: {
    type: INPUT_TYPES.BOOLEAN,
  },
  allowDescription: {
    type: INPUT_TYPES.BOOLEAN,
  },
  allowSlideshowCounter: {
    type: INPUT_TYPES.BOOLEAN,
  },
  titlePlacement: {
    type: INPUT_TYPES.OPTIONS,
    options: [
      { value: Consts.placements.SHOW_ON_HOVER, title: "On Hover" },
      { value: Consts.placements.SHOW_BELOW, title: "Below" },
      { value: Consts.placements.SHOW_ABOVE, title: "Above" },
    ],
  },
  hoveringBehaviour: {
    type: INPUT_TYPES.OPTIONS,
    options: [
      { value: Consts.infoBehaviourOnHover.APPEARS, title: "appears" },
      { value: Consts.infoBehaviourOnHover.DISAPPEARS, title: "disappears" },
      { value: Consts.infoBehaviourOnHover.NO_CHANGE, title: "no change" },
    ],
  },
  imageResize: {
    type: INPUT_TYPES.OPTIONS,
    options: [{ value: Consts.imageResize.crop, title: "Crop" }, { value: Consts.imageResize.fit, title: "Fit" }],
    alert: " this sets cubeType, cubeImages -> check proGalleryStyleBuilder",
  },
  galleryImageRatioFromWix: {
    type: INPUT_TYPES.OPTIONS,
    options: [
      { value: 16 / 9, title: "16:9" },
      { value: 4 / 3, title: "4:3" },
      { value: 1, title: "1:1" },
      { value: 3 / 4, title: "3:4" },
      { value: 9 / 16, title: "9:16" }
    ],

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
    options: [
      { value: Consts.thumbnailsAlignment.bottom, title: "Bottom" },
      { value: Consts.thumbnailsAlignment.left, title: "Left" },
      { value: Consts.thumbnailsAlignment.top, title: "Top" },
      { value: Consts.thumbnailsAlignment.right, title: "Right" }
    ],
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
  gallerySize: {
    type: INPUT_TYPES.NUMBER,
    min: 0,
    max: 800,
  },
  numberOfImagesPerRow: {
    type: INPUT_TYPES.NUMBER,
    min: 1,
    max: 5,
  },
  numberOfImagesPerCol: {
    type: INPUT_TYPES.NUMBER,
    min: 1,
    max: 3,
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
  floatingImages: {
    type: INPUT_TYPES.NUMBER,
    min: 0,
    max: 100,
    units: "%",
    alert: 'percentage - Should be set as / 100',
  },
  collageDensity: {
    type: INPUT_TYPES.NUMBER,
    min: 1,
    max: 100,
    step: 10,
    units: "%",
    alert: 'percentage - Should be set as / 100',
  },
  enableInfiniteScroll: {
    type: INPUT_TYPES.BOOLEAN,
  },
  loadMoreAmount: {
    type: INPUT_TYPES.OPTIONS,
    options: [
      { value: Consts.loadMoreAmount.ALL, title: "all images" },
      { value: Consts.loadMoreAmount.PARTIAL, title: "one more section" }
    ],
  }, 
  magicLayoutSeed: {
    text: "Generate Magic Layout",
    type: INPUT_TYPES.BUTTON,
    action: () => Math.random() * 100000,
  },
  //----------| SETTINGS SECTION |---------//
  scrollSnap: {
    type: INPUT_TYPES.BOOLEAN,
  },
  itemClick: {
    options: [
      { value: Consts.itemClick.EXPAND, title: 'Open in Expand' },
      { value: Consts.itemClick.LINK, title: 'A link opens' }, // When choosing a ling then a button of "Manage Media" link should appear
      { value: Consts.itemClick.NOTHING, title: 'Nothing happens' },
      { value: Consts.itemClick.FULLSCREEN, title: 'Open in Full Screen' },
    ],
  },
  useWatermark: {
    type: INPUT_TYPES.BOOLEAN,
    alert: 'now is being saved in "appSettings"',
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
    options: [
      { value: Consts.watermarkDock.LEFT_TOP, title: 'LEFT_TOP' },
      { value: Consts.watermarkDock.MIDDLE_TOP, title: 'MIDDLE_TOP' },
      { value: Consts.watermarkDock.RIGHT_TOP, title: 'RIGHT_TOP' },
      { value: Consts.watermarkDock.LEFT_MIDDLE, title: 'LEFT_MIDDLE' },
      { value: Consts.watermarkDock.MIDDLE, title: 'MIDDLE' },
      { value: Consts.watermarkDock.RIGHT_MIDDLE, title: 'RIGHT_MIDDLE' },
      { value: Consts.watermarkDock.LEFT_DOWN, title: 'LEFT_DOWN' },
      { value: Consts.watermarkDock.MIDDLE_DOWN, title: 'MIDDLE_DOWN' },
      { value: Consts.watermarkDock.RIGHT_DOWN, title: 'RIGHT_DOWN' },
    ],
    alert: 'now is being saved in "appSettings"',
  },
  allowDownload: {
    type: INPUT_TYPES.BOOLEAN,
  },
  allowSocial: {
    type: INPUT_TYPES.BOOLEAN,
  },
  loveButton: {
    type: INPUT_TYPES.BOOLEAN,
  },
  loveCounter: {
    type: INPUT_TYPES.BOOLEAN,
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
    options: [
      { value: Consts.overlayAnimations.NO_EFFECT, title: "No effect" },
      { value: Consts.overlayAnimations.FADE_IN, title: "Fade in" },
      { value: Consts.overlayAnimations.EXPAND, title: "Expand" },
      { value: Consts.overlayAnimations.SLIDE_UP, title: "Slide up" },
      { value: Consts.overlayAnimations.SLIDE_RIGHT, title: "Slide right" },
    ],
  },
  imageHoverAnimation: {
    type: INPUT_TYPES.OPTIONS,
    options: [
      { value: Consts.imageHoverAnimations.NO_EFFECT, title: "no effect" },
      { value: Consts.imageHoverAnimations.ZOOM_IN, title: "zoom in" },
      { value: Consts.imageHoverAnimations.BLUR, title: "blur" },
      { value: Consts.imageHoverAnimations.GRAYSCALE, title: "grayscale" },
      { value: Consts.imageHoverAnimations.SHRINK, title: "shrink" },
      { value: Consts.imageHoverAnimations.INVERT, title: "invert" },
      { value: Consts.imageHoverAnimations.COLOR_IN, title: "color in" },
      { value: Consts.imageHoverAnimations.DARKENED, title: "darkened" }
    ],
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
  galleryHorizontalAlign: { // ALSO sets galleryTextAlign --- 
    type: INPUT_TYPES.OPTIONS,
    options: [
      { value: Consts.horizontalAlign.LEFT, title: "left" },
      { value: Consts.horizontalAlign.CENTER, title: "center" },
      { value: Consts.horizontalAlign.RIGHT, title: "right" },
    ],
    alert: '"galleryTextAlign" should be set accordingly',
  },
  galleryVerticalAlign: {
    type: INPUT_TYPES.OPTIONS,
    options: [
      { value: Consts.verticalAlign.TOP, title: "top" },
      { value: Consts.verticalAlign.CENTER, title: "middle" },
      { value: Consts.verticalAlign.BOTTOM, title: "bottom" },
    ],
  },
  textBoxFillColor: {
    type: INPUT_TYPES.COLOR_PICKER,
    alert: 'implement!',
  },
  calculateTextBoxHeightMode: {
    type: INPUT_TYPES.OPTIONS,
    options: [
      { value: Consts.calculationOptions.AUTOMATIC, title: "Automatic" },
      { value: Consts.calculationOptions.MANUAL, title: "Manual" },
    ],
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
  textsVerticalPadding: {
    type: INPUT_TYPES.NUMBER,
    min: 0,
    max: 50,
    units: 'px',
  },
  textsHorizontalPadding: {
    type: INPUT_TYPES.NUMBER,
    min: 0,
    max: 50,
    units: 'px',
  },
  titleDescriptionSpace: {
    type: INPUT_TYPES.NUMBER,
    min: 0,
    max: 50,
    units: 'px',
  },
  useCustomButton: {
    type: INPUT_TYPES.BOOLEAN,
  },
  customButtonText: {
    type: INPUT_TYPES.TEXT,
  },
  customButtonFontForHover: {
    type: INPUT_TYPES.FONT_PICKER,
    alert: 'implement',
  },
  customButtonFontColorForHover: {
    type: INPUT_TYPES.COLOR_PICKER,
    alert: 'implement!',
  },
  customButtonFont: {
    type: INPUT_TYPES.FONT_PICKER,
    alert: 'implement',
    fontMinSize:14,
    fontMaxSize: 22,
  },
  customButtonFontColor: {
    type: INPUT_TYPES.COLOR_PICKER,
    alert: 'implement!',
  },
  customButtonColor: {
    type: INPUT_TYPES.COLOR_PICKER,
    alert: 'implement!',
  },
  customButtonBorderWidth: {
    type: INPUT_TYPES.NUMBER,
    min: 0,
    max: 5,
  },
  customButtonBorderColor: {
    type: INPUT_TYPES.COLOR_PICKER,
    alert: 'implement!',
  },
  customButtonBorderRadius: {
    type: INPUT_TYPES.NUMBER,
    min: 0,
    max: 30,
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
    options: [
      { value: Consts.infoType.NO_BACKGROUND, title: "Clean" },
      { value: Consts.infoType.ATTACHED_BACKGROUND, title: "Attached" },
      { value: Consts.infoType.SEPARATED_BACKGROUND, title: "Separated" },
    ],
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
    options: [
      { value: Consts.loadingMode.BLUR, title: "Blurred Image" },
      { value: Consts.loadingMode.COLOR, title: "Color Background Placeholder" }
    ],
  },
  imageLoadingColor: {
    type: INPUT_TYPES.COLOR_PICKER,
    alert: 'implement!',
  },
  expandAnimation: {
    type: INPUT_TYPES.OPTIONS,
    options: [
      { value: Consts.expandAnimations.NO_EFFECT, title: "No effect" },
      { value: Consts.expandAnimations.EXPAND, title: "Expand" },
      { value: Consts.expandAnimations.FADE_IN, title: "fade in" },
    ],
  },
  scrollAnimation: {
    type: INPUT_TYPES.OPTIONS,
    options: [
      { value: Consts.scrollAnimations.NO_EFFECT, title: "no effect" },
      { value: Consts.scrollAnimations.FADE_IN, title: "fade in" },
      { value: Consts.scrollAnimations.GRAYSCALE, title: "grayscale" },
      { value: Consts.scrollAnimations.SLIDE_UP, title: "slide up" },
      { value: Consts.scrollAnimations.EXPAND, title: "expand" },
      { value: Consts.scrollAnimations.SHRINK, title: "shrink" },
      { value: Consts.scrollAnimations.ZOOM_OUT, title: "zoom out" },
      { value: Consts.scrollAnimations.ONE_COLOR, title: "one color" }
    ],
  },
  oneColorAnimationColor: {
    type: INPUT_TYPES.COLOR_PICKER,
    alert: 'implement!',
  },
  allowTitleExpand: {
    type: INPUT_TYPES.BOOLEAN,
  },
  allowDescriptionExpand: {
    type: INPUT_TYPES.BOOLEAN,
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
  videoPlay: {
    type: INPUT_TYPES.OPTIONS,
    options: [
      { value: Consts.videoPlay.HOVER, title: "On hover" },
      { value: Consts.videoPlay.AUTO, title: "Autoplay" },
      { value: Consts.videoPlay.ON_CLICK, title: "On click" },
    ],
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

// if (canSet('imageResize', 'cubeType')) {
//   stateStyles.cubeType = ((String(wixStyles.imageResize) === '1') ? 'fit' : 'fill');
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