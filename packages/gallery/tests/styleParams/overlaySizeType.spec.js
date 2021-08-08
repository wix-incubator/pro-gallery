import { GALLERY_CONSTS } from 'pro-gallery-lib';
import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { images2 } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles';

describe('styleParam - overlaySize', () => {
  let driver;
  const initialProps = {
    container,
    items: images2,
    styles: styleParams,
  };

  beforeEach(() => {
    driver = new GalleryDriver();
  });

  it('should set the correct overlaySize according to size type-pixel', async () => {
    Object.assign(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      overlayPosition: GALLERY_CONSTS.overlayPositions.LEFT,
      overlaySize: 20,
      overlaySizeType: 'PIXEL',
      overlayPadding: 0,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const overlaySizeImage = driver.find.selector('.gallery-item-hover').at(0);
    const { width } = overlaySizeImage.props().style;
    expect(width).to.eq(20);
    driver.detach.proGallery();
  });

  it('should set the correct overlaySize according to size type-percent', async () => {
    Object.assign(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      overlayPosition: GALLERY_CONSTS.overlayPositions.LEFT,
      overlaySizeType: 'PERCENT',
      overlaySize: 50,
      overlayPadding: 0,
      width: 246,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const overlaySizeImage = driver.find.selector('.gallery-item-hover').at(0);
    console.log(overlaySizeImage.props().style);
    const { width } = overlaySizeImage.props().style;
    expect(width).to.eq(210);
    driver.detach.proGallery();
  });
});
