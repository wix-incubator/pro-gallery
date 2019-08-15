import React from 'react';
import GalleryContainerNew from './galleryContainerNew.js';
import utils from '../../utils';
import { viewModeWrapper } from '../../utils/window/viewModeWrapper';
import window from '../../utils/window/windowWrapper';
import { GalleryComponent } from '../galleryComponent';

export default class ProGallery extends GalleryComponent {
  constructor(props) {
    super();
    if (utils.isVerbose()) {
      console.count('[OOISSR] proGallery constructor', window.isMock);
    }
    const isSSR = !!window.isMock;
    this.canRender = !isSSR || props.allowSSR === true; //do not render if it is SSR
    if (this.canRender) {
      this.init(props);
    }
  }

  init(props) {
    if (typeof props.viewMode !== 'undefined') {
      viewModeWrapper.setViewMode(props.viewMode);
    }
    this.domId = props.domId || Math.floor(Math.random() * 10000);
    if (utils.isVerbose()) {
      console.log('[OOISSR] proGallery init', window.isMock);
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
        <div id={`pro-gallery-${this.domId}`} className="pro-gallery">
          <GalleryContainerNew
            {...this.props}
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
