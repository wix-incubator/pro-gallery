import LAYOUTS from '../../common/constants/layout';

//#region Imports Layouts
import {
  fixedOptions as alternate,
  createOptions as alternateOptions,
} from './alternateGallery';
import {
  fixedOptions as newSPs_alternate,
  createOptions as newSPs_alternateOptions,
} from './newSPS_alternateGallery';
import {
  fixedOptions as bricks,
  createOptions as bricksOptions,
} from './bricksGallery';
import {
  fixedOptions as newSPs_bricks,
  createOptions as newSPs_bricksOptions,
} from './newSPs_bricksGallery';
import {
  fixedOptions as collage,
  createOptions as collageOptions,
} from './collageGallery';
import {
  fixedOptions as newSPs_collage,
  createOptions as newSPs_collageOptions,
} from './newSPs_collageGallery';
import {
  fixedOptions as fullsize,
  createOptions as fullsizeOptions,
} from './fullsizeGallery';
import {
  fixedOptions as newSPs_fullsize,
  createOptions as newSPs_fullsizeOptions,
} from './newSPs_fullsizeGallery';
import {
  fixedOptions as column,
  createOptions as columnOptions,
} from './columnGallery';
import {
  fixedOptions as newSPs_column,
  createOptions as newSPs_columnOptions,
} from './newSPs_columnGallery';
import {
  fixedOptions as grid,
  createOptions as gridOptions,
} from './gridGallery';
import {
  fixedOptions as newSPs_grid,
  createOptions as newSPs_gridOptions,
} from './newSPs_gridGallery';
import {
  fixedOptions as magic,
  createOptions as magicOptions,
} from './magicGallery';
import {
  fixedOptions as masonry,
  createOptions as masonryOptions,
} from './masonryGallery';
import {
  fixedOptions as newSPs_masonry,
  createOptions as newSPs_masonryOptions,
} from './newSPs_masonryGallery';
import { fixedOptions as mix, createOptions as mixOptions } from './mixGallery';
import {
  fixedOptions as newSPs_mix,
  createOptions as newSPs_mixOptions,
} from './newSPs_mixGallery';
import {
  fixedOptions as panorama,
  createOptions as panoramaOptions,
} from './panoramaGallery';
import {
  fixedOptions as newSPs_panorama,
  createOptions as newSPs_panoramaOptions,
} from './newSPs_panoramaGallery';
import {
  fixedOptions as slider,
  createOptions as sliderOptions,
} from './sliderGallery';
import {
  fixedOptions as newSPs_slider,
  createOptions as newSPs_sliderOptions,
} from './newSPs_sliderGallery';

import {
  fixedOptions as slideshow,
  createOptions as slideshowOptions,
} from './slideshowGallery';
import {
  fixedOptions as newSPs_slideshow,
  createOptions as newSPs_slideshowOptions,
} from './newSPs_slideshowGallery';

import {
  fixedOptions as thumbnails,
  createOptions as thumbnailsOptions,
} from './thumbnailGallery';
import {
  fixedOptions as newSPs_thumbnails,
  createOptions as newSPs_thumbnailsOptions,
} from './newSPs_thumbnailsGallery';
import {
  fixedOptions as empty,
  createOptions as emptyOptions,
} from './emptyGallery';
import {
  fixedOptions as newSPs_empty,
  createOptions as newSPs_emptyOptions,
} from './newSPs_emptyGallery';
import { createOptions as jsonFixedOptions } from './newSPs_designedPresetGallery';
import { addMigratedOptions } from '../helpers/optionsConverter';
import { flattenObject } from '../helpers/optionsUtils';
import optionsMap from '../helpers/optionsMap';

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
  } else if (options.newSPs) {
    {
      // new layouts
      const layoutIdx =
        options[optionsMap.layoutParams.structure.galleryLayout];

      switch (layoutIdx) {
        case LAYOUTS.MASONRY:
          return newSPs_masonryOptions(options);
        case LAYOUTS.GRID:
          return newSPs_gridOptions(options);
        case LAYOUTS.THUMBNAIL:
          return newSPs_thumbnailsOptions(options);
        case LAYOUTS.SLIDER:
          return newSPs_sliderOptions(options);
        case LAYOUTS.SLIDESHOW:
          return newSPs_slideshowOptions(options);
        case LAYOUTS.PANORAMA:
          return newSPs_panoramaOptions(options);
        case LAYOUTS.COLUMN:
          return newSPs_columnOptions(options);
        case LAYOUTS.MAGIC:
          console.error('NEW SP METHOD MAGIC NOT SUPPORTED WITH NEW SPS yet');
          return magicOptions(options);
        case LAYOUTS.FULLSIZE:
          return newSPs_fullsizeOptions(options);
        case LAYOUTS.BRICKS:
          return newSPs_bricksOptions(options);
        case LAYOUTS.MIX:
          return newSPs_mixOptions(options);
        case LAYOUTS.ALTERNATE:
          return newSPs_alternateOptions(options);
        case LAYOUTS.EMPTY:
          return newSPs_emptyOptions(options);
        case LAYOUTS.JSON_FIXED:
          console.error(
            'NEW SP METHOD JSON PRESET NOT SUPPORTED WITH NEW SPS yet'
          );
          return jsonFixedOptions(options);
        case LAYOUTS.COLLAGE:
        default:
          return newSPs_collageOptions(options);
      }
    }
  } else {
    // new layouts
    const layoutIdx = options.galleryLayout;
    switch (layoutIdx) {
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
  newSPs_alternate,
  newSPs_collage,
  newSPs_masonry,
  newSPs_grid,
  newSPs_bricks,
  newSPs_thumbnails,
  newSPs_slider,
  newSPs_slideshow,
  newSPs_panorama,
  newSPs_column,
  newSPs_empty,
  newSPs_mix,
  newSPs_fullsize,
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
