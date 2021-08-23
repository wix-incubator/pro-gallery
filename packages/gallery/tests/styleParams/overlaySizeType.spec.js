import { GALLERY_CONSTS } from 'pro-gallery-lib';
import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { mergeNestedObjects } from 'pro-gallery-lib';
import { images2 } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles';

describe('styleParam - overlaySize', () => {
  let driver;
  let initialProps;

  beforeEach(() => {
    driver = new GalleryDriver();
    initialProps = {
      container,
      items: images2,
      styles: styleParams,
    };
    initialProps.styles = mergeNestedObjects(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      overlayPosition: GALLERY_CONSTS.overlayPositions.LEFT,
      overlayPadding: 0,
    });
  });

  it('should set the correct overlaySize according to size type - PIXEL', async () => {
    initialProps.styles = mergeNestedObjects(initialProps.styles, {
      overlaySize: 20,
      overlaySizeType: 'PIXEL',
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const overlaySizeImage = driver.find.selector('.gallery-item-hover').at(0);
    const { width } = overlaySizeImage.props().style;
    expect(width).to.eq(20);
    driver.detach.proGallery();
  });

  it('should set the correct overlaySize according to size type- PERCENT', async () => {
    initialProps.styles = mergeNestedObjects(initialProps.styles, {
      overlaySizeType: 'PERCENT',
      overlaySize: 50,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const overlaySizeImage = driver.find.selector('.gallery-item-hover').at(0);
    const { width, height } = overlaySizeImage.props().style;
    expect(width).to.eq(height / 2);
    driver.detach.proGallery();
  });
});
