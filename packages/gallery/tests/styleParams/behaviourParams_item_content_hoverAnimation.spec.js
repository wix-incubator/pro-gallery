import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { GALLERY_CONSTS, optionsMap } from 'pro-gallery-lib';
import { images2 } from '../drivers/mocks/items';
import { options, container } from '../drivers/mocks/styles';

describe('options - behaviourParams_item_content_hoverAnimation', () => {
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

  it('should have "Zoom in" animation on items', async () => {
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
      [optionsMap.behaviourParams.item.content.hoverAnimation]:
        GALLERY_CONSTS[optionsMap.behaviourParams.item.content.hoverAnimation].ZOOM_IN,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const animatedItems = driver.find.selector('.zoom-in-on-hover').at(0);
    expect(animatedItems.length).to.be.greaterThan(0);
    driver.detach.proGallery();
  });
  it('should have "Blur" animation on items', async () => {
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
      [optionsMap.behaviourParams.item.content.hoverAnimation]:
        GALLERY_CONSTS[optionsMap.behaviourParams.item.content.hoverAnimation].BLUR,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const animatedItems = driver.find.selector('.blur-on-hover').at(0);
    expect(animatedItems.length).to.be.greaterThan(0);
    driver.detach.proGallery();
  });
  it('should have "Greyscale" animation on items', async () => {
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
      [optionsMap.behaviourParams.item.content.hoverAnimation]:
        GALLERY_CONSTS[optionsMap.behaviourParams.item.content.hoverAnimation].GRAYSCALE,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const animatedItems = driver.find.selector('.grayscale-on-hover').at(0);
    expect(animatedItems.length).to.be.greaterThan(0);
    driver.detach.proGallery();
  });
  it('should have "Shrink" animation on items', async () => {
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
      [optionsMap.behaviourParams.item.content.hoverAnimation]:
        GALLERY_CONSTS[optionsMap.behaviourParams.item.content.hoverAnimation].SHRINK,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const animatedItems = driver.find.selector('.shrink-on-hover').at(0);
    expect(animatedItems.length).to.be.greaterThan(0);
    driver.detach.proGallery();
  });
  it('should have "invert" animation on items', async () => {
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
      [optionsMap.behaviourParams.item.content.hoverAnimation]:
        GALLERY_CONSTS[optionsMap.behaviourParams.item.content.hoverAnimation].INVERT,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const animatedItems = driver.find.selector('.invert-on-hover').at(0);
    expect(animatedItems.length).to.be.greaterThan(0);
    driver.detach.proGallery();
  });
  it('should have "Color in" animation on items', async () => {
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
      [optionsMap.behaviourParams.item.content.hoverAnimation]:
        GALLERY_CONSTS[optionsMap.behaviourParams.item.content.hoverAnimation].COLOR_IN,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const animatedItems = driver.find.selector('.color-in-on-hover').at(0);
    expect(animatedItems.length).to.be.greaterThan(0);
    driver.detach.proGallery();
  });
  it('should have "Darkened" animation on items', async () => {
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
      [optionsMap.behaviourParams.item.content.hoverAnimation]:
        GALLERY_CONSTS[optionsMap.behaviourParams.item.content.hoverAnimation].DARKENED,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const animatedItems = driver.find.selector('.darkened-on-hover').at(0);
    expect(animatedItems.length).to.be.greaterThan(0);
    driver.detach.proGallery();
  });
});
