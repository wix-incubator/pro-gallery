import GalleryDriver from '../drivers/reactDriver'
import { expect } from 'chai';
import { images2 } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles';
import GALLERY_CONSTS from '../../src/common/constants';

describe('styleParam - imageHoverAnimation', () => {

  let driver;
  const initialProps = {
    container,
    items: images2,
    styles: styleParams
  }

  beforeEach(() => {
    driver = new GalleryDriver();
  });

  it('should have "Zoom in" animation on items', () => {
    Object.assign(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      imageHoverAnimation: GALLERY_CONSTS.imageHoverAnimations.ZOOM_IN,
    })
    driver.mount.proGallery(initialProps);
    const animatedItems = driver.find.selector('.zoom-in-on-hover').at(0);
    expect(animatedItems.length).to.be.greaterThan(0)
    driver.detach.proGallery();
  });
  it('should have "Blur" animation on items', () => {
    Object.assign(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      imageHoverAnimation: GALLERY_CONSTS.imageHoverAnimations.BLUR,
    })
    driver.mount.proGallery(initialProps);
    const animatedItems = driver.find.selector('.blur-on-hover').at(0);
    expect(animatedItems.length).to.be.greaterThan(0)
    driver.detach.proGallery();
  });
  it('should have "Greyscale" animation on items', () => {
    Object.assign(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      imageHoverAnimation: GALLERY_CONSTS.imageHoverAnimations.GRAYSCALE,
    })
    driver.mount.proGallery(initialProps);
    const animatedItems = driver.find.selector('.grayscale-on-hover').at(0);
    expect(animatedItems.length).to.be.greaterThan(0)
    driver.detach.proGallery();
  });
  it('should have "Shrink" animation on items', () => {
    Object.assign(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      imageHoverAnimation: GALLERY_CONSTS.imageHoverAnimations.SHRINK,
    })
    driver.mount.proGallery(initialProps);
    const animatedItems = driver.find.selector('.shrink-on-hover').at(0);
    expect(animatedItems.length).to.be.greaterThan(0)
    driver.detach.proGallery();
  });
  it('should have "invert" animation on items', () => {
    Object.assign(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      imageHoverAnimation: GALLERY_CONSTS.imageHoverAnimations.INVERT,
    })
    driver.mount.proGallery(initialProps);
    const animatedItems = driver.find.selector('.invert-on-hover').at(0);
    expect(animatedItems.length).to.be.greaterThan(0)
    driver.detach.proGallery();
  });
  it('should have "Color in" animation on items', () => {
    Object.assign(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      imageHoverAnimation: GALLERY_CONSTS.imageHoverAnimations.COLOR_IN,
    })
    driver.mount.proGallery(initialProps);
    const animatedItems = driver.find.selector('.color-in-on-hover').at(0);
    expect(animatedItems.length).to.be.greaterThan(0)
    driver.detach.proGallery();
  });
  it('should have "Darkened" animation on items', () => {
    Object.assign(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      imageHoverAnimation: GALLERY_CONSTS.imageHoverAnimations.DARKENED,
    })
    driver.mount.proGallery(initialProps);
    const animatedItems = driver.find.selector('.darkened-on-hover').at(0);
    expect(animatedItems.length).to.be.greaterThan(0)
    driver.detach.proGallery();
  });
})