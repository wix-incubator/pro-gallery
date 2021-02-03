import '../../../common/utils/polyfills';
import React from 'react';
import { viewModeWrapper, utils } from 'pro-gallery-lib';
import Gallery from './galleryContainer.js';
import { GalleryComponent } from '../../galleryComponent';

import '../../../versionLogger';

export default class ProGallery extends GalleryComponent {
  constructor(props) {
    super();
    this.init(props);
    if (utils.isLocal() && !utils.isTest()) {
      console.log('PRO GALLERY DEV');
    }
  }

  init(props) {
    if (typeof props.viewMode !== 'undefined') {
      viewModeWrapper.setViewMode(props.viewMode);
    }
    if (typeof props.formFactor !== 'undefined') {
      viewModeWrapper.setFormFactor(props.formFactor);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.viewMode !== nextProps.viewMode) {
      utils.dumpCache();
      viewModeWrapper.setViewMode(nextProps.viewMode);
    }
    if (this.props.formFactor !== nextProps.formFactor) {
      utils.dumpCache();
      viewModeWrapper.setFormFactor(nextProps.formFactor);
    }
  }

  renderProps() {
    return {
      ...this.props,
      domId: this.props.domId,
      items: this.props.items || [],
      watermarkData: this.props.watermarkData,
      settings: this.props.settings || {},
      offsetTop: this.props.offsetTop,
      itemsLoveData: this.props.itemsLoveData || {},
      proGalleryRegionLabel:
        this.props.proGalleryRegionLabel ||
        'Gallery. you can navigate the gallery with keyboard arrow keys.',
    };
  }

  containerProps() {
    return {
      id: `pro-gallery-${this.props.domId}`,
      className: 'pro-gallery',
    };
  }

  render() {
    return (
      <div {...this.containerProps()}>
        <Gallery {...this.renderProps()} />
      </div>
    );
  }
}
