import { GALLERY_CONSTS } from 'pro-gallery-lib';
import { expect } from 'chai';
import SlideshowView from '../../src/components/gallery/proGallery/slideshowView';
import GalleryDriver from '../drivers/reactDriver';
import sinon from 'sinon';

describe('styleParam - pauseAutoSlideshowOnHover', () => {
  let driver;
  let galleryViewProps;
  let clock;
  let initialProps;

  beforeEach(() => {
    driver = new GalleryDriver();
    initialProps = driver.props.galleryView();
    Object.assign(initialProps.styleParams, {
      oneRow: true,
      isAutoSlideshow: true,
      autoSlideshowInterval: 1,
      galleryLayout: GALLERY_CONSTS.layout.SLIDESHOW,
    });
    clock = sinon.useFakeTimers();
  });

  afterEach(() => {
    clock.restore();
  });
  it('startAutoSlideshow should not be called when Hovering over the gallery', () => {
    Object.assign(initialProps.styleParams, {
      pauseAutoSlideshowOnHover: true,
    });
    galleryViewProps = driver.props.galleryView(initialProps);
    const stub = sinon.stub(SlideshowView.prototype, 'next');
    driver.mount(SlideshowView, galleryViewProps);
    driver.set.props({ isGalleryContainerInHover: true });
    expect(stub.called).to.equal(false);
    clock.tick(900);
    expect(stub.called).to.equal(false);
    clock.tick(300);
    expect(stub.called).to.equal(false);
    stub.restore();
  });

  it('startAutoSlideshow should be called when the gallery is not hovering', () => {
    Object.assign(initialProps.styleParams, {
      pauseAutoSlideshowOnHover: true,
    });
    galleryViewProps = driver.props.galleryView(initialProps);
    const stub = sinon.stub(SlideshowView.prototype, 'next');
    driver.mount(SlideshowView, galleryViewProps);
    driver.set.props({ isGalleryContainerInHover: false });
    expect(stub.called).to.equal(false);
    clock.tick(900);
    expect(stub.called).to.equal(false);
    clock.tick(300);
    expect(stub.called).to.equal(true);
    stub.restore();
  });
});
