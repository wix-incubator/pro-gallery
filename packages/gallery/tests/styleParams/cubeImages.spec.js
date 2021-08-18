import { GALLERY_CONSTS } from 'pro-gallery-lib';
import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { mergeNestedObjects } from 'pro-gallery-lib';
import { images2 } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles';

describe('styleParam - cubeImages', () => {
  let driver;
  let initialProps;

  beforeEach(() => {
    driver = new GalleryDriver();
    initialProps = {
      container,
      items: images2,
      styles: styleParams,
    };
  });

  it('should allow to "cubeType" to set class to "itemWrapper"', async () => {
    initialProps.styles = mergeNestedObjects(initialProps.styles, {
      galleryLayout: -1,
      cubeImages: true,
      cubeType: GALLERY_CONSTS.cubeType.CROP,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const itemWrappers = driver.find.selector('.cube-type-fill');
    //expect to find items that have "cube-type-fill" class
    expect(itemWrappers.length).to.be.greaterThan(0);
    driver.detach.proGallery();
  });
  it('should not allow to "cubeType" to set class to "itemWrapper"', async () => {
    initialProps.styles = mergeNestedObjects(initialProps.styles, {
      galleryLayout: -1,
      cubeImages: false,
      cubeType: GALLERY_CONSTS.cubeType.CROP,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const itemWrappers = driver.find.selector('.cube-type-fill');
    //expect to not find items with "cube-type-fill" class
    expect(itemWrappers.length).to.eq(0);
    driver.detach.proGallery();
  });
});
