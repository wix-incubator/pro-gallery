import { GALLERY_CONSTS } from 'pro-gallery-lib';
import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { mergeNestedObjects } from 'pro-gallery-lib';
import { images2 } from '../drivers/mocks/items';
import {
  styleParams,
  container,
  customComponents,
} from '../drivers/mocks/styles';

describe('styleParam - titlePlacement', () => {
  let driver;
  const initialProps = {
    container,
    items: images2,
    styles: styleParams,
    customComponents,
  };

  beforeEach(() => {
    driver = new GalleryDriver();
  });

  it('should place texts below images when "titlePlacement" is "SHOW_BELOW"', async () => {
    const styles = mergeNestedObjects(initialProps.styles, {
      galleryLayout: 2,
      onRow: false,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
      titlePlacement: GALLERY_CONSTS.placements.SHOW_BELOW,
    });
    driver.mount.proGallery(styles);
    await driver.update();
    const items = driver.find.selector('.gallery-item-bottom-info');
    expect(items).to.have.lengthOf(6);
    driver.detach.proGallery();
  });
  it('should place texts above images when "titlePlacement" is "SHOW_ABOVE"', async () => {
    const styles = mergeNestedObjects(initialProps.styles, {
      galleryLayout: 2,
      onRow: false,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
      titlePlacement: GALLERY_CONSTS.placements.SHOW_ABOVE,
    });
    driver.mount.proGallery(styles);
    await driver.update();
    const items = driver.find.selector('.gallery-item-top-info');
    expect(items).to.have.lengthOf(6);
    driver.detach.proGallery();
  });
  it('should render hover when "titlePlacement" is "SHOW_ON_HOVER"', async () => {
    const styles = mergeNestedObjects(initialProps.styles, {
      galleryLayout: 2,
      onRow: false,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
      titlePlacement: GALLERY_CONSTS.placements.SHOW_ON_HOVER,
    });
    driver.mount.proGallery(styles);
    await driver.update();
    const items = driver.find.selector('.gallery-item-hover');
    expect(items.length).to.be.greaterThan(0);
    driver.detach.proGallery();
  });
});
