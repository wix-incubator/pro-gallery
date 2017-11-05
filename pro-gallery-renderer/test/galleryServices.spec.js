'use strict';

import GalleryDriver from './galleryDriver.js';

describe('Gallery Services', () => {

  let galleryDriver;
  let galleryViewProps;

  beforeEach(() => {

    galleryDriver = new GalleryDriver();
    galleryViewProps = galleryDriver.create.galleryViewProps();

  });

  describe(' gallery api ', () => {
    // it('should return all gallery photos using getPhotos', () => {
    //   expect(galleryViewProps.items).toBe()
    // })
  });

});

