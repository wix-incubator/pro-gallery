'use strict';

import GalleryDriver from './galleryDriver.js';
import GalleryView from '../src/components/gallery/galleryView';
import {mount} from 'enzyme';
import React from 'react';
import {expect} from 'chai';

describe('Gallery View', () => {

  let galleryDriver;
  let galleryViewProps;

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

      expect(wrapper.find({'data-hook': 'gallery-column'}).length).to.equal(1);
    });

    it('init empty gallery', () => {

      galleryViewProps.items = [];

      const wrapper = mount(<GalleryView
        {...galleryDriver.create.galleryViewProps(galleryViewProps)}
      />);

      expect(wrapper.find({'data-hook': 'gallery-column'}).length).to.equal(0);
    });

  });

});

