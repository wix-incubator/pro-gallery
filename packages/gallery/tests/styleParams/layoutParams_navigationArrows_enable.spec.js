import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { GALLERY_CONSTS, optionsMap } from 'pro-gallery-lib';
import { images2 } from '../drivers/mocks/items';
import { options, container } from '../drivers/mocks/styles';

describe('options - layoutParams_navigationArrows_enable', () => {
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
  it('should show arrows"', async () => {
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].EMPTY,
      [optionsMap.behaviourParams.gallery.horizontal.enableScrollSnap]: true,
      [optionsMap.layoutParams.structure.scrollDirection]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection]
          .HORIZONTAL,
      [optionsMap.layoutParams.navigationArrows.enable]: true,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const arrows = driver.find.selector('.nav-arrows-container');
    expect(arrows.length).to.be.greaterThan(0);
    driver.detach.proGallery();
  });
  it('should not show arrows"', async () => {
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].EMPTY,
      [optionsMap.behaviourParams.gallery.horizontal.enableScrollSnap]: true,
      [optionsMap.layoutParams.structure.scrollDirection]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection]
          .HORIZONTAL,
      [optionsMap.layoutParams.navigationArrows.enable]: false,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const arrows = driver.find.selector('.nav-arrows-container');
    expect(arrows.length).to.eq(0);
    driver.detach.proGallery();
  });
});
