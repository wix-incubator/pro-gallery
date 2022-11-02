import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import {
  mergeNestedObjects,
  GALLERY_CONSTS,
  optionsMap,
} from 'pro-gallery-lib';
import { images2 } from '../drivers/mocks/items';
import { options, container } from '../drivers/mocks/styles';

describe('options - overlaySize', () => {
  let driver;
  let initialProps;

  beforeEach(() => {
    driver = new GalleryDriver();
    initialProps = {
      container,
      items: images2,
      options,
    };
    initialProps.options = mergeNestedObjects(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
      [optionsMap.behaviourParams.item.overlay.position]:
        GALLERY_CONSTS[optionsMap.behaviourParams.item.overlay.position].LEFT,
      [optionsMap.behaviourParams.item.overlay.padding]: 0,
    });
  });

  it('should set the correct overlaySize according to size type - PIXEL', async () => {
    initialProps.options = mergeNestedObjects(initialProps.options, {
      [optionsMap.behaviourParams.item.overlay.size]: 20,
      [optionsMap.behaviourParams.item.overlay.sizeUnits]:
        GALLERY_CONSTS[optionsMap.behaviourParams.item.overlay.sizeUnits].PIXEL,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const overlaySizeImage = driver.find.selector('.gallery-item-hover').at(0);
    const { width } = overlaySizeImage.props().style;
    expect(width).to.eq(20);
    driver.detach.proGallery();
  });

  it('should set the correct overlaySize according to size type- PERCENT', async () => {
    initialProps.options = mergeNestedObjects(initialProps.options, {
      overlaySizeType: 'PERCENT',
      [optionsMap.behaviourParams.item.overlay.size]: 50,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const overlaySizeImage = driver.find.selector('.gallery-item-hover').at(0);
    const { width, height } = overlaySizeImage.props().style;
    expect(width).to.eq(height / 2);
    driver.detach.proGallery();
  });
});
