import { GALLERY_CONSTS } from 'pro-gallery-lib';
import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { mergeNestedObjects } from 'pro-gallery-lib';
import { images2 } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles';

describe('styleParam - itemBorderWidth', () => {
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

  it('should set border-width of 10 to items', async () => {
    initialProps.styles = mergeNestedObjects(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
      itemBorderWidth: 10,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const item = driver.find.hook('item-container').at(0);
    expect(item.props().style.borderWidth).to.eq('10px');
    driver.detach.proGallery();
  });
  it('should set border-width of 40 to items', async () => {
    initialProps.styles = mergeNestedObjects(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
      itemBorderWidth: 40,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const item = driver.find.hook('item-container').at(0);
    expect(item.props().style.borderWidth).to.eq('40px');
    driver.detach.proGallery();
  });
  it('should not set border-width to when "cubeType" is "fit"', async () => {
    initialProps.styles = mergeNestedObjects(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      cubeType: GALLERY_CONSTS.cubeType.FIT,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
      itemBorderWidth: 40,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const item = driver.find.hook('item-container').at(0);
    expect(item.props().style.borderWidth).to.be.undefined;
    driver.detach.proGallery();
  });
});
