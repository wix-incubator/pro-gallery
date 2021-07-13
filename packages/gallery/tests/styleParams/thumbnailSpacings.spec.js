import { GALLERY_CONSTS } from 'pro-gallery-lib';
import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { images2 } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles';

describe('styleParam - thumbnailSpacings', () => {
  let driver;
  const initialProps = {
    container,
    items: images2,
    styles: styleParams,
  };

  beforeEach(() => {
    driver = new GalleryDriver();
  });

  it('should set "thumbnailSpacing" of "10"', async () => {
    Object.assign(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.THUMBNAIL,
      thumbnailSpacings: 10,
    });
    const mock = {
      marginLeft: 10,
      marginTop: 10,
    };
    driver.mount.proGallery(initialProps);
    await driver.update();
    const item = driver.find.selector('.thumbnailItem').at(0);
    expect(item.props().style).to.include(mock);
    driver.detach.proGallery();
  });
  it('should set "thumbnailSpacing" of "30"', async () => {
    Object.assign(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.THUMBNAIL,
      thumbnailSpacings: 30,
    });
    const mock = {
      marginLeft: 30,
      marginTop: 30,
    };
    driver.mount.proGallery(initialProps);
    await driver.update();
    const item = driver.find.selector('.thumbnailItem').at(0);
    expect(item.props().style).to.include(mock);
    driver.detach.proGallery();
  });
});
