import React from 'react';
import {
  utils,
  defaultStyles,
  dimensionsHelper,
  addPresetStyles,
} from 'pro-gallery-lib';
import ProGallery from './proGallery/proBlueprintsGallery';
import basePropTypes from './proGallery/propTypes';

export default class BaseGallery extends React.Component {
  static propTypes = basePropTypes;

  constructor(props) {
    super(props);
    this.domId = props.domId || 'default-dom-id';
  }

  render() {
    const {
      styles,
      options,
      styleParams,
      eventsListener,
      ...otherProps
    } = this.props;
    const _eventsListener = (...args) =>
      typeof eventsListener === 'function' && eventsListener(...args);
    const _styles = { ...defaultStyles, ...options, ...styles, ...styleParams };
    let galleryProps = {
      ...otherProps,
      styles: _styles,
      eventsListener: _eventsListener,
      domId: this.domId,
    };

    if (!this.props.useBlueprints) {
      dimensionsHelper.updateParams({
        domId: galleryProps.domId,
        container: galleryProps.container,
        styles: galleryProps.styles,
      });

      const { galleryType, galleryLayout } = galleryProps.styles;

      if (galleryType === undefined || galleryLayout !== undefined) {
        galleryProps = {
          ...galleryProps,
          styles: addPresetStyles(galleryProps.styles),
        };
      }
    }

    utils.logPlaygroundLink(galleryProps.styles);

    const MemoProGallery = React.memo(ProGallery);
    if (
      galleryProps.styles &&
      galleryProps.items &&
      galleryProps.container &&
      galleryProps.structure
    ) {
      return <MemoProGallery {...galleryProps} />;
    } else {
      return null;
    }
  }
}
