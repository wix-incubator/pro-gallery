'use strict';

import GalleryDriver from '../drivers/reactDriver';
import GalleryView from '../../src/components/gallery/galleryView';
import {mount} from 'enzyme';
import React from 'react';
import {expect} from 'chai';

describe('Gallery View', () => {

  let galleryDriver;
  let galleryViewProps;

  beforeEach(() => {

    galleryDriver = new GalleryDriver();
    galleryViewProps = galleryDriver.props.galleryView();

  });

  describe(' init of different items ', () => {

    it('init one item gallery', () => {

      galleryViewProps.items = [galleryViewProps.items[0]];
      galleryDriver.mount(GalleryView, galleryDriver.props.galleryView(galleryViewProps));

      expect(galleryDriver.find.hook('gallery-column').length).to.equal(1);
    });

    it('init empty gallery', () => {

      galleryViewProps.items = [];
      galleryDriver.mount(GalleryView, galleryDriver.props.galleryView(galleryViewProps));

      expect(galleryDriver.find.hook('gallery-column').length).to.equal(0);
    });

  });

});

