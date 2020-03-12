
import { expect } from 'chai';
import SlideshowView from '../../src/components/gallery/proGallery/slideshowView';
import VIEW_MODE from '../../src/common/constants/viewMode';
import { viewModeWrapper } from '../../src/common/window/viewModeWrapper';
import GalleryDriver from '../drivers/reactDriver'
import sinon from 'sinon';

describe('styleParam - autoSLideShowInterval', () => {

  let driver;
  let galleryViewProps;
  let clock;
  let initialProps;
  let helpers

  beforeEach(() => {
    helpers = require('../../src/components/gallery/proGallery/galleryHelpers.js');
    sinon.stub(helpers, 'isGalleryInViewport').callsFake(() => {
      return true;
    });
    driver = new GalleryDriver();
    initialProps = driver.props.galleryView();
    Object.assign(initialProps.styleParams, {
      oneRow: true,
    });
    clock = sinon.useFakeTimers();
  });

  afterEach(() => {
    clock.restore();
  });
  it('startAutoSlideshow is called if needed', () => {
    Object.assign(initialProps.styleParams, {
      isAutoSlideshow: true,
      autoSlideshowInterval: 1,
      galleryLayout: 4,
    });
    galleryViewProps = driver.props.galleryView(initialProps);
    const stub = sinon.stub(SlideshowView.prototype, 'nextItem');
    viewModeWrapper.setViewMode(VIEW_MODE.PREVIEW);
    driver.mount(SlideshowView, galleryViewProps);
    expect(stub.called).to.equal(false);
    clock.tick(900);
    expect(stub.called).to.equal(false);
    clock.tick(300);
    expect(stub.called).to.equal(true);
    stub.restore();
    viewModeWrapper.setViewMode(VIEW_MODE.SITE);
  });
})