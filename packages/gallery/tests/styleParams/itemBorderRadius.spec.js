import { GALLERY_CONSTS } from 'pro-gallery-lib';
import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { mergeNestedObjects } from 'pro-gallery-lib';
import { images2 } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles';

describe('styleParam - itemBorderRadius', () => {
  let driver;
  const initialProps = {
    container,
    items: images2,
    styles: styleParams,
  };

  beforeEach(() => {
    driver = new GalleryDriver();
  });

  it('should set border-radius of 10 to items', async () => {
    const styles = mergeNestedObjects(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
      itemBorderWidth: 1,
      itemBorderRadius: 10,
    });
    driver.mount.proGallery(styles);
    await driver.update();
    const item = driver.find.hook('item-container').at(0);
    expect(item.props().style.borderRadius).to.eq(10);
    driver.detach.proGallery();
  });
  it('should set border-radius of 40 to items', async () => {
    const styles = mergeNestedObjects(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
      itemBorderWidth: 1,
      itemBorderRadius: 40,
    });
    driver.mount.proGallery(styles);
    await driver.update();
    const item = driver.find.hook('item-container').at(0);
    expect(item.props().style.borderRadius).to.eq(40);
    driver.detach.proGallery();
  });
  it('should not set border-radius to when "cubeType" is "fit"', async () => {
    const styles = mergeNestedObjects(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      cubeType: GALLERY_CONSTS.cubeType.FIT,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
      itemBorderWidth: 1,
      itemBorderRadius: 40,
    });
    driver.mount.proGallery(styles);
    await driver.update();
    const item = driver.find.hook('item-container').at(0);
    expect(item.props().style.borderRadius).to.be.undefined;
    driver.detach.proGallery();
  });
});
