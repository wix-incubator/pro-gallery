import { GALLERY_CONSTS } from 'pro-gallery-lib';
import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { mergeNestedObjects } from 'pro-gallery-lib';
import { images2 } from '../drivers/mocks/items';
import { options, container } from '../drivers/mocks/styles';

describe('options - overlayAnimation', () => {
  let driver;
  let initialProps;

  beforeEach(() => {
    driver = new GalleryDriver();
    initialProps = {
      container,
      items: images2,
      options,
    };
  });

  it('should have box shadow when "itemEnableShadow" is "true"', async () => {
    initialProps.options = mergeNestedObjects(initialProps.options, {
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
      itemShadowBlur: 20,
      itemShadowSize: 10,
      itemShadowDirection: 135,
      itemShadowOpacityAndColor: 'rgba(0,0,0,.4)',
      itemEnableShadow: true,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const item = driver.find.hook('item-container').at(0);
    const { boxShadow } = item.props().style;
    const boxShadowMock = '7px 7px 20px rgba(0,0,0,.4)';
    expect(boxShadow).to.equal(boxShadowMock);
    driver.detach.proGallery();
  });
  it('should not have box shadow when "itemEnableShadow" is "false"', async () => {
    initialProps.options = mergeNestedObjects(initialProps.options, {
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
      itemShadowBlur: 20,
      itemShadowSize: 10,
      itemShadowDirection: 135,
      itemShadowOpacityAndColor: 'rgba(0,0,0,.4)',
      itemEnableShadow: false,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const item = driver.find.hook('item-container').at(0);
    const { boxShadow } = item.props().style;
    expect(boxShadow).to.equal(undefined);
    driver.detach.proGallery();
  });
  it('should not have box shadow in a horizontal gallery', async () => {
    initialProps.options = mergeNestedObjects(initialProps.options, {
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      scrollDirection: GALLERY_CONSTS.scrollDirection.HORIZONTAL,
      itemShadowBlur: 20,
      itemShadowSize: 10,
      itemShadowDirection: 135,
      itemShadowOpacityAndColor: 'rgba(0,0,0,.4)',
      itemEnableShadow: true,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const item = driver.find.hook('item-container').at(0);
    const { boxShadow } = item.props().style;
    expect(boxShadow).to.equal(undefined);
    driver.detach.proGallery();
  });

  it('should set the right "gallerySpacing"', async () => {
    initialProps.options = mergeNestedObjects(initialProps.options, {
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
      itemShadowBlur: 20,
      itemShadowSize: 10,
      itemShadowDirection: 135,
      itemShadowOpacityAndColor: 'rgba(0,0,0,.4)',
      itemEnableShadow: true,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const item = driver.find.selector('.pro-gallery-margin-container');
    const { margin } = item.props().style;
    expect(margin).to.equal('30px');
    driver.detach.proGallery();
  });

  it('should set the correct box-shadow style to the items', async () => {
    initialProps.options = mergeNestedObjects(initialProps.options, {
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
      itemEnableShadow: true,
      itemShadowDirection: 100,
      itemShadowSize: 20,
      itemShadowBlur: 20,
      itemShadowOpacityAndColor: 'rgba(0,0,0,.4)',
    });

    driver.mount.proGallery(initialProps);
    await driver.update();
    const item = driver.find.hook('item-container').at(0);
    expect(item.props().style.boxShadow).to.equal(
      '20px 3px 20px rgba(0,0,0,.4)'
    );
    driver.detach.proGallery();
  });
});
