'use strict';

import GalleryView from './galleryView.js';
import GalleryDriver from './galleryDriver.js';
import {shallow, mount} from 'enzyme';
import React from 'react';

describe('Gallery Services', () => {

  var galleryDriver;
  var galleryViewProps;

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

