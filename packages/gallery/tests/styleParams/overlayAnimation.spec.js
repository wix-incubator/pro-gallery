import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { GALLERY_CONSTS, optionsMap } from 'pro-gallery-lib';
import { images2 } from '../drivers/mocks/items';
import { options, container } from '../drivers/mocks/styles';

describe('options - overlayAnimation', () => {
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

  it('should have overlay animation class - "EXPAND"', async () => {
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
      [optionsMap.behaviourParams.item.overlay.hoverAnimation]:
        GALLERY_CONSTS[optionsMap.behaviourParams.item.overlay.hoverAnimation]
          .EXPAND,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const items = driver.find.selector('.hover-animation-expand');
    expect(items.length).to.be.greaterThan(0);
    driver.detach.proGallery();
  });
  it('should have overlay animation class - "FADE IN"', async () => {
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
      [optionsMap.behaviourParams.item.overlay.hoverAnimation]:
        GALLERY_CONSTS[optionsMap.behaviourParams.item.overlay.hoverAnimation]
          .FADE_IN,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const items = driver.find.selector('.hover-animation-fade-in');
    expect(items.length).to.be.greaterThan(0);
    driver.detach.proGallery();
  });
  it('should have overlay animation class - "SLIDE UP"', async () => {
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
      [optionsMap.behaviourParams.item.overlay.hoverAnimation]:
        GALLERY_CONSTS[optionsMap.behaviourParams.item.overlay.hoverAnimation]
          .SLIDE_UP,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const items = driver.find.selector('.hover-animation-slide-up');
    expect(items.length).to.be.greaterThan(0);
    driver.detach.proGallery();
  });
  it('should have overlay animation class - "SLIDE RIGHT"', async () => {
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
      [optionsMap.behaviourParams.item.overlay.hoverAnimation]:
        GALLERY_CONSTS[optionsMap.behaviourParams.item.overlay.hoverAnimation]
          .SLIDE_RIGHT,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const items = driver.find.selector('.hover-animation-slide-right');
    expect(items.length).to.be.greaterThan(0);
    driver.detach.proGallery();
  });
  it('should have overlay animation class - "SLIDE DOWN"', async () => {
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
      [optionsMap.behaviourParams.item.overlay.hoverAnimation]:
        GALLERY_CONSTS[optionsMap.behaviourParams.item.overlay.hoverAnimation]
          .SLIDE_DOWN,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const items = driver.find.selector('.hover-animation-slide-down');
    expect(items.length).to.be.greaterThan(0);
    driver.detach.proGallery();
  });
  it('should have overlay animation class - "SLIDE LEFT"', async () => {
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
      [optionsMap.behaviourParams.item.overlay.hoverAnimation]:
        GALLERY_CONSTS[optionsMap.behaviourParams.item.overlay.hoverAnimation]
          .SLIDE_LEFT,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const items = driver.find.selector('.hover-animation-slide-left');
    expect(items.length).to.be.greaterThan(0);
    driver.detach.proGallery();
  });
});
