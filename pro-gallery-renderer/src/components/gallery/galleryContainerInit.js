import GalleryContainer from './galleryContainer.js';
import React from 'react';

class GalleryContainerInit {
  constructor() {
    const createProGallery = window.createProGallery = props => {
      return React.createElement(GalleryContainer, props);
    };
  }

}
new GalleryContainerInit();
