'use strict';

import ItemView from './itemView.js';
import GalleryDriver from '../gallery/galleryDriver.js';
import {shallow, mount} from 'enzyme';
import React from 'react';
import {testImages} from '../test/images-mock';

describe('Item View', () => {
  let sampleItemViewProps;
  let galleryDriver;
  let sampleItem;

  beforeEach(() => {
    galleryDriver = new GalleryDriver();
    sampleItem = testImages[0];
    sampleItemViewProps = galleryDriver.create.itemViewProps(sampleItem);
  });

  it('should init', () => {
    const wrapper = mount(<ItemView
      {...sampleItemViewProps}
      />);
    expect(wrapper.find({'data-hook': 'item-wrapper'}).length).toBe(1);
  });

  describe('when error occurs', () => {
    it('retries should be 0 if no error occured', () => {
      const wrapper = mount(<ItemView
        {...sampleItemViewProps}
        />);

      expect(wrapper.state('retries')).toBe(0);
    });

    it('retries should be 1 when setting error once', () => {
      const wrapper = mount(<ItemView
        {...sampleItemViewProps}
        />);

      wrapper.instance().setItemError();

      expect(wrapper.state('retries')).toBe(1);
    });

    it('retries should be 3 when setting error 3 times', () => {
      const wrapper = mount(<ItemView
        {...sampleItemViewProps}
        />);

      const instance = wrapper.instance();
      instance.setItemError();
      instance.setItemError();
      instance.setItemError();

      expect(wrapper.state('retries')).toBe(3);
    });

    it('failed should be set true when setting error 4 times', () => {
      const wrapper = mount(<ItemView
        {...sampleItemViewProps}
        />);

      const instance = wrapper.instance();
      instance.setItemError();
      instance.setItemError();
      instance.setItemError();
      instance.setItemError();

      expect(wrapper.state('failed')).toBe(true);
    });

    it('failed should be set false when setting error less than 4 times', () => {
      const wrapper = mount(<ItemView
        {...sampleItemViewProps}
        />);

      const instance = wrapper.instance();
      instance.setItemError();
      instance.setItemError();
      instance.setItemError();

      expect(wrapper.state('failed')).toBe(false);
    });
  });

  describe('Item Download ', () => {
    let galleryConfig;
    beforeEach(() => {
      galleryConfig = galleryDriver.get.galleryConfig;
    });

    it('should hide according to the style params', () => {
      // Step 1: check with allowDownload = FALSE
      galleryConfig.styleParams.allowDownload = false;
      sampleItemViewProps = galleryDriver.create.itemViewProps(sampleItem, galleryConfig);

      const wrapper1 = mount(<ItemView
        {...sampleItemViewProps}
        />).setState({
          loaded: true,
        });

      expect(wrapper1.find({'data-hook': 'item-download'}).length).toBe(0);
    });

    it('should show the download button according to the style params', () => {
      // Step 2: check with allowDownload = TRUE
      let galleryConfig2 = galleryDriver.get.galleryConfig;
      galleryConfig2.styleParams.allowDownload = true;
      sampleItemViewProps = galleryDriver.create.itemViewProps(sampleItem, galleryConfig2);

      const wrapper1 = mount(<ItemView
        {...sampleItemViewProps}
        />).setState({
          loaded: true,
        });

      expect(wrapper1.find({'data-hook': 'item-download'}).length).toBe(1);
    });

    it('should hide the download button if it is a demo item', () => {
      // Step 2: check with allowDownload = TRUE
      let galleryConfig2 = galleryDriver.get.galleryConfig;
      galleryConfig2.styleParams.allowDownload = true;
      sampleItem.isDemo = true;
      sampleItemViewProps = galleryDriver.create.itemViewProps(sampleItem, galleryConfig2);

      const wrapper1 = mount(<ItemView
        {...sampleItemViewProps}
        />).setState({
          loaded: true,
        });

      expect(wrapper1.find({'data-hook': 'item-download'}).length).toBe(0);
    });

    it('should show title element when showTitle is true', () => {
      // Step 2: check with allowDownload = TRUE
      let galleryConfig2 = galleryDriver.get.galleryConfig;
      galleryConfig2.styleParams.allowTitle = true;
      sampleItem.isDemo = true;
      sampleItemViewProps = galleryDriver.create.itemViewProps(sampleItem, galleryConfig2);

      const wrapper1 = mount(<ItemView
        {...sampleItemViewProps}
        title = "My title"
      />).setState({
        loaded: true,
      });

      expect(wrapper1.find({'data-hook': 'item-title'}).length).toBe(1);
    });

    it('should hide title element when showTitle is true but not title text', () => {
      // Step 2: check with allowDownload = TRUE
      let galleryConfig2 = galleryDriver.get.galleryConfig;
      galleryConfig2.styleParams.allowTitle = true;
      sampleItem.isDemo = true;
      sampleItemViewProps = galleryDriver.create.itemViewProps(sampleItem, galleryConfig2);

      const wrapper1 = mount(<ItemView
        {...sampleItemViewProps}
      />).setState({
        loaded: true,
      });

      expect(wrapper1.find({'data-hook': 'item-title'}).length).toBe(0);
    });

    it('should show description element when allowDescription is true', () => {
      // Step 2: check with allowDownload = TRUE
      let galleryConfig2 = galleryDriver.get.galleryConfig;
      galleryConfig2.styleParams.allowDescription = true;
      sampleItem.isDemo = true;
      sampleItemViewProps = galleryDriver.create.itemViewProps(sampleItem, galleryConfig2);

      const wrapper1 = mount(<ItemView
        {...sampleItemViewProps}
        description = "My description"
      />).setState({
        loaded: true,
      });

      expect(wrapper1.find({'data-hook': 'item-description'}).length).toBe(1);
    });

    it('should hide description element when allowDescription is true but not description text', () => {
      // Step 2: check with allowDownload = TRUE
      let galleryConfig2 = galleryDriver.get.galleryConfig;
      galleryConfig2.styleParams.allowDescription = true;
      sampleItem.isDemo = true;
      sampleItemViewProps = galleryDriver.create.itemViewProps(sampleItem, galleryConfig2);

      const wrapper1 = mount(<ItemView
        {...sampleItemViewProps}
      />).setState({
        loaded: true,
      });

      expect(wrapper1.find({'data-hook': 'item-description'}).length).toBe(0);
    });
  });

  /*
   it('should show / hide the download button according to the style params', () => {

   // Step 1: check with allowDownload = FALSE
   var galleryConfig1 = galleryDriver.get.galleryConfig;
   galleryConfig1.styleParams.allowDownload = false;
   sampleItemViewProps = galleryDriver.create.itemViewProps(sampleItem, galleryConfig1);

   let wrapper1 = mount(<ItemView
   {...sampleItemViewProps}
   />).setState({
   loaded: true,
   });

   expect(wrapper1.find({'data-hook': 'item-download'}).length).toBe(0);

   // Step 2: check with allowDownload = TRUE
   var galleryConfig2 = galleryDriver.get.galleryConfig;
   galleryConfig2.styleParams.allowDownload = true;
   sampleItemViewProps = galleryDriver.create.itemViewProps(sampleItem, galleryConfig2);

   let wrapper2 = mount(<ItemView
   {...sampleItemViewProps}
   />).setState({
   loaded: true,
   });

   expect(wrapper2.find({'data-hook': 'item-download'}).length).toBe(1);
   });
   */


});



