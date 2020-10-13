import React from 'react';
import { utils, defaultStyles, dimensionsHelper, addPresetStyles } from 'pro-gallery-lib';
import ProGallery from './proGallery/proGallery';
import basePropTypes from './proGallery/propTypes';
import isEligibleForLeanGallery from './leanGallery/isEligible';
import LeanGallery, { formatLeanGalleryStyles } from './leanGallery/leanGallery';

export default class BaseGallery extends React.Component {

  static propTypes = basePropTypes;
  render() {
    const domId = this.props.domId || 'default-dom-id';
    const { styles, options, styleParams, eventsListener, ...otherProps } = this.props;
    const _eventsListener = (...args) => (typeof eventsListener === 'function') && eventsListener(...args);
    const _styles = { ...defaultStyles, ...options, ...styles, ...styleParams };
    let galleryProps = { ...otherProps, styles: _styles, eventsListener: _eventsListener, domId};
    const shouldRenderLean = isEligibleForLeanGallery(galleryProps);
    const key = [domId, shouldRenderLean].join('_');

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

    if (shouldRenderLean) {
      galleryProps.styles = formatLeanGalleryStyles(galleryProps.styles);
      GalleryComponent = LeanGallery;
    }

    try {
      if (utils.isVerbose()) {
        console.log('Gallery Playground link:', `https://pro-gallery.surge.sh?useBlueprints=false&${Object.entries(galleryProps.styles).map(keyval => keyval.join('=')).join('&')}`);
      }
    } catch (e) {}

    return <GalleryComponent key={key} {...galleryProps} />
  }
}

