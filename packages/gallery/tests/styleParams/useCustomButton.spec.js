import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { images2 } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles';

describe('styleParam - useCustomButton', () => {

  let driver;
  const initialProps = {
    container,
    items: [...images2],
    styles: styleParams,
  }

  beforeEach(() => {
    driver = new GalleryDriver();
  });

  it('should render custom button when "customButton" is "true"', () => {
    Object.assign(initialProps.styles, {
      galleryLayout:2,
      useCustomButton: true,
    });
    driver.mount.proGallery(initialProps);
    const buttons = driver.find.selector('.custom-button-wrapper');
    expect(buttons.length).to.be.greaterThan(0);
    driver.detach.proGallery();
  });
  it('should not render custom button when "customButton" is "false"', () => {
    Object.assign(initialProps.styles, {
      galleryLayout:2,
      useCustomButton: false,
    });
    driver.mount.proGallery(initialProps);
    const buttons = driver.find.selector('.custom-button-wrapper');
    expect(buttons.length).to.eq(0);
    driver.detach.proGallery();
  });
  it('should render Texts element when "customButton" is "true"', () => {
    Object.assign(initialProps.styles, {
      galleryLayout:2,
      useCustomButton: true,
      allowTitle: false, // test that customButton is enough to render Texts element
      allowDescription: false,
    });
    driver.mount.proGallery(initialProps);
    const buttons = driver.find.selector('.gallery-item-text');
    expect(buttons.length).to.be.greaterThan(0)
    driver.detach.proGallery();
  });
})