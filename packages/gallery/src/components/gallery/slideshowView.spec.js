import { viewModeWrapper } from '../../common/window/viewModeWrapper';
import GalleryDriver from '../../../__testsDrivers__/drivers/reactDriver';
import SlideshowView from './slideshowView';
import { expect } from 'chai';
import sinon from 'sinon';
import VIEW_MODE from '../../common/constants/viewMode';

describe('Slideshow View', () => {
  let driver;
  let initialGalleryViewProps;
  let galleryViewProps;
  let clock;
  let helpers;

  beforeEach(() => {
    helpers = require('./galleryHelpers.js');
    sinon.stub(helpers, 'isGalleryInViewport').callsFake(() => {
      return true;
    });
    driver = new GalleryDriver();
    initialGalleryViewProps = driver.props.galleryView();
    Object.assign(initialGalleryViewProps.styleParams, {
      oneRow: true,
    });
    clock = sinon.useFakeTimers();
  });

  afterEach(() => {
    clock.restore();
    helpers.isGalleryInViewport.restore();
  });

  describe('init of different items', () => {
    it('init one item gallery', () => {
      Object.assign(initialGalleryViewProps, {
        items: [initialGalleryViewProps.items[0]],
      });
      galleryViewProps = driver.props.galleryView(initialGalleryViewProps);
      driver.mount(SlideshowView, galleryViewProps);
      expect(driver.find.hook('gallery-column').length).to.equal(1);
      expect(driver.find.selector('GalleryDebugMessage').length).to.equal(1);
    });

    it('init empty gallery', () => {
      Object.assign(initialGalleryViewProps, {
        items: [],
      });
      galleryViewProps = driver.props.galleryView(initialGalleryViewProps);
      driver.mount(SlideshowView, galleryViewProps);
      expect(driver.find.hook('gallery-column').length).to.equal(1);
    });

    it('should show next-arrow if more then one item, otherwise no next-arrow', () => {
      //expect images-moch.testImages to contain more than 1 image
      //=> more than 1 item
      galleryViewProps = driver.props.galleryView(initialGalleryViewProps);
      driver.mount(SlideshowView, galleryViewProps);
      expect(driver.find.hook('nav-arrow-next').length).to.equal(1);
      expect(driver.find.hook('nav-arrow-back').length).to.equal(0);
      //one item
      Object.assign(initialGalleryViewProps, {
        items: [initialGalleryViewProps.items[0]],
      });
      galleryViewProps = driver.props.galleryView(initialGalleryViewProps);
      driver.mount(SlideshowView, galleryViewProps);
      expect(driver.find.hook('nav-arrow-next').length).to.equal(0);
      expect(driver.find.hook('nav-arrow-back').length).to.equal(0);
    });
  });

  describe('Scroll', () => {
    it('Handle keypress correctly (next/prev image)', () => {
      galleryViewProps = driver.props.galleryView(initialGalleryViewProps);
      driver.mount(SlideshowView, galleryViewProps);
      const stubLast = sinon
        .stub(SlideshowView.prototype, 'isLastItem')
        .returns(false);
      const stubFirst = sinon
        .stub(SlideshowView.prototype, 'isFirstItem')
        .returns(true);
      expect(driver.get.state('currentIdx')).to.equal(0);
      //nextItem - forward
      driver.get.instance().handleSlideshowKeyPress({
        keyCode: 39,
        charCode: null,
        preventDefault() {},
        stopPropagation() {},
      });
      expect(driver.get.state('currentIdx')).to.equal(1);
      stubFirst.returns(false);
      clock.tick(450); // does not navigate more than once every 400 ms
      driver.get.instance().handleSlideshowKeyPress({
        keyCode: 40,
        charCode: null,
        preventDefault() {},
        stopPropagation() {},
      });
      expect(driver.get.state('currentIdx')).to.equal(2);
      clock.tick(450); // does not navigate more than once every 400 ms
      driver.get.instance().handleSlideshowKeyPress({
        keyCode: null,
        charCode: 32,
        preventDefault() {},
        stopPropagation() {},
      });
      expect(driver.get.state('currentIdx')).to.equal(3);
      clock.tick(450); // does not navigate more than once every 400 ms
      driver.get.instance().handleSlideshowKeyPress({
        keyCode: null,
        charCode: 34,
        preventDefault() {},
        stopPropagation() {},
      });
      expect(driver.get.state('currentIdx')).to.equal(4);
      //nextItem - backward
      clock.tick(450); // does not navigate more than once every 400 ms
      driver.get.instance().handleSlideshowKeyPress({
        keyCode: 38,
        charCode: null,
        preventDefault() {},
        stopPropagation() {},
      });
      expect(driver.get.state('currentIdx')).to.equal(3);
      clock.tick(450); // does not navigate more than once every 400 ms
      driver.get.instance().handleSlideshowKeyPress({
        keyCode: 37,
        charCode: null,
        preventDefault() {},
        stopPropagation() {},
      });
      expect(driver.get.state('currentIdx')).to.equal(2);
      clock.tick(450); // does not navigate more than once every 400 ms
      driver.get.instance().handleSlideshowKeyPress({
        keyCode: null,
        charCode: 33,
        preventDefault() {},
        stopPropagation() {},
      });
      expect(driver.get.state('currentIdx')).to.equal(1);
      clock.tick(450); // does not navigate more than once every 400 ms
      driver.get.instance().handleSlideshowKeyPress({
        keyCode: null,
        charCode: 33,
        preventDefault() {},
        stopPropagation() {},
      });
      expect(driver.get.state('currentIdx')).to.equal(0);
      stubFirst.returns(true);
      clock.tick(450); // does not navigate more than once every 400 ms
      driver.get.instance().handleSlideshowKeyPress({
        keyCode: null,
        charCode: 33,
        preventDefault() {},
        stopPropagation() {},
      });
      expect(driver.get.state('currentIdx')).to.equal(0);
      stubLast.restore();
      stubFirst.restore();
    });

    it('Handle nav arrows click correctly (next/prev image)', () => {
      Object.assign(initialGalleryViewProps.scroll, {
        top: 1,
      });
      galleryViewProps = driver.props.galleryView(initialGalleryViewProps);
      driver.mount(SlideshowView, galleryViewProps);
      expect(driver.get.state('currentIdx')).to.equal(0);
      clock.tick(450); // does not navigate more than once every 400 ms
      driver.find.hook('nav-arrow-next').simulate('click');
      expect(driver.get.state('currentIdx')).to.equal(1); //navigates
      clock.tick(450); // does not navigate more than once every 400 ms
      driver.find.hook('nav-arrow-next').simulate('click');
      expect(driver.get.state('currentIdx')).to.equal(2);
    });
  });

  describe('Thumbnails', () => {
    it('Thumbnails are created if layout is Thumbnails', () => {
      Object.assign(initialGalleryViewProps.styleParams, {
        hasThumbnails: true,
      });
      galleryViewProps = driver.props.galleryView(initialGalleryViewProps);
      driver.mount(SlideshowView, galleryViewProps);
      expect(driver.find.hook('gallery-thumbnails').length).to.equal(1);
      expect(driver.find.hook('gallery-thumbnails-column').length).to.not.equal(
        0,
      );
    });
  });

  describe('Auto Slideshow', () => {
    //IMPORTANT - I used useFakeTimers() to run this test. if you have something that happens only X time after a click etc. you can also use this.
    //Why not setTimeout?, setTimeout will actually wait the time you ask it to and that means a higher time cost on our tests.
    //the fake timers "fakes" the time passing and then proceeds to the next line in the test.
    //In this test i use 900 + 300 ms timers but in fact the test run for about 240 ms in total.
    //To use fake timers you need to set them up. preferably in the beforeEact and afterEach. you can see how to do it in this file.
    it('startAutoSlideshow is called if needed', () => {
      Object.assign(initialGalleryViewProps.styleParams, {
        isAutoSlideshow: true,
        autoSlideshowInterval: 1,
        galleryLayout: 4,
      });
      galleryViewProps = driver.props.galleryView(initialGalleryViewProps);
      const stub = sinon.stub(SlideshowView.prototype, 'nextItem');
      viewModeWrapper.setViewMode(VIEW_MODE.EDIT);
      driver.mount(SlideshowView, galleryViewProps);
      expect(stub.called).to.equal(false);
      clock.tick(900);
      expect(stub.called).to.equal(false);
      clock.tick(300);
      expect(stub.called).to.equal(true);
      stub.restore();
      viewModeWrapper.setViewMode(VIEW_MODE.SITE);
    });

    it('nextItem works with normal or last items', () => {
      Object.assign(initialGalleryViewProps.styleParams, {
        isAutoSlideshow: true,
        autoSlideshowInterval: 10,
      });
      galleryViewProps = driver.props.galleryView(initialGalleryViewProps);
      const stubLast = sinon
        .stub(SlideshowView.prototype, 'isLastItem')
        .returns(false);
      viewModeWrapper.setViewMode(VIEW_MODE.EDIT);
      driver.mount(SlideshowView, galleryViewProps);
      driver.get.instance().nextItem(1, true);
      expect(driver.get.state('currentIdx')).to.equal(1);
      stubLast.returns(true);
      driver.get.instance().nextItem(1, true);
      expect(driver.get.state('currentIdx')).to.equal(0);
      viewModeWrapper.setViewMode(VIEW_MODE.SITE);
      stubLast.restore();
    });
  });
});
