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
    clock = sinon.useFakeTimers();
  });

  afterEach(() => {
    clock.restore();
  });
  it('shuld not auto slide when Hovering over the gallery', () => {
    Object.assign(initialProps.styleParams, {
      oneRow: true,
      isAutoSlideshow: true,
      autoSlideshowInterval: 1,
      galleryLayout: GALLERY_CONSTS.layout.SLIDESHOW,
      pauseAutoSlideshowOnHover: true,
    });
    galleryViewProps = driver.props.galleryView(initialProps);
    const stub = sinon.stub(SlideshowView.prototype, 'next');
    driver.mount(SlideshowView, galleryViewProps);
    driver.set.props({ isGalleryContainerInHover: true });
    clock.tick(1200);
    expect(stub.called).to.equal(false);
    stub.restore();
  });
});
