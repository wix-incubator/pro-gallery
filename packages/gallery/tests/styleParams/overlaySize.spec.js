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
      [optionsMap.behaviourParams.item.overlay.size]: 50,
    });
  });

  it('should set the correct overlaySize of 50 - right position', async () => {
    initialProps.options = mergeNestedObjects(initialProps.options, {
      [optionsMap.behaviourParams.item.overlay.position]:
        GALLERY_CONSTS[optionsMap.behaviourParams.item.overlay.position].RIGHT,
      [optionsMap.behaviourParams.item.overlay.sizeUnits]:
        GALLERY_CONSTS[optionsMap.behaviourParams.item.overlay.sizeUnits].PIXEL,
      [optionsMap.behaviourParams.item.overlay.padding]: 20,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const overlaySizeImage = driver.find.selector('.gallery-item-hover').at(0);
    const { width, height } = overlaySizeImage.props().style;
    expect(width).to.eq(50);
    expect(height).to.eq(380);
    driver.detach.proGallery();
  });

  it('should set the correct overlaySize of "50" - position top ', async () => {
    initialProps.options = mergeNestedObjects(initialProps.options, {
      [optionsMap.behaviourParams.item.overlay.position]:
        GALLERY_CONSTS[optionsMap.behaviourParams.item.overlay.position].TOP,
      [optionsMap.behaviourParams.item.overlay.sizeUnits]:
        GALLERY_CONSTS[optionsMap.behaviourParams.item.overlay.sizeUnits].PIXEL,
      [optionsMap.behaviourParams.item.overlay.padding]: 30,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const overlaySizeImage = driver.find.selector('.gallery-item-hover').at(0);
    const { height, width } = overlaySizeImage.props().style;
    expect(height).to.eq(50);
    expect(width).to.eq(360);
    driver.detach.proGallery();
  });
});
