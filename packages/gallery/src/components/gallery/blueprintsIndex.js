import React from 'react';
import { GALLERY_CONSTS, defaultStyles, dimensionsHelper, addPresetStyles, utils } from 'pro-gallery-lib';
import ProGallery from './proGallery/proBlueprintsGallery';
import basePropTypes from './proGallery/propTypes';
import isEligibleForLeanGallery from './leanGallery/isEligible';
import LeanGallery from './leanGallery/leanGallery';

export default class BaseGallery extends React.Component {

  static propTypes = basePropTypes;
  render() {
    const lazyLoad = utils.hasNativeLazyLoadSupport() ? GALLERY_CONSTS.lazyLoad.NATIVE : this.props.lazyLoad;
    const domId = this.props.domId || 'default-dom-id';
    const { styles, options, styleParams, eventsListener, ...otherProps } = this.props;
    const _eventsListener = (...args) => (typeof eventsListener === 'function') && eventsListener(...args);
    const _styles = { ...defaultStyles, ...options, ...styles, ...styleParams };
    let galleryProps = { ...otherProps, styles: _styles, eventsListener: _eventsListener, domId, lazyLoad};


    if(this.props.useBlueprints) {
      //
    } else {
      dimensionsHelper.updateParams({
        domId: galleryProps.domId,
        container: galleryProps.container,
        styles: galleryProps.styles
      });

      const { galleryType, galleryLayout } = galleryProps.styles;

      if (galleryType === undefined || galleryLayout !== undefined) {
          galleryProps = {...galleryProps, styles: addPresetStyles(galleryProps.styles)}
        }
    }

    let GalleryComponent = ProGallery;

    if (isEligibleForLeanGallery(galleryProps)) {
      GalleryComponent = LeanGallery;
    }

    return <GalleryComponent {...galleryProps} />
  }
}

