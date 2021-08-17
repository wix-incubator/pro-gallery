import { GALLERY_CONSTS } from 'pro-gallery-lib';
import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { mergeNestedObjects } from 'pro-gallery-lib';
import { images2 } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles';

describe('styleParam - enableScroll', () => {
  let driver;
  const initialProps = {
    container,
    items: images2,
    styles: styleParams,
  };
  beforeEach(() => {
    driver = new GalleryDriver();
  });

  it('should set class "slider" when "enableScroll" is "true"', async () => {
    const styles = mergeNestedObjects(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.EMPTY,
      scrollDirection: GALLERY_CONSTS.scrollDirection.HORIZONTAL,
      enableScroll: true,
    });
    driver.mount.proGallery(styles);
    await driver.update();
    const galleryContainer = driver.find.selector('#pro-gallery-container');
    expect(galleryContainer.hasClass('slider')).to.be.true;
    driver.detach.proGallery();
  });
  it('should not set class "slider" when "enableScroll" is "false"', async () => {
    const styles = mergeNestedObjects(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.EMPTY,
      scrollDirection: GALLERY_CONSTS.scrollDirection.HORIZONTAL,
      enableScroll: false,
    });

    driver.mount.proGallery(styles);
    await driver.update();
    const galleryContainer = driver.find.selector('#pro-gallery-container');
    expect(galleryContainer.hasClass('slider')).to.be.false;
    driver.detach.proGallery();
  });
});
