import { GALLERY_CONSTS } from 'pro-gallery-lib';
import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { images2 } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles';

describe('styleParam - overlayAnimation', () => {
  let driver;
  const initialProps = {
    container,
    items: images2,
    styles: styleParams,
  };

  beforeEach(() => {
    driver = new GalleryDriver();
  });

  it('should have box shadow when "itemEnableShadow" is "true"', () => {
    Object.assign(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
      oneRow: false,
      itemShadowBlur: 20,
      itemShadowSize: 10,
      itemShadowDirection: 135,
      itemShadowOpacityAndColor: 'rgba(0,0,0,.4)',
      itemEnableShadow: true,
    });
    driver.mount.proGallery(initialProps);
    const item = driver.find.hook('item-container').at(0);
    const { boxShadow } = item.props().style;
    const boxShadowMock = '7px 7px 20px rgba(0,0,0,.4)';
    expect(boxShadow).to.equal(boxShadowMock);
    driver.detach.proGallery();
  });
  it('should not have box shadow when "itemEnableShadow" is "false"', () => {
    Object.assign(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
      oneRow: false,
      itemShadowBlur: 20,
      itemShadowSize: 10,
      itemShadowDirection: 135,
      itemShadowOpacityAndColor: 'rgba(0,0,0,.4)',
      itemEnableShadow: false,
    });
    driver.mount.proGallery(initialProps);
    const item = driver.find.hook('item-container').at(0);
    const { boxShadow } = item.props().style;
    expect(boxShadow).to.equal(undefined);
    driver.detach.proGallery();
  });
  it('should not have box shadow in a "oneRow" gallery', () => {
    Object.assign(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      scrollDirection: GALLERY_CONSTS.scrollDirection.HORIZONTAL,
      oneRow: true,
      itemShadowBlur: 20,
      itemShadowSize: 10,
      itemShadowDirection: 135,
      itemShadowOpacityAndColor: 'rgba(0,0,0,.4)',
      itemEnableShadow: true,
    });
    driver.mount.proGallery(initialProps);
    const item = driver.find.hook('item-container').at(0);
    const { boxShadow } = item.props().style;
    expect(boxShadow).to.equal(undefined);
    driver.detach.proGallery();
  });

  it('should set the right "galleryMargin"', () => {
    Object.assign(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
      oneRow: false,
      itemShadowBlur: 20,
      itemShadowSize: 10,
      itemShadowDirection: 135,
      itemShadowOpacityAndColor: 'rgba(0,0,0,.4)',
      itemEnableShadow: true,
    });
    driver.mount.proGallery(initialProps);
    const item = driver.find.selector('#pro-gallery-margin-container');
    const { margin } = item.props().style;
    expect(margin).to.equal('30px');
    driver.detach.proGallery();
  });
});
