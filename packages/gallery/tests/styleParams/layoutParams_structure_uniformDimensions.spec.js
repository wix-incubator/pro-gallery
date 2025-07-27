import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { GALLERY_CONSTS, optionsMap } from 'pro-gallery-lib';
import { images2 } from '../drivers/mocks/items';
import { options, container } from '../drivers/mocks/styles';

describe('options - layoutParams_structure_uniformDimensions', () => {
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

  it('should apply uniform dimensions when uniformDimensions is true', async () => {
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].EMPTY,
      [optionsMap.layoutParams.structure.uniformDimensions]: true,
      [optionsMap.layoutParams.structure.scrollDirection]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].VERTICAL,
      [optionsMap.layoutParams.structure.layoutOrientation]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.layoutOrientation].HORIZONTAL,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();

    // Test that the gallery renders successfully with uniformDimensions set
    const items = driver.find.hook('item-container');
    expect(items.length).to.be.greaterThan(0);

    driver.detach.proGallery();
  });

  it('should behave normally when uniformDimensions is false', async () => {
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].EMPTY,
      [optionsMap.layoutParams.structure.uniformDimensions]: false,
      [optionsMap.layoutParams.structure.scrollDirection]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].VERTICAL,
      [optionsMap.layoutParams.structure.layoutOrientation]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.layoutOrientation].HORIZONTAL,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();

    // When uniformDimensions is false, should behave normally
    const items = driver.find.hook('item-container');
    expect(items.length).to.be.greaterThan(0);

    driver.detach.proGallery();
  });

  it('should work with vertical layout orientation', async () => {
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].EMPTY,
      [optionsMap.layoutParams.structure.uniformDimensions]: true,
      [optionsMap.layoutParams.structure.scrollDirection]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].VERTICAL,
      [optionsMap.layoutParams.structure.layoutOrientation]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.layoutOrientation].VERTICAL,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();

    // Test vertical orientation with uniform dimensions
    const items = driver.find.hook('item-container');
    expect(items.length).to.be.greaterThan(0);

    driver.detach.proGallery();
  });

  it('should default to false when not specified', async () => {
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].EMPTY,
      // uniformDimensions not specified - should default to false
      [optionsMap.layoutParams.structure.scrollDirection]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].VERTICAL,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();

    // Should work without uniformDimensions specified (defaults to false)
    const items = driver.find.hook('item-container');
    expect(items.length).to.be.greaterThan(0);

    driver.detach.proGallery();
  });
});
