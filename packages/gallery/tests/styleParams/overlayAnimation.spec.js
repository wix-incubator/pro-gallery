import { GALLERY_CONSTS } from 'pro-gallery-lib';
import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { mergeNestedObjects } from 'pro-gallery-lib';
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
    initialProps.options = mergeNestedObjects(initialProps.options, {
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      overlayAnimation: GALLERY_CONSTS.overlayAnimations.EXPAND,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const items = driver.find.selector('.hover-animation-expand');
    expect(items.length).to.be.greaterThan(0);
    driver.detach.proGallery();
  });
  it('should have overlay animation class - "FADE IN"', async () => {
    initialProps.options = mergeNestedObjects(initialProps.options, {
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      overlayAnimation: GALLERY_CONSTS.overlayAnimations.FADE_IN,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const items = driver.find.selector('.hover-animation-fade-in');
    expect(items.length).to.be.greaterThan(0);
    driver.detach.proGallery();
  });
  it('should have overlay animation class - "SLIDE UP"', async () => {
    initialProps.options = mergeNestedObjects(initialProps.options, {
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      overlayAnimation: GALLERY_CONSTS.overlayAnimations.SLIDE_UP,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const items = driver.find.selector('.hover-animation-slide-up');
    expect(items.length).to.be.greaterThan(0);
    driver.detach.proGallery();
  });
  it('should have overlay animation class - "SLIDE RIGHT"', async () => {
    initialProps.options = mergeNestedObjects(initialProps.options, {
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      overlayAnimation: GALLERY_CONSTS.overlayAnimations.SLIDE_RIGHT,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const items = driver.find.selector('.hover-animation-slide-right');
    expect(items.length).to.be.greaterThan(0);
    driver.detach.proGallery();
  });
  it('should have overlay animation class - "SLIDE DOWN"', async () => {
    initialProps.options = mergeNestedObjects(initialProps.options, {
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      overlayAnimation: GALLERY_CONSTS.overlayAnimations.SLIDE_DOWN,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const items = driver.find.selector('.hover-animation-slide-down');
    expect(items.length).to.be.greaterThan(0);
    driver.detach.proGallery();
  });
  it('should have overlay animation class - "SLIDE LEFT"', async () => {
    initialProps.options = mergeNestedObjects(initialProps.options, {
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      overlayAnimation: GALLERY_CONSTS.overlayAnimations.SLIDE_LEFT,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const items = driver.find.selector('.hover-animation-slide-left');
    expect(items.length).to.be.greaterThan(0);
    driver.detach.proGallery();
  });
});
