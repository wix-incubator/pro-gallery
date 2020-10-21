import React from 'react';
import { utils, defaultStyles, dimensionsHelper, addPresetStyles } from 'pro-gallery-lib';
import ProGallery from './proGallery/proBlueprintsGallery';
import basePropTypes from './proGallery/propTypes';
import isEligibleForLeanGallery from './leanGallery/isEligible';
import LeanGallery from './leanGallery/leanGallery';

export default class BaseGallery extends React.Component {

  static propTypes = basePropTypes;
  render() {
    const domId = this.props.domId || 'default-dom-id';
    const { styles, options, styleParams, eventsListener, ...otherProps } = this.props;
    const _eventsListener = (...args) => (typeof eventsListener === 'function') && eventsListener(...args);
    const _styles = { ...defaultStyles, ...options, ...styles, ...styleParams };
    let galleryProps = { ...otherProps, styles: _styles, eventsListener: _eventsListener, domId};


    if (this.props.useBlueprints) {
      try {
        const {layoutFixer} = window;
        if (typeof window !== 'undefined' && layoutFixer && !layoutFixer.hydrated) {
          galleryProps.structure = layoutFixer.structure;
          galleryProps.container = layoutFixer.container;
          galleryProps.items = layoutFixer.items;
          layoutFixer.hydrated = true;
          console.log('[LAYOUT FIXER] used structure and container from layoutFixer', layoutFixer);
        } else {
          return null;
        }
      } catch (e) {
        console.log('Failed to get data from the layoutFixer', e);
        return null;
      }
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

    utils.logPlaygroundLink(galleryProps.styles);

    return <GalleryComponent {...galleryProps} />
  }
}

