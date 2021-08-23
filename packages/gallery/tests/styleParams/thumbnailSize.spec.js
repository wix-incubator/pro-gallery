import { GALLERY_CONSTS } from 'pro-gallery-lib';
import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { mergeNestedObjects } from 'pro-gallery-lib';
import { images2 } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles';

describe('styleParam - thumbnailSize', () => {
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
  it('should "thumbnailSize" of "300"', async () => {
    initialProps.styles = mergeNestedObjects(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.THUMBNAIL,
      thumbnailSize: 300,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const thumbnailItem = driver.find.selector('.thumbnailItem').at(0);
    const { height } = thumbnailItem.props().style;
    expect(height).to.eq(300);
    driver.detach.proGallery();
  });
  it('should "thumbnailSize" of "150"', async () => {
    initialProps.styles = mergeNestedObjects(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.THUMBNAIL,
      thumbnailSize: 150,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const thumbnailItem = driver.find.selector('.thumbnailItem').at(0);
    const { height } = thumbnailItem.props().style;
    expect(height).to.eq(150);
    driver.detach.proGallery();
  });
  it('should set the gallery height for thumbnailSize=300', async () => {
    initialProps.styles = mergeNestedObjects(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.THUMBNAIL,
      thumbnailSize: 300,
      thumbnailSpacings: 10,
      galleryThumbnailsAlignment: 'bottom',
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const galleryContainer = driver.find.selector('#pro-gallery-container');
    const { height } = galleryContainer.props().style;
    // expect to galleryContainer height without the thumbnails to be container.height - thumbnails and margins
    expect(initialProps.container.height - 300 - 3 * 10).to.eq(height);
    driver.detach.proGallery();
  });

  it('should set the gallery width for thumbnailSize=300', async () => {
    initialProps.styles = mergeNestedObjects(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.THUMBNAIL,
      thumbnailSize: 300,
      thumbnailSpacings: 10,
      galleryThumbnailsAlignment: 'left',
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const galleryContainer = driver.find.selector('#pro-gallery-container');
    const { width } = galleryContainer.props().style;
    // expect to galleryContainer width without the thumbnails to be container.width - thumbnails and margins
    expect(initialProps.container.width - 300 - 3 * 10).to.eq(width);
    driver.detach.proGallery();
  });
});
