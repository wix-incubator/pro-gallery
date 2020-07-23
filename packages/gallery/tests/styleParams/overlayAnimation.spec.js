import { GALLERY_CONSTS } from 'pro-gallery-lib';
import GalleryDriver from '../drivers/reactDriver'
import { expect } from 'chai';
import { images2 } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles';

describe('styleParam - overlayAnimation', () => {

  let driver;
  const initialProps = {
    container,
    items: images2,
    styles: styleParams
  }

  beforeEach(() => {
    driver = new GalleryDriver();
  });

  it('should have overlay animation class - "EXPAND"', () => {
    Object.assign(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      overlayAnimation: GALLERY_CONSTS.overlayAnimations.EXPAND,
    })
    driver.mount.proGallery(initialProps);
    const items = driver.find.selector('.hover-animation-expand');
    expect(items.length).to.be.greaterThan(0);
    driver.detach.proGallery();
  });
  it('should have overlay animation class - "FADE IN"', () => {
    Object.assign(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      overlayAnimation: GALLERY_CONSTS.overlayAnimations.FADE_IN,
    })
    driver.mount.proGallery(initialProps);
    const items = driver.find.selector('.hover-animation-fade-in');
    expect(items.length).to.be.greaterThan(0);
    driver.detach.proGallery();
  });
  it('should have overlay animation class - "SLIDE UP"', () => {
    Object.assign(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      overlayAnimation: GALLERY_CONSTS.overlayAnimations.SLIDE_UP,
    })
    driver.mount.proGallery(initialProps);
    const items = driver.find.selector('.hover-animation-slide-up');
    expect(items.length).to.be.greaterThan(0);
    driver.detach.proGallery();
  });
  it('should have overlay animation class - "SLIDE RIGHT"', () => {
    Object.assign(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      overlayAnimation: GALLERY_CONSTS.overlayAnimations.SLIDE_RIGHT,
    })
    driver.mount.proGallery(initialProps);
    const items = driver.find.selector('.hover-animation-slide-right');
    expect(items.length).to.be.greaterThan(0);
    driver.detach.proGallery();
  });

})
