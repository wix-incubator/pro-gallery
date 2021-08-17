import { GALLERY_CONSTS } from 'pro-gallery-lib';
import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { mergeNestedObjects } from 'pro-gallery-lib';
import { images2 } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles';

describe('styleParam - hasThumbnails', () => {
  let driver;
  const initialProps = {
    container,
    items: [...images2],
    styles: styleParams,
  };

  beforeEach(() => {
    driver = new GalleryDriver();
  });

  it('should render thumbnails element when "hasThumbnails" and the gallery is horizontal"', async () => {
    const styles = mergeNestedObjects(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.EMPTY,
      onRow: true,
      hasThumbnails: true,
      scrollDirection: GALLERY_CONSTS.scrollDirection.HORIZONTAL,
    });
    driver.mount.proGallery(styles);
    await driver.update();
    const thumbnails = driver.find.hook('gallery-thumbnails');
    expect(thumbnails).to.have.lengthOf(1);
    driver.detach.proGallery();
  });
  it('should not render thumbnails element when "hasThumbnails" is "true" and the gallery is vertical', async () => {
    const styles = mergeNestedObjects(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.EMPTY,
      onRow: false,
      hasThumbnails: true,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
    });
    driver.mount.proGallery(styles);
    await driver.update();
    const thumbnails = driver.find.hook('gallery-thumbnails');
    expect(thumbnails).to.have.lengthOf(0);
    driver.detach.proGallery();
  });
  it('should not render thumbnails element when "hasThumbnails" is "false"', async () => {
    const styles = mergeNestedObjects(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.EMPTY,
      onRow: true,
      hasThumbnails: false,
      scrollDirection: GALLERY_CONSTS.scrollDirection.HORIZONTAL,
    });
    driver.mount.proGallery(styles);
    await driver.update();
    const thumbnails = driver.find.hook('gallery-thumbnails');
    expect(thumbnails).to.have.lengthOf(0);
    driver.detach.proGallery();
  });
});
