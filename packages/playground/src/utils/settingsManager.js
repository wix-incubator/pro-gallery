import Consts from './consts';

export const INPUT_TYPES = {
  NUMBER: "NUMBER",
  BOOLEAN: "BOOLEAN",
  OPTIONS: "OPTIONS",
  TEXT: "TEXT",
  COLOR_PICKER: "COLOR_PICKER",
  FONT_PICKER: "FONT_PICKER",
  BUTTON: "BUTTON",
};

export const SECTIONS = {
  LAYOUT: "Layout",
  SETTINGS: "Settings",
  DESIGN: "Design",
  ADVANCED: "Advanced",
  EXPAND_MODE: "Expand Mode",
  STORE: "Art Store",
};

export const SUB_SECTIONS = {
  DESIGN: {
    OVERLAY_AND_ICONS: "Overlay & Icons",
    TEXTS: "Texts",
    BUTTONS: "Buttons",
    ITEM_STYLE: "Item Style",
    SCROLL_ANIMATION: "Scroll Animation",
    EXPAND_MODE: "Expand Mode",
    ADVANCED: "Advanced",
  },
};

const showColorOverlay = (sp, context) => {
  if (context.isMobile) {
    return hasHoverOnMobile(sp);
  }
  return !isSlideshowLayout(sp);
};

const hasHoverOnMobile = sp => {
   const firstTapSimulatesHover = sp.itemClick === Consts.itemClick.NOTHING ||
    (showTexts(sp) &&
      (
        (layoutPresentOuterInformation(sp) && sp.titlePlacement === Consts.placements.SHOW_ON_HOVER) ||
        !layoutPresentOuterInformation(sp)
      )
    )
  ;

  return !isSlideshowLayout(sp) &&
    firstTapSimulatesHover;
};

const isSlideshowLayout = sp => {
  return [Consts.layout.SLIDESHOW].indexOf(sp.galleryLayout) > -1;
}

const isHorizontalLayout = sp => {
  return [Consts.layout.THUMBNAIL, Consts.layout.SLIDER, Consts.layout.SLIDESHOW, Consts.layout.COLUMN].indexOf(sp.galleryLayout) > -1 ||
  ((sp.galleryLayout === Consts.layout.GRID || sp.galleryLayout === Consts.layout.COLLAGE) && !oneRow(sp)); 
  }

const layoutPresentOuterInformation = sp => 
  [Consts.layout.PANORAMA, Consts.layout.COLUMN, Consts.layout.SLIDER].indexOf(sp.galleryLayout) > -1 ||
  (sp.galleryLayout === Consts.layout.MASONRY && sp.isVertical) ||
  (sp.galleryLayout === Consts.layout.GRID && !oneRow(sp))

const showTexts = sp => sp.allowTitle || sp.allowDescription;
const showAlignTextVertical = sp => [Consts.layout.COLLAGE, Consts.layout.MASONRY, Consts.layout.GRID, Consts.layout.THUMBNAIL, Consts.layout.SLIDER, Consts.layout.PANORAMA, Consts.layout.COLUMN, Consts.layout.MAGIC].indexOf(sp.galleryLayout) > -1 && sp.titlePlacement === Consts.placements.SHOW_ON_HOVER;
const presentOuterInformation = sp => layoutPresentOuterInformation(sp) && sp.titlePlacement !== Consts.placements.SHOW_ON_HOVER;
const isTitlePlacementAlwaysShown = sp => layoutPresentOuterInformation(sp) || isSlideshowLayout(sp) || sp.titlePlacement !== Consts.placements.SHOW_ON_HOVER;
const showInfiniteScroll = sp => [Consts.layout.COLLAGE, Consts.layout.MASONRY, Consts.layout.GRID, Consts.layout.PANORAMA].indexOf(sp.galleryLayout) > -1 && oneRow(sp);
const showItemBorderAndShadowConfig = sp => !(sp.cubeType === 'fit' && showThumbnailResize(sp)) // check cubeType exists 
const showThumbnailResize = sp => [Consts.layout.EMPTY, Consts.layout.GRID, Consts.layout.THUMBNAIL, Consts.layout.SLIDER, Consts.layout.SLIDESHOW].indexOf(sp.galleryLayout) > -1 ;
const showShadow = sp => showItemBorderAndShadowConfig(sp) && !isHorizontalLayout(sp)  && (sp.imageInfoType === Consts.infoType.ATTACHED_BACKGROUND || sp.titlePlacement === Consts.placements.SHOW_ON_HOVER);
const oneRow = sp => sp.scrollDirection === Consts.scrollDirection.horizontal;
const showSlideshowSettings = sp => [Consts.layout.THUMBNAIL, Consts.layout.SLIDER, Consts.layout.SLIDESHOW, Consts.layout.COLUMN].indexOf(sp.galleryLayout) > -1;
const showAutoSlideshow = sp => [Consts.layout.THUMBNAIL, Consts.layout.SLIDER, Consts.layout.SLIDESHOW].indexOf(sp.galleryLayout) > -1;
const showImagesDisplaySection = sp => [Consts.layout.EMPTY, Consts.layout.COLLAGE, Consts.layout.MASONRY, Consts.layout.GRID, Consts.layout.THUMBNAIL, Consts.layout.SLIDER, Consts.layout.SLIDESHOW, Consts.layout.PANORAMA, Consts.layout.COLUMN].indexOf(sp.galleryLayout) > -1;
const showHoveringBehaviour = sp => showImagesDisplaySection(sp) && !isSlideshowLayout(sp) && showTexts(sp) && ((presentOuterInformation(sp) && sp.titlePlacement === Consts.placements.SHOW_ON_HOVER) || !presentOuterInformation(sp));
const showTextSubSection = sp => showTexts(sp);
const showButtonSection = sp => showInfiniteScroll(sp) && !sp.enableInfiniteScroll && isStore(sp);
const showExpendSection = sp => sp.itemClick === Consts.itemClick.EXPAND || isStore(sp);
const showScrollAnimations = sp => [Consts.layout.MASONRY, Consts.layout.PANORAMA, Consts.layout.BRICKS, Consts.layout.ALTERNATE, Consts.layout.MIX].indexOf(sp.galleryLayout) > -1 || ((sp.galleryLayout === Consts.layout.GRID || sp.galleryLayout === Consts.layout.COLLAGE) && !oneRow(sp));

// implement
const isStore = (sp) => sp.isStore;
const showAddToCartSection = (sp) => isStore(sp) && sp.showAddToCartSection; // providerApi.hasAddToCart();
const canUseWatermark = (sp) => isStore(sp) && sp.canUseWatermark; // mediaUploaded || !isDemoImage;

