import { GALLERY_CONSTS, viewModeWrapper } from 'pro-gallery-lib';
import GalleryDriver from '../../drivers/reactDriver';
import SlideshowView from '../../../src/components/gallery/proGallery/slideshowView';
import { expect } from 'chai';
import sinon from 'sinon';
import _ from 'lodash';

describe('Slideshow View', () => {
  let driver;
  let initialGalleryViewProps;
  let galleryViewProps;
  let clock;

  beforeEach(() => {
    driver = new GalleryDriver();
    initialGalleryViewProps = driver.props.galleryView();
    initialGalleryViewProps.options = _.cloneDeep(
      initialGalleryViewProps.options
    );
    Object.assign(initialGalleryViewProps.options, {
      scrollDirection: GALLERY_CONSTS.scrollDirection.HORIZONTAL,
    });
    clock = sinon.useFakeTimers();
  });

  afterEach(() => {
    clock.restore();
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
      setTimeout(() => {
        expect(driver.find.hook('nav-arrow-next').length).to.equal(1);
        expect(driver.find.hook('nav-arrow-back').length).to.equal(0);
      }, 450);
      //one item
      Object.assign(initialGalleryViewProps, {
        items: [initialGalleryViewProps.items[0]],
      });
      galleryViewProps = driver.props.galleryView(initialGalleryViewProps);
      driver.mount(SlideshowView, galleryViewProps);
      setTimeout(() => {
        expect(driver.find.hook('nav-arrow-next').length).to.equal(0);
        expect(driver.find.hook('nav-arrow-back').length).to.equal(0);
      }, 450);
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
      expect(driver.get.state('activeIndex')).to.equal(0);
      //nextItem - forward
      driver.get.instance().handleSlideshowKeyPress({
        keyCode: 39,
        charCode: null,
        preventDefault() {},
        stopPropagation() {},
      });
      setTimeout(() => {
        expect(driver.get.state('activeIndex')).to.equal(1);
        stubFirst.returns(false);
        driver.get.instance().handleSlideshowKeyPress({
          keyCode: 40,
          charCode: null,
          preventDefault() {},
          stopPropagation() {},
        });
        setTimeout(() => {
          expect(driver.get.state('activeIndex')).to.equal(2);
          driver.get.instance().handleSlideshowKeyPress({
            keyCode: null,
            charCode: 32,
            preventDefault() {},
            stopPropagation() {},
          });
          setTimeout(() => {
            expect(driver.get.state('activeIndex')).to.equal(3);
            driver.get.instance().handleSlideshowKeyPress({
              keyCode: null,
              charCode: 34,
              preventDefault() {},
              stopPropagation() {},
            });
            setTimeout(() => {
              expect(driver.get.state('activeIndex')).to.equal(4);
              driver.get.instance().handleSlideshowKeyPress({
                keyCode: 38,
                charCode: null,
                preventDefault() {},
                stopPropagation() {},
              });
              setTimeout(() => {
                expect(driver.get.state('activeIndex')).to.equal(3);
                driver.get.instance().handleSlideshowKeyPress({
                  keyCode: 37,
                  charCode: null,
                  preventDefault() {},
                  stopPropagation() {},
                });
                setTimeout(() => {
                  expect(driver.get.state('activeIndex')).to.equal(2);
                  driver.get.instance().handleSlideshowKeyPress({
                    keyCode: null,
                    charCode: 33,
                    preventDefault() {},
                    stopPropagation() {},
                  });
                  setTimeout(() => {
                    expect(driver.get.state('activeIndex')).to.equal(1);
                    driver.get.instance().handleSlideshowKeyPress({
                      keyCode: null,
                      charCode: 33,
                      preventDefault() {},
                      stopPropagation() {},
                    });
                    setTimeout(() => {
                      expect(driver.get.state('activeIndex')).to.equal(0);
                      stubFirst.returns(true);
                      driver.get.instance().handleSlideshowKeyPress({
                        keyCode: null,
                        charCode: 33,
                        preventDefault() {},
                        stopPropagation() {},
                      });
                      setTimeout(() => {
                        expect(driver.get.state('activeIndex')).to.equal(0);
                        stubLast.restore();
                        stubFirst.restore();
                      }, 450);
                    }, 450);
                  }, 450);
                }, 450);
              }, 450);
            }, 450);
          }, 450);
        }, 450);
      }, 450);
    });

    it('Handle nav arrows click correctly (next/prev image)', () => {
      jest.useFakeTimers();
      Object.assign(initialGalleryViewProps.scroll, {
        top: 1,
        left: 1,
      });
      // constants determining the gallery's height
      const galleryHeight = initialGalleryViewProps.container.galleryHeight;
      const imageMargin = initialGalleryViewProps.options.imageMargin;
      // assigning the height parameter as in this.props.container to gallery's height
      Object.assign(initialGalleryViewProps.container, {
        height: galleryHeight - imageMargin,
      });
      galleryViewProps = driver.props.galleryView(initialGalleryViewProps);
      driver.mount(SlideshowView, galleryViewProps);
      expect(driver.get.state('activeIndex')).to.equal(0);
      driver.find.hook('nav-arrow-next').simulate('click');
      setTimeout(() => {
        expect(driver.get.state('activeIndex')).to.equal(1); //navigates
        driver.find.hook('nav-arrow-next').simulate('click');
        jest.advanceTimersByTime(1000);
        setTimeout(() => {
          expect(driver.get.state('activeIndex')).to.equal(2);
        }, 450);
      }, 450);
    });
  });

  describe('Thumbnails', () => {
    it('Thumbnails are created if layout is Thumbnails', () => {
      Object.assign(initialGalleryViewProps.options, {
        hasThumbnails: true,
      });
      galleryViewProps = driver.props.galleryView(initialGalleryViewProps);
      driver.mount(SlideshowView, galleryViewProps);
      expect(driver.find.hook('gallery-thumbnails').length).to.equal(1);
      expect(driver.find.hook('gallery-thumbnails-column').length).to.not.equal(
        0
      );
    });
  });

  describe('Virtual Item Loading', () => {
    it.skip('only load items that are visible', () => {
      Object.assign(initialGalleryViewProps, {
        virtualizationSettings: {
          enabled: true,
          forwardItemScrollMargin: 0,
          backwardItemScrollMargin: 0,
        },
      });
      Object.assign(initialGalleryViewProps.options, {
        slideAnimation: GALLERY_CONSTS.slideAnimations.SCROLL,
      });
      galleryViewProps = driver.props.galleryView(initialGalleryViewProps);
      driver.mount(SlideshowView, galleryViewProps);
      expect(driver.images.length).to.equal(1);
    });
    it.skip('also load imags in margin', () => {
      Object.assign(initialGalleryViewProps, {
        virtualizationSettings: {
          enabled: true,
          forwardItemMargin: 3,
          backwardItemMargin: 0,
        },
      });
      Object.assign(initialGalleryViewProps.options, {
        slideAnimation: GALLERY_CONSTS.slideAnimations.FADE,
      });
      galleryViewProps = driver.props.galleryView(initialGalleryViewProps);
      driver.mount(SlideshowView, galleryViewProps);
      const imagesWithoutFirst = driver.images.slice(1, driver.images.length);
      const imagesSize = imagesWithoutFirst.reduce(
        (acc, image) => acc + image.props.style.width,
        0
      );
      const buffer =
        imagesSize / initialGalleryViewProps.container.galleryWidth;
      expect(Math.floor(buffer)).to.equal(3);
    });
  });

  describe('Auto Slideshow', () => {
    //IMPORTANT - I used useFakeTimers() to run this test. if you have something that happens only X time after a click etc. you can also use this.
    //Why not setTimeout?, setTimeout will actually wait the time you ask it to and that means a higher time cost on our tests.
    //the fake timers "fakes" the time passing and then proceeds to the next line in the test.
    //In this test i use 900 + 300 ms timers but in fact the test run for about 240 ms in total.
    //To use fake timers you need to set them up. preferably in the beforeEact and afterEach. you can see how to do it in this file.
    it('startAutoSlideshow is called if needed', () => {
      Object.assign(initialGalleryViewProps.options, {
        isAutoSlideshow: true,
        autoSlideshowInterval: 1,
        autoSlideshowType: GALLERY_CONSTS.autoSlideshowTypes.INTERVAL,
        galleryLayout: 4,
      });
      galleryViewProps = driver.props.galleryView(initialGalleryViewProps);
      const stub = sinon.stub(SlideshowView.prototype, 'next');
      viewModeWrapper.setViewMode(GALLERY_CONSTS.viewMode.PREVIEW);
      driver.mount(SlideshowView, galleryViewProps);
      expect(stub.called).to.equal(false);
      clock.tick(900);
      expect(stub.called).to.equal(false);
      clock.tick(300);
      expect(stub.called).to.equal(true);
      stub.restore();
      viewModeWrapper.setViewMode(GALLERY_CONSTS.viewMode.SITE);
    });
  });
});
