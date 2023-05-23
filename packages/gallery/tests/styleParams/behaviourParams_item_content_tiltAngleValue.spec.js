import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { GALLERY_CONSTS, optionsMap } from 'pro-gallery-lib';
import { images2 } from '../drivers/mocks/items';
import { options, container } from '../drivers/mocks/styles';

describe('options - behaviourParams_item_content_tiltAngleValue', () => {
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
  it('should compute correct tilt angle value after tilt', async () => {
    const TILE_ANGLE_VALUE = 20;
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.behaviourParams.item.content.hoverAnimation]:
        GALLERY_CONSTS[optionsMap.behaviourParams.item.content.hoverAnimation]
          .TILT,
      [optionsMap.behaviourParams.item.content.tiltAngleValue]:
        TILE_ANGLE_VALUE,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const animatedItem = driver.find.selector('.gallery-item-wrapper').at(0);
    animatedItem.simulate('mouseover');
    const computedAngle = getComputedStyle(
      animatedItem.getDOMNode()
    ).getPropertyValue('--tiltAngleValue');
    expect(computedAngle).to.be.eq(TILE_ANGLE_VALUE.toString());
    driver.detach.proGallery();
  });
});
