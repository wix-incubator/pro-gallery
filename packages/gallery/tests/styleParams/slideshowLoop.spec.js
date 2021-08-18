import { GALLERY_CONSTS } from 'pro-gallery-lib';
import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { mergeNestedObjects } from 'pro-gallery-lib';
import { images2 } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles';

describe('styleParam - slideshowLoop', () => {
  let driver;
  let initialProps;

  beforeEach(() => {
    driver = new GalleryDriver();
    initialProps = {
      container: { ...container, width: 400 },
      items: images2.slice(0, 2),
      totalItemsCount: 2,
      styles: styleParams,
    };
  });
  it('should be able to to click next when reached last item', async () => {
    initialProps.styles = mergeNestedObjects(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.SLIDESHOW,
      slideshowLoop: true,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    driver.find.hook('nav-arrow-next').simulate('click');
    await driver.update(500);
    expect(driver.find.hook('nav-arrow-next')).to.have.lengthOf(1);
    driver.detach.proGallery();
  });
  it('should not be able to to click next', async () => {
    initialProps.styles = mergeNestedObjects(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.SLIDESHOW,
      slideshowLoop: false,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    driver.find.hook('nav-arrow-next').simulate('click');
    await driver.update(500);
    expect(driver.find.hook('nav-arrow-next')).to.have.lengthOf(0);
    driver.detach.proGallery();
  });
});
