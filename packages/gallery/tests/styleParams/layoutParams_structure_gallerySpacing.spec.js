import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { GALLERY_CONSTS, optionsMap } from 'pro-gallery-lib';
import { images2 } from '../drivers/mocks/items';
import { options, container } from '../drivers/mocks/styles';

describe('options - layoutParams_structure_gallerySpacing', () => {
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

  it('should set the gallery with a margin of 20px in a vertical gallery', async () => {
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.gallerySpacing]: 20,
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,

      [optionsMap.layoutParams.structure.scrollDirection]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].VERTICAL,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const marginContainer = driver.find.selector('.pro-gallery-margin-container').getDOMNode();
    const margin = getComputedStyle(marginContainer).margin;
    expect(margin).to.eq('20px');
    driver.detach.proGallery();
  });
  it('should set the gallery with a margin of (gallerySpacing - (itemSpacing / 2)) in a horizontal gallery', async () => {
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.gallerySpacing]: 20,

      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
      [optionsMap.layoutParams.structure.itemSpacing]: 10,
      [optionsMap.layoutParams.structure.scrollDirection]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].HORIZONTAL,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const galleryContainer = driver.find.selector('.pro-gallery-parent-container').getDOMNode();
    const margin = getComputedStyle(galleryContainer).margin;
    // expect the margin to be (gallerySpacing - (itemSpacing / 2)
    expect(margin).to.eq('15px');
    driver.detach.proGallery();
  });
});
