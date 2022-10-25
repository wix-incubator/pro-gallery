import LAYOUTS from '../../common/constants/layout';

//#region Imports Layouts
import {
  fixedOptions as alternate,
  createOptions as alternateOptions,
} from './alternateGallery';
import {
  fixedOptions as bricks,
  createOptions as bricksOptions,
} from './bricksGallery';
import {
  fixedOptions as collage,
  createOptions as collageOptions,
} from './collageGallery';
import {
  fixedOptions as fullsize,
  createOptions as fullsizeOptions,
} from './fullsizeGallery';
import {
  fixedOptions as column,
  createOptions as columnOptions,
} from './columnGallery';
import {
  fixedOptions as grid,
  createOptions as gridOptions,
} from './gridGallery';
import {
  fixedOptions as magic,
  createOptions as magicOptions,
} from './magicGallery';
import {
  fixedOptions as masonry,
  createOptions as masonryOptions,
} from './masonryGallery';
import { fixedOptions as mix, createOptions as mixOptions } from './mixGallery';
import {
  fixedOptions as panorama,
  createOptions as panoramaOptions,
} from './panoramaGallery';
import {
  fixedOptions as slider,
  createOptions as sliderOptions,
} from './sliderGallery';

import {
  fixedOptions as slideshow,
  createOptions as slideshowOptions,
} from './slideshowGallery';
import {
  fixedOptions as experimental_showcase,
  createOptions as experimental_showcaseOptions,
} from './showcaseGallery';

import {
  fixedOptions as thumbnails,
  createOptions as thumbnailsOptions,
} from './thumbnailGallery';
import {
  fixedOptions as empty,
  createOptions as emptyOptions,
} from './emptyGallery';
import { createOptions as jsonFixedOptions } from './designedPresetGallery';
import { addMigratedOptions } from '../helpers/optionsConverter';
import { flattenObject } from '../helpers/optionsUtils';

//#endregion Imports

const addPresetOptions = (options) => {
  const galleryType = options.galleryType;
  const galleryLayoutV1 = options.galleryType;
  const galleryLayoutV2 = options.galleryLayout;
  if (galleryLayoutV1 !== undefined && galleryLayoutV2 === undefined) {
    // legacy layouts - only if galleyrType parameter is specifically defined (i.e. layout had changed)

    switch (galleryType) {
      case '1': // horizontal collage
        return collageOptions(options);
      case '2': // grid
        return gridOptions(options);
      case '3': // vertical masonry
        return masonryOptions(options);
      case '4': // horizontal masonry
        return masonryOptions(options);
      case '5': // one column
        return panoramaOptions(options);
      case '6': // one row
        return columnOptions(options);
      case '7': // slideshow
        return slideshowOptions(options);
      case '13': // slideshow
        return slideshowOptions(options);
      case '0': // vertical collage
      default:
        return collageOptions(options);
    }
  } else {
    // new layouts
    switch (options.galleryLayout) {
      case LAYOUTS.MASONRY:
        return masonryOptions(options);
      case LAYOUTS.GRID:
        return gridOptions(options);
      case LAYOUTS.THUMBNAIL:
        return thumbnailsOptions(options);
      case LAYOUTS.SLIDER:
        return sliderOptions(options);
      case LAYOUTS.SLIDESHOW:
        return slideshowOptions(options);
      case LAYOUTS.PANORAMA:
        return panoramaOptions(options);
      case LAYOUTS.COLUMN:
        return columnOptions(options);
      case LAYOUTS.MAGIC:
        return magicOptions(options);
      case LAYOUTS.FULLSIZE:
        return fullsizeOptions(options);
      case LAYOUTS.BRICKS:
        return bricksOptions(options);
      case LAYOUTS.MIX:
        return mixOptions(options);
      case LAYOUTS.ALTERNATE:
        return alternateOptions(options);
      case LAYOUTS.EXPERIMENTAL_SHOWCASE:
        return experimental_showcaseOptions(options);
      case LAYOUTS.EMPTY:
        return emptyOptions(options);
      case LAYOUTS.JSON_FIXED:
        return jsonFixedOptions(options);
      case LAYOUTS.COLLAGE:
      default:
        return collageOptions(options);
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
  experimental_showcase,
  thumbnails,
  empty,
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
    'mix', // 11,
    'alternate', // 12
  ];
  return galleyLayoutList[galleryLayout + 1];
};

// returns true if the given param is in the current layout preset
const isInPreset = (galleryLayout, paramToCheck) => {
  const layoutName = getLayoutName(galleryLayout) || 'empty'; // empty for when there is no layout given
  return Object.keys(
    addMigratedOptions(flattenObject(NEW_PRESETS[layoutName]))
  ).includes(paramToCheck);
};

export { addPresetOptions, NEW_PRESETS, getLayoutName, isInPreset };
