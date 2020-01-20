import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { images2 } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles';

describe('styleParam - useCustomButton', () => {

  let driver;
  const initialProps = {
    container,
    items: [...images2, ...images2],
    styles: styleParams,
  }

  beforeEach(() => {
    driver = new GalleryDriver();
  });

  it('should render custom button when "customButton" is "true"', () => {
    Object.assign(initialProps.styles, {
      
      galleryLayout:2
    });
    driver.mount.proGallery(initialProps);
    const elem = driver.find.selector('#gallery-horizontal-scroll');
    expect(elem).to.have.lengthOf(1)
    driver.detach.proGallery();
  });
})