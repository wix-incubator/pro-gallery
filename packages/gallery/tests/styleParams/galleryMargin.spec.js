import GalleryDriver from '../drivers/reactDriver'
import { expect } from 'chai';
import { images2 } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles'

describe('styleParam - galleryMargin', () => {

  let driver;
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
})