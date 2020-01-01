import GalleryDriver from '../drivers/reactDriver'
import { expect } from 'chai';
import { images2 } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles'

describe('styleParam - loveButton', () => {

  let driver;
  const initialProps = {
    container,
    items: images2,
    styles: styleParams
  }

  beforeEach(() => {
    driver = new GalleryDriver();
  });

  it('should be able to set "cubeType" when "cubeImages" is "true"', () => {
    Object.assign(initialProps.styles, {
      galleryLayout: -1,
      cubeImages: true,
      cubeType: 'fill',
    })
    driver.mount.proGallery(initialProps);
    const itemWrappers = driver.find.selector('.cube-type-fill');
    console.log(itemWrappers.length);
    //expect to find items that have "cube-type-fill" class
    expect(itemWrappers.length).to.be.greaterThan(0)
    driver.detach.proGallery();
  });
  it('should not be able to set "cubeType" when "cubeImages" is "false"', () => {
    Object.assign(initialProps.styles, {
      galleryLayout: -1,
      cubeImages: false,
      cubeType: 'fill',
    })
    driver.mount.proGallery(initialProps);
    const itemWrappers = driver.find.selector('.cube-type-fill');
    console.log(itemWrappers.length);
    //expect to find no items with "cube-type-fill" class
    expect(itemWrappers.length).to.eq(0);
    driver.detach.proGallery();
  });
})