import { GALLERY_CONSTS } from 'pro-gallery-lib';
import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { mergeNestedObjects } from 'pro-gallery-lib';
import { images2 } from '../drivers/mocks/items';
import { options, container } from '../drivers/mocks/styles';

describe('options - showArrows', () => {
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
  it('should show arrows"', async () => {
    initialProps.options = mergeNestedObjects(initialProps.options, {
      galleryLayout: GALLERY_CONSTS.layout.EMPTY,
      scrollSnap: true,
      scrollDirection: GALLERY_CONSTS.scrollDirection.HORIZONTAL,
      showArrows: true,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const arrows = driver.find.selector('.nav-arrows-container');
    expect(arrows.length).to.be.greaterThan(0);
    driver.detach.proGallery();
  });
  it('should not show arrows"', async () => {
    initialProps.options = mergeNestedObjects(initialProps.options, {
      galleryLayout: GALLERY_CONSTS.layout.EMPTY,
      scrollSnap: true,
      scrollDirection: GALLERY_CONSTS.scrollDirection.HORIZONTAL,
      showArrows: false,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const arrows = driver.find.selector('.nav-arrows-container');
    expect(arrows.length).to.eq(0);
    driver.detach.proGallery();
  });
});
