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

  it('should show social button when "allowSocial" is "true"', () => {
    Object.assign(initialProps.styles, {
      allowSocial: true,
    })
    driver.mount.proGallery(initialProps)
    const items = driver.find.hook('gallery-item-social-button');
    // button foreach item(6)
    expect(items).to.have.lengthOf(6);
    driver.detach.proGallery();
  });

  it('should render social network buttons("social-share-box") when "allowSocial" is "true"', () => {
    Object.assign(initialProps.styles, {
      allowSocial: true,
    })
    driver.mount.proGallery(initialProps)
    const items = driver.find.hook('social-share-box');
    // expect to
    expect(items).to.have.lengthOf(6)
    driver.detach.proGallery();
  });

  it('should not show social button when "allowSocial" is "false"', () => {
    Object.assign(initialProps.styles, {
      allowSocial: false,
    })
    driver.mount.proGallery(initialProps);
    const items = driver.find.hook('gallery-item-social-button');
    expect(items).to.have.lengthOf(0)
    driver.detach.proGallery();
  });

  it('should not render social network buttons("social-share-box") when "allowSocial" is "false"', () => {
    Object.assign(initialProps.styles, {
      allowSocial: false,
    })
    driver.mount.proGallery(initialProps)
    const items = driver.find.hook('social-share-box');
    expect(items).to.have.lengthOf(0)
    driver.detach.proGallery();
  });

  it('should show social network buttons when the social sharing button is clicked"', () => {
    Object.assign(initialProps.styles, {
      allowSocial: true,
    })
    driver.mount.proGallery(initialProps)
    const button = driver.find.hook('gallery-item-social-button').at(0);
    button.simulate('click')
    const socialBox = driver.find.hook('social-share-box').at(0);
    expect(socialBox.hasClass('opened')).to.be.true;
    driver.detach.proGallery();
  });

  it('should set class ".populated-item" to "item-social" when only "allowSocial" is enabled', () => {
    Object.assign(initialProps.styles, {
      allowDownload: false,
      allowSocial: true,
      loveButton: false
    })
    driver.mount.proGallery(initialProps)
    const item = driver.find.hook('item-social').at(0);
    expect(item.hasClass('populated-item')).to.be.true;
    driver.detach.proGallery();
  });

  it('should set "padding-bottom:70" to texts element', () => {
    Object.assign(initialProps.styles, {
      allowSocial: true,
      allowTitle: true //added title to render "gallery-item-text" for the test
    })
    driver.mount.proGallery(initialProps)
    const item = driver.find.selector('.gallery-item-text').at(0);
    expect(item.prop('style').paddingBottom).to.eq(70);
    driver.detach.proGallery();
  });
})