import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import {
  mergeNestedObjects,
  GALLERY_CONSTS,
  optionsMap,
} from 'pro-gallery-lib';
import { images2 } from '../drivers/mocks/items';
import { options, container, customComponents } from '../drivers/mocks/styles';

describe('options - textBoxBorderColor', () => {
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

  it('should set border-color to the text container when "imageInfoType" is "SEPARATED_BACKGROUND"', async () => {
    initialProps.options = mergeNestedObjects(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
      [optionsMap.layoutParams.info.layout]:
        GALLERY_CONSTS[optionsMap.layoutParams.info.layout]
          .SEPARATED_BACKGROUND,
      [optionsMap.layoutParams.structure.scrollDirection]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection]
          .VERTICAL,
      [optionsMap.layoutParams.info.placement]:
        GALLERY_CONSTS[optionsMap.layoutParams.info.placement].BELOW,
      [optionsMap.layoutParams.info.border.color]: { value: 'rgba(0,0,0,0)' },
      [optionsMap.stylingParams.itemBorderWidth]: 1,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const textsStyles = driver.find
      .selector('.gallery-item-bottom-info')
      .at(0)
      .parent();
    expect(textsStyles.props().style.borderColor).to.be.undefined;
    driver.detach.proGallery();
  });
  it('should not set border-color to the text container when "imageInfoType" is not "SEPARATED_BACKGROUND"', async () => {
    initialProps.options = mergeNestedObjects(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
      [optionsMap.layoutParams.info.layout]:
        GALLERY_CONSTS[optionsMap.layoutParams.info.layout].NO_BACKGROUND,
      [optionsMap.layoutParams.structure.scrollDirection]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection]
          .VERTICAL,
      [optionsMap.layoutParams.info.placement]:
        GALLERY_CONSTS[optionsMap.layoutParams.info.placement].BELOW,
      [optionsMap.layoutParams.info.border.color]: { value: 'rgba(0,0,0,0)' },
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const textsStyles = driver.find
      .selector('.gallery-item-bottom-info')
      .at(0)
      .parent();
    expect(textsStyles.props().style.borderColor).to.eq(undefined);
    driver.detach.proGallery();
  });
});
