import React from 'react';
import {
  utils,
  defaultStyles,
  dimensionsHelper,
  addPresetStyles,
} from 'pro-gallery-lib';
import ProGallery from './proGallery/proBlueprintsGallery';
import basePropTypes from './proGallery/propTypes';
import {
  setLayoutFixerMounted,
  getLayoutFixerData,
} from '../layoutFixer/layoutFixerStore';
import { LeanGallery, isEligibleForLeanGallery } from 'lean-gallery';

export default class BaseGallery extends React.Component {
  static propTypes = basePropTypes;

  constructor(props) {
    super(props);
    this.domId = props.domId || 'default-dom-id';
  }

  componentDidMount() {
    setLayoutFixerMounted(this.domId);
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

    if (this.props.useBlueprints) {
      if (!galleryProps.structure || galleryProps.isPrerenderMode) {
        Object.assign(galleryProps, getLayoutFixerData(this.domId));
      }
    } else {
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

    const GalleryComponent = isEligibleForLeanGallery(galleryProps)
      ? LeanGallery
      : ProGallery;

    utils.logPlaygroundLink(galleryProps.styles);

    if (
      galleryProps.styles &&
      galleryProps.items &&
      galleryProps.container &&
      galleryProps.structure
    ) {
      return <GalleryComponent {...galleryProps} />;
    } else {
      return null;
    }
  }
}
