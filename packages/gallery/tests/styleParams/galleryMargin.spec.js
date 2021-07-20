import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { images2 } from '../drivers/mocks/items';
import { styleParams, dimensions } from '../drivers/mocks/styles';
import { GALLERY_CONSTS } from 'pro-gallery-lib';

describe('styleParam - galleryMargin', () => {
  let driver;
  const initialProps = {
    dimensions,
    items: images2,
    styles: styleParams,
  };

  beforeEach(() => {
    driver = new GalleryDriver();
  });

  it('should set the gallery with a margin of 20px in a vertical gallery', async () => {
    Object.assign(initialProps.styles, {
      galleryLayout: 2,
      galleryMargin: 20,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const marginContainer = driver.find
      .selector('#pro-gallery-margin-container')
      .getDOMNode();
    const margin = getComputedStyle(marginContainer).margin;
    expect(margin).to.eq('20px');
    driver.detach.proGallery();
  });
  it('should set the gallery with a margin of (galleryMargin - (imageMargin / 2)) in a horizontal gallery', async () => {
    Object.assign(initialProps.styles, {
      galleryLayout: 2,
      imageMargin: 10,
      galleryMargin: 20,
      scrollDirection: GALLERY_CONSTS.scrollDirection.HORIZONTAL,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const galleryContainer = driver.find
      .selector('.pro-gallery-parent-container')
      .getDOMNode();
    const margin = getComputedStyle(galleryContainer).margin;
    // expect the margin to be (galleryMargin - (imageMargin / 2)
    expect(margin).to.eq('15px');
    driver.detach.proGallery();
  });
});
