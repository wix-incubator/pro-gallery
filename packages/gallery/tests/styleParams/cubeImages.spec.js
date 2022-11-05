import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { GALLERY_CONSTS, optionsMap } from 'pro-gallery-lib';
import { images2 } from '../drivers/mocks/items';
import { options, container } from '../drivers/mocks/styles';

describe('options - cubeImages', () => {
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

  it('should allow to "cubeType" to set class to "itemWrapper"', async () => {
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].EMPTY,
      [optionsMap.layoutParams.crop.enable]: true,
      [optionsMap.layoutParams.crop.method]:
        GALLERY_CONSTS[optionsMap.layoutParams.crop.method].FILL,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const itemWrappers = driver.find.selector('.cube-type-fill');
    //expect to find items that have "cube-type-fill" class
    expect(itemWrappers.length).to.be.greaterThan(0);
    driver.detach.proGallery();
  });
  it('should not allow to "cubeType" to set class to "itemWrapper"', async () => {
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].EMPTY,
      [optionsMap.layoutParams.crop.enable]: false,
      [optionsMap.layoutParams.crop.method]:
        GALLERY_CONSTS[optionsMap.layoutParams.crop.method].FILL,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const itemWrappers = driver.find.selector('.cube-type-fill');
    //expect to not find items with "cube-type-fill" class
    expect(itemWrappers.length).to.eq(0);
    driver.detach.proGallery();
  });
});
