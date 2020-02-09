import LAYOUTS from '../../../common/constants/layout';

import { layoutStyles as alternate, createStyles as alternateStyles} from './alternateGallery';
import { layoutStyles as bricks, createStyles as bricksStyles} from './bricksGallery';
import { layoutStyles as collage, createStyles as collageStyles} from './collageGallery';
import { layoutStyles as fullsize, createStyles as fullsizeStyles} from './fullsizeGallery';
import { layoutStyles as column, createStyles as columnStyles} from './columnGallery';
import { layoutStyles as grid, createStyles as gridStyles} from './gridGallery';
import { layoutStyles as magic, createStyles as magicStyles} from './magicGallery';
import { layoutStyles as masonry, createStyles as masonryStyles} from './masonryGallery';
import { layoutStyles as mix, createStyles as mixStyles} from './mixGallery';
import { layoutStyles as panorama, createStyles as panoramaStyles} from './panoramaGallery';
import { layoutStyles as slider, createStyles as sliderStyles} from './sliderGallery';
import { layoutStyles as slideshow, createStyles as slideshowStyles} from './slideshowGallery';
import { layoutStyles as thumbnails, createStyles as thumbnailsStyles} from './thumbnailGallery';
import { layoutStyles as empty, createStyles as emptyStyles} from './emptyGallery';


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
  
  
  