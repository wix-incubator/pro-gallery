import '../../../common/utils/polyfills';

import React from 'react';
import GalleryContainer from './galleryContainerNew.js';
import utils from '../../../common/utils';
import { viewModeWrapper } from '../../../common/window/viewModeWrapper';
import window from '../../../common/window/windowWrapper';
import { GalleryComponent } from '../../galleryComponent';

import '../../../versionLogger';

export default class ProGallery extends GalleryComponent {
  constructor(props) {
    super();
    const isSSR = !!window.isMock;
    this.canRender = !isSSR || props.allowSSR === true; //do not render if it is SSR
    if (this.canRender) {
      this.init(props);
    }
    if (utils.isLocal() && !utils.isTest()) {
      console.warn('PRO GALLERY DEV');
    }
  }

  init(props) {
    if (typeof props.viewMode !== 'undefined') {
      viewModeWrapper.setViewMode(props.viewMode);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.viewMode !== nextProps.viewMode) {
      viewModeWrapper.setViewMode(nextProps.viewMode);
    }
  }

  render() {
    return (
      this.canRender && (
        <div id={`pro-gallery-${this.props.domId}`} className="pro-gallery">
          <GalleryContainer
            {...this.props}
            domId={this.props.domId}
            items={this.props.items || []}
            watermarkData={this.props.watermarkData}
            settings={this.props.settings || {}}
            offsetTop={this.props.offsetTop}
            itemsLoveData={this.props.itemsLoveData || {}}
          />
        </div>
      )
    );
  }
}
