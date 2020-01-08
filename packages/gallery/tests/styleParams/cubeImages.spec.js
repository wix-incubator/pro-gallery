import GalleryDriver from '../drivers/reactDriver'
import { expect } from 'chai';
import { images2 } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles';
import CUBE_TYPE from '../../src/common/constants/cubeType';

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

  it('should be able to set "cubeType"(fill) when "cubeImages" is "true"', () => {
    Object.assign(initialProps.styles, {
      galleryLayout: -1,
      cubeImages: true,
      cubeType: CUBE_TYPE.CROP,
    })
    driver.mount.proGallery(initialProps);
    const itemWrappers = driver.find.selector('.cube-type-fill');
    console.log(itemWrappers.length);
    //expect to find items that have "cube-type-fill" class
    expect(itemWrappers.length).to.be.greaterThan(0)
    driver.detach.proGallery();
  });
  it('should be able to set "cubeType"(fit) when "cubeImages" is "true"', () => {
    Object.assign(initialProps.styles, {
      galleryLayout: -1,
      cubeImages: true,
      cubeType: CUBE_TYPE.FIT,
    })
    driver.mount.proGallery(initialProps);
    const itemWrappers = driver.find.selector('.cube-type-fit');
    console.log(itemWrappers.length);
    //expect to find items that have "cube-type-fit" class
    expect(itemWrappers.length).to.be.greaterThan(0)
    driver.detach.proGallery();
  });
  it('should not be able to set "cubeType"(fill) when "cubeImages" is "false"', () => {
    Object.assign(initialProps.styles, {
      galleryLayout: -1,
      cubeImages: false,
      cubeType: CUBE_TYPE.CROP,
    })
    driver.mount.proGallery(initialProps);
    const itemWrappers = driver.find.selector('.cube-type-fill');
    console.log(itemWrappers.length);
    //expect to not find items with "cube-type-fill" class
    expect(itemWrappers.length).to.eq(0);
    driver.detach.proGallery();
  });
  it('should not be able to set "cubeType"(fit) when "cubeImages" is "false"', () => {
    Object.assign(initialProps.styles, {
      galleryLayout: -1,
      cubeImages: false,
      cubeType: CUBE_TYPE.FIT,
    })
    driver.mount.proGallery(initialProps);
    const itemWrappers = driver.find.selector('.cube-type-fit');
    console.log(itemWrappers.length);
    //expect to not find items with "cube-type-fit" class
    expect(itemWrappers.length).to.eq(0);
    driver.detach.proGallery();
  });
})