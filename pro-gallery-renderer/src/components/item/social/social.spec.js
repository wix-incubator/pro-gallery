//Yonatan Hattav 19 Jun 2018

import ItemView from '../itemView.js';
import GalleryDriver from '../../../../__testsDrivers__/drivers/reactDriver.js';
import Social from './social.js';
import React from 'react';
import { spy, expect } from 'chai';
import sinon from 'sinon';
import { testImages } from '../../../../__testsDrivers__/images-mock.js';
import utils from '../../../utils/index';
import window from '../../../utils/window/windowWrapper';
import LoveButton from '../loveButton/loveButton.js';
import { itemActions } from '@wix/photography-client-lib/dist/src/item/itemActions';

describe('Social:', () => {
  let driver;
  let sampleItemViewProps;
  let sampleItem;
  let mockEvent;
  let stubForWindowLocation;
  beforeEach(() => {
    mockEvent = new Event('mock');
    driver = new GalleryDriver();
    sampleItem = testImages[0];
    sampleItemViewProps = driver.props.itemView(sampleItem);
    stubForWindowLocation = sinon.stub(window.location, 'assign');
  });

  afterEach(() => {
    stubForWindowLocation.restore();
  });

  describe('root div, gallery-item-social', () => {
    it('renders ', () => {
      driver.mount(ItemView, sampleItemViewProps);
      expect(driver.find.hook('item-social').length).to.equal(1);
    });
    it('has classes based on props', () => {
      driver.mount(Social, sampleItemViewProps);
      driver.set.props({
        showShare: true,
        isSmallItem: true,
        isShort: true,
        isNarrow: true,
        isVerticalContainer: true,
        styleParams: { hasThumbnails: true },
      });
      expect(driver.find.hook('item-social').hasClass('hidden')).to.equal(true);
      expect(driver.find.hook('item-social').hasClass('small-item')).to.equal(
        true,
      );
      expect(driver.find.hook('item-social').hasClass('short-item')).to.equal(
        true,
      );
      expect(driver.find.hook('item-social').hasClass('narrow-item')).to.equal(
        true,
      );
      expect(
        driver.find.hook('item-social').hasClass('vertical-item'),
      ).to.equal(true);
      expect(driver.find.hook('item-social').hasClass('with-arrows')).to.equal(
        true,
      );
      driver.set.props({
        showShare: false,
        isSmallItem: false,
        isShort: false,
        isNarrow: false,
        isVerticalContainer: false,
        styleParams: { hasThumbnails: false },
      });
      expect(driver.find.hook('item-social').hasClass('hidden')).to.equal(
        false,
      );
      expect(driver.find.hook('item-social').hasClass('small-item')).to.equal(
        false,
      );
      expect(driver.find.hook('item-social').hasClass('short-item')).to.equal(
        false,
      );
      expect(driver.find.hook('item-social').hasClass('narrow-item')).to.equal(
        false,
      );
      expect(
        driver.find.hook('item-social').hasClass('vertical-item'),
      ).to.equal(false);
      expect(driver.find.hook('item-social').hasClass('with-arrows')).to.equal(
        false,
      );
    });
  });
  describe('social button (getSocialShare)', () => {
    it('should call toggleShare onClick if isSite is true', () => {
      const stub = sinon.stub(utils, 'isSite').returns(true);
      driver.mount(Social, sampleItemViewProps);
      let spy = sinon.spy(driver.get.props().actions, 'toggleShare');
      driver.find
        .hook('gallery-item-social-button')
        .simulate('click', mockEvent);
      expect(spy.called).to.be.true;
      spy.restore();
      stub.returns(false);
      driver.mount(Social, sampleItemViewProps);
      spy = sinon.spy(driver.get.props().actions, 'toggleShare');
      driver.find
        .hook('gallery-item-social-button')
        .simulate('click', mockEvent);
      expect(spy.called).to.be.false;
      stub.restore();
      spy.restore();
    });
    it('should not exist if allowSocial is false', () => {
      Object.assign(sampleItemViewProps, {
        styleParams: { allowSocial: false },
      });
      driver.mount(ItemView, sampleItemViewProps);
      expect(driver.find.hook('gallery-item-social-button').length).to.equal(0);
    });
    it('should get a Share component if its a slideshow', () => {
      const stub = sinon.stub(utils, 'isSite').returns(true);
      Object.assign(sampleItemViewProps, {
        styleParams: { allowSocial: true, isSlideshow: true },
      });
      driver.mount(ItemView, sampleItemViewProps);
      expect(
        driver.find.selector(
          '[data-hook="item-social"] > [data-hook="gallery-item-social-button"] > Share',
        ).length,
      ).to.equal(1);
      driver.set.props({
        styleParams: { allowSocial: true, isSlideshow: false },
      });
      expect(
        driver.find.selector(
          '[data-hook="item-social"] > [data-hook="gallery-item-social-button"] > Share',
        ).length,
      ).to.equal(0);
      stub.restore();
    });
  });
  describe('love button (getLoveButton)', () => {
    it('should get a LoveButton  if its a slideshow', () => {
      Object.assign(sampleItemViewProps, { styleParams: { loveButton: true } });
      driver.mount(Social, sampleItemViewProps);
      expect(
        driver.find.selector('[data-hook="item-social"] > LoveButton').length,
      ).to.equal(1);
      driver.set.props({ styleParams: { loveButton: false } });
      expect(
        driver.find.selector('[data-hook="item-social"] > LoveButton').length,
      ).to.equal(0);
    });
    it('should toggle slideshow or gallery layout based on props', () => {
      Object.assign(sampleItemViewProps, {
        styleParams: { allowSocial: true, isSlideshow: true, loveButton: true },
      });
      driver.mount(ItemView, sampleItemViewProps);
      expect(driver.find.selector(LoveButton).props().layout).to.equal(
        'slideshow',
      );
      driver.set.props({
        styleParams: {
          allowSocial: true,
          isSlideshow: false,
          loveButton: true,
        },
      });
      expect(driver.find.selector(LoveButton).props().layout).to.equal(
        'gallery',
      );
    });
  });
  describe('Download button (getDownload)', () => {
    describe('should have a download button only in the right constellation of params -', () => {
      it('allowParams-toggles', () => {
        const stubSite = sinon.stub(utils, 'isSite').returns(false);
        const stubiOS = sinon.stub(utils, 'isiOS').returns(false);
        Object.assign(sampleItemViewProps, {
          styleParams: { allowDownload: true },
          isDemo: true,
        });
        driver.mount(ItemView, sampleItemViewProps);
        expect(driver.find.hook('item-download').length).to.equal(1); // isSite:false,isiOS:false,allowDownload:true,isDemo:true
        driver.set.props({
          styleParams: { allowDownload: false },
          isDemo: true,
        });
        expect(driver.find.hook('item-download').length).to.equal(0); // isSite:false,isiOS:false,allowDownload:false,isDemo:true
        stubSite.restore();
        stubiOS.restore();
      });
      it('isiOS-toggles', () => {
        const stubSite = sinon.stub(utils, 'isSite').returns(false);
        let stubiOS = sinon.stub(utils, 'isiOS').returns(false);
        Object.assign(sampleItemViewProps, {
          styleParams: { allowDownload: true },
          isDemo: true,
        });
        driver.mount(ItemView, sampleItemViewProps);
        expect(driver.find.hook('item-download').length).to.equal(1); // isSite:false,isiOS:false,allowDownload:true,isDemo:true
        stubiOS.restore();
        stubiOS = sinon.stub(utils, 'isiOS').returns(true);
        driver.mount(ItemView, sampleItemViewProps);
        expect(driver.find.hook('item-download').length).to.equal(0); // isSite:false,isiOS:ture,allowDownload:true,isDemo:true
        stubSite.restore();
        stubiOS.restore();
      });
      it('isSite value doesnt matter while isDemo is false', () => {
        const stubSite = sinon.stub(utils, 'isSite').returns(false);
        const stubiOS = sinon.stub(utils, 'isiOS').returns(false);
        Object.assign(sampleItemViewProps, {
          styleParams: { allowDownload: true },
          isDemo: false,
        });
        driver.mount(ItemView, sampleItemViewProps);
        expect(driver.find.hook('item-download').length).to.equal(1); // isSite:false,isiOS:false,allowDownload:true,isDemo:false
        stubSite.returns(true);
        driver.mount(ItemView, sampleItemViewProps);
        expect(driver.find.hook('item-download').length).to.equal(1); // isSite:true,isiOS:false,allowDownload:true,isDemo:false
        stubSite.restore();
        stubiOS.restore();
      });
      it('isDemo value doesnt matter while isSite is false', () => {
        const stubSite = sinon.stub(utils, 'isSite').returns(false);
        const stubiOS = sinon.stub(utils, 'isiOS').returns(false);
        Object.assign(sampleItemViewProps, {
          styleParams: { allowDownload: true },
          isDemo: true,
        });
        driver.mount(ItemView, sampleItemViewProps);
        expect(driver.find.hook('item-download').length).to.equal(1); // isSite:false,isiOS:false,allowDownload:true,isDemo:true
        driver.set.props({
          styleParams: { allowDownload: true },
          isDemo: false,
        });
        expect(driver.find.hook('item-download').length).to.equal(1); // isSite:false,isiOS:false,allowDownload:true,isDemo:flase
        stubSite.restore();
        stubiOS.restore();
      });
    });
    it('should create a different onClick functions for text items', () => {
      const stubSite = sinon.stub(utils, 'isSite').returns(false);
      const stubiOS = sinon.stub(utils, 'isiOS').returns(false);
      let stubItemActions = sinon.stub(itemActions, 'downloadTextItem');
      Object.assign(sampleItemViewProps, {
        type: 'text',
        styleParams: { allowDownload: true },
        isDemo: false,
      });
      driver.mount(ItemView, sampleItemViewProps);
      driver.find.hook('item-download').simulate('click', mockEvent);
      expect(stubItemActions.called).to.be.true;
      stubItemActions.restore();
      stubItemActions = sinon.stub(itemActions, 'downloadTextItem');
      driver.set.props({ type: 'image' });
      driver.find.hook('item-download').simulate('click', mockEvent);
      expect(stubItemActions.called).to.be.false;
      stubSite.restore();
      stubiOS.restore();
    });
  });
});
