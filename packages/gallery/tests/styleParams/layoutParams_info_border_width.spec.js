import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { GALLERY_CONSTS, optionsMap } from 'pro-gallery-lib';
import { images2 } from '../drivers/mocks/items';
import { options, container, customComponents } from '../drivers/mocks/styles';

describe('options - layoutParams_info_border_width', () => {
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

  it('should set border-width to the text container when "layoutParams_info_layout" is "SEPARATED_BACKGROUND"', async () => {
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
      [optionsMap.layoutParams.info.layout]: GALLERY_CONSTS[optionsMap.layoutParams.info.layout].SEPARATED_BACKGROUND,
      [optionsMap.layoutParams.structure.scrollDirection]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].VERTICAL,
      [optionsMap.layoutParams.info.placement]: GALLERY_CONSTS[optionsMap.layoutParams.info.placement].BELOW,
      [optionsMap.layoutParams.info.border.width]: 10,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const textsStyles = driver.find.selector('.gallery-item-bottom-info').at(0).parent();
    expect(textsStyles.props().style.borderWidth).to.eq('10px');
    driver.detach.proGallery();
  });
  it('should not set border-width to the text container when "layoutParams_info_layout" is not "SEPARATED_BACKGROUND"', async () => {
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
      [optionsMap.layoutParams.info.layout]: GALLERY_CONSTS[optionsMap.layoutParams.info.layout].NO_BACKGROUND,
      [optionsMap.layoutParams.structure.scrollDirection]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].VERTICAL,
      [optionsMap.layoutParams.info.placement]: GALLERY_CONSTS[optionsMap.layoutParams.info.placement].BELOW,
      [optionsMap.layoutParams.info.border.width]: 10,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const textsStyles = driver.find.selector('.gallery-item-bottom-info').at(0).parent();
    expect(textsStyles.props().style.borderWidth).to.eq(undefined);
    driver.detach.proGallery();
  });
});
