import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { GALLERY_CONSTS, optionsMap } from 'pro-gallery-lib';
import { images2 } from '../drivers/mocks/items';
import { options, container } from '../drivers/mocks/styles';

describe('options - behaviourParams_item_overlay_position', () => {
  let driver;
  let initialProps;

  beforeEach(() => {
    driver = new GalleryDriver();
    initialProps = {
      container,
      items: images2,
      options,
    };
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
      [optionsMap.behaviourParams.item.overlay.size]: 50,
      [optionsMap.behaviourParams.item.overlay.sizeUnits]:
        GALLERY_CONSTS[optionsMap.behaviourParams.item.overlay.sizeUnits].PIXEL,
      [optionsMap.behaviourParams.item.overlay.padding]: 30,
    });
  });

  it('should set the correct behaviourParams_item_overlay_position - TOP position', async () => {
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.behaviourParams.item.overlay.position]:
        GALLERY_CONSTS[optionsMap.behaviourParams.item.overlay.position].TOP,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const overlaySizeImage = driver.find.selector('.gallery-item-hover').at(0);
    const { height, width } = overlaySizeImage.props().style;
    expect(height).to.eq(50);
    expect(width).to.eq(360);
    driver.detach.proGallery();
  });

  it('should set the correct behaviourParams_item_overlay_position - RIGHT position', async () => {
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.behaviourParams.item.overlay.position]:
        GALLERY_CONSTS[optionsMap.behaviourParams.item.overlay.position].RIGHT,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const overlaySizeImage = driver.find.selector('.gallery-item-hover').at(0);
    const { width, height } = overlaySizeImage.props().style;
    expect(width).to.eq(50);
    expect(height).to.eq(360);
    driver.detach.proGallery();
  });
});
