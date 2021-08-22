import { GALLERY_CONSTS } from 'pro-gallery-lib';
import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { mergeNestedObjects } from 'pro-gallery-lib';
import { images2 } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles';

describe('styleParam - arrowsSize', () => {
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

  it('should set the correct arrowsSize', async () => {
    initialProps.styles = mergeNestedObjects(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.SLIDESHOW,
      arrowsSize: 50,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const arrowImage = driver.find.selector('.nav-arrows-container svg');
    const { transform } = arrowImage.props().style;
    const arrowFinalSize = initialProps.styles.arrowsSize / 23;
    expect(transform).to.eq(`scale(${arrowFinalSize})`);
    driver.detach.proGallery();
  });
  it('should set the position of arrows according to arrowsSize', async () => {
    initialProps.styles = mergeNestedObjects(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.SLIDESHOW,
      arrowsSize: 50,
      arrowsPosition: GALLERY_CONSTS.arrowsPosition.OUTSIDE_GALLERY,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const arrowContainer = driver.find.selector('.nav-arrows-container');
    const { right } = arrowContainer.props().style;
    expect(right).to.eq(`-${20 + initialProps.styles.arrowsSize}px`);
    driver.detach.proGallery();
  });
});
