import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { GALLERY_CONSTS, optionsMap } from 'pro-gallery-lib';
import { images2 } from '../drivers/mocks/items';
import { options, container } from '../drivers/mocks/styles';
import { getElementDimensions } from '../utils/utils';

describe('options - layoutParams_crop_ratios', () => {
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

  it('should set cube ratio of 1', async () => {
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].EMPTY,
      [optionsMap.layoutParams.crop.enable]: true,
      [optionsMap.layoutParams.crop.ratios]: [1],
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const item = driver.find.hook('item-container').at(0);
    const { width, height } = getElementDimensions(item);
    //expect the ratio to not be what was given in the options
    expect(width).to.eq(height);
    driver.detach.proGallery();
  });
  it('should set cube ratio of 2', async () => {
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].EMPTY,
      [optionsMap.layoutParams.crop.enable]: true,
      [optionsMap.layoutParams.crop.ratios]: [2],
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const item = driver.find.hook('item-container').at(0);
    const { width, height } = getElementDimensions(item);
    //expect the ratio to be what was set in the options
    expect(width).to.eq(height * 2);
    driver.detach.proGallery();
  });
  it('should not be able to set cube ratio when "layoutParams_crop_enable" is "false"', async () => {
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].EMPTY,
      [optionsMap.layoutParams.crop.enable]: false,
      [optionsMap.layoutParams.crop.ratios]: [1],
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const item = driver.find.hook('item-container').at(0);
    const { width, height } = getElementDimensions(item);
    //expect the ratio to not be what was given in the options
    expect(width).to.not.eq(height);
    driver.detach.proGallery();
  });
});
