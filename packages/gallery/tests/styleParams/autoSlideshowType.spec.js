import { GALLERY_CONSTS, viewModeWrapper, optionsMap } from 'pro-gallery-lib';
import { expect } from 'chai';
import SlideshowView from '../../src/components/gallery/proGallery/slideshowView';
import GalleryDriver from '../drivers/reactDriver';
import sinon from 'sinon';

describe('options - autoSlideshowType', () => {
  let driver;
  let galleryViewProps;
  let clock;
  let initialProps;

  beforeEach(() => {
    driver = new GalleryDriver();
    initialProps = driver.props.galleryView();
    Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.scrollDirection]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection]
          .HORIZONTAL,
    });
    clock = sinon.useFakeTimers();
  });

  afterEach(() => {
    clock.restore();
  });
  it('Should call "next" with the correct value when auto autoSlideshowType set to "INTERVAL"', () => {
    Object.assign(initialProps.options, {
      [optionsMap.behaviourParams.gallery.horizontal.autoSlide.interval]: 1,
      [optionsMap.behaviourParams.gallery.horizontal.autoSlide.behaviour]:
        GALLERY_CONSTS[
          optionsMap.behaviourParams.gallery.horizontal.autoSlide.behaviour
        ].INTERVAL,
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].SLIDER,
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
    Object.assign(initialProps.options, {
      [optionsMap.behaviourParams.gallery.horizontal.autoSlide.speed]: 200,
      [optionsMap.behaviourParams.gallery.horizontal.autoSlide.behaviour]:
        GALLERY_CONSTS[
          optionsMap.behaviourParams.gallery.horizontal.autoSlide.behaviour
        ].CONTINUOUS,
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].SLIDER,
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
