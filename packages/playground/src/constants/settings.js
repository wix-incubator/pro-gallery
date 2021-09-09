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

export const optionsBySection = {
  [SECTIONS.PRESET]: ['galleryLayout'],
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
    'layoutParams_cropRatio',
    'cubeFitPosition',

    'gallerySizeType',
    'gallerySize',
    'gallerySizePx',
    'gallerySizeRatio',

  ],
  [SECTIONS.ADVANCED]: [
    'gridStyle',
    'numberOfImagesPerRow',
    'groupsPerStrip',
    'placeGroupsLtr',

    'groupTypes',
    'layoutParams_repeatingGroupTypes',
    'rotatingCropRatios',
    'columnWidths',
    'layoutParams_gallerySpacing',
    'scatter',
    'rotatingScatter',
    'smartCrop',

    'galleryThumbnailsAlignment',
    'thumbnailSize',
    'thumbnailSpacings',
    'useMaxDimensions'
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
    'autoSlideshowType',
    'autoSlideshowInterval',
    'autoSlideshowContinuousSpeed',
    'playButtonForAutoSlideShow',
    'scrollSnap',
    'allowContextMenu',
    'pauseAutoSlideshowOnHover',
    'itemClick',
    'magnificationLevel',
  ],
  [SECTIONS.DESIGN]: [
    'showArrows',
    'arrowsSize',
    'arrowsColor',
    'arrowsPosition',
    'arrowsPadding',
    'arrowsVerticalPosition',

    'overlayBackground',
    'overlayPosition',
    'overlaySize',
    'overlaySizeType',
    'overlayPadding',
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
    // 'loadMoreButtonBorderColor',
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
    'slideTransition',
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
    'enableVideoPlaceholder',
  ],
};

export const optionsList = [].concat(...Object.values(optionsBySection));
export const sectionByOption = Object.assign(
  {},
  ...Object.entries(optionsBySection).map(([section, options]) =>
    options.reduce(
      (obj, option) => ({
        ...obj,
        [option]: section,
      }),
      {}
    )
  )
);

export const settingsManager = optionsList.reduce((obj, option) => {
  const settingsData = galleryOptions[option];

  return settingsData
    ? {
        ...obj,
        [option]: {
          ...settingsData,
          section: sectionByOption[option],
        },
      }
    : {
        ...obj,
        [option]: {
          missing: true,
          title: option,
          section: sectionByOption[option],
          isRelevant: () => false,
        },
      };
}, {});
