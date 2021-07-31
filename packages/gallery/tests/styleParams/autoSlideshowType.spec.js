import { GALLERY_CONSTS, viewModeWrapper } from 'pro-gallery-lib';
import { expect } from 'chai';
import SlideshowView from '../../src/components/gallery/proGallery/slideshowView';
import GalleryDriver from '../drivers/reactDriver';
import sinon from 'sinon';

describe('styleParam - autoSlideshowType', () => {
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
  it('Should call "next" with the correct value when auto autoSlideshowType set to "INTERVAL"', () => {
    Object.assign(initialProps.styleParams, {
      isAutoSlideshow: true,
      autoSlideshowInterval: 1,
      autoSlideshowType: GALLERY_CONSTS.autoSlideshowTypes.INTERVAL,
      galleryLayout: 4,
    });
    galleryViewProps = driver.props.galleryView(initialProps);
    const stub = sinon.stub(SlideshowView.prototype, 'next');
    viewModeWrapper.setViewMode(GALLERY_CONSTS.viewMode.PREVIEW);
    driver.mount(SlideshowView, galleryViewProps);
    clock.tick(1100);
    expect(stub.getCall(0).args[0].isContinuousScrolling).to.equal(undefined);
    stub.restore();
    viewModeWrapper.setViewMode(GALLERY_CONSTS.viewMode.SITE);
  });

  it('Should call "next" with the correct value when auto autoSlideshowType set to "CONTINUOUS"', () => {
    Object.assign(initialProps.styleParams, {
      isAutoSlideshow: true,
      autoSlideshowContinuousSpeed: 1,
      autoSlideshowType: GALLERY_CONSTS.autoSlideshowTypes.CONTINUOUS,
      galleryLayout: 4,
    });
    galleryViewProps = driver.props.galleryView(initialProps);
    const stub = sinon.stub(SlideshowView.prototype, 'next');
    viewModeWrapper.setViewMode(GALLERY_CONSTS.viewMode.PREVIEW);
    driver.mount(SlideshowView, galleryViewProps);
    expect(stub.getCall(0).args[0].isContinuousScrolling).to.equal(true);
    stub.restore();
    viewModeWrapper.setViewMode(GALLERY_CONSTS.viewMode.SITE);
  });
});
