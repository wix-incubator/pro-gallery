import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { GALLERY_CONSTS, optionsMap } from 'pro-gallery-lib';
import { images2 } from '../drivers/mocks/items';
import { options, container } from '../drivers/mocks/styles';

describe.skip('options - stylingParams_itemShadow', () => {
  //v5 TODO. need to restore this once layoutHelper is new
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
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
      [optionsMap.layoutParams.structure.scrollDirection]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].VERTICAL,
      [optionsMap.stylingParams.itemShadowBlur]: 20,
      [optionsMap.stylingParams.itemShadowSize]: 10,
      [optionsMap.stylingParams.itemShadowDirection]: 135,
      [optionsMap.stylingParams.itemShadowOpacityAndColor]: 'rgba(0,0,0,.4)',
      [optionsMap.stylingParams.itemEnableShadow]: true,
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
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
      [optionsMap.layoutParams.structure.scrollDirection]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].VERTICAL,
      [optionsMap.stylingParams.itemShadowBlur]: 20,
      [optionsMap.stylingParams.itemShadowSize]: 10,
      [optionsMap.stylingParams.itemShadowDirection]: 135,
      [optionsMap.stylingParams.itemShadowOpacityAndColor]: 'rgba(0,0,0,.4)',
      [optionsMap.stylingParams.itemEnableShadow]: false,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const item = driver.find.hook('item-container').at(0);
    const { boxShadow } = item.props().style;
    expect(boxShadow).to.equal(undefined);
    driver.detach.proGallery();
  });
  it('should not have box shadow in a horizontal gallery', async () => {
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
      [optionsMap.layoutParams.structure.scrollDirection]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].HORIZONTAL,
      [optionsMap.stylingParams.itemShadowBlur]: 20,
      [optionsMap.stylingParams.itemShadowSize]: 10,
      [optionsMap.stylingParams.itemShadowDirection]: 135,
      [optionsMap.stylingParams.itemShadowOpacityAndColor]: 'rgba(0,0,0,.4)',
      [optionsMap.stylingParams.itemEnableShadow]: true,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const item = driver.find.hook('item-container').at(0);
    const { boxShadow } = item.props().style;
    expect(boxShadow).to.equal(undefined);
    driver.detach.proGallery();
  });

  it('should set the right "layoutParams_structure_gallerySpacing"', async () => {
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
      [optionsMap.layoutParams.structure.scrollDirection]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].VERTICAL,
      [optionsMap.stylingParams.itemShadowBlur]: 20,
      [optionsMap.stylingParams.itemShadowSize]: 10,
      [optionsMap.stylingParams.itemShadowDirection]: 135,
      [optionsMap.stylingParams.itemShadowOpacityAndColor]: 'rgba(0,0,0,.4)',
      [optionsMap.stylingParams.itemEnableShadow]: true,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const item = driver.find.selector('.pro-gallery-margin-container');
    const { margin } = item.props().style;
    expect(margin).to.equal('30px');
    driver.detach.proGallery();
  });

  it('should set the correct box-shadow style to the items', async () => {
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
      [optionsMap.layoutParams.structure.scrollDirection]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].VERTICAL,
      [optionsMap.stylingParams.itemEnableShadow]: true,
      [optionsMap.stylingParams.itemShadowDirection]: 100,
      [optionsMap.stylingParams.itemShadowSize]: 20,
      [optionsMap.stylingParams.itemShadowBlur]: 20,
      [optionsMap.stylingParams.itemShadowOpacityAndColor]: 'rgba(0,0,0,.4)',
    });

    driver.mount.proGallery(initialProps);
    await driver.update();
    const item = driver.find.hook('item-container').at(0);
    expect(item.props().style.boxShadow).to.equal('20px 3px 20px rgba(0,0,0,.4)');
    driver.detach.proGallery();
  });
});
