import LAYOUTS from '../../common/constants/layout';
import getStyleParamsFromUrl from '../helpers/playgroundUrlHelper';

//#region Imports Layouts
import {
  fixedStyles as alternate,
  createStyles as alternateStyles,
} from './alternateGallery';
import {
  fixedStyles as bricks,
  createStyles as bricksStyles,
} from './bricksGallery';
import {
  fixedStyles as collage,
  createStyles as collageStyles,
} from './collageGallery';
import {
  fixedStyles as fullsize,
  createStyles as fullsizeStyles,
} from './fullsizeGallery';
import {
  fixedStyles as column,
  createStyles as columnStyles,
} from './columnGallery';
import { fixedStyles as grid, createStyles as gridStyles } from './gridGallery';
import {
  fixedStyles as magic,
  createStyles as magicStyles,
} from './magicGallery';
import {
  fixedStyles as masonry,
  createStyles as masonryStyles,
} from './masonryGallery';
import { fixedStyles as mix, createStyles as mixStyles } from './mixGallery';
import {
  fixedStyles as panorama,
  createStyles as panoramaStyles,
} from './panoramaGallery';
import {
  fixedStyles as slider,
  createStyles as sliderStyles,
} from './sliderGallery';
import {
  fixedStyles as slideshow,
  createStyles as slideshowStyles,
} from './slideshowGallery';
import {
  fixedStyles as thumbnails,
  createStyles as thumbnailsStyles,
} from './thumbnailGallery';
import {
  fixedStyles as empty,
  createStyles as emptyStyles,
} from './emptyGallery';

// Designed Presets
// 1
import {
  fixedStyles as designedPreset_1,
  createStyles as designedPreset_1Styles,
} from './designedPresets/designedPreset_1';
// 2
import {
  fixedStyles as designedPreset_2,
  createStyles as designedPreset_2Styles,
} from './designedPresets/designedPreset_2';
// 3
import {
  fixedStyles as designedPreset_3,
  createStyles as designedPreset_3Styles,
} from './designedPresets/designedPreset_3';
// 4
import {
  fixedStyles as designedPreset_4,
  createStyles as designedPreset_4Styles,
} from './designedPresets/designedPreset_4';
// 5
import {
  fixedStyles as designedPreset_5,
  createStyles as designedPreset_5Styles,
} from './designedPresets/designedPreset_5';
// 6
import {
  fixedStyles as designedPreset_6,
  createStyles as designedPreset_6Styles,
} from './designedPresets/designedPreset_6';
// 7
import {
  fixedStyles as designedPreset_7,
  createStyles as designedPreset_7Styles,
} from './designedPresets/designedPreset_7';
// 8
import {
  fixedStyles as designedPreset_8,
  createStyles as designedPreset_8Styles,
} from './designedPresets/designedPreset_8';
//#endregion Imports

const addPresetStyles = (styles) => {
  // Relevant only for Wixers usage in Wix editor
  if (styles.playgroundUrl !== '') {
    return getStyleParamsFromUrl(styles.playgroundUrl, styles);
  }

  const galleryType = styles.galleryType;
  const galleryLayoutV1 = styles.galleryType;
  const galleryLayoutV2 = styles.galleryLayout;
  if (galleryLayoutV1 !== undefined && galleryLayoutV2 === undefined) {
    // legacy layouts - only if galleyrType parameter is specifically defined (i.e. layout had changed)

    switch (galleryType) {
      case '1': // horizontal collage
        return collageStyles(styles);
      case '2': // grid
        return gridStyles(styles);
      case '3': // vertical masonry
        return masonryStyles(styles);
      case '4': // horizontal masonry
        return masonryStyles(styles);
      case '5': // one column
        return panoramaStyles(styles);
      case '6': // one row
        return columnStyles(styles);
      case '7': // slideshow
        return slideshowStyles(styles);
      case '0': // vertical collage
      default:
        return collageStyles(styles);
    }
  } else {
    // new layouts
    switch (styles.galleryLayout) {
      case LAYOUTS.MASONRY:
        return masonryStyles(styles);
      case LAYOUTS.GRID:
        return gridStyles(styles);
      case LAYOUTS.THUMBNAIL:
        return thumbnailsStyles(styles);
      case LAYOUTS.SLIDER:
        return sliderStyles(styles);
      case LAYOUTS.SLIDESHOW:
        return slideshowStyles(styles);
      case LAYOUTS.PANORAMA:
        return panoramaStyles(styles);
      case LAYOUTS.COLUMN:
        return columnStyles(styles);
      case LAYOUTS.MAGIC:
        return magicStyles(styles);
      case LAYOUTS.FULLSIZE:
        return fullsizeStyles(styles);
      case LAYOUTS.BRICKS:
        return bricksStyles(styles);
      case LAYOUTS.MIX:
        return mixStyles(styles);
      case LAYOUTS.ALTERNATE:
        return alternateStyles(styles);
      case LAYOUTS.EMPTY:
        return emptyStyles(styles);
      // Designed Presets
      case LAYOUTS.DESIGNED_PRESET_1:
        return designedPreset_1Styles(styles);
      case LAYOUTS.DESIGNED_PRESET_2:
        return designedPreset_2Styles(styles);
      case LAYOUTS.DESIGNED_PRESET_3:
        return designedPreset_3Styles(styles);
      case LAYOUTS.DESIGNED_PRESET_4:
        return designedPreset_4Styles(styles);
      case LAYOUTS.DESIGNED_PRESET_5:
        return designedPreset_5Styles(styles);
      case LAYOUTS.DESIGNED_PRESET_6:
        return designedPreset_6Styles(styles);
      case LAYOUTS.DESIGNED_PRESET_7:
        return designedPreset_7Styles(styles);
      case LAYOUTS.DESIGNED_PRESET_8:
        return designedPreset_8Styles(styles);
      case LAYOUTS.COLLAGE:
      default:
        return collageStyles(styles);
    }
  }
};

const NEW_PRESETS = {
  alternate,
  bricks,
  collage,
  fullsize,
  column,
  grid,
  magic,
  masonry,
  mix,
  panorama,
  slider,
  slideshow,
  thumbnails,
  empty,
  // Designed Presets
  designedPreset_1,
  designedPreset_2,
  designedPreset_3,
  designedPreset_4,
  designedPreset_5,
  designedPreset_6,
  designedPreset_7,
  designedPreset_8,
};

const getLayoutName = (galleryLayout) => {
  const galleyLayoutList = [
    'empty', // -1
    'collage', // 0
    'masonry', // 1
    'grid', // 2
    'thumbnails', // 3
    'slider', // 4
    'slideshow', // 5
    'panorama', // 6
    'column', // 7
    'magic', // 8
    'fullsize', // 9
    'bricks', // 10
    'alternate', // 11
    'mix', // 12,
    'designedPreset_1', // 13
    'designedPreset_2', // 14
    'designedPreset_3', // 15
    'designedPreset_4', // 16
    'designedPreset_5', // 17
    'designedPreset_6', // 18
    'designedPreset_7', // 19
    'designedPreset_8', // 20
  ];
  return galleyLayoutList[galleryLayout + 1];
};

// returns true if the given param is in the current layout preset
const isInPreset = (galleryLayout, paramToCheck) => {
  const layoutName = getLayoutName(galleryLayout) || 'empty'; // empty for when there is no layout given
  return Object.keys(NEW_PRESETS[layoutName]).includes(paramToCheck);
};

export { addPresetStyles, NEW_PRESETS, getLayoutName, isInPreset };
