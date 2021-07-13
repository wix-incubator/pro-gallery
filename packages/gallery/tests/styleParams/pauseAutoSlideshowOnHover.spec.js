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
  it('should not auto slide when Hovering over the gallery', () => {
    Object.assign(initialProps.styleParams, {
      scrollDirection: GALLERY_CONSTS.scrollDirection.HORIZONTAL,
      isAutoSlideshow: true,
      autoSlideshowInterval: 1,
      galleryLayout: GALLERY_CONSTS.layout.SLIDESHOW,
      pauseAutoSlideshowOnHover: true,
    });
    galleryViewProps = driver.props.galleryView(initialProps);
    const stub = sinon.stub(SlideshowView.prototype, 'next');
    driver.mount(SlideshowView, galleryViewProps);
    driver.set.props({ isGalleryInHover: true });
    clock.tick(1200);
    expect(stub.called).to.equal(false);
    stub.restore();
  });
});
