import { GALLERY_CONSTS, optionsMap } from 'pro-gallery-lib';
import { expect } from 'chai';
import SlideshowView from '../../src/components/gallery/proGallery/slideshowView';
import GalleryDriver from '../drivers/reactDriver';
import sinon from 'sinon';

describe('options - behaviourParams_gallery_horizontal_autoSlide_pauseOnHover', () => {
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
    Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.scrollDirection]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection]
          .HORIZONTAL,
      [optionsMap.behaviourParams.gallery.horizontal.autoSlide.behaviour]:
        GALLERY_CONSTS[
          optionsMap.behaviourParams.gallery.horizontal.autoSlide.behaviour
        ].INTERVAL,
      [optionsMap.behaviourParams.gallery.horizontal.autoSlide.interval]: 1,
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout]
          .SLIDESHOW,
      [optionsMap.behaviourParams.gallery.horizontal.autoSlide
        .pauseOnHover]: true,
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
