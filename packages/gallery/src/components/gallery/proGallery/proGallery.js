import '../../../common/utils/polyfills';

import React from 'react';
import GalleryContainer from './galleryContainerNew.js';
import GalleryContainerForBlueprints from './galleryContainerExtraNew.js';
import utils from '../../../common/utils';
import { viewModeWrapper } from '../../../common/window/viewModeWrapper';
import window from '../../../common/window/windowWrapper';
import { GalleryComponent } from '../../galleryComponent';
import blueprintsManager from '../../blueprints/BlueprintsManager'

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

  componentWillReceiveProps(nextProps) {
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
    const {useBlueprints} = this.props;
    const GalleryComponent = useBlueprints ? GalleryContainerForBlueprints : GalleryContainer;
    const blueprintProps = useBlueprints ? {...blueprintsManager.getOrCreateBlueprint(this.props)} : {};
    return (
      this.canRender && (
        <div id={`pro-gallery-${this.props.domId}`} className="pro-gallery">

            <GalleryComponent
              {...this.props}
              domId={this.props.domId}
              items={this.props.items || []}
              watermarkData={this.props.watermarkData}
              settings={this.props.settings || {}}
              offsetTop={this.props.offsetTop}
              itemsLoveData={this.props.itemsLoveData || {}}
              proGalleryRegionLabel={this.props.proGalleryRegionLabel || 'Gallery. you can navigate the gallery with keyboard arrow keys.'}
              {...blueprintProps}
            />
        </div>
      )
    );
  }
}
