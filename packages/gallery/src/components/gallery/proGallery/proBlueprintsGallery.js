import React from 'react';
import Gallery from './galleryContainerExtraNew.js';
import ProGallery from './proGallery';

export default class ProBlueprintsGallery extends ProGallery {
  render() {
    debugger;

    return (
      <div {...this.containerProps()}>
          <Gallery
            {...this.renderProps()}
          />
      </div>
    );
  }
}
