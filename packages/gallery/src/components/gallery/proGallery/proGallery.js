import '../../../common/utils/polyfills';

import React from 'react';
import GalleryContainerNew from './galleryContainerNew.js';
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
    this.domId = props.domId || Math.floor(Math.random() * 10000);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.viewMode !== nextProps.viewMode) {
      viewModeWrapper.setViewMode(nextProps.viewMode);
    }
  }

  render() {
    const styles = this.props.styles || this.props.options;
    return (
      this.canRender && (
        <div id={`pro-gallery-${this.domId}`} className="pro-gallery">
          <GalleryContainerNew
            {...this.props}
            styles={styles}
            domId={this.domId}
            items={this.props.items || []}
            watermarkData={this.props.watermarkData}
            settings={this.props.settings || {}}
            offsetTop={this.props.offsetTop}
            itemsLoveData={
              this.props.itemsLoveData ? this.props.itemsLoveData : {}
            }
          />
        </div>
      )
    );
  }
}
