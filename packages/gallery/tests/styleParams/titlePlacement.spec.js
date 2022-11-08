import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { GALLERY_CONSTS, optionsMap } from 'pro-gallery-lib';
import { images2 } from '../drivers/mocks/items';
import { options, container, customComponents } from '../drivers/mocks/styles';

describe('options - titlePlacement', () => {
  let driver;
  let initialProps;

  beforeEach(() => {
    driver = new GalleryDriver();
    initialProps = {
      container,
      items: images2,
      options,
      customComponents,
    };
  });

  it('should place texts below images when "titlePlacement" is "SHOW_BELOW"', async () => {
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
      [optionsMap.layoutParams.structure.scrollDirection]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection]
          .VERTICAL,
      [optionsMap.layoutParams.info.placement]:
        GALLERY_CONSTS[optionsMap.layoutParams.info.placement].BELOW,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const items = driver.find.selector('.gallery-item-bottom-info');
    expect(items).to.have.lengthOf(6);
    driver.detach.proGallery();
  });
  it('should place texts above images when "titlePlacement" is "SHOW_ABOVE"', async () => {
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
      [optionsMap.layoutParams.structure.scrollDirection]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection]
          .VERTICAL,
      [optionsMap.layoutParams.info.placement]:
        GALLERY_CONSTS[optionsMap.layoutParams.info.placement].ABOVE,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const items = driver.find.selector('.gallery-item-top-info');
    expect(items).to.have.lengthOf(6);
    driver.detach.proGallery();
  });
  it('should render hover when "titlePlacement" is "SHOW_ON_HOVER"', async () => {
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
      [optionsMap.layoutParams.structure.scrollDirection]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection]
          .VERTICAL,
      [optionsMap.layoutParams.info.placement]:
        GALLERY_CONSTS[optionsMap.layoutParams.info.placement].OVERLAY,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const items = driver.find.selector('.gallery-item-hover');
    expect(items.length).to.be.greaterThan(0);
    driver.detach.proGallery();
  });
});
