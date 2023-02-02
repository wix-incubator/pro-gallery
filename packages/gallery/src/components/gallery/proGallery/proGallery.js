import '../../../common/utils/polyfills';
import React from 'react';
import { utils } from 'pro-gallery-lib';
import Gallery from './galleryContainer.js';

import '../../../versionLogger';
import { GalleryProvider } from '../../../context/GalleryContext';

export default class ProGallery extends React.Component {
  constructor() {
    super();
    if (utils.isLocal() && !utils.isTest()) {
      console.log('PRO GALLERY DEV');
    }
  }

  renderProps() {
    return {
      ...this.props,
      id: this.props.id,
      items: this.props.items || [],
      settings: this.props.settings || {},
      offsetTop: this.props.offsetTop,
      proGalleryRegionLabel: this.props.proGalleryRegionLabel,
      isInDisplay: this.props.isInDisplay ?? true,
    };
  }

  containerProps() {
    return {
      id: `pro-gallery-${this.props.id}`,
      className: 'pro-gallery',
    };
  }

  render() {
    return (
      <GalleryProvider {...this.props}>
        <div {...this.containerProps()}>
          <Gallery {...this.renderProps()} />
        </div>
      </GalleryProvider>
    );
  }
}
