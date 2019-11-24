import GalleryDriver from '../drivers/reactDriver'
import { expect } from 'chai';
import { images2 } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles'

describe('styleParam - allowSocial', () => {

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

  it('should set class ".populated-item" to "item-social" when only "allowSocial" is enabled', () => {
    Object.assign(initialProps.styles, {
      allowDownload: false,
      allowSocial: false,
      loveButton: true
    })
    driver.mount.proGallery(initialProps)
    const item = driver.find.hook('item-social').at(0);
    expect(item.hasClass('populated-item')).to.be.true;
    driver.detach.proGallery();
  });

  it('should set "padding-bottom:70" to texts element', () => {
    Object.assign(initialProps.styles, {
      loveButton: true,
      allowTitle: true //added title to render "gallery-item-text" for the test
    })
    driver.mount.proGallery(initialProps)
    const item = driver.find.selector('.gallery-item-text').at(0);
    expect(item.prop('style').paddingBottom).to.eq(70);
    driver.detach.proGallery();
  });

})