import { GALLERY_CONSTS } from 'pro-gallery-lib';
import GalleryDriver from '../drivers/reactDriver'
import { expect } from 'chai';
import { images2, textItems } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles';

describe('styleParam - cubeType', () => {

  //let driver;
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
  it('should set "backgroundColor" to "transparent" on text items when "cubeType" is "fill"', () => {
    initialProps.items = textItems;
    Object.assign(initialProps.styles, {
      galleryLayout: -1,
      cubeImages:true,
      cubeType: GALLERY_CONSTS.cubeType.CROP
    })
    driver.mount.proGallery(initialProps)
    const textItem = driver.find.hook('item-wrapper').at(0);
    const { backgroundColor } = textItem.props().style;
    expect(backgroundColor).to.eq('transparent')
    driver.detach.proGallery();
  });
  it('should set "backgroundColor" to "inherit" on text items when "cubeType" is "fit"', () => {
    initialProps.items = textItems;
    Object.assign(initialProps.styles, {
      galleryLayout: -1,
      cubeImages:true,
      cubeType: GALLERY_CONSTS.cubeType.FIT
    })
    driver.mount.proGallery(initialProps)
    const textItem = driver.find.hook('item-wrapper').at(0);
    const { backgroundColor } = textItem.props().style;
    expect(backgroundColor).to.eq('inherit');
    driver.detach.proGallery();
  });
})

