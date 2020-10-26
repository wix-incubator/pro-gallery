import React from 'react';
import { utils, defaultStyles, dimensionsHelper, addPresetStyles } from 'pro-gallery-lib';
import ProGallery from './proGallery/proBlueprintsGallery';
import basePropTypes from './proGallery/propTypes';
import { setLayoutFixerMounted, getLayoutFixerData } from '../layoutFixer/layoutFixerStore';
import isEligibleForLeanGallery from './leanGallery/isEligible';
import LeanGallery from './leanGallery/leanGallery';

export default class BaseGallery extends React.Component {

  static propTypes = basePropTypes;

  constructor(props) {
    super(props);
    this.domId = props.domId || 'default-dom-id';
  }

  render() {
    const { styles, options, styleParams, eventsListener, ...otherProps } = this.props;
    const _eventsListener = (...args) => (typeof eventsListener === 'function') && eventsListener(...args);
    const _styles = { ...defaultStyles, ...options, ...styles, ...styleParams };
    let galleryProps = { ...otherProps, styles: _styles, eventsListener: _eventsListener, domId: this.domId};

    if (this.props.useBlueprints) {
      galleryProps = Object.assign({}, getLayoutFixerData(this.domId), galleryProps)
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

