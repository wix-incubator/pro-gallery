import GalleryDriver from '../drivers/reactDriver'
import { expect } from 'chai';
import { images2 } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles';
import {  getElementDimensions } from '../utils/utils';

describe('styleParam - isVertical', () => {

  let driver;
  const initialProps = {
    container,
    items: images2,
    styles: styleParams
  }

  beforeEach(() => {
    driver = new GalleryDriver();
  });

  it('should not be able to set "isVertical" to "true" when gallery is "oneRow"', () => {
    Object.assign(initialProps.styles, {
      galleryLayout: -1,
      oneRow: true,
      scrollDirection: 1,
      isVertical: true,
    })
    driver.mount.proGallery(initialProps)
    const item = driver.find.hook('item-container').at(0);
    expect(item.prop('style').margin).to.eq('5px')
    driver.detach.proGallery();
  });
})

