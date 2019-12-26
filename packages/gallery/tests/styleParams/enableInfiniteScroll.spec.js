import GalleryDriver from '../drivers/reactDriver'
import { expect } from 'chai';
import { images2 } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles';

describe('styleParam - enableInfiniteScroll', () => {

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
      galleryLayout: 2,
      enableInfiniteScroll: false,
      oneRow: false,
      scrollDirection: 0
    })
    driver.mount.proGallery(initialProps)
    const item = driver.find.hook('show-more');
    console.log(item.length);
    
    // expect(item.prop('style').margin).to.eq('5px')
    driver.detach.proGallery();
  });
})

