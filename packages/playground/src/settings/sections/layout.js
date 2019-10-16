import { INPUT_TYPES, GALLERY_CONSTS } from './consts';
import {
  isSlideshowLayout,
  showThumbnailResize,
  oneRow,
  showSlideshowSettings,
  showAutoSlideshow,
} from './utils';

export default {
  slideshowLoop: {
    title: 'Loop Images',
    description: "",
    type: INPUT_TYPES.BOOLEAN,
    isRelevant: showSlideshowSettings,
  },
  isAutoSlideshow: {
    title: 'Auto Slide',
    description: "",
    type: INPUT_TYPES.BOOLEAN,
    isRelevant: showAutoSlideshow
  },
  autoSlideshowInterval: {
    title: 'Time Between Images',
    description: "",
    type: INPUT_TYPES.NUMBER,
    min: 2,
    max: 30,
    isRelevant: (sp) => showAutoSlideshow(sp) && sp.isAutoSlideshow,
  },
  slideshowInfoSize: {
    title: 'Info bar size',
    description: "",
    type: INPUT_TYPES.NUMBER,
    min: 0,
    max: 500,
    isRelevant: isSlideshowLayout,
  },
  playButtonForAutoSlideShow: {
    title: 'Play button',
    description: "",
    type: INPUT_TYPES.BOOLEAN,
    isRelevant: isSlideshowLayout,
  },
  scrollDirection: {
    title: "Scroll Direction",
    description: "",
    type: INPUT_TYPES.OPTIONS,
    options: [
      { value: 0, title: "Vertical" },
      { value: 1, title: "Horizontal" }
    ],
    isRelevant: sp => [GALLERY_CONSTS.layout.EMPTY, GALLERY_CONSTS.layout.COLLAGE, GALLERY_CONSTS.layout.GRID].indexOf(sp.galleryLayout) > -1,
  },
  isVertical: {
    title: "Image Orientation",
    description: "",
    type: INPUT_TYPES.OPTIONS,
    options: [{ value: false, title: "Rows" }, { value: true, title: "Columns" }],
    isRelevant: sp => [GALLERY_CONSTS.layout.COLLAGE, GALLERY_CONSTS.layout.MASONRY].indexOf(sp.galleryLayout) > -1,
  },
  isRTL: {
    title: "Layout Direction",
    description: "",
    type: INPUT_TYPES.OPTIONS,
    options: [{ value: false, title: "Left to Right" }, { value: true, title: "Right to Left" }],
    isRelevant: sp => [GALLERY_CONSTS.layout.PANORAMA].indexOf(sp.galleryLayout) === -1,
  },
  cubeImages: {
    title: "Allow Crop",
    description: "",
    type: INPUT_TYPES.BOOLEAN,
    isRelevant: showThumbnailResize,
  },
  cubeType: {
    title: "Thumbnail Resize",
    description: "",
    type: INPUT_TYPES.OPTIONS,
    options: [{ value: GALLERY_CONSTS.cubeType.CROP, title: "Crop" }, { value: GALLERY_CONSTS.cubeType.FIT, title: "Fit" }],
    isRelevant: showThumbnailResize,
  },
  cubeRatio: {
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
    isRelevant: sp => [GALLERY_CONSTS.layout.EMPTY, GALLERY_CONSTS.layout.GRID, GALLERY_CONSTS.layout.SLIDER].indexOf(sp.galleryLayout) > -1 && sp.cubeType === GALLERY_CONSTS.cubeType.crop,
  },
  gallerySliderImageRatio: {
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
    isRelevant: sp => sp.galleryLayout === GALLERY_CONSTS.layout.SLIDER && sp.cubeType === GALLERY_CONSTS.cubeType.crop,
    todo: 'remove this param, merge it in the wrapper'
  },
  galleryThumbnailsAlignment: {
    title: "Thumbnail Placement",
    description: "",
    type: INPUT_TYPES.OPTIONS,
    options: [
      { value: GALLERY_CONSTS.thumbnailsAlignment.BOTTOM, title: "Bottom" },
      { value: GALLERY_CONSTS.thumbnailsAlignment.LEFT, title: "Left" },
      { value: GALLERY_CONSTS.thumbnailsAlignment.TOP, title: "Top" },
      { value: GALLERY_CONSTS.thumbnailsAlignment.RIGHT, title: "Right" }
    ],
    isRelevant: sp => [GALLERY_CONSTS.layout.THUMBNAIL].indexOf(sp.galleryLayout) >= 0,
  },
  thumbnailSize: {
    title: "Thumbnail Size",
    description: "",
    type: INPUT_TYPES.NUMBER,
    min: 80,
    max: 300,
    isRelevant: sp => [GALLERY_CONSTS.layout.THUMBNAIL].indexOf(sp.galleryLayout) >= 0,
  },
  gridStyle: {
    title: "Grid Style",
    description: "",
    type: INPUT_TYPES.OPTIONS,
    options: [
      { value: 0, title: "Fit To Screen" },
      { value: 1, title: "Set Items Per Row" }
    ],
    isRelevant: sp => ((sp.galleryLayout === GALLERY_CONSTS.layout.GRID || sp.galleryLayout === GALLERY_CONSTS.layout.COLLAGE) && !oneRow(sp)),
  },
  numberOfImagesPerRow: {
    title: "Images Per Row",
    description: "",
    type: INPUT_TYPES.NUMBER,
    min: 1,
    max: 5,
    isRelevant: sp => ((sp.galleryLayout === GALLERY_CONSTS.layout.GRID || sp.galleryLayout === GALLERY_CONSTS.layout.COLLAGE) && !oneRow(sp)) && sp.gridStyle === 1,
  },
  numberOfImagesPerCol: {
    title: "Images Per Column",
    description: "",
    type: INPUT_TYPES.NUMBER,
    min: 1,
    max: 3,
    isRelevant: sp => [GALLERY_CONSTS.layout.GRID].indexOf(sp.galleryLayout) >= 0 && (sp.galleryLayout === GALLERY_CONSTS.layout.COLLAGE && !oneRow(sp)),
  },
  thumbnailSpacings: {
    title: "Spacing between Thumbnails",
    description: "",
    type: INPUT_TYPES.NUMBER,
    min: 0,
    max: 30,
    units: "px",
    isRelevant: sp => [GALLERY_CONSTS.layout.EMPTY, GALLERY_CONSTS.layout.THUMBNAIL].indexOf(sp.galleryLayout) > -1,
  },
  imageMargin: {
    title: "Spacing between Items",
    description: "Set the spacing between the items in your gallery.",
    type: INPUT_TYPES.NUMBER,
    min: 0,
    max: 500,
    units: "px",
    isRelevant: sp => [GALLERY_CONSTS.layout.EMPTY, GALLERY_CONSTS.layout.COLLAGE, GALLERY_CONSTS.layout.MASONRY, GALLERY_CONSTS.layout.GRID, GALLERY_CONSTS.layout.SLIDER, GALLERY_CONSTS.layout.PANORAMA, GALLERY_CONSTS.layout.COLUMN, GALLERY_CONSTS.layout.BRICKS, GALLERY_CONSTS.layout.MIX, GALLERY_CONSTS.layout.ALTERNATE].indexOf(sp.galleryLayout) > -1,
  },
  collageDensity: {
    title: "Collage Density",
    description: "",
    type: INPUT_TYPES.NUMBER,
    min: 1,
    max: 100,
    step: 10,
    units: "%",
    isRelevant: sp => [GALLERY_CONSTS.layout.EMPTY, GALLERY_CONSTS.layout.COLLAGE].indexOf(sp.galleryLayout) >= 0,
  },
  magicLayoutSeed: {
    title: "Random Layout",
    description: "",
    type: INPUT_TYPES.BUTTON,
    text: "Generate random layout",
    action: () => Math.random() * 100000,
    isRelevant: sp => [GALLERY_CONSTS.layout.MAGIC].indexOf(sp.galleryLayout) > -1,
  },

}