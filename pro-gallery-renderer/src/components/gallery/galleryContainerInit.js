import GalleryContainer from './galleryContainer.js';
import React from 'react';
import window from 'photography-client-lib/dist/src/sdk/windowWrapper';

//todo - is this still needed???
const createProGallery = window.createProGallery = props => {
  return React.createElement(GalleryContainer, props);
};
// class GalleryContainerInit {
//   constructor() {
//     const createProGallery = window.createProGallery = props => {
//       return React.createElement(GalleryContainer, props);
//     };
//   }

// }
// new GalleryContainerInit();
