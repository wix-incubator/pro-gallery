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
  });

  it('should set the correct overlayPadding of 30', async () => {
    initialProps.styles = mergeNestedObjects(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      overlayPosition: GALLERY_CONSTS.overlayPositions.LEFT,
      overlaySize: 50,
      overlaySizeType: 'PIXEL',
      overlayPadding: 30,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const overlaySizeImage = driver.find.selector('.gallery-item-hover').at(0);
    const { margin } = overlaySizeImage.props().style;
    expect(margin).to.eq(30);
    driver.detach.proGallery();
  });
});
