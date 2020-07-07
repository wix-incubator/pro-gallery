import React from 'react';
import ProGallery from './proGallery/proGallery';
import { PRESETS } from './presets';
import basePropTypes from './proGallery/propTypes';
import LAYOUTS from '../../common/constants/layout';
import dimensionsHelper from '../helpers/dimensionsHelper';
import defaultStyles from '../../common/defaultStyles';
import LAZY_LOAD from '../../common/constants/lazyLoad';
import utils from '../../common/utils';
import isEligibleForLeanGallery from './leanGallery/isEligible';
import { createStylesFromProps } from './presets/gridGallery.js';
import { default as LeanGallery, formatLeanGalleryStyles }  from './leanGallery/leanGallery.js';

export default class BaseGallery extends React.Component {

  static propTypes = basePropTypes;
  render() {
    const lazyLoad = utils.hasNativeLazyLoadSupport() ? LAZY_LOAD.NATIVE : this.props.lazyLoad;
    const domId = this.props.domId || 'default-dom-id';
    const { styles, options, styleParams, eventsListener, ...otherProps } = this.props;
    const _styles = { ...defaultStyles, ...options, ...styles, ...styleParams };
    const _eventsListener = (...args) => (typeof eventsListener === 'function') && eventsListener(...args);
    const galleryProps = { ...otherProps, styles: _styles, eventsListener: _eventsListener, domId, lazyLoad};
    let GalleryComponent = ProGallery;

    if(!this.props.useBlueprints) {
      dimensionsHelper.updateParams({
        domId: galleryProps.domId,	  
        container: galleryProps.container,
        styles: galleryProps.styles
      });    
      
      const { galleryType, galleryLayout } = galleryProps.styles;
      if (galleryType === undefined || galleryLayout !== undefined) {
        switch (galleryLayout) {
          case LAYOUTS.MASONRY:
            GalleryComponent = PRESETS.MasonryGallery;
            break;
          case LAYOUTS.GRID:
            GalleryComponent = PRESETS.GridGallery;
            break;
          case LAYOUTS.THUMBNAIL:
            GalleryComponent = PRESETS.ThumbnailGallery;
            break;
          case LAYOUTS.SLIDER:
            GalleryComponent = PRESETS.SliderGallery;
            break;
          case LAYOUTS.SLIDESHOW:
            GalleryComponent = PRESETS.SlideshowGallery;
            break;
          case LAYOUTS.PANORAMA:
            GalleryComponent = PRESETS.PanoramaGallery;
            break;
          case LAYOUTS.COLUMN:
            GalleryComponent = PRESETS.ColumnGallery;
            break;
          case LAYOUTS.MAGIC:
            GalleryComponent = PRESETS.MagicGallery;
            break;
          case LAYOUTS.FULLSIZE:
            GalleryComponent = PRESETS.FullsizeGallery;
            break;
          case LAYOUTS.BRICKS:
            GalleryComponent = PRESETS.BricksGallery;
            break;
          case LAYOUTS.MIX:
            GalleryComponent = PRESETS.MixGallery;
            break;
          case LAYOUTS.ALTERNATE:
            GalleryComponent = PRESETS.AlternateGallery;
            break;
          case LAYOUTS.EMPTY:
            GalleryComponent = PRESETS.EmptyGallery;
            break;
          case LAYOUTS.COLLAGE:
          default:
            GalleryComponent = PRESETS.CollageGallery;
        }
      }
    }
    else if(isEligibleForLeanGallery(createStylesFromProps(galleryProps))) {
      galleryProps.styles = formatLeanGalleryStyles(galleryProps.styles);
      GalleryComponent = LeanGallery;
    }

    return <GalleryComponent {...galleryProps} />
  }
}