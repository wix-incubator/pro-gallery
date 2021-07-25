import { GALLERY_CONSTS, viewModeWrapper } from 'pro-gallery-lib';
import { expect } from 'chai';
import SlideshowView from '../../src/components/gallery/proGallery/slideshowView';
import GalleryDriver from '../drivers/reactDriver';
import sinon from 'sinon';

describe('styleParam - autoSlideShowType', () => {
  let driver;
  let galleryViewProps;
  let clock;
  let initialProps;

  beforeEach(() => {
    driver = new GalleryDriver();
    initialProps = driver.props.galleryView();
    Object.assign(initialProps.styleParams, {
      scrollDirection: GALLERY_CONSTS.scrollDirection.HORIZONTAL,
    });
    clock = sinon.useFakeTimers();
  });

  afterEach(() => {
    clock.restore();
  });
  it('should startAutoSlideshow after interval', () => {
    Object.assign(initialProps.styleParams, {
      isAutoSlideshow: true,
      autoSlideshowInterval: 1,
      autoSlideshowType: GALLERY_CONSTS.autoSlideshowType.INTERVAL,
      galleryLayout: 4,
    });
    galleryViewProps = driver.props.galleryView(initialProps);
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
  it('should call startAutoSlideshow with CONTINUES behavior', () => {
    Object.assign(initialProps.styleParams, {
      isAutoSlideshow: true,
      autoSlideshowInterval: 1,
      scrollDuration: 2000,
      autoSlideshowType: GALLERY_CONSTS.autoSlideshowType.CONTINUES,
      galleryLayout: 4,
    });
    galleryViewProps = driver.props.galleryView(initialProps);
    const stub = sinon.stub(SlideshowView.prototype, 'next');
    viewModeWrapper.setViewMode(GALLERY_CONSTS.viewMode.PREVIEW);
    driver.mount(SlideshowView, galleryViewProps);
    expect(stub.called).to.equal(true);
    stub.restore();
    viewModeWrapper.setViewMode(GALLERY_CONSTS.viewMode.SITE);
  });
});