export const settingsManager = {
  isStore: {
    section: SECTIONS.STORE,
    title: 'Is store',
    description: "",
    type: INPUT_TYPES.BOOLEAN,
    alert: 'MOCK PARAM',
    isRelevant: () => true,
  },
  showAddToCartSection: {
    section: SECTIONS.STORE,
    title: 'show Add To Cart Section',
    description: "",
    type: INPUT_TYPES.BOOLEAN,
    alert: 'MOCK PARAM',
    isRelevant: sp => isStore(sp),
  },
  canUseWatermark: {
    section: SECTIONS.STORE,
    title: 'can Use Watermark',
    description: "",
    type: INPUT_TYPES.BOOLEAN,
    alert: 'MOCK PARAM',
    isRelevant: sp => isStore(sp),
  },

  //----------| LAYOUT SECTION |---------//
  galleryLayout: {
    section: SECTIONS.LAYOUT,
    title: 'Gallery Layout',
    description: "",
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
    isRelevant: () => true
  },
  slideshowLoop: {
    section: SECTIONS.LAYOUT,
    title: 'Loop Images',
    description: "",
    type: INPUT_TYPES.BOOLEAN,
    isRelevant: showSlideshowSettings
  },
  isAutoSlideshow: {
    section: SECTIONS.LAYOUT,
    title: 'Auto Slide',
    description: "",
    type: INPUT_TYPES.BOOLEAN,
    isRelevant: showAutoSlideshow
  },
  autoSlideshowInterval: {
    section: SECTIONS.LAYOUT,
    title: 'Time Between Images',
    description: "",
    type: INPUT_TYPES.NUMBER,
    min: 2,
    max: 30,
    isRelevant: (sp) => showAutoSlideshow(sp) && sp.isAutoSlideshow
  },
  slideshowInfoSize: {
    section: SECTIONS.LAYOUT,
    title: 'Info bar size',
    description: "",
    type: INPUT_TYPES.NUMBER,
    min: 0,
    max: 500,
    isRelevant: isSlideshowLayout
  },
  playButtonForAutoSlideShow: {
    section: SECTIONS.LAYOUT,
    title: 'Play button',
    description: "",
    type: INPUT_TYPES.BOOLEAN,
    isRelevant: isSlideshowLayout
  },
  scrollDirection: {
    section: SECTIONS.LAYOUT,
    title: "Scroll Direction",
    description: "",
    type: INPUT_TYPES.OPTIONS,
    options: [
      { value: 0, title: "Vertical" },
      { value: 1, title: "Horizontal" }
    ],
    alert: 'should be "oneRow" instead of "scrollDirection" - but the clientlib and renderer uses both parameters\n Also if "oneRow" - "isVertical" should be set to false - maybe add it to not relevant',
    isRelevant: sp => [Consts.layout.EMPTY, Consts.layout.COLLAGE, Consts.layout.GRID].indexOf(sp.galleryLayout) > -1
  },
  isVertical: {
    section: SECTIONS.LAYOUT,
    title: "Image Orientation",
    description: "",
    type: INPUT_TYPES.OPTIONS,
    options: [{ value: false, title: "Rows" }, { value: true, title: "Columns" }],
    isRelevant: sp => [Consts.layout.COLLAGE, Consts.layout.MASONRY].indexOf(sp.galleryLayout) > -1
  },
  allowTitle: {
    section: SECTIONS.LAYOUT,
    title: "Allow Title",
    description: "",
    type: INPUT_TYPES.BOOLEAN,
    isRelevant: showImagesDisplaySection
  },
  allowDescription: {
    section: SECTIONS.LAYOUT,
    title: "Allow Description",
    description: "",
    type: INPUT_TYPES.BOOLEAN,
    isRelevant: showImagesDisplaySection
  },
  allowSlideshowCounter: {
    section: SECTIONS.LAYOUT,
    title: "Slideshow counter",
    description: "",
    type: INPUT_TYPES.BOOLEAN,
    isRelevant: (sp) => isSlideshowLayout(sp) && sp.isAutoSlideshow
  },
  titlePlacement: {
    section: SECTIONS.LAYOUT,
    title: "Title Placement",
    description: "",
    type: INPUT_TYPES.OPTIONS,
    options: [
      { value: Consts.placements.SHOW_ON_HOVER, title: "On Hover" },
      { value: Consts.placements.SHOW_BELOW, title: "Below" },
      { value: Consts.placements.SHOW_ABOVE, title: "Above" },
    ],
    isRelevant: (sp) => layoutPresentOuterInformation(sp) && showTexts(sp)
  },
  hoveringBehaviour: {
    section: SECTIONS.LAYOUT,
    title: "What happens to the info on hover?",
    description: "",
    type: INPUT_TYPES.OPTIONS,
    options: [
      { value: Consts.infoBehaviourOnHover.APPEARS, title: "appears" },
      { value: Consts.infoBehaviourOnHover.DISAPPEARS, title: "disappears" },
      { value: Consts.infoBehaviourOnHover.NO_CHANGE, title: "no change" },
    ],
    isRelevant: showHoveringBehaviour
  },
  imageResize: {
    section: SECTIONS.LAYOUT,
    title: "Thumbnail Resize",
    description: "",
    type: INPUT_TYPES.OPTIONS,
    options: [{ value: Consts.imageResize.crop, title: "Crop" }, { value: Consts.imageResize.fit, title: "Fit" }],
    alert: " this sets cubeType, cubeImages -> check proGalleryStyleBuilder",
    isRelevant: showThumbnailResize
  },
  galleryImageRatioFromWix: {
    section: SECTIONS.LAYOUT,
    title: "Image Ratio",
    description: "",
    type: INPUT_TYPES.OPTIONS,
    options: [
      { value: 16 / 9, title: "16:9" },
      { value: 4 / 3, title: "4:3" },
      { value: 1, title: "1:1" },
      { value: 3 / 4, title: "3:4" },
      { value: 9 / 16, title: "9:16" }
    ],

    isRelevant: sp => [Consts.layout.EMPTY, Consts.layout.GRID, Consts.layout.SLIDER].indexOf(sp.galleryLayout) > -1 && sp.imageResize === Consts.imageResize.crop
  },
  gallerySliderImageRatio: {
    section: SECTIONS.LAYOUT,
    title: "Image Ratio - Slider",
    description: "",
    type: INPUT_TYPES.OPTIONS,
    options: [
      { value: 16 / 9, title: "16:9" },
      { value: 4 / 3, title: "4:3" },
      { value: 1, title: "1:1" },
      { value: 3 / 4, title: "3:4" },
      { value: 9 / 16, title: "9:16" }
    ],
    alert: 'is "cubeRatio" is undefined (a value that is only in wixers) that this is set to a default value of 16/9',
    isRelevant: sp => sp.galleryLayout === Consts.layout.SLIDER && sp.imageResize === Consts.imageResize.crop
  },
  galleryThumbnailsAlignment: {
    section: SECTIONS.LAYOUT,
    title: "Thumbnail Placement",
    description: "",
    type: INPUT_TYPES.OPTIONS,
    options: [
      { value: Consts.thumbnailsAlignment.bottom, title: "Bottom" },
      { value: Consts.thumbnailsAlignment.left, title: "Left" },
      { value: Consts.thumbnailsAlignment.top, title: "Top" },
      { value: Consts.thumbnailsAlignment.right, title: "Right" }
    ],
    isRelevant: sp => [Consts.layout.THUMBNAIL].indexOf(sp.galleryLayout) >= 0
  },
  thumbnailSize: {
    section: SECTIONS.LAYOUT,
    title: "Thumbnail Size",
    description: "",
    type: INPUT_TYPES.NUMBER,
    min: 80,
    max: 300,
    isRelevant: sp => [Consts.layout.THUMBNAIL].indexOf(sp.galleryLayout) >= 0
  },
  gridStyle: {
    section: SECTIONS.LAYOUT,
    title: "Grid Style",
    description: "",
    type: INPUT_TYPES.OPTIONS,
    options: [
      { value: 0, title: "Fit To Screen" },
      { value: 1, title: "Set Items Per Row" }
    ],
    isRelevant: sp => ((sp.galleryLayout === Consts.layout.GRID || sp.galleryLayout === Consts.layout.COLLAGE) && !oneRow(sp))
  },
  gallerySize: {
    section: SECTIONS.LAYOUT,
    title: "Thumbnail Size",
    description: "",
    type: INPUT_TYPES.NUMBER,
    min: 0,
    max: 800,
    isRelevant: sp => ((sp.galleryLayout === Consts.layout.GRID || sp.galleryLayout === Consts.layout.COLLAGE) && !oneRow(sp)) ? sp.gridStyle ===  0 : [Consts.layout.EMPTY, Consts.layout.COLLAGE, Consts.layout.MASONRY].indexOf(sp.galleryLayout) >= 0 
  },
  numberOfImagesPerRow: {
    section: SECTIONS.LAYOUT,
    title: "Images Per Row",
    description: "",
    type: INPUT_TYPES.NUMBER,
    min: 1,
    max: 5,
    isRelevant: sp => ((sp.galleryLayout === Consts.layout.GRID || sp.galleryLayout === Consts.layout.COLLAGE) && !oneRow(sp)) && sp.gridStyle === 1
  },
  numberOfImagesPerCol: {
    section: SECTIONS.LAYOUT,
    title: "Images Per Column",
    description: "",
    type: INPUT_TYPES.NUMBER,
    min: 1,
    max: 3,
    isRelevant: sp => [Consts.layout.GRID].indexOf(sp.galleryLayout) >= 0  && (sp.galleryLayout === Consts.layout.COLLAGE && !oneRow(sp))
  },
  thumbnailSpacings: {
    section: SECTIONS.LAYOUT,
    title: "Spacing between Thumbnails",
    description: "",
    type: INPUT_TYPES.NUMBER,
    min: 0,
    max: 30,
    units: "px",
    alert: 'Should be set as / 2',
    isRelevant: sp => [Consts.layout.EMPTY, Consts.layout.THUMBNAIL].indexOf(sp.galleryLayout) > -1
  },
  imageMargin: {
    section: SECTIONS.LAYOUT,
    title: "Spacing between Items",
    description: "Set the spacing between the items in your gallery.",
    type: INPUT_TYPES.NUMBER,
    min: 0,
    max: 300,
    units: "px",
    isRelevant: sp => [Consts.layout.EMPTY, Consts.layout.COLLAGE, Consts.layout.MASONRY, Consts.layout.GRID, Consts.layout.SLIDER, Consts.layout.PANORAMA, Consts.layout.COLUMN, Consts.layout.BRICKS, Consts.layout.MIX, Consts.layout.ALTERNATE].indexOf(sp.galleryLayout) > -1
  },
  galleryMargin: {
    section: SECTIONS.LAYOUT,
    title: "Gallery Spacing",
    description: "",
    type: INPUT_TYPES.NUMBER,
    min: 0,
    max: 50,
    units: "px",
    isRelevant: () => true
  },
  floatingImages: {
    section: SECTIONS.LAYOUT,
    title: "floating Images",
    description: "",
    type: INPUT_TYPES.NUMBER,
    min: 0,
    max: 100,
    units: "%",
    alert: 'percentage - Should be set as / 100',
    isRelevant: () => true
  },
  collageDensity: {
    section: SECTIONS.LAYOUT,
    title: "Collage Density",
    description: "",
    type: INPUT_TYPES.NUMBER,
    min: 1,
    max: 100,
    step: 10,
    units: "%",
    alert: 'percentage - Should be set as / 100',
    isRelevant: sp => [Consts.layout.EMPTY, Consts.layout.COLLAGE].indexOf(sp.galleryLayout) >= 0
  },
  enableInfiniteScroll: {
    section: SECTIONS.LAYOUT,
    title: "Load More Button",
    description: "",
    type: INPUT_TYPES.BOOLEAN,
    isRelevant: sp => [Consts.layout.COLLAGE,  Consts.layout.MASONRY,  Consts.layout.GRID,  Consts.layout.PANORAMA].indexOf(sp.galleryLayout) > -1 && !oneRow(sp) 
  },
  loadMoreAmount: {
    section: SECTIONS.LAYOUT,
    title: "Load More Amount",
    description: "",
    type: INPUT_TYPES.OPTIONS,
    options: [
      { value: Consts.loadMoreAmount.ALL, title: "all images" },
      { value: Consts.loadMoreAmount.PARTIAL, title: "one more section" }
    ],
    isRelevant: sp => [Consts.layout.COLLAGE,  Consts.layout.MASONRY,  Consts.layout.GRID,  Consts.layout.PANORAMA].indexOf(sp.galleryLayout) > -1 && !oneRow(sp) && sp.enableInfiniteScroll
  }, 
  magicLayoutSeed: {
    section: SECTIONS.LAYOUT,
    title: "To freshen up your gallery with an all-new look click Create Magic Layout.",
    text: "Generate Magic Layout",
    description: "",
    type: INPUT_TYPES.BUTTON,
    action: () => Math.random() * 100000,
    isRelevant: sp => [Consts.layout.MAGIC].indexOf(sp.galleryLayout) > -1
  },
  //----------| SETTINGS SECTION |---------//
  scrollSnap: {
    section: SECTIONS.SETTINGS,
    title: 'Auto Scroll to Image Center',
    description: "",
    type: INPUT_TYPES.BOOLEAN,
    isRelevant: sp => isHorizontalLayout(sp)
  },
  itemClick: {
    section: SECTIONS.OPTIONS,
    options: [
      { value: Consts.itemClick.EXPAND, title: 'Open in Expand' },
      { value: Consts.itemClick.LINK, title: 'A link opens' }, // When choosing a ling then a button of "Manage Media" link should appear
      { value: Consts.itemClick.NOTHING, title: 'Nothing happens' },
      { value: Consts.itemClick.FULLSCREEN, title: 'Open in Full Screen' },
    ],
    title: 'When clicking on an item:',
    description: "",
    isRelevant: sp => !isStore(sp)
  },
  useWatermark: {
    section: SECTIONS.SETTINGS,
    title: 'Watermark',
    description: "",
    type: INPUT_TYPES.BOOLEAN,
    alert: 'now is being saved in "appSettings"',
    isRelevant: sp => canUseWatermark(sp)
  },
  watermarkOpacity: {
    section: SECTIONS.SETTINGS,
    title: 'Watermark Opacity',
    description: "",
    type: INPUT_TYPES.NUMBER,
    min: 0,
    max: 100,
    unit: '%',
    alert: 'now is being saved in "appSettings"',
    isRelevant: sp => canUseWatermark(sp) && sp.useWatermark
  },
  watermarkSize: {
    section: SECTIONS.SETTINGS,
    title: 'Watermark Size',
    description: "",
    type: INPUT_TYPES.NUMBER,
    min: 0,
    max: 100,
    unit: '%',
    alert: 'now is being saved in "appSettings"',
    isRelevant: sp => canUseWatermark(sp) && sp.useWatermark
  },
  watermarkDock: {
    section: SECTIONS.SETTINGS,
    title: 'Watermark Dock',
    description: "",
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
    isRelevant: sp => canUseWatermark(sp) && sp.useWatermark
  },
  allowDownload: {
    section: SECTIONS.SETTINGS,
    title: 'Show Download Button',
    description: "",
    type: INPUT_TYPES.BOOLEAN,
    isRelevant: () => true
  },
  allowSocial: {
    section: SECTIONS.SETTINGS,
    title: 'Show Share Button',
    description: "",
    type: INPUT_TYPES.BOOLEAN,
    isRelevant: () => true
  },
  loveButton: {
    section: SECTIONS.SETTINGS,
    title: 'Show Love Button',
    description: "",
    type: INPUT_TYPES.BOOLEAN,
    isRelevant: () => true
  },
  loveCounter: {
    section: SECTIONS.SETTINGS,
    title: 'Show Love Counter',
    description: "",
    type: INPUT_TYPES.BOOLEAN,
    isRelevant: (sp) => sp.loveButton
  },
  //------------------------ Design ----------------------//
  itemOpacity: {
    section: SECTIONS.DESIGN,
    subSection: SUB_SECTIONS.DESIGN.OVERLAY_AND_ICONS,
    title: 'Color Overlay',
    description: "",
    type: INPUT_TYPES.COLOR_PICKER,
    alert: 'implement! - this is a colorPickerSlider component - I think only to set opacity',
    isRelevant: showColorOverlay
  },
  itemIconColorSlideshow: {
    section: SECTIONS.DESIGN,
    subSection: SUB_SECTIONS.DESIGN.OVERLAY_AND_ICONS,
    title: 'Icon color',
    description: "",
    type: INPUT_TYPES.COLOR_PICKER,
    alert: 'implement!',
    isRelevant: isSlideshowLayout
  },
  itemIconColor: {
    section: SECTIONS.DESIGN,
    subSection: SUB_SECTIONS.DESIGN.OVERLAY_AND_ICONS,
    title: 'Icon color',
    description: "",
    type: INPUT_TYPES.COLOR_PICKER,
    alert: 'implement!',
    isRelevant: sp => !isSlideshowLayout(sp)
  },
  arrowsSize: {
    section: SECTIONS.DESIGN,
    subSection: SUB_SECTIONS.DESIGN.OVERLAY_AND_ICONS,
    title: 'Arrows Size',
    description: "",
    type: INPUT_TYPES.NUMBER,
    min: 8,
    max: 80,
    isRelevant: isHorizontalLayout
  },
  arrowsColor: {
    section: SECTIONS.DESIGN,
    subSection: SUB_SECTIONS.DESIGN.OVERLAY_AND_ICONS,
    title: 'Arrows Color',
    description: "",
    type: INPUT_TYPES.COLOR_PICKER,
    alert: 'implement!',
    isRelevant: isHorizontalLayout
  },
  arrowsPosition: {
    section: SECTIONS.DESIGN,
    subSection: SUB_SECTIONS.DESIGN.OVERLAY_AND_ICONS,
    title: 'Navigation arrows position',
    description: "",
    type: INPUT_TYPES.OPTIONS,
    options: [
      { value: 0, title: "On gallery" },
      { value: 1, title: "Outside gallery" },
    ],
    isRelevant: isHorizontalLayout // && showOldGalleryFeaturesDesign
  },
  overlayAnimation:  {
    section: SECTIONS.DESIGN,
    subSection: SUB_SECTIONS.DESIGN.OVERLAY_AND_ICONS,
    title: 'Choose an effect when hovering over an image',
    description: "",
    type: INPUT_TYPES.OPTIONS,
    options: [
      { value: Consts.overlayAnimations.NO_EFFECT, title: "No effect" },
      { value: Consts.overlayAnimations.FADE_IN, title: "Fade in" },
      { value: Consts.overlayAnimations.EXPAND, title: "Expand" },
      { value: Consts.overlayAnimations.SLIDE_UP, title: "Slide up" },
      { value: Consts.overlayAnimations.SLIDE_RIGHT, title: "Slide right" },
    ],
    isRelevant: sp => !isSlideshowLayout(sp) && !(sp.titlePlacement === Consts.placements.SHOW_ON_HOVER &&  sp.hoveringBehaviour === Consts.infoBehaviourOnHover.NO_CHANGE)
  },
  imageHoverAnimation: {
    section: SECTIONS.DESIGN,
    subSection: SUB_SECTIONS.DESIGN.OVERLAY_AND_ICONS,
    title: 'Choose an effect when hovering over an image',
    description: "",
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
    isRelevant: sp => !isSlideshowLayout(sp)
  },
  itemFont: {
    section: SECTIONS.DESIGN,
    subSection: SUB_SECTIONS.DESIGN.TEXTS,
    title: 'Title Font',
    description: "",
    type: INPUT_TYPES.FONT_PICKER,
    alert: 'implement',
    isRelevant: sp => showTextSubSection(sp) && (sp.allowTitle && !(isSlideshowLayout(sp) || presentOuterInformation(sp)))
  },
  itemFontColor: {
    section: SECTIONS.DESIGN,
    subSection: SUB_SECTIONS.DESIGN.TEXTS,
    title: 'Title Font Color',
    description: "",
    type: INPUT_TYPES.COLOR_PICKER,
    alert: 'implement!',
    isRelevant: sp => showTextSubSection(sp) && (sp.allowTitle && !(isSlideshowLayout(sp) || presentOuterInformation(sp)))
  },
  itemFontSlideshow: {
    section: SECTIONS.DESIGN,
    subSection: SUB_SECTIONS.DESIGN.TEXTS,
    title: 'Title Font',
    description: "",
    type: INPUT_TYPES.FONT_PICKER,
    alert: 'implement',
    isRelevant: sp => showTextSubSection(sp) && (sp.allowTitle && (isSlideshowLayout(sp) || presentOuterInformation(sp)))
  },
  itemFontColorSlideshow: {
    section: SECTIONS.DESIGN,
    subSection: SUB_SECTIONS.DESIGN.TEXTS,
    title: 'Title Font Color',
    description: "",
    type: INPUT_TYPES.COLOR_PICKER,
    alert: 'implement!',
    isRelevant: sp => showTextSubSection(sp) && (sp.allowTitle && (isSlideshowLayout(sp) || presentOuterInformation(sp)))
  },
  itemDescriptionFont: {
    section: SECTIONS.DESIGN,
    subSection: SUB_SECTIONS.DESIGN.TEXTS,
    title: 'Description Font',
    description: "",
    type: INPUT_TYPES.FONT_PICKER,
    alert: 'implement',
    isRelevant: sp => showTextSubSection(sp) && (sp.allowDescription && !(isSlideshowLayout(sp) || presentOuterInformation(sp)))
  },
  itemDescriptionFontColor: {
    section: SECTIONS.DESIGN,
    subSection: SUB_SECTIONS.DESIGN.TEXTS,
    title: 'Description Font Color',
    description: "",
    type: INPUT_TYPES.COLOR_PICKER,
    alert: 'implement!',
    isRelevant: sp => showTextSubSection(sp) && (sp.allowDescription && !(isSlideshowLayout(sp) || presentOuterInformation(sp)))
  },
  itemDescriptionFontSlideshow: {
    section: SECTIONS.DESIGN,
    subSection: SUB_SECTIONS.DESIGN.TEXTS,
    title: 'Description Font',
    description: "",
    type: INPUT_TYPES.Font,
    isRelevant: sp => showTextSubSection(sp) && (sp.allowDescription && (isSlideshowLayout(sp) || presentOuterInformation(sp)))
  },
  itemDescriptionFontColorSlideshow: {
    section: SECTIONS.DESIGN,
    subSection: SUB_SECTIONS.DESIGN.TEXTS,
    title: 'Description Color',
    description: "",
    type: INPUT_TYPES.COLOR_PICKER,
    alert: 'implement!',
    isRelevant: sp => showTextSubSection(sp) && (sp.allowDescription && (isSlideshowLayout(sp) || presentOuterInformation(sp)))
  },
  galleryHorizontalAlign: { // ALSO sets galleryTextAlign --- 
    section: SECTIONS.DESIGN,
    subSection: SUB_SECTIONS.DESIGN.TEXTS,
    title: 'Text Alignment',
    description: "",
    type: INPUT_TYPES.OPTIONS,
    options: [
      { value: Consts.horizontalAlign.LEFT, title: "left" },
      { value: Consts.horizontalAlign.CENTER, title: "center" },
      { value: Consts.horizontalAlign.RIGHT, title: "right" },
    ],
    alert: '"galleryTextAlign" should be set accordingly',
    isRelevant: sp => showTextSubSection(sp)
  },
  galleryVerticalAlign: {
    section: SECTIONS.DESIGN,
    subSection: SUB_SECTIONS.DESIGN.TEXTS,
    title: 'Vertical Text Alignment',
    description: "",
    type: INPUT_TYPES.OPTIONS,
    options: [
      { value: Consts.verticalAlign.TOP, title: "top" },
      { value: Consts.verticalAlign.CENTER, title: "middle" },
      { value: Consts.verticalAlign.BOTTOM, title: "bottom" },
    ],
    isRelevant: sp => showTextSubSection(sp) && showAlignTextVertical(sp)
  },
  textBoxFillColor: {
    section: SECTIONS.DESIGN,
    subSection: SUB_SECTIONS.DESIGN.TEXTS,
    title: 'Fill Color & Opacity',
    description: "",
    type: INPUT_TYPES.COLOR_PICKER,
    alert: 'implement!',
    isRelevant: sp => showTextSubSection(sp) && (!isSlideshowLayout(sp) && presentOuterInformation(sp) && (sp.infoType === Consts.infoType.ATTACHED_BACKGROUND || sp.infoType === Consts.infoType.SEPARATED_BACKGROUND)) 
  },
  calculateTextBoxHeightMode: {
    section: SECTIONS.DESIGN,
    subSection: SUB_SECTIONS.DESIGN.TEXTS,
    title: 'Calculate text box height:',
    description: "",
    type: INPUT_TYPES.OPTIONS,
    options: [
      { value: Consts.calculationOptions.AUTOMATIC, title: "Automatic" },
      { value: Consts.calculationOptions.MANUAL, title: "Manual" },
    ],
    isRelevant: sp => showTextSubSection(sp) && (!isSlideshowLayout(sp) && presentOuterInformation(sp)) 
  },
  textBoxHeight: {
    section: SECTIONS.DESIGN,
    subSection: SUB_SECTIONS.DESIGN.TEXTS,
    title: 'Text Box Height',
    description: "",
    type: INPUT_TYPES.NUMBER,
    min: 1,
    max: 400,
    units: 'px',
    isRelevant: sp => showTextSubSection(sp) && (!isSlideshowLayout(sp) && presentOuterInformation(sp) && sp.calculateTextBoxHeightMode === Consts.calculationOptions.MANUAL) 
  },
  textImageSpace: {
    section: SECTIONS.DESIGN,
    subSection: SUB_SECTIONS.DESIGN.TEXTS,
    title: 'Text Space From Image',
    description: "",
    type: INPUT_TYPES.NUMBER,
    min: 0,
    max: 100,
    units: 'px',
    isRelevant: sp =>  showTextSubSection(sp) && (!isSlideshowLayout(sp) && presentOuterInformation(sp) && sp.infoType === Consts.infoType.SEPARATED_BACKGROUND)  
  },
  textBoxBorderRadius: {
    section: SECTIONS.DESIGN,
    subSection: SUB_SECTIONS.DESIGN.TEXTS,
    title: 'Text box corner radius',
    description: "",
    type: INPUT_TYPES.NUMBER,
    min: 0,
    max: 900,
    units: 'px',
    isRelevant: sp =>  showTextSubSection(sp) && (!isSlideshowLayout(sp) && presentOuterInformation(sp) && sp.infoType === Consts.infoType.SEPARATED_BACKGROUND)  
  },
  textBoxBorderWidth: {
    section: SECTIONS.DESIGN,
    subSection: SUB_SECTIONS.DESIGN.TEXTS,
    title: 'Text box border width',
    description: "",
    type: INPUT_TYPES.NUMBER,
    min: 0,
    max: 20,
    units: 'px',
    isRelevant: sp =>  showTextSubSection(sp) && (!isSlideshowLayout(sp) && presentOuterInformation(sp) && sp.infoType === Consts.infoType.SEPARATED_BACKGROUND)  
  },
  textBoxBorderColor: {
    section: SECTIONS.DESIGN,
    subSection: SUB_SECTIONS.DESIGN.TEXTS,
    title: 'Text box border color',
    description: "",
    type: INPUT_TYPES.COLOR_PICKER,
    alert: 'implement!',
    isRelevant: sp =>  showTextSubSection(sp) && (!isSlideshowLayout(sp) && presentOuterInformation(sp) && sp.infoType === Consts.infoType.SEPARATED_BACKGROUND)  
  },
  textsVerticalPadding: {
    section: SECTIONS.DESIGN,
    subSection: SUB_SECTIONS.DESIGN.TEXTS,
    title: 'Text vertical padding',
    description: "",
    type: INPUT_TYPES.NUMBER,
    min: 0,
    max: 50,
    units: 'px',
    isRelevant: sp =>  showTextSubSection(sp) && (!isSlideshowLayout(sp) && (sp.titlePlacement !== Consts.placements.SHOW_ON_HOVER || !sp.galleryVerticalAlign === 'center'))
  },
  textsHorizontalPadding: {
    section: SECTIONS.DESIGN,
    subSection: SUB_SECTIONS.DESIGN.TEXTS,
    title: 'Text horizontal padding',
    description: "",
    type: INPUT_TYPES.NUMBER,
    min: 0,
    max: 50,
    units: 'px',
    isRelevant: sp =>  showTextSubSection(sp) && (!isSlideshowLayout(sp)) 
  },
  titleDescriptionSpace: {
    section: SECTIONS.DESIGN,
    subSection: SUB_SECTIONS.DESIGN.TEXTS,
    title: 'Title Description Space',
    description: "",
    type: INPUT_TYPES.NUMBER,
    min: 0,
    max: 50,
    units: 'px',
    isRelevant: sp =>  showTextSubSection(sp) && (!isSlideshowLayout(sp) && sp.allowTitle && sp.allowDescription)
  },
  useCustomButton: {
    section: SECTIONS.DESIGN,
    subSection: SUB_SECTIONS.DESIGN.BUTTONS,
    title: 'Buy Now Button',
    description: "",
    type: INPUT_TYPES.BOOLEAN,
    isRelevant: sp => showButtonSection(sp)
  },
  customButtonText: {
    section: SECTIONS.DESIGN,
    subSection: SUB_SECTIONS.DESIGN.BUTTONS,
    title: 'Button Text',
    description: "",
    type: INPUT_TYPES.TEXT,
    isRelevant: sp => showButtonSection(sp) && sp.useCustomButton
  },
  customButtonFontForHover: {
    section: SECTIONS.DESIGN,
    subSection: SUB_SECTIONS.DESIGN.BUTTONS,
    title: 'Button Font Hover',
    description: "",
    type: INPUT_TYPES.FONT_PICKER,
    alert: 'implement',
    isRelevant: sp => showButtonSection(sp) && sp.useCustomButton && isTitlePlacementAlwaysShown(sp)
  },
  customButtonFontColorForHover: {
    section: SECTIONS.DESIGN,
    subSection: SUB_SECTIONS.DESIGN.BUTTONS,
    title: 'Button Font Color Hover',
    description: "",
    type: INPUT_TYPES.COLOR_PICKER,
    alert: 'implement!',
    isRelevant: sp => showButtonSection(sp) && sp.useCustomButton && isTitlePlacementAlwaysShown(sp)
  },
  customButtonFont: {
    section: SECTIONS.DESIGN,
    subSection: SUB_SECTIONS.DESIGN.BUTTONS,
    title: 'Button Font',
    description: "",
    type: INPUT_TYPES.FONT_PICKER,
    alert: 'implement',
    fontMinSize:14,
    fontMaxSize: 22,
    isRelevant: sp =>showButtonSection(sp) &&  sp.useCustomButton && !isTitlePlacementAlwaysShown(sp)
  },
  customButtonFontColor: {
    section: SECTIONS.DESIGN,
    subSection: SUB_SECTIONS.DESIGN.BUTTONS,
    title: 'Button Font Color',
    description: "",
    type: INPUT_TYPES.COLOR_PICKER,
    alert: 'implement!',
    isRelevant: sp => showButtonSection(sp) && sp.useCustomButton && !isTitlePlacementAlwaysShown(sp)
  },
  customButtonColor: {
    section: SECTIONS.DESIGN,
    subSection: SUB_SECTIONS.DESIGN.BUTTONS,
    title: 'Button Color',
    description: "",
    type: INPUT_TYPES.COLOR_PICKER,
    alert: 'implement!',
    isRelevant: sp => showButtonSection(sp) && sp.useCustomButton && !isTitlePlacementAlwaysShown(sp)
  },
  customButtonBorderWidth: {
    section: SECTIONS.DESIGN,
    subSection: SUB_SECTIONS.DESIGN.BUTTONS,
    title: 'Border Width',
    description: "",
    type: INPUT_TYPES.NUMBER,
    min: 0,
    max: 5,
    isRelevant: sp => showButtonSection(sp) && sp.useCustomButton && !isTitlePlacementAlwaysShown(sp)
  },
  customButtonBorderColor: {
    section: SECTIONS.DESIGN,
    subSection: SUB_SECTIONS.DESIGN.BUTTONS,
    title: 'Border Color',
    description: "",
    type: INPUT_TYPES.COLOR_PICKER,
    alert: 'implement!',
    isRelevant: sp => showButtonSection(sp) && sp.useCustomButton && !isTitlePlacementAlwaysShown(sp)
  },
  customButtonBorderRadius: {
    section: SECTIONS.DESIGN,
    subSection: SUB_SECTIONS.DESIGN.BUTTONS,
    title: 'Border Radius',
    description: "",
    type: INPUT_TYPES.NUMBER,
    min: 0,
    max: 30,
    isRelevant: sp => showButtonSection(sp) && sp.useCustomButton && !isTitlePlacementAlwaysShown(sp)
  },
  loadMoreButtonText: {
    section: SECTIONS.DESIGN,
    subSection: SUB_SECTIONS.DESIGN.BUTTONS,
    title: 'load more Button Text',
    description: "",
    type: INPUT_TYPES.TEXT,
    isRelevant: sp => showButtonSection(sp) && showInfiniteScroll(sp) && !sp.enableInfiniteScroll 
  },
  loadMoreButtonFont: {
    section: SECTIONS.DESIGN,
    subSection: SUB_SECTIONS.DESIGN.BUTTONS,
    title: 'load more Button Font',
    description: "",
    type: INPUT_TYPES.FONT_PICKER,
    alert: 'implement',
    isRelevant: sp => showButtonSection(sp) && showInfiniteScroll(sp) && !sp.enableInfiniteScroll 
  },
  loadMoreButtonFontColor: {
    section: SECTIONS.DESIGN,
    subSection: SUB_SECTIONS.DESIGN.BUTTONS,
    title: 'load more Button Font Color',
    description: "",
    type: INPUT_TYPES.COLOR_PICKER,
    alert: 'implement!',
    isRelevant: sp => showButtonSection(sp) && showInfiniteScroll(sp) && !sp.enableInfiniteScroll 
  },
  loadMoreButtonColor: {
    section: SECTIONS.DESIGN,
    subSection: SUB_SECTIONS.DESIGN.BUTTONS,
    title: 'Button Color & Opacity',
    description: "",
    type: INPUT_TYPES.COLOR_PICKER,
    alert: 'implement!',
    isRelevant: sp => showButtonSection(sp) && showInfiniteScroll(sp) && !sp.enableInfiniteScroll 
  },
  loadMoreButtonBorderWidth: {
    section: SECTIONS.DESIGN,
    subSection: SUB_SECTIONS.DESIGN.BUTTONS,
    title: 'load more Border Width',
    description: "",
    type: INPUT_TYPES.NUMBER,
    min: 0,
    max: 5,
    isRelevant: sp => showButtonSection(sp) && showInfiniteScroll(sp) && !sp.enableInfiniteScroll 
  },
  loadMoreButtonBorderColor: {
    section: SECTIONS.DESIGN,
    subSection: SUB_SECTIONS.DESIGN.BUTTONS,
    title: 'load more Border Color',
    description: "",
    type: INPUT_TYPES.COLOR_PICKER,
    alert: 'implement!',
    isRelevant: sp => showButtonSection(sp) && showInfiniteScroll(sp) && !sp.enableInfiniteScroll 
  }, 
  loadMoreButtonBorderRadius: {
    section: SECTIONS.DESIGN,
    subSection: SUB_SECTIONS.DESIGN.BUTTONS,
    title: 'load More Border Radius',
    description: "",
    type: INPUT_TYPES.NUMBER,
    min: 0,
    max: 30,
    isRelevant: sp => showButtonSection(sp) && showInfiniteScroll(sp) && !sp.enableInfiniteScroll 
  },
  imageInfoType: {
    section: SECTIONS.DESIGN,
    subSection: SUB_SECTIONS.DESIGN.ITEM_STYLE,
    title: 'Choose info layout',
    description: "",
    type: INPUT_TYPES.OPTIONS,
    options: [
      { value: Consts.infoType.NO_BACKGROUND, title: "Clean" },
      { value: Consts.infoType.ATTACHED_BACKGROUND, title: "Attached" },
      { value: Consts.infoType.SEPARATED_BACKGROUND, title: "Separated" },
    ],
    isRelevant: sp => presentOuterInformation(sp) && showTexts(sp)
  },
  itemBorderWidth: {
    section: SECTIONS.DESIGN,
    subSection: SUB_SECTIONS.DESIGN.ITEM_STYLE,
    title: 'item Border Width',
    description: "",
    type: INPUT_TYPES.NUMBER,
    min: 0,
    max: 20,
    units: 'px',
    isRelevant: showItemBorderAndShadowConfig
  },
  itemBorderColor: {
    section: SECTIONS.DESIGN,
    subSection: SUB_SECTIONS.DESIGN.ITEM_STYLE,
    title: 'item Border Color & Opacity',
    description: "",
    type: INPUT_TYPES.COLOR_PICKER,
    alert: 'implement!',
    isRelevant: showItemBorderAndShadowConfig
  },
  itemBorderRadius: {
    section: SECTIONS.DESIGN,
    subSection: SUB_SECTIONS.DESIGN.ITEM_STYLE,
    title: 'item Border Radius',
    description: "",
    type: INPUT_TYPES.NUMBER,
    min: 0,
    max: 900,
    units: 'px',
    isRelevant: showItemBorderAndShadowConfig
  },
  itemEnableShadow: {
    section: SECTIONS.DESIGN,
    subSection: SUB_SECTIONS.DESIGN.ITEM_STYLE,
    title: 'Shadow',
    description: "",
    type: INPUT_TYPES.BOOLEAN,
    isRelevant: showShadow
  },
  itemShadowOpacityAndColor: {
    section: SECTIONS.DESIGN,
    subSection: SUB_SECTIONS.DESIGN.ITEM_STYLE,
    title: 'Shadow Opacity & Color',
    description: "",
    type: INPUT_TYPES.COLOR_PICKER,
    alert: 'implement!',
    isRelevant: sp => showShadow(sp) && sp.itemEnableShadow
  },
  itemShadowBlur: {
    section: SECTIONS.DESIGN,
    subSection: SUB_SECTIONS.DESIGN.ITEM_STYLE,
    title: 'Shadow Blur',
    description: "",
    type: INPUT_TYPES.NUMBER,
    min: 0,
    max: 80,
    units: 'px',
    isRelevant: sp => showShadow(sp) && sp.itemEnableShadow
  },
  itemShadowDirection: {
    section: SECTIONS.DESIGN,
    subSection: SUB_SECTIONS.DESIGN.ITEM_STYLE,
    title: 'Shadow Direction',
    description: "",
    type: INPUT_TYPES.NUMBER,
    min: 0,
    max: 360,
    units: '°',
    isRelevant: sp => showShadow(sp) && sp.itemEnableShadow
  },
  itemShadowSize: {
    section: SECTIONS.DESIGN,
    subSection: SUB_SECTIONS.DESIGN.ITEM_STYLE,
    title: 'Shadow Size',
    description: "",
    type: INPUT_TYPES.NUMBER,
    min: 0,
    max: 150,
    units: 'px',
    isRelevant: sp => showShadow(sp) && sp.itemEnableShadow
  },
  imageLoadingMode: {
    section: SECTIONS.DESIGN,
    subSection: SUB_SECTIONS.DESIGN.ITEM_STYLE,
    title: 'What shows while image is loading?',
    description: "",
    type: INPUT_TYPES.OPTIONS,
    options: [
      { value: Consts.loadingMode.BLUR, title: "Blurred Image" },
      { value: Consts.loadingMode.COLOR, title: "Color Background Placeholder" }
    ],
    isRelevant: () => true
  },
  imageLoadingColor: {
    section: SECTIONS.DESIGN,
    subSection: SUB_SECTIONS.DESIGN.ITEM_STYLE,
    title: 'Color Background Placeholder',
    description: "",
    type: INPUT_TYPES.COLOR_PICKER,
    alert: 'implement!',
    isRelevant: sp => sp.imageLoadingMode === Consts.loadingMode.COLOR
  },
  expandAnimation: {
    section: SECTIONS.DESIGN,
    subSection: SUB_SECTIONS.DESIGN.EXPAND_MODE,
    title: 'How does your expand mode open?',
    description: "",
    type: INPUT_TYPES.OPTIONS,
    options: [
      { value: Consts.expandAnimations.NO_EFFECT, title: "No effect" },
      { value: Consts.expandAnimations.EXPAND, title: "Expand" },
      { value: Consts.expandAnimations.FADE_IN, title: "fade in" },
    ],
    isRelevant: sp => sp.itemClick === Consts.itemClick.EXPAND || isStore(sp)
  },
  scrollAnimation: {
    section: SECTIONS.DESIGN,
    subSection: SUB_SECTIONS.DESIGN.SCROLL_ANIMATION,
    title: 'Choose how images appear when scrolling down the page',
    description: "",
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
    isRelevant: sp => showScrollAnimations(sp)
  },
  oneColorAnimationColor: {
    section: SECTIONS.DESIGN,
    subSection: SUB_SECTIONS.DESIGN.SCROLL_ANIMATION,
    title: 'Pick a color',
    description: "",
    type: INPUT_TYPES.COLOR_PICKER,
    alert: 'implement!',
    isRelevant: sp => showScrollAnimations(sp) && sp.scrollAnimation === Consts.scrollAnimations.ONE_COLOR
  },
  allowTitleExpand: {
    section: SECTIONS.EXPAND_MODE,
    title: 'Title',
    description: "",
    type: INPUT_TYPES.BOOLEAN,
    isRelevant: sp => showExpendSection(sp)
  },
  allowDescriptionExpand: {
    section: SECTIONS.EXPAND_MODE,
    title: 'Description',
    description: "",
    type: INPUT_TYPES.BOOLEAN,
    isRelevant: sp => showExpendSection(sp)
  },
  allowLinkExpand: {
    section: SECTIONS.EXPAND_MODE,
    title: 'Link',
    description: "",
    type: INPUT_TYPES.BOOLEAN,
    isRelevant: sp => showExpendSection(sp)
  },
  expandInfoPosition: {
    section: SECTIONS.EXPAND_MODE,
    subSection: SUB_SECTIONS.DESIGN.SCROLL_ANIMATION,
    title: 'Where does it appear?',
    description: "",
    type: INPUT_TYPES.OPTIONS,
    options: [
      { value: 0, title: "Side" },
      { value: 1, title: "Bottom" },
    ],
    isRelevant: sp => showExpendSection(sp) && !isStore(sp)
  },
  defaultShowInfoExpand: {
    section: SECTIONS.EXPAND_MODE,
    subSection: SUB_SECTIONS.DESIGN.SCROLL_ANIMATION,
    title: 'Choose how images appear when scrolling down the page',
    description: "",
    type: INPUT_TYPES.OPTIONS,
    options: [
      { value: 0, title: "When clicking info icon" },
      { value: 1, title: "Always" },
    ],
    alert: '"showInfoExpandButton" property is set accordingly',
    isRelevant: sp => showExpendSection(sp) && sp.expandInfoPosition !== 1 && !isStore(sp)
  },
  allowFullscreenExpand: {
    section: SECTIONS.EXPAND_MODE,
    title: 'Allow full screen',
    description: 'Viewers can open images in full screen mode.',
    type: INPUT_TYPES.BOOLEAN,
    isRelevant: sp => showExpendSection(sp) && !isStore(sp)
  },
  fullscreenLoop: {
    section: SECTIONS.EXPAND_MODE,
    title: 'Loop images',
    description: 'Viewers can scroll through images in a continuous loop.',
    type: INPUT_TYPES.BOOLEAN,
    isRelevant: sp => showExpendSection(sp) && !isStore(sp)
  },
  bgColorExpand: {
    section: SECTIONS.EXPAND_MODE,
    title: 'Background color',
    description: "",
    type: INPUT_TYPES.COLOR_PICKER,
    alert: 'implement!',
    isRelevant: sp => showExpendSection(sp)
  },
  actionsColorExpand: {
    section: SECTIONS.EXPAND_MODE,
    title: 'Icon color',
    description: "",
    type: INPUT_TYPES.COLOR_PICKER,
    alert: 'implement!',
    isRelevant: sp => showExpendSection(sp)
  },
  titleFontExpand: {
    section: SECTIONS.EXPAND_MODE,
    title: 'title Font Expand',
    description: "",
    type: INPUT_TYPES.FONT_PICKER,
    alert: 'implement',
    isRelevant: sp => showExpendSection(sp) && sp.allowTitleExpand
  },
  titleColorExpand: {
    section: SECTIONS.EXPAND_MODE,
    title: 'title Color Expand',
    description: "",
    type: INPUT_TYPES.COLOR_PICKER,
    alert: 'implement!',
    isRelevant: sp => showExpendSection(sp) && sp.allowTitleExpand 
  },
  descriptionFontExpand: {
    section: SECTIONS.EXPAND_MODE,
    title: 'description Font Expand',
    description: "",
    type: INPUT_TYPES.FONT_PICKER,
    alert: 'implement',
    isRelevant: sp => showExpendSection(sp) && sp.allowDescriptionExpand
  },
  descriptionColorExpand: {
    section: SECTIONS.EXPAND_MODE,
    title: 'description Color Expand',
    description: "",
    type: INPUT_TYPES.COLOR_PICKER,
    alert: 'implement!',
    isRelevant: sp => showExpendSection(sp) && sp.allowDescriptionExpand
  },
  galleryAlignExpand: {
    section: SECTIONS.EXPAND_MODE,
    title: 'Text alignment',
    description: "",
    type: INPUT_TYPES.OPTIONS,
    options: [
      { value: 'left', title: "left" },
      { value: 'center', title: "center" },
      { value: 'right', title: "right" },
    ],
    alert: '"galleryAlignExpandIcons" property is being accordingly set',
    isRelevant: sp => showExpendSection(sp) && (sp.allowDescriptionExpand || sp.allowTitleExpand) && !isStore(sp)
  },
  addToCartBackColorExpand: {
    section: SECTIONS.EXPAND_MODE,
    title: 'addToCartBackColorExpand - Button color & opacity',
    description: "",
    type: INPUT_TYPES.COLOR_PICKER,
    alert: 'implement!',
    isRelevant: sp => showExpendSection(sp) && isStore(sp)
  }, 
  addToCartFontExpand: {
    section: SECTIONS.EXPAND_MODE,
    title: 'add To Cart Font Expand',
    description: "",
    type: INPUT_TYPES.FONT_PICKER,
    alert: 'implement',
    isRelevant: sp => showExpendSection(sp) && showAddToCartSection(sp) 
  },
  addToCartColorExpand: {
    section: SECTIONS.EXPAND_MODE,
    title: 'add To Cart Color Expand',
    description: "",
    type: INPUT_TYPES.COLOR_PICKER,
    alert: 'implement!',
    isRelevant: sp => showExpendSection(sp) && showAddToCartSection(sp)
  },
  addToCartBorderWidth: {
    section: SECTIONS.EXPAND_MODE,
    title: 'add To Cart Border width',
    description: "",
    type: INPUT_TYPES.NUMBER,
    min: 0,
    max: 5,
    units: 'px',
    isRelevant: sp => showExpendSection(sp) && showAddToCartSection(sp)
  },
  addToCartBorderColor: {
    section: SECTIONS.EXPAND_MODE,
    title: 'add To Cart Border Color',
    description: "",
    type: INPUT_TYPES.COLOR_PICKER,
    alert: 'implement!',
    isRelevant: sp => showExpendSection(sp) && showAddToCartSection(sp)
  },
  addToCartButtonText: {
    section: SECTIONS.EXPAND_MODE,
    title: 'add To Cart Button Text',
    description: "",
    type: INPUT_TYPES.TEXT,
    maxLength: 30,
    isRelevant: sp => showExpendSection(sp) && showAddToCartSection(sp)
  },
  imageQuality: {
    section: SECTIONS.ADVANCED,
    title: 'Image Quality',
    description: 'Higher quality images often take longer to load. The recommended setting is 90%. (JPEG images only)',
    type: INPUT_TYPES.NUMBER,
    min: 30,
    max: 100,
    alert: 'doesn\'t influence - this builds "sharpParams" object - as "imageQuality" property',
    isRelevant: () => true
  },
  usmToggle: {
    section: SECTIONS.ADVANCED,
    title: 'Image Sharpening',
    description: 'Sharpen all images in this gallery using the Amount, Radius and Threshold controls.',
    type: INPUT_TYPES.BOOLEAN,
    isRelevant: () => true
  },
  usm_a: {
    section: SECTIONS.ADVANCED,
    title: 'Amount',
    description: '',
    type: INPUT_TYPES.NUMBER,
    min: 0,
    max: 500,
    units: '%',
    alert: 'inside "sharpParams" object as "usm_a" property + percentage - should be divided by 100',
    isRelevant: sp => sp.usmToggle,
  },
  usm_r: {
    section: SECTIONS.ADVANCED,
    title: 'Radius',
    description: '',
    type: INPUT_TYPES.NUMBER,
    min: 0,
    max: 50,
    units: 'px',
    step: 0.1,
    alert: 'inside "sharpParams" object as "usm_r" property',
    isRelevant: sp => sp.usmToggle,
  },
  usm_t: {
    section: SECTIONS.ADVANCED,
    title: 'Threshold (Levels)',
    description: '',
    type: INPUT_TYPES.NUMBER,
    min: 0,
    max: 255,
    units: 'lv',
    alert: 'inside "sharpParams" object as "usm_t" property + percentage - should be divided by 255',
    isRelevant: sp => sp.usmToggle,
  },
  videoPlay: {
    section: SECTIONS.ADVANCED,
    title: 'Playing Options',
    description: 'You control how your videos play: On hover, autoplay, or on click.',
    type: INPUT_TYPES.OPTIONS,
    options: [
      { value: Consts.videoPlay.HOVER, title: "On hover" },
      { value: Consts.videoPlay.AUTO, title: "Autoplay" },
      { value: Consts.videoPlay.ON_CLICK, title: "On click" },
    ],
    isRelevant: () => true,
  },
  videoSound: {
    section: SECTIONS.ADVANCED,
    title: 'Play with sound',
    description: 'Videos are muted in gallery view by default. Enable to play videos with sound. In Expand Mode, the video will always play with the sound on.',
    type: INPUT_TYPES.BOOLEAN,
    isRelevant: sp => sp.videoPlay !== Consts.videoPlay.ON_CLICK
  },
  videoSpeed: {
    section: SECTIONS.ADVANCED,
    title: 'Playback speed',
    description: 'You control how your videos play: On hover, autoplay, or on click.',
    type: INPUT_TYPES.OPTIONS,
    options: [
      { value: '0.25', title: ".25x"   },
      { value: '0.5', title: ".50x"},
      { value: '1', title: "Normal"   },
      { value: '1.25', title: "1.25x"   },
      { value: '1.5', title: "1.50x"},
      { value: '2', title: "2.00x"   },
    ],
    isRelevant: () => true,
  },
  videoLoop: {
    section: SECTIONS.ADVANCED,
    title: 'Loop videos',
    description: '',
    type: INPUT_TYPES.BOOLEAN,
    isRelevant: () => true
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