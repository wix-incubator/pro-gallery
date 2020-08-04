import { galleryOptions } from 'pro-gallery-lib';

export const INPUT_TYPES = {
    NUMBER: "NUMBER",
    BOOLEAN: "BOOLEAN",
    OPTIONS: "OPTIONS",
    TEXT: "TEXT",
    COLOR_PICKER: "COLOR_PICKER",
    FONT_PICKER: "FONT_PICKER",
    BUTTON: "BUTTON",
    MULTISELECT: "MULTISELECT",
    MULTIREPEAT: "MULTIREPEAT",
};


export const SECTIONS = {
    PRESET: 'Presets',
    LAYOUT: 'Layout Customization',
    ADVANCED: 'Advanced Layout Settings',
    BEHAVIOR: 'Behavior Settings',
    INFO: 'Item info',
    DESIGN: 'Design Settings',
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
    [SECTIONS.PRESET]: [
        'galleryLayout',
    ],
    [SECTIONS.LAYOUT]: [
        'allowLeanGallery',
        'scrollDirection',
        'isVertical',
        'isRTL',
        'imageMargin',

        'gridStyle',
        'fixedColumns',
        'numberOfImagesPerRow',
        'numberOfImagesPerCol',

        'collageDensity',

        'cubeImages',
        'cubeType',
        'cubeRatio',
        // 'gallerySliderImageRatio',

        'showArrows',
        'slideshowLoop',
        'isAutoSlideshow',
        'autoSlideshowInterval',
        'slideshowInfoSize',
        'playButtonForAutoSlideShow',

        'galleryThumbnailsAlignment',
        'thumbnailSize',
        'thumbnailSpacings',

    ],
    [SECTIONS.ADVANCED]: [
        'gallerySizeType',
        'gallerySize',
        'gallerySizePx',
        'gallerySizeRatio',
        'groupSize',
        'groupTypes',
        'rotatingGroupTypes',
        'rotatingCropRatios',
        'groupsPerStrip',
        'galleryMargin',
        'floatingImages',
    ],
    [SECTIONS.INFO]: [
        'titlePlacement',
        'itemOpacity',
        'allowSlideshowCounter',
    ],
    [SECTIONS.BEHAVIOR]: [
        'enableInfiniteScroll',
        'loadMoreAmount',
        'hoveringBehaviour',
        'itemClick',
        'scrollSnap',
        'RCP',
    ],
    [SECTIONS.DESIGN]: [
        'arrowsSize',
        'arrowsColor',
        'arrowsPosition',

        // 'itemIconColorSlideshow',
        // 'itemIconColor',
        // 'textBoxFillColor',
        'textBoxHeight',
        'calculateTextBoxWidthMode',
        'textBoxWidthPercent',
        'textBoxWidth',
        'textImageSpace',
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
        'imageInfoType',
        // 'itemBorderWidth',
        // 'itemBorderColor',
        // 'itemBorderRadius',
        // 'itemEnableShadow',
        // 'itemShadowOpacityAndColor',
        // 'itemShadowBlur',
        // 'itemShadowDirection',
        // 'itemShadowSize',
    ],
    [SECTIONS.ANIMATION]: [
        'overlayAnimation',
        'imageHoverAnimation',
        'imageLoadingMode',
        'imageLoadingColor',
        'imagePlacementAnimation',
        'scrollAnimation',
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
        'videoSound',
        'videoLoop',
    ],
}

export const stylesList = [].concat(...Object.values(stylesBySection));
export const sectionByStyle = Object.assign({},
    ...Object.entries(stylesBySection).map(([section, styleParams]) => styleParams.reduce((obj, styleParam) => ({
        ...obj,
        [styleParam]: section
    }), {}))
);


export const settingsManager = stylesList.reduce((obj, styleParam) => {
  const settingsData = galleryOptions[styleParam];

  return settingsData ? {
    ...obj,
    [styleParam]: {
      ...settingsData,
      section: sectionByStyle[styleParam]
    }
  } : {
    ...obj,
    [styleParam] :{
      missing: true,
      title: styleParam,
      section: sectionByStyle[styleParam],
      isRelevant: () => false
    }
  }
}, {});

