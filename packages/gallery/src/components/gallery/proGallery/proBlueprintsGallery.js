import '../../../common/utils/polyfills';

import React from 'react';
import Gallery from './galleryContainerExtraNew.js';
import utils from '../../../common/utils';
import { viewModeWrapper } from '../../../common/window/viewModeWrapper';
import { GalleryComponent } from '../../galleryComponent';

import '../../../versionLogger';

export default class ProGallery extends GalleryComponent {
  constructor(props) {
    super();
    this.init(props);
    if (utils.isLocal() && !utils.isTest()) {
      console.log('PRO BLUEPRINTS GALLERY DEV');
    }
  }

  init(props) {
    //this should be some sort of HOC
    if (typeof props.viewMode !== 'undefined') {
      viewModeWrapper.setViewMode(props.viewMode);
    }
    if (typeof props.formFactor !== 'undefined') {
      viewModeWrapper.setFormFactor(props.formFactor);
    }
  }

  componentWillReceiveProps(nextProps) {
    //this should be some sort of HOC
    if (this.props.viewMode !== nextProps.viewMode) {
      utils.dumpCache();
      viewModeWrapper.setViewMode(nextProps.viewMode);
    }
    if (this.props.formFactor !== nextProps.formFactor) {
      utils.dumpCache();
      viewModeWrapper.setFormFactor(nextProps.formFactor);
    }
  }

  render() {
    return (
      <div id={`pro-gallery-${this.props.domId}`} className="pro-gallery">
          <Gallery
            {...this.props}
            domId={this.props.domId}
            items={this.props.items || []}
            watermarkData={this.props.watermarkData}
            settings={this.props.settings || {}}
            offsetTop={this.props.offsetTop}
            itemsLoveData={this.props.itemsLoveData || {}}
            proGalleryRegionLabel={this.props.proGalleryRegionLabel || 'Gallery. you can navigate the gallery with keyboard arrow keys.'}
            // {...blueprintProps}
          />
      </div>
    );
  }
}
