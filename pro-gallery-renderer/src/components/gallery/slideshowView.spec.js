'use strict';

import SlideshowView from './slideshowView.js';
import GalleryDriver from './galleryDriver.js';
import { shallow, mount } from 'enzyme';
import React from 'react';

describe('Slideshow View', () => {

  var galleryDriver;
  var galleryViewProps;

  beforeEach(() => {

    galleryDriver = new GalleryDriver();
    galleryViewProps = galleryDriver.create.galleryViewProps();


  });

  describe(' init of different items ', () => {

    it('init one item gallery', () => {

      galleryViewProps.items = [galleryViewProps.items[0]];

      const wrapper = mount(<SlideshowView
        store={galleryViewProps.store}
        {...galleryViewProps}
      />);

      expect(wrapper.find({ 'data-hook': 'gallery-column' }).length).toBe(1);
    });

    it('init empty gallery', () => {

      galleryViewProps.items = [];

      const wrapper = mount(<SlideshowView
        {...galleryDriver.create.galleryViewProps(galleryViewProps) }
      />);

      expect(wrapper.find({ 'data-hook': 'gallery-column' }).length).toBe(0);
    });

    it('should show arrows', () => {

      const wrapper = mount(<SlideshowView
        {...galleryDriver.create.galleryViewProps(galleryViewProps) }
      />);

      expect(wrapper.find({ 'data-hook': 'nav-arrow-next' }).length).toBe(1);
    });

    // it('should show thumbnails', () => {
    //   galleryViewProps.items = galleryDriver.items;
    //   galleryViewProps.styleParams.hasThumbnails = true;
    //   galleryViewProps.styleParams.galleryThumbnailsAlignment = 'top';
    //   galleryViewProps.thumbnailSize = 90;
    //
    //   const wrapper = mount(<SlideshowView
    //     {...galleryDriver.create.galleryViewProps(galleryViewProps)}
    //   />);
    //
    //   expect(wrapper.find({'data-hook': 'gallery-thumbnails'}).length).toBe(1);
    // });

  });

});

