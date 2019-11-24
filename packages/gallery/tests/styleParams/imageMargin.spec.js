import GalleryDriver from '../drivers/reactDriver'
import { expect } from 'chai';
import { images2 } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles'

describe('styleParam - imageMargin', () => {

  let driver;
  const initialProps = {
    container,
    items: images2,
    styles: styleParams
  }

  beforeEach(() => {
    driver = new GalleryDriver();
  });

  it('should set the right spacing between items in a vertical gallery', () => {
    Object.assign(initialProps.styles, {
      galleryLayout: 2,
      oneRow:false
    })
    driver.mount.proGallery(initialProps)
    const item = driver.find.hook('item-title').at(0);
    expect(item).to.have.lengthOf(1);
    driver.detach.proGallery();
  });

})