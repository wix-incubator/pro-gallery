import GalleryDriver from '../drivers/reactDriver'
import { expect } from 'chai';
import { images2 } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles'

describe('styleParam - galleryMargin', () => {

  //let driver;
  const initialProps = {
    container,
    items: images2,
    styles: styleParams
  }

  beforeEach(() => {
    driver = new GalleryDriver();
  });

  it('should set the gallery with a margin of 20px', () => {
    Object.assign(initialProps.styles, {
      galleryLayout: 2,
      galleryMargin: 20,
      oneRow:false,
      scrollDirection:0
    })
    driver.mount.proGallery(initialProps);
    const marginContainer = driver.find.selector('#pro-gallery-margin-container').getDOMNode();
    const margin = getComputedStyle(marginContainer).margin;
    expect(margin).to.eq('20px');
    driver.detach.proGallery();
  });
  it('should set the gallery with a margin of (galleryMargin - (imageMargin / 2)) in a oneRow gallery', () => {
    Object.assign(initialProps.styles, {
      galleryLayout: 2,
      imageMargin: 10,
      galleryMargin: 20,
      oneRow:true,
    })
    driver.mount.proGallery(initialProps);
    const galleryContainer = driver.find.selector('.pro-gallery-parent-container').getDOMNode();
    const margin = getComputedStyle(galleryContainer).margin;
    // expect the margin to be (galleryMargin - (imageMargin / 2)
    expect(margin).to.eq('15px');
    driver.detach.proGallery();
  });
})