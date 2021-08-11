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

  it('should set the correct overlaySize of 50 - right position', async () => {
    Object.assign(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      overlayPosition: GALLERY_CONSTS.overlayPositions.RIGHT,
      overlaySize: 50,
      overlaySizeType: 'PIXEL',
      overlayPadding: 20,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const overlaySizeImage = driver.find.selector('.gallery-item-hover').at(0);
    const { width, height } = overlaySizeImage.props().style;
    expect(width).to.eq(50);
    expect(height).to.eq(380);
    driver.detach.proGallery();
  });

  it('should set the correct overlaySize of "50" - position top ', async () => {
    Object.assign(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      overlaySize: 50,
      overlayPosition: GALLERY_CONSTS.overlayPositions.TOP,
      overlayPadding: 30,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const overlaySizeImage = driver.find.selector('.gallery-item-hover').at(0);
    const { height, width } = overlaySizeImage.props().style;
    expect(height).to.eq(50);
    expect(width).to.eq(360);
    driver.detach.proGallery();
  });
});
