import GalleryDriver from '../drivers/reactDriver'
import { expect } from 'chai';
import { images2 } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles';
import GALLERY_CONSTS from '../../src/common/constants';

describe('styleParam - cubeType', () => {

  let driver;
  const initialProps = {
    container,
    items: images2,
    styles: styleParams
  }

  beforeEach(() => {
    driver = new GalleryDriver();
  });

  it('should set class "cube-type-fit" to "item-wrapper"(hook) when "cubeType" is "fit"', () => {
    Object.assign(initialProps.styles, {
      galleryLayout: -1,
      cubeImages:true,
      cubeType: GALLERY_CONSTS.cubeType.FIT
    })
    driver.mount.proGallery(initialProps)
    const items = driver.find.selector('.cube-type-fit');
    expect(items.length).to.be.greaterThan(0)
    driver.detach.proGallery();
  });
  it('should set class "cube-type-fill" to "item-wrapper"(hook) when "cubeType" is "fill"', () => {
    Object.assign(initialProps.styles, {
      galleryLayout: -1,
      cubeImages:true,
      cubeType: GALLERY_CONSTS.cubeType.CROP
    })
    driver.mount.proGallery(initialProps)
    const items = driver.find.selector('.cube-type-fill');
    expect(items.length).to.be.greaterThan(0)
    driver.detach.proGallery();
  });
  it('should set class "grid-fit" to "image-item"(hook) when "cubeType" is "fit"', () => {
    Object.assign(initialProps.styles, {
      galleryLayout: -1,
      cubeImages:true,
      cubeType: GALLERY_CONSTS.cubeType.FIT
    })
    driver.mount.proGallery(initialProps)
    const items = driver.find.selector('.grid-fit');
    expect(items.length).to.be.greaterThan(0)
    driver.detach.proGallery();
  });
})

