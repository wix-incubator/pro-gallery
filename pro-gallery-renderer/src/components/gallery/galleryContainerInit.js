import GalleryContainer from './galleryContainer.js';
import React from 'react';

const createProGallery = window.createProGallery = props => {
  return React.createElement(GalleryContainer, props);
};
