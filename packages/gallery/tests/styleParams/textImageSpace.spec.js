import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import {
  mergeNestedObjects,
  GALLERY_CONSTS,
  optionsMap,
} from 'pro-gallery-lib';
import { images2 } from '../drivers/mocks/items';
import { options, container, customComponents } from '../drivers/mocks/styles';

describe('options - textImageSpace', () => {
  let driver;
  let initialProps;

  beforeEach(() => {
    driver = new GalleryDriver();
    initialProps = {
      container,
      items: images2,
      options,
      customComponents,
    };
  });

  it('should set spacing between the image and the texts (texts below items and separated background)', async () => {
    initialProps.options = mergeNestedObjects(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
      [optionsMap.layoutParams.info.placement]:
        GALLERY_CONSTS[optionsMap.layoutParams.info.placement].BELOW,
      [optionsMap.layoutParams.info.layout]:
        GALLERY_CONSTS[optionsMap.layoutParams.info.layout]
          .SEPARATED_BACKGROUND,
      [optionsMap.layoutParams.info.spacing]: 20,
      [optionsMap.layoutParams.structure.scrollDirection]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection]
          .VERTICAL,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const item = driver.find
      .selector('.gallery-item-bottom-info')
      .at(0)
      .parent();
    // expect marginTop to equal textImageSpace value.
    expect(item.props().style.marginTop).to.eq(20);
    driver.detach.proGallery();
  });
  it('should set spacing between the image and the texts (texts above items and separated background)', async () => {
    initialProps.options = mergeNestedObjects(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
      [optionsMap.layoutParams.info.placement]:
        GALLERY_CONSTS[optionsMap.layoutParams.info.placement].ABOVE,
      [optionsMap.layoutParams.info.layout]:
        GALLERY_CONSTS[optionsMap.layoutParams.info.layout]
          .SEPARATED_BACKGROUND,
      [optionsMap.layoutParams.info.spacing]: 20,
      [optionsMap.layoutParams.structure.scrollDirection]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection]
          .VERTICAL,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const item = driver.find.selector('.gallery-item-top-info').at(0).parent();
    // expect marginBottom to equal textImageSpace value.
    expect(item.props().style.marginBottom).to.eq(20);
    driver.detach.proGallery();
  });
  it('should not set when "imageInfoType" is not "SEPARATED_BACKGROUND"', async () => {
    initialProps.options = mergeNestedObjects(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
      [optionsMap.layoutParams.info.placement]:
        GALLERY_CONSTS[optionsMap.layoutParams.info.placement].ABOVE,
      [optionsMap.layoutParams.info.layout]:
        GALLERY_CONSTS[optionsMap.layoutParams.info.layout].NO_BACKGROUND,
      [optionsMap.layoutParams.info.spacing]: 20,
      [optionsMap.layoutParams.structure.scrollDirection]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection]
          .VERTICAL,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const item = driver.find.selector('.gallery-item-top-info').at(0).parent();
    // expect marginBottom to be undefined.
    expect(item.props().style.marginBottom).to.eq(undefined);
    driver.detach.proGallery();
  });
});
