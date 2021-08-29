import { GALLERY_CONSTS } from 'pro-gallery-lib';
import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { mergeNestedObjects } from 'pro-gallery-lib';
import { images2, textItems } from '../drivers/mocks/items';
import { options, container } from '../drivers/mocks/styles';

describe('options - cubeType', () => {
  let driver;
  let initialProps;

  beforeEach(() => {
    driver = new GalleryDriver();
    initialProps = {
      container,
      items: images2,
      options,
    };
  });

  it('should set class "cube-type-fit" to "item-wrapper"(hook) when "cubeType" is "fit"', async () => {
    initialProps.options = mergeNestedObjects(initialProps.options, {
      galleryLayout: -1,
      cubeImages: true,
      cubeType: GALLERY_CONSTS.cubeType.FIT,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const items = driver.find.selector('.cube-type-fit');
    expect(items.length).to.be.greaterThan(0);
    driver.detach.proGallery();
  });
  it('should set class "cube-type-fill" to "item-wrapper"(hook) when "cubeType" is "fill"', async () => {
    initialProps.options = mergeNestedObjects(initialProps.options, {
      galleryLayout: -1,
      cubeImages: true,
      cubeType: GALLERY_CONSTS.cubeType.CROP,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const items = driver.find.selector('.cube-type-fill');
    expect(items.length).to.be.greaterThan(0);
    driver.detach.proGallery();
  });
  it('should set class "grid-fit" to "image-item"(hook) when "cubeType" is "fit"', async () => {
    initialProps.options = mergeNestedObjects(initialProps.options, {
      galleryLayout: -1,
      cubeImages: true,
      cubeType: GALLERY_CONSTS.cubeType.FIT,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const items = driver.find.selector('.grid-fit');
    expect(items.length).to.be.greaterThan(0);
    driver.detach.proGallery();
  });
  it('should set "backgroundColor" to "transparent" on text items when "cubeType" is "fill"', async () => {
    initialProps.items = textItems;
    initialProps.options = mergeNestedObjects(initialProps.options, {
      galleryLayout: -1,
      cubeImages: true,
      cubeType: GALLERY_CONSTS.cubeType.CROP,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const textItem = driver.find.hook('item-wrapper').at(0);
    const { backgroundColor } = textItem.props().style;
    expect(backgroundColor).to.eq('transparent');
    driver.detach.proGallery();
  });
  it('should set "backgroundColor" to "inherit" on text items when "cubeType" is "fit"', async () => {
    initialProps.items = textItems;
    initialProps.options = mergeNestedObjects(initialProps.options, {
      galleryLayout: -1,
      cubeImages: true,
      cubeType: GALLERY_CONSTS.cubeType.FIT,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const textItem = driver.find.hook('item-wrapper').at(0);
    const { backgroundColor } = textItem.props().style;
    expect(backgroundColor).to.eq('inherit');
    driver.detach.proGallery();
  });
});
