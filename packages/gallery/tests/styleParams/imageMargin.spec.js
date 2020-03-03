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

  it.only('should use "top" and "left" properties to create the spacing', () => {
    //in vertical layout the spacing will be set with the "top" and "left" properties and not with "margin"
    Object.assign(initialProps.styles, {
      galleryLayout: 1,
      imageMargin: 200,
      oneRow: false,
      gallerySizeType: 'px',
      gallerySizePx: 390,
      isVertical: false
    })
    driver.mount.proGallery(initialProps);
    //get the middle image in the second row to test
    let prevDims = {top: 0, left: 0, width: 0, height: 0};
    for (let i = 0; i < 6; i++) {
      const item = driver.find.hook('item-container').at(i);
      driver
      try {
        const dims = getElementDimensions(item);
        const spacing = dims.left - (prevDims.left + prevDims.width);
        console.log({idx: i, spacing, ...dims});
        prevDims = dims;
      } catch (e) {
        console.log('Cannot find item', i);
      }
    }
    // const item2 = driver.find.hook('item-container').at(4); 
    // const item3 = driver.find.hook('item-container').at(5); 
    // // get CSS "width" and "left" values
    // const { width, left } = getElementDimensions(item1);
    // const left2 = getElementDimensions(item2).left;
    // const width2 = getElementDimensions(item2).width;
    // const left3 = getElementDimensions(item3).left;
    // const width3 = getElementDimensions(item3).width;
    // // expect the difference between the"left" and "width" of the middle item (in a row of 3) to equal the given imageMargin number
    // console.log({left, width, left2, width2, left3, width3}) 
    // expect(initialProps.styles.imageMargin).to.eq(left + width - left2);
    // expect(initialProps.styles.imageMargin).to.eq(left);
    // expect(initialProps.styles.imageMargin).to.eq(width);
    // expect(initialProps.styles.imageMargin).to.eq(left2);
    // expect(initialProps.styles.imageMargin).to.eq(width2);
    // expect(initialProps.styles.imageMargin).to.eq(left3);
    expect(initialProps.styles.imageMargin).to.eq(11);
    driver.detach.proGallery();
  })
})

