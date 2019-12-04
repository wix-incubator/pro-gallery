import GalleryDriver from '../drivers/reactDriver'
import { expect } from 'chai';
import { images2 } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles';
import { createCssLayouts } from '../../src/components/helpers/cssLayoutsHelper';
import sinon from 'sinon';

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
      galleryLayout: 1,
      imageMargin: 10,
      oneRow: false,
      scrollDirection: 0
    })

    driver.mount.proGallery(initialProps);
    const item = driver.find.hook('item-container').at(4); //get the middle image in the second row to test
    const { width, height, top ,left } = getCSSNumberValues(item);
    const { bottom, right } = getBoundingClientRect(item);
    console.log(bottom,right   );
    
    //expect(initialProps.styles.imageMargin).to.eq(bottom - height)
  })
})

const getBoundingClientRect = (elem) => {
  const { width, top, left, height } = getComputedStyle(elem.getDOMNode())
  return {
    bottom: top + height,
    right: left + width
  }
}
const getCSSNumberValues = (elem) => {
  const getPropNumber = (propValue) => Number(propValue.substring(0, propValue.indexOf('px')))
  const { width, top, left, height } = getComputedStyle(elem.getDOMNode());
  return {
    width: getPropNumber(width),
    top: getPropNumber(top),
    left: getPropNumber(left),
    height: getPropNumber(height)
  }
}