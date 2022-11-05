import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { GALLERY_CONSTS, optionsMap } from 'pro-gallery-lib';
import { images2 } from '../drivers/mocks/items';
import { options, container } from '../drivers/mocks/styles';

describe('options - itemBorderColor', () => {
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

  it('should set border-color of "rgba(0,0,0,1)" to the items', async () => {
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
      [optionsMap.layoutParams.structure.scrollDirection]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection]
          .VERTICAL,
      [optionsMap.stylingParams.itemBorderWidth]: 1,
      [optionsMap.stylingParams.itemBorderColor]: 'rgba(0,0,0,1)',
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const item = driver.find.hook('item-container').at(0);

    expect(item.props().style.borderColor).to.eq('rgba(0,0,0,1)');
    driver.detach.proGallery();
  });
  it('should set border-color of "rgba(23,110,23,1)" to items', async () => {
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
      [optionsMap.layoutParams.structure.scrollDirection]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection]
          .VERTICAL,
      [optionsMap.stylingParams.itemBorderWidth]: 1,
      [optionsMap.stylingParams.itemBorderColor]: 'rgba(23,110,23,1)',
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const item = driver.find.hook('item-container').at(0);
    expect(item.props().style.borderColor).to.eq('rgba(23,110,23,1)');
    driver.detach.proGallery();
  });
});
