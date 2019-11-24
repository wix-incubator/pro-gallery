import GalleryDriver from '../drivers/reactDriver'
import { expect } from 'chai';
import { images2 } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles'

describe('styleParam - loveButton', () => {

  let driver;
  const initialProps = {
    container,
    items: images2,
    styles: styleParams
  }

  beforeEach(() => {
    driver = new GalleryDriver();
  });

  it('should render "love-button" when "loveButton" is "true"', () => {
    Object.assign(initialProps.styles, {
      loveButton: true,
    })
    driver.mount.proGallery(initialProps);
    const items = driver.find.hook('love-button');
    //test 6 items for love button
    expect(items).to.have.lengthOf(6)
    driver.detach.proGallery();
  });

  it('should not render "love-button" when "loveButton" is "false"', () => {
    Object.assign(initialProps.styles, {
      loveButton: false,
    })
    driver.mount.proGallery(initialProps);
    const items = driver.find.hook('love-button');
    //test 6 items for love button
    expect(items).to.have.lengthOf(0)
    driver.detach.proGallery();
  });

})