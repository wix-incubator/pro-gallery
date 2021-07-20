import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { images2 } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles';
import { getElementDimensions } from '../utils/utils';

describe('styleParam - cubeRatio', () => {
  let driver;
  const initialProps = {
    container,
    items: images2,
    styles: styleParams,
  };

  beforeEach(() => {
    driver = new GalleryDriver();
  });

  it('should set cube ratio of 1', async () => {
    Object.assign(initialProps.styles, {
      galleryLayout: -1,
      cubeImages: true,
      cubeRatio: 1,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const item = driver.find.hook('item-container').at(0);
    const { width, height } = getElementDimensions(item);
    //expect the ratio to not be what was given in the styleParams/options
    expect(width).to.eq(height);
    driver.detach.proGallery();
  });
  it('should set cube ratio of 2', async () => {
    Object.assign(initialProps.styles, {
      galleryLayout: -1,
      cubeImages: true,
      cubeRatio: 2,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const item = driver.find.hook('item-container').at(0);
    const { width, height } = getElementDimensions(item);
    //expect the ratio to be what was set in the styleParams/options
    expect(width).to.eq(height * 2);
    driver.detach.proGallery();
  });
  it('should not be able to set cube ratio when "cubeImages" is "false"', async () => {
    Object.assign(initialProps.styles, {
      galleryLayout: -1,
      cubeImages: false,
      cubeRatio: 1,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const item = driver.find.hook('item-container').at(0);
    const { width, height } = getElementDimensions(item);
    //expect the ratio to not be what was given in the styleParams/options
    expect(width).to.not.eq(height);
    driver.detach.proGallery();
  });
});
