import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { images2 } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles';

describe('styleParam - imageInfoType', () => {

  let driver;
  const initialProps = {
    container,
    items: [...images2],
    styles: styleParams,
  }

  beforeEach(() => {
    driver = new GalleryDriver();
  });

  it('should ', () => {
    Object.assign(initialProps.styles, {
      galleryLayout:2,
      useCustomButton: true,
    });
    driver.mount.proGallery(initialProps);
    const buttons = driver.find.selector('.custom-button-wrapper');
    expect(buttons.length).to.be.greaterThan(0);
    driver.detach.proGallery();
  });
})