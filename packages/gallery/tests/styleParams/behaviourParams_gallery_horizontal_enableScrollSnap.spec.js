import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { GALLERY_CONSTS, optionsMap } from 'pro-gallery-lib';
import { images2 } from '../drivers/mocks/items';
import { options, container } from '../drivers/mocks/styles';

describe('options - behaviourParams_gallery_horizontal_enableScrollSnap', () => {
  let driver;
  let initialProps;
  beforeEach(() => {
    driver = new GalleryDriver();
    initialProps = {
      container,
      items: images2,
      options,
    };
  });
  it('should set class "scroll-snap"', async () => {
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].EMPTY,
      [optionsMap.behaviourParams.gallery.horizontal.enableScrollSnap]: true,
      [optionsMap.layoutParams.structure.scrollDirection]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection]
          .HORIZONTAL,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const galleryContainer = driver.find.selector('.gallery-horizontal-scroll');
    expect(galleryContainer.hasClass('scroll-snap')).to.be.true;
    driver.detach.proGallery();
  });

  it('should not set class "scroll-snap"', async () => {
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].EMPTY,
      [optionsMap.behaviourParams.gallery.horizontal.enableScrollSnap]: false,
      [optionsMap.layoutParams.structure.scrollDirection]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection]
          .HORIZONTAL,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const galleryContainer = driver.find.selector('.gallery-horizontal-scroll');
    expect(galleryContainer.hasClass('scroll-snap')).to.be.false;
    driver.detach.proGallery();
  });
});
