import { GALLERY_CONSTS, viewModeWrapper, optionsMap } from 'pro-gallery-lib';
import { expect } from 'chai';
import SlideshowView from '../../src/components/gallery/proGallery/slideshowView';
import GalleryDriver from '../drivers/reactDriver';
import sinon from 'sinon';

describe('options - behaviourParams_gallery_horizontal_autoSlide_interval', () => {
  let driver;
  let galleryViewProps;
  let clock;
  let initialProps;

  beforeEach(() => {
    driver = new GalleryDriver();
    initialProps = driver.props.galleryView();
    Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.scrollDirection]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].HORIZONTAL,
    });
    clock = sinon.useFakeTimers();
  });

  afterEach(() => {
    clock.restore();
  });
  it('startAutoSlideshow is called if needed', () => {
    Object.assign(initialProps.options, {
      [optionsMap.behaviourParams.gallery.horizontal.autoSlide.interval]: 1,
      [optionsMap.behaviourParams.gallery.horizontal.autoSlide.behaviour]:
        GALLERY_CONSTS[optionsMap.behaviourParams.gallery.horizontal.autoSlide.behaviour].INTERVAL,
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].SLIDER,
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
});
