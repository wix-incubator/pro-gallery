import GalleryDriver from '../drivers/reactDriver'
import { expect } from 'chai';
import { images2 } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles'

describe('styleParam - allowHover', () => {

  let driver;
  const initialProps = {
    container,
    items: images2,
    styles: styleParams
  }

  beforeEach(() => {
    driver = new GalleryDriver();
  });

  it('should not render "itemHover" when "allowHover" is "false"', () => {
    Object.assign(initialProps.styles, {
      galleryLayout: 2,
      allowHover: false,
    })
    driver.mount.proGallery(initialProps);
    const items = driver.find.selector('.gallery-item-hover');
    //test 6 items for itemHover
    expect(items).to.have.lengthOf(0)
    driver.detach.proGallery();
  });
  it('should render "itemHover" when "allowHover" is "true"', () => {
    Object.assign(initialProps.styles, {
      galleryLayout: 2,
      allowHover: true,
    })
    driver.mount.proGallery(initialProps);
    const items = driver.find.selector('.gallery-item-hover');
    //test 6 items for itemHover
    expect(items).to.have.lengthOf(6)
    driver.detach.proGallery();
  });
})