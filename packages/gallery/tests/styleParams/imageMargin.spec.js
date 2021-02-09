import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { images2 } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles';
import { getElementDimensions } from '../utils/utils';

describe('styleParam - imageMargin', () => {
  let driver;
  const initialProps = {
    container,
    items: images2,
    styles: styleParams,
  };

  beforeEach(() => {
    driver = new GalleryDriver();
  });

  it('should set use CSS property "margin" to create the spacing when gallery is "oneRow"', async () => {
    Object.assign(initialProps.styles, {
      galleryLayout: 7,
      imageMargin: 10,
      oneRow: true,
      scrollDirection: 1,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const item = driver.find.hook('item-container').at(0);
    expect(item.prop('style').margin).to.eq('5px');
    driver.detach.proGallery();
  });

  it('should use "top" and "left" properties to create the spacing', async () => {
    //in vertical layout the spacing will be set with the "top" and "left" properties and not with "margin"
    Object.assign(initialProps.styles, {
      galleryLayout: 2,
      imageMargin: 25,
      oneRow: false,
      gallerySizeType: 'px',
      gallerySizePx: 390,
      isVertical: true,
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
        expect(spacing).to.eq(initialProps.styles.imageMargin);
      }
      prevDims = dims;
    }
    driver.detach.proGallery();
  });
});
