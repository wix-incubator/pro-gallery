import GalleryDriver from '../drivers/reactDriver'
import { expect } from 'chai';
import { images2 } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles';
import {  getElementDimensions } from '../utils/utils';

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
    //in vertical layout the spacing will be set with the "top" and "left" properties and not with "margin"
    Object.assign(initialProps.styles, {
      galleryLayout: 2,
      imageMargin: 10,
      oneRow: false,
      scrollDirection: 0
    })
    driver.mount.proGallery(initialProps);
    //get the middle image in the second row to test
    const item = driver.find.hook('item-container').at(4); 
    // get CSS "width" and "left" values
    const { width,left } = getElementDimensions(item);
    // expect the difference between the "left" and "width" of the middle item (in a row of 3) to equal the given imageMargin number
    expect(initialProps.styles.imageMargin).to.eq(left - width);
    driver.detach.proGallery();
  })
})

