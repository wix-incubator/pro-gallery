'use strict';

import GalleryDriver from '../../../test/drivers/reactDriver';
import GalleryView from './galleryView';
import {expect} from 'chai';

describe('Gallery View', () => {

  let driver;
  let galleryViewProps;

  beforeEach(() => {

    driver = new GalleryDriver();
    galleryViewProps = driver.props.galleryView();

  });

  describe(' init of different items ', () => {

    it('init one item gallery', () => {

      galleryViewProps.items = [galleryViewProps.items[0]];
      driver.mount(GalleryView, driver.props.galleryView(galleryViewProps));

      expect(driver.find.hook('gallery-column').length).to.equal(1);
    });

    it('init empty gallery', () => {

      galleryViewProps.items = [];
      driver.mount(GalleryView, driver.props.galleryView(galleryViewProps));

      expect(driver.find.hook('gallery-column').length).to.equal(0);
    });

  });

});

