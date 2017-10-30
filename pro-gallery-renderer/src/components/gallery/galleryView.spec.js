'use strict';

import GalleryView from './galleryView.js';
import GalleryDriver from './galleryDriver.js';
import {shallow, mount} from 'enzyme';
import React from 'react';

describe('Gallery View', () => {

  var galleryDriver;
  var galleryViewProps;

  beforeEach(() => {

    galleryDriver = new GalleryDriver();
    galleryViewProps = galleryDriver.create.galleryViewProps();

  });

  describe(' init of different items ', () => {

    it('init one item gallery', () => {

      galleryViewProps.items = [galleryViewProps.items[0]];

      const wrapper = mount(<GalleryView
        {...galleryViewProps}
      />);

      expect(wrapper.find({'data-hook': 'gallery-column'}).length).toBe(1);
    });

    it('init empty gallery', () => {

      galleryViewProps.items = [];

      const wrapper = mount(<GalleryView
        {...galleryDriver.create.galleryViewProps(galleryViewProps)}
      />);

      expect(wrapper.find({'data-hook': 'gallery-column'}).length).toBe(0);
    });

  });

});

