import { GALLERY_CONSTS } from 'pro-gallery-lib';
import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { mergeNestedObjects } from 'pro-gallery-lib';
import { images2 } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles';

describe('styleParam - arrowsPosition', () => {
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

  it('should calculate gallery width accroding to "arrowsPosition" ("OUTSIDE_GALLERY")', async () => {
    initialProps.styles = mergeNestedObjects(initialProps.styles, {
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
      initialProps.container.width -
      2 *
        (initialProps.styles.arrowsSize + 40 + initialProps.styles.imageMargin);
    expect(width).to.eq(newWidth);
    driver.detach.proGallery();
  });
  it('should have original container width (arrowsPosition = "OUTSIDE_GALLERY")', async () => {
    initialProps.styles = mergeNestedObjects(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.SLIDESHOW,
      arrowsPosition: GALLERY_CONSTS.arrowsPosition.ON_GALLERY,
      arrowsSize: 40,
      imageMargin: 0, // fixed in slideshow
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const galleryContainer = driver.find.selector('#pro-gallery-container');
    const { width } = galleryContainer.props().style;

    expect(width).to.eq(initialProps.container.width);
    driver.detach.proGallery();
  });
});
