import LAYOUTS from '../../../common/constants/layout';

import { fixedStyles as alternate, createStyles as alternateStyles} from './alternateGallery';
import { fixedStyles as bricks, createStyles as bricksStyles} from './bricksGallery';
import { fixedStyles as collage, createStyles as collageStyles} from './collageGallery';
import { fixedStyles as fullsize, createStyles as fullsizeStyles} from './columnGallery';
import { fixedStyles as column, createStyles as columnStyles} from './fullsizeGallery';
import { fixedStyles as grid, createStyles as gridStyles} from './gridGallery';
import { fixedStyles as magic, createStyles as magicStyles} from './magicGallery';
import { fixedStyles as masonry, createStyles as masonryStyles} from './masonryGallery';
import { fixedStyles as mix, createStyles as mixStyles} from './mixGallery';
import { fixedStyles as panorama, createStyles as panoramaStyles} from './panoramaGallery';
import { fixedStyles as slider, createStyles as sliderStyles} from './sliderGallery';
import { fixedStyles as slideshow, createStyles as slideshowStyles} from './slideshowGallery';
import { fixedStyles as thumbnails, createStyles as thumbnailsStyles} from './thumbnailGallery';
import { fixedStyles as empty, createStyles as emptyStyles} from './emptyGallery';


export const addPresetStyles = styles => {
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
      case LAYOUTS.COLLAGE:
      default:
          return collageStyles(styles);
    }
  }
  
  export default {
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
    empty
  };
  
  
  