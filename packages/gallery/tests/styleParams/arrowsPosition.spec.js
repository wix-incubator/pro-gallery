import { GALLERY_CONSTS } from 'pro-gallery-lib';
import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { images2 } from '../drivers/mocks/items';
import { styleParams, dimensions } from '../drivers/mocks/styles';

describe('styleParam - arrowsPosition', () => {
  let driver;
  const initialProps = {
    dimensions,
    items: images2,
    styles: styleParams,
  };

  beforeEach(() => {
    driver = new GalleryDriver();
  });

  it('should calculate gallery width accroding to "arrowsPosition" ("OUTSIDE_GALLERY")', async () => {
    Object.assign(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.SLIDESHOW,
      arrowsPosition: GALLERY_CONSTS.arrowsPosition.OUTSIDE_GALLERY,
      arrowsSize: 40,
      imageMargin: 0, // fixed in slideshow
    });
    driver.mount.proGallery(initialProps);
    await driver.update();

    const galleryContainer = driver.find.selector('#pro-gallery-container');
    const { width } = galleryContainer.props().style;
    const newWidth =
      initialProps.dimensions.width -
      2 *
        (initialProps.styles.arrowsSize + 40 + initialProps.styles.imageMargin);
    expect(width).to.eq(newWidth);
    driver.detach.proGallery();
  });
  it('should have original dimensions.width (arrowsPosition = "OUTSIDE_GALLERY")', async () => {
    Object.assign(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.SLIDESHOW,
      arrowsPosition: GALLERY_CONSTS.arrowsPosition.ON_GALLERY,
      arrowsSize: 40,
      imageMargin: 0, // fixed in slideshow
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const galleryContainer = driver.find.selector('#pro-gallery-container');
    const { width } = galleryContainer.props().style;

    expect(width).to.eq(initialProps.dimensions.width);
    driver.detach.proGallery();
  });
});
