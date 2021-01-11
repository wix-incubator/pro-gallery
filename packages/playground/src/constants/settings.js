import { galleryOptions } from 'pro-gallery-lib';

export const INPUT_TYPES = {
  NUMBER: 'NUMBER',
  BOOLEAN: 'BOOLEAN',
  OPTIONS: 'OPTIONS',
  TEXT: 'TEXT',
  COLOR_PICKER: 'COLOR_PICKER',
  FONT_PICKER: 'FONT_PICKER',
  BUTTON: 'BUTTON',
  MULTISELECT: 'MULTISELECT',
  MULTIREPEAT: 'MULTIREPEAT',
};

export const SECTIONS = {
  PRESET: 'Presets',
  DESIGNED_PRESET: 'Designed Presets',
  LAYOUT: 'Layout Customization',
  ADVANCED: 'Advanced Layout Options',
  BEHAVIOR: 'Behavior',
  INFO: 'Item info',
  DESIGN: 'Design',
  ANIMATION: 'Animations',
  // IMAGE: 'Image',
  VIDEO: 'Videos',
};

export const SECTIONS_ORDER = {
  PRESET: 1,
  LAYOUT: 2,
  ADVANCED: 3,
  BEHAVIOR: 4,
  INFO: 5,
  DESIGN: 6,
  ANIMATION: 7,
  IMAGE: 8,
  VIDEO: 9,
  STORE: 10,
};

export const stylesBySection = {
  [SECTIONS.PRESET]: ['galleryLayout'],
  [SECTIONS.DESIGNED_PRESET]: ['designedPreset'],
  [SECTIONS.LAYOUT]: [
    // 'allowLeanGallery',
    'scrollDirection',
    'isVertical',
    'isRTL',
    'imageMargin',

    'groupSize',
    'collageDensity',
    'minItemSize',

    'cubeImages',
    'cubeType',
    'cubeRatio',
    // 'gallerySliderImageRatio',

    'gallerySizeType',
    'gallerySize',
    'gallerySizePx',
    'gallerySizeRatio',

  ],
  [SECTIONS.ADVANCED]: [
    'gridStyle',
    'fixedColumns',
    'groupsPerStrip',

    'groupTypes',
    'rotatingGroupTypes',
    'rotatingCropRatios',
    'columnWidths',
    'galleryMargin',
    'scatter',
    'rotatingScatter',
    'smartCrop',

    'galleryThumbnailsAlignment',
    'thumbnailSize',
    'thumbnailSpacings',
  ],
  [SECTIONS.INFO]: [
    'titlePlacement',

    'imageInfoType',

    'textBoxHeight',
    'calculateTextBoxWidthMode',
    'textBoxWidthPercent',
    'textBoxWidth',
    'textImageSpace',

    'allowSlideshowCounter',
    'slideshowInfoSize',
  ],
  [SECTIONS.BEHAVIOR]: [
    'hoveringBehaviour',
    'enableInfiniteScroll',
    'loadMoreAmount',
    'scrollDuration',
    'slideshowLoop',
    'isAutoSlideshow',
    'autoSlideshowInterval',
    'playButtonForAutoSlideShow',
    'scrollSnap',
    'allowContextMenu',
  ],
  [SECTIONS.DESIGN]: [
    'showArrows',
    'arrowsSize',
    'arrowsColor',
    'arrowsPosition',

    'overlayBackground',
    'overlayBackgroundGradient',

    // 'itemIconColorSlideshow',
    // 'itemIconColor',
    // 'textBoxFillColor',
    'textBoxBorderRadius',
    'textBoxBorderWidth',
    'textBoxBorderColor',
    // 'loadMoreButtonText',
    // 'loadMoreButtonFont',
    // 'loadMoreButtonFontColor',
    // 'loadMoreButtonColor',
    // 'loadMoreButtonBorderWidth',
    // 'loadMoreButtonBorderColor',
    // 'loadMoreButtonBorderRadius',
    'itemBorderWidth',
    'itemBorderColor',
    'itemBorderRadius',
    'itemEnableShadow',
    'itemShadowOpacityAndColor',
    'itemShadowBlur',
    'itemShadowDirection',
    'itemShadowSize',
  ],
  [SECTIONS.ANIMATION]: [
    'overlayAnimation',
    'imageHoverAnimation',
    'imageLoadingMode',
    'imageLoadingColor',
    'imagePlacementAnimation',
    'scrollAnimation',
    'slideAnimation',
    'oneColorAnimationColor',
  ],
  [SECTIONS.IMAGE]: [
    // 'imageQuality',
    // 'usmToggle',
    // 'usm_a',
    // 'usm_r',
    // 'usm_t',
  ],
  [SECTIONS.VIDEO]: [
    'hidePlay',
    'videoPlay',
    'videoSpeed',
    'videoSound',
    'videoLoop',
  ],
};

export const stylesList = [].concat(...Object.values(stylesBySection));
export const sectionByStyle = Object.assign(
  {},
  ...Object.entries(stylesBySection).map(([section, styleParams]) =>
    styleParams.reduce(
      (obj, styleParam) => ({
        ...obj,
        [styleParam]: section,
      }),
      {}
    )
  )
);

export const settingsManager = stylesList.reduce((obj, styleParam) => {
  const settingsData = galleryOptions[styleParam];

  return settingsData
    ? {
        ...obj,
        [styleParam]: {
          ...settingsData,
          section: sectionByStyle[styleParam],
        },
      }
    : {
        ...obj,
        [styleParam]: {
          missing: true,
          title: styleParam,
          section: sectionByStyle[styleParam],
          isRelevant: () => false,
        },
      };
}, {});
