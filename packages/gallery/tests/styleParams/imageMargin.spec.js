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

  it('should set use CSS property "margin" to create the spacing when gallery is "oneRow"', () => {
    Object.assign(initialProps.styles, {
      galleryLayout: 7,
      imageMargin: 10,
      oneRow: true,
      scrollDirection: 1
    })
    driver.mount.proGallery(initialProps)
    const item = driver.find.hook('item-container').at(0);
    expect(item.prop('style').margin).to.eq('5px')
    driver.detach.proGallery();
  });

  it('should use "top" and "left" properties to create the spacing', () => {
    Object.assign(initialProps.styles, {
      galleryLayout: 2,
      imageMargin: 10,
      oneRow: false,
      scrollDirection: 0
    })
    driver.mount.proGallery(initialProps)
    //const item = driver.find.hook('item-container').at(0).getDOMNode();
    const items = driver.find.hook('item-container');
    const count = items.reduce((amount, item) => {
      const width = getComputedStyle(item.getDOMNode()).width;
      const widthNumber = Number(width.substring(0, width.indexOf('px')))
      console.log(widthNumber);
      
      return amount + widthNumber
    })
    console.log(count);

    // expect(item.prop('style').margin).to.eq('5px')
    driver.detach.proGallery();
  });

})