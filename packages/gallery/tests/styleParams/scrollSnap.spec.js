import { GALLERY_CONSTS } from 'pro-gallery-lib';
import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { mergeNestedObjects } from 'pro-gallery-lib';
import { images2 } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles';

describe('styleParam - scrollSnap', () => {
  let driver;
  const initialProps = {
    container,
    items: images2,
    styles: styleParams,
  };
  beforeEach(() => {
    driver = new GalleryDriver();
  });
  it('should set class "scroll-snap"', async () => {
    const styles = mergeNestedObjects(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.EMPTY,
      scrollSnap: true,
      scrollDirection: GALLERY_CONSTS.scrollDirection.HORIZONTAL,
    });
    driver.mount.proGallery(styles);
    await driver.update();
    const galleryContainer = driver.find.selector('#gallery-horizontal-scroll');
    expect(galleryContainer.hasClass('scroll-snap')).to.be.true;
    driver.detach.proGallery();
  });

  it('should not set class "scroll-snap"', async () => {
    const styles = mergeNestedObjects(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.EMPTY,
      scrollSnap: false,
      scrollDirection: GALLERY_CONSTS.scrollDirection.HORIZONTAL,
    });
    driver.mount.proGallery(styles);
    await driver.update();
    const galleryContainer = driver.find.selector('#gallery-horizontal-scroll');
    expect(galleryContainer.hasClass('scroll-snap')).to.be.false;
    driver.detach.proGallery();
  });
});
