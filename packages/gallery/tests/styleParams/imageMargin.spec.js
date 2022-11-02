import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import {
  mergeNestedObjects,
  GALLERY_CONSTS,
  optionsMap,
} from 'pro-gallery-lib';
import { images2 } from '../drivers/mocks/items';
import { options, container } from '../drivers/mocks/styles';
import { getElementDimensions } from '../utils/utils';

describe('options - imageMargin', () => {
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

  it('should set use CSS property "margin" to create the spacing when gallery is horizontal', async () => {
    initialProps.options = mergeNestedObjects(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].COLUMN,
      [optionsMap.layoutParams.structure.itemSpacing]: 10,
      [optionsMap.layoutParams.structure.scrollDirection]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection]
          .HORIZONTAL,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const item = driver.find.hook('item-container').at(0);
    expect(item.prop('style').margin).to.eq('5px');
    driver.detach.proGallery();
  });

  it('should use "top" and "left" properties to create the spacing', async () => {
    //in vertical layout the spacing will be set with the "top" and "left" properties and not with "margin"
    initialProps.options = mergeNestedObjects(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
      [optionsMap.layoutParams.structure.itemSpacing]: 25,
      [optionsMap.layoutParams.structure.scrollDirection]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection]
          .VERTICAL,
      [optionsMap.layoutParams.targetItemSize.unit]:
        GALLERY_CONSTS[optionsMap.layoutParams.targetItemSize.unit].PIXEL,
      [optionsMap.layoutParams.targetItemSize.value]: 390,
      [optionsMap.layoutParams.structure.layoutOrientation]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.layoutOrientation]
          .VERTICAL,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    //get the middle image in the second row to test
    let prevDims = { top: -1, left: 0, width: 0, height: 0 };
    for (let i = 0; i < initialProps.items.length; i++) {
      const item = driver.find.hook('item-container').at(i);
      const dims = getElementDimensions(item);
      if (dims.top === prevDims.top) {
        const spacing = dims.left - (prevDims.left + prevDims.width);
        expect(spacing).to.eq(
          initialProps.options[optionsMap.layoutParams.structure.itemSpacing]
        );
      }
      prevDims = dims;
    }
    driver.detach.proGallery();
  });
});
