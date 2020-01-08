import React from 'react';
import LeanGallery from './leanGallery/leanGallery';
import ProGallery from './proGallery/proGallery';
import isEligibleForLeanGallery from './leanGallery/isEligible';
import CollageGallery from './presets/collageGallery';
import MasonryGallery from './presets/masonryGallery';
import GridGallery from './presets/gridGallery';
import ThumbnailGallery from './presets/thumbnailGallery';
import SliderGallery from './presets/sliderGallery';
import SlideshowGallery from './presets/slideshowGallery';
import PanoramaGallery from './presets/panoramaGallery';
import ColumnGallery from './presets/columnGallery';
import MagicGallery from './presets/magicGallery';
import FullsizeGallery from './presets/fullsizeGallery';
import BricksGallery from './presets/bricksGallery';
import MixGallery from './presets/mixGallery';
import AlternateGallery from './presets/alternateGallery';
import LAYOUTS from '../../common/constants/layout';
import EmptyGallery from './presets/emptyGallery';
import dimensionsHelper from '../helpers/dimensionsHelper';
import defaultStyles from '../../common/defaultStyles';

export default props => {

  const domId = props.domId || Math.floor(Math.random() * 10000);
  const { styles, options, styleParams, eventsListener, ...otherProps } = props;
  const _styles = { ...defaultStyles, ...options, ...styles, ...styleParams };
  const _eventsListener = (...args) => (typeof eventsListener === 'function') && eventsListener(...args);
  const galleryProps = { ...otherProps, styles: _styles, eventsListener: _eventsListener, domId };
  dimensionsHelper.updateParams({
    domId: galleryProps.domId,
    container: galleryProps.container,
    styles: galleryProps.styles
  });

  const { galleryType, galleryLayout } = galleryProps.styles;
  let GalleryComponent = ProGallery;

  if (isEligibleForLeanGallery(galleryProps)) {
    GalleryComponent = LeanGallery;
  } else if (galleryType === undefined || galleryLayout !== undefined) {
    switch (galleryLayout) {
      case LAYOUTS.COLLAGE:
        GalleryComponent = CollageGallery;
        break;
      case LAYOUTS.MASONRY:
        GalleryComponent = MasonryGallery;
        break;
      case LAYOUTS.GRID:
        GalleryComponent = GridGallery;
        break;
      case LAYOUTS.THUMBNAIL:
        GalleryComponent = ThumbnailGallery;
        break;
      case LAYOUTS.SLIDER:
        GalleryComponent = SliderGallery;
        break;
      case LAYOUTS.SLIDESHOW:
        GalleryComponent = SlideshowGallery;
        break;
      case LAYOUTS.PANORAMA:
        GalleryComponent = PanoramaGallery;
        break;
      case LAYOUTS.COLUMN:
        GalleryComponent = ColumnGallery;
        break;
      case LAYOUTS.MAGIC:
        GalleryComponent = MagicGallery;
        break;
      case LAYOUTS.FULLSIZE:
        GalleryComponent = FullsizeGallery;
        break;
      case LAYOUTS.BRICKS:
        GalleryComponent = BricksGallery;
        break;
      case LAYOUTS.MIX:
        GalleryComponent = MixGallery;
        break;
      case LAYOUTS.ALTERNATE:
        GalleryComponent = AlternateGallery;
        break;
      case LAYOUTS.EMPTY:
        GalleryComponent = EmptyGallery;
        break;
      default:
        GalleryComponent = CollageGallery;
    }
  }

  return <GalleryComponent {...galleryProps} />
}
