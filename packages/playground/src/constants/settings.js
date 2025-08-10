import { galleryOptions } from 'pro-gallery-lib';
import { optionsMap } from 'pro-gallery-lib';

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
  ThreeD: '3D',
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
  [SECTIONS.PRESET]: [optionsMap.layoutParams.structure.galleryLayout],
  [SECTIONS.LAYOUT]: [
    optionsMap.layoutParams.structure.scrollDirection,
    optionsMap.layoutParams.structure.galleryRatio.value,
    optionsMap.layoutParams.structure.galleryRatio.includeExternalInfo,
    optionsMap.layoutParams.thumbnails.enable,
    optionsMap.layoutParams.structure.layoutOrientation,
    optionsMap.layoutParams.structure.uniformDimensions,
    optionsMap.behaviourParams.gallery.layoutDirection,
    optionsMap.layoutParams.structure.itemSpacing,

    optionsMap.layoutParams.groups.groupSize,
    optionsMap.layoutParams.groups.density,

    optionsMap.layoutParams.crop.enable,
    optionsMap.layoutParams.crop.method,
    optionsMap.layoutParams.crop.ratios,
    optionsMap.layoutParams.crop.alignment,

    optionsMap.layoutParams.targetItemSize.minimum,
    optionsMap.layoutParams.targetItemSize.value,
    optionsMap.layoutParams.targetItemSize.unit,
  ],
  [SECTIONS.ADVANCED]: [
    optionsMap.layoutParams.structure.responsiveMode,
    optionsMap.layoutParams.structure.numberOfColumns,
    optionsMap.layoutParams.groups.numberOfGroupsPerRow,
    optionsMap.layoutParams.structure.groupsOrder,

    optionsMap.layoutParams.groups.allowedGroupTypes,
    optionsMap.layoutParams.groups.repeatingGroupTypes,
    optionsMap.layoutParams.structure.columnRatios,
    optionsMap.layoutParams.structure.gallerySpacing,
    optionsMap.layoutParams.structure.scatter.randomScatter,
    optionsMap.layoutParams.structure.scatter.manualScatter,
    // [optionsMap.layoutParams.crop.enableSmartCrop],

    optionsMap.layoutParams.thumbnails.position,
    optionsMap.layoutParams.thumbnails.alignment,
    optionsMap.layoutParams.thumbnails.size,
    optionsMap.layoutParams.thumbnails.spacing,
    optionsMap.layoutParams.thumbnails.marginToGallery,
    optionsMap.layoutParams.structure.enableStreching,
    optionsMap.behaviourParams.gallery.horizontal.blockScroll,
  ],
  [SECTIONS.INFO]: [
    optionsMap.layoutParams.info.placement,
    optionsMap.layoutParams.info.layout,
    optionsMap.layoutParams.info.height,
    optionsMap.layoutParams.info.width,
    optionsMap.layoutParams.info.sizeUnits,
    optionsMap.layoutParams.info.spacing,
    optionsMap.behaviourParams.gallery.horizontal.slideshowInfo.buttonsAlignment,
    optionsMap.behaviourParams.gallery.horizontal.slideshowInfo.enableCounter,
    optionsMap.behaviourParams.gallery.horizontal.slideshowInfo.enablePlayButton,
  ],
  [SECTIONS.BEHAVIOR]: [
    optionsMap.behaviourParams.item.clickAction,
    optionsMap.behaviourParams.item.video.speed,
    optionsMap.behaviourParams.item.video.volume,
    optionsMap.behaviourParams.item.video.loop,
    optionsMap.behaviourParams.item.video.playTrigger,
    optionsMap.behaviourParams.item.video.enablePlayButton,
    optionsMap.behaviourParams.item.video.enableThumbnailsPlayButton,
    optionsMap.behaviourParams.item.video.enableControls,
    optionsMap.behaviourParams.item.video.enablePlaceholder,
    optionsMap.behaviourParams.item.content.placementAnimation,
    optionsMap.behaviourParams.item.content.loader,
    optionsMap.behaviourParams.item.content.magnificationValue,
    optionsMap.behaviourParams.item.content.tiltAngleValue,
    optionsMap.behaviourParams.item.secondaryMedia.trigger,
    optionsMap.behaviourParams.item.secondaryMedia.behaviour,
    optionsMap.behaviourParams.item.secondaryMedia.trigger,
    optionsMap.behaviourParams.item.secondaryMedia.behaviour,
    optionsMap.behaviourParams.gallery.horizontal.loop,
  ],
  [SECTIONS.DESIGN]: [
    optionsMap.layoutParams.navigationArrows.enable,
    optionsMap.layoutParams.navigationArrows.size,
    optionsMap.layoutParams.navigationArrows.padding,
    optionsMap.layoutParams.navigationArrows.position,
    optionsMap.layoutParams.navigationArrows.verticalAlignment,
    optionsMap.layoutParams.navigationArrows.type,
    optionsMap.layoutParams.navigationArrows.container.type,
    optionsMap.layoutParams.navigationArrows.container.borderRadius,
    optionsMap.layoutParams.navigationArrows.container.backgroundColor,
    optionsMap.layoutParams.navigationArrows.mouseCursorContainerMaxWidth,
    optionsMap.behaviourParams.item.overlay.hoveringBehaviour,
    optionsMap.behaviourParams.item.overlay.position,
    optionsMap.behaviourParams.item.overlay.size,
    optionsMap.behaviourParams.item.overlay.sizeUnits,
    optionsMap.behaviourParams.item.overlay.padding,
    optionsMap.behaviourParams.item.overlay.backgroundColor,
    optionsMap.layoutParams.info.border.width,
    optionsMap.layoutParams.info.border.color,
    optionsMap.layoutParams.info.border.radius,
    optionsMap.stylingParams.arrowsColor,
    optionsMap.stylingParams.itemShadowBlur,
    optionsMap.stylingParams.itemShadowDirection,
    optionsMap.stylingParams.itemShadowOpacityAndColor,
    optionsMap.stylingParams.itemShadowSize,
    optionsMap.stylingParams.itemEnableShadow,
    optionsMap.stylingParams.itemBorderRadius,
    optionsMap.stylingParams.itemBorderWidth,
    optionsMap.stylingParams.itemBorderColor,
  ],
  [SECTIONS.ANIMATION]: [
    optionsMap.behaviourParams.item.content.hoverAnimation,
    optionsMap.behaviourParams.item.overlay.hoverAnimation,

    optionsMap.behaviourParams.item.content.loader,
    'imageLoadingColor',
    'oneColorAnimationColor',
    optionsMap.behaviourParams.item.content.placementAnimation,
    optionsMap.behaviourParams.gallery.scrollAnimation,
    optionsMap.behaviourParams.gallery.horizontal.slideAnimation,
    optionsMap.behaviourParams.gallery.horizontal.slideTransition,
  ],
  [SECTIONS.IMAGE]: [
    optionsMap.stylingParams.itemResolutionMode,
    // 'imageQuality',
    // 'usmToggle',
    // 'usm_a',
    // 'usm_r',
    // 'usm_t',
  ],
  [SECTIONS.VIDEO]: [
    optionsMap.behaviourParams.item.video.speed,
    optionsMap.behaviourParams.item.video.volume,
    optionsMap.behaviourParams.item.video.loop,
    optionsMap.behaviourParams.item.video.playTrigger,
    optionsMap.behaviourParams.item.video.enablePlayButton,
    optionsMap.behaviourParams.item.video.enableThumbnailsPlayButton,

    optionsMap.behaviourParams.item.video.enableControls,
    optionsMap.behaviourParams.item.video.enablePlaceholder,
  ],
  [SECTIONS.ThreeD]: [
    optionsMap.behaviourParams.item.threeDimensionalScene.playTrigger,
    optionsMap.behaviourParams.item.threeDimensionalScene.enablePlayButton,
    optionsMap.behaviourParams.item.threeDimensionalScene.enableThumbnailsPlayButton,
    optionsMap.behaviourParams.item.threeDimensionalScene.keepPosterAfterObjectLoad,
    ...Object.values(optionsMap.behaviourParams.item.threeDimensionalScene.controls),
    ...Object.values(optionsMap.behaviourParams.item.threeDimensionalScene.transform),
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
