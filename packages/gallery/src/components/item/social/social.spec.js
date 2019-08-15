//Yonatan Hattav 19 Jun 2018

import ItemView from '../itemView.js';
import GalleryDriver from '../../../../__testsDrivers__/drivers/reactDriver.js';
import Social from './social.js';
import { expect } from 'chai';
import sinon from 'sinon';
import { testImages } from '../../../../__testsDrivers__/images-mock.js';
import utils from '../../../utils/index';
import window from '../../../utils/window/windowWrapper';
import LoveButton from '../loveButton/loveButton.js';
import EVENTS from '../../../utils/constants/events';
import { viewModeWrapper } from '../../../utils/window/viewModeWrapper';
import VIEW_MODE from '../../../utils/constants/viewMode';

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
    it('should call toggleShare onClick if isSiteMode() is true (from viewModeWrapper)', () => {
      driver.mount(Social, sampleItemViewProps);
      let spy = sinon.spy(driver.get.props().actions, 'toggleShare');
      driver.find
        .hook('gallery-item-social-button')
        .simulate('click', mockEvent);
      expect(spy.called).to.be.true;
      spy.restore();
      viewModeWrapper.setViewMode(VIEW_MODE.EDIT);
      driver.mount(Social, sampleItemViewProps);
      spy = sinon.spy(driver.get.props().actions, 'toggleShare');
      driver.find
        .hook('gallery-item-social-button')
        .simulate('click', mockEvent);
      expect(spy.called).to.be.false;
      viewModeWrapper.setViewMode(VIEW_MODE.SITE);
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
        viewModeWrapper.setViewMode(VIEW_MODE.EDIT);
        const stubiOS = sinon.stub(utils, 'isiOS').returns(false);
        Object.assign(sampleItemViewProps, {
          styleParams: { allowDownload: true },
          isDemo: true,
        });
        driver.mount(ItemView, sampleItemViewProps);
        expect(driver.find.hook('item-download').length).to.equal(1); // isSiteMode(from viewModeWrapper):false,isiOS:false,allowDownload:true,isDemo:true
        driver.set.props({
          styleParams: { allowDownload: false },
          isDemo: true,
        });
        expect(driver.find.hook('item-download').length).to.equal(0); // isSiteMode(from viewModeWrapper):false,isiOS:false,allowDownload:false,isDemo:true
        viewModeWrapper.setViewMode(VIEW_MODE.SITE);
        stubiOS.restore();
      });
      it('isiOS-toggles', () => {
        viewModeWrapper.setViewMode(VIEW_MODE.EDIT);
        let stubiOS = sinon.stub(utils, 'isiOS').returns(false);
        Object.assign(sampleItemViewProps, {
          styleParams: { allowDownload: true },
          isDemo: true,
        });
        driver.mount(ItemView, sampleItemViewProps);
        expect(driver.find.hook('item-download').length).to.equal(1); // isSiteMode(from viewModeWrapper):false,isiOS:false,allowDownload:true,isDemo:true
        stubiOS.restore();
        stubiOS = sinon.stub(utils, 'isiOS').returns(true);
        driver.mount(ItemView, sampleItemViewProps);
        expect(driver.find.hook('item-download').length).to.equal(0); // isSiteMode(from viewModeWrapper):false,isiOS:ture,allowDownload:true,isDemo:true
        viewModeWrapper.setViewMode(VIEW_MODE.SITE);
        stubiOS.restore();
      });
      it('isSiteMode() (from viewModeWrapper) value doesnt matter while isDemo is false', () => {
        viewModeWrapper.setViewMode(VIEW_MODE.EDIT);
        const stubiOS = sinon.stub(utils, 'isiOS').returns(false);
        Object.assign(sampleItemViewProps, {
          styleParams: { allowDownload: true },
          isDemo: false,
        });
        driver.mount(ItemView, sampleItemViewProps);
        expect(driver.find.hook('item-download').length).to.equal(1); // isSiteMode(from viewModeWrapper):false,isiOS:false,allowDownload:true,isDemo:false
        viewModeWrapper.setViewMode(VIEW_MODE.SITE);
        driver.mount(ItemView, sampleItemViewProps);
        expect(driver.find.hook('item-download').length).to.equal(1); // isSiteMode(from viewModeWrapper):true,isiOS:false,allowDownload:true,isDemo:false
        stubiOS.restore();
      });
      it('isDemo value doesnt matter while isSiteMode() is false (from viewModeWrapper)', () => {
        viewModeWrapper.setViewMode(VIEW_MODE.EDIT);
        const stubiOS = sinon.stub(utils, 'isiOS').returns(false);
        Object.assign(sampleItemViewProps, {
          styleParams: { allowDownload: true },
          isDemo: true,
        });
        driver.mount(ItemView, sampleItemViewProps);
        expect(driver.find.hook('item-download').length).to.equal(1); // isSiteMode(from viewModeWrapper):false,isiOS:false,allowDownload:true,isDemo:true
        driver.set.props({
          styleParams: { allowDownload: true },
          isDemo: false,
        });
        expect(driver.find.hook('item-download').length).to.equal(1); // isSiteMode(from viewModeWrapper):false,isiOS:false,allowDownload:true,isDemo:flase
        viewModeWrapper.setViewMode(VIEW_MODE.SITE);
        stubiOS.restore();
      });
      it('should call eventsListener with different event for text items', () => {
        viewModeWrapper.setViewMode(VIEW_MODE.EDIT);
        const stubiOS = sinon.stub(utils, 'isiOS').returns(false);
        const stub = sinon.stub(sampleItemViewProps.actions, 'eventsListener');
        Object.assign(sampleItemViewProps, {
          type: 'text',
          styleParams: { allowDownload: true },
          isDemo: false,
        });
        driver.mount(ItemView, sampleItemViewProps);
        driver.find.hook('item-download').simulate('click', mockEvent);
        expect(stub.calledWith(EVENTS.TEXT_DOWNLOAD_BUTTON_CLICKED)).to.be.true;
        driver.set.props({ type: 'image' });
        driver.find.hook('item-download').simulate('click', mockEvent);
        expect(stub.calledWith(EVENTS.DOWNLOAD_BUTTON_CLICKED)).to.be.true;
        viewModeWrapper.setViewMode(VIEW_MODE.SITE);
        stubiOS.restore();
        stub.restore();
      });
    });
  });
});
