import { GALLERY_CONSTS, GalleryItem } from 'pro-gallery-lib';
import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { images2 } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles';
import sinon from 'sinon';

describe('styleParam - imageLoadingMode', () => {
  let driver;
  let imageStub;
  const initialProps = {
    container,
    items: images2.slice(0, 1),
    styles: styleParams,
  };

  beforeEach(() => {
    driver = new GalleryDriver();
  });

  it('should preload blury image', async () => {
    Object.assign(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
      oneRow: false,
      imageLoadingMode: GALLERY_CONSTS.loadingMode.BLUR,
    });
    imageStub = sinon.stub(GalleryItem.prototype, 'createUrl');
    initialProps.settings = { forceImagePreload: true };
    driver.mount.proGallery(initialProps);
    await driver.update();
    expect(imageStub.withArgs('resized', 'thumb').called).to.be.true;
    imageStub.restore();
    driver.detach.proGallery();
  });
  it('should preload pixel image (MAIN_COLOR)', async () => {
    Object.assign(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
      oneRow: false,
      imageLoadingMode: GALLERY_CONSTS.loadingMode.MAIN_COLOR,
    });
    initialProps.settings = { forceImagePreload: true };
    imageStub = sinon.stub(GalleryItem.prototype, 'createUrl');
    driver.mount.proGallery(initialProps);
    await driver.update();
    expect(imageStub.withArgs('pixel', 'img').called).to.be.true;
    imageStub.restore();
    driver.detach.proGallery();
  });
  it('should preload color background (MAIN_COLOR)', async () => {
    Object.assign(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
      oneRow: false,
      imageLoadingMode: GALLERY_CONSTS.loadingMode.COLOR,
    });
    initialProps.settings = { forceImagePreload: true };
    driver.mount.proGallery(initialProps);
    await driver.update();
    const items = driver.find.selector('.load-with-color').length;
    expect(items).to.be.above(0);
    driver.detach.proGallery();
  });
});
