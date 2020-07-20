import React from 'react';
import Gallery from './galleryContainerExtraNew.js';
import ProGallery from './proGallery';

export default class ProBlueprintsGallery extends ProGallery {
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
