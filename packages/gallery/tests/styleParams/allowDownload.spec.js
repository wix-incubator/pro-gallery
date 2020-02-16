import GalleryDriver from '../drivers/reactDriver'
import { expect } from 'chai';
import { images2 } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles';
import utils from '../../src/common/utils/index';
import sinon from 'sinon';

describe('styleParam - allowDownload', () => {
  let driver;
  const initialProps = {
    container,
    items: images2,
    styles: styleParams
  }

  beforeEach(() => {
    driver = new GalleryDriver();
  });


  it('should render "item-download" when "allowDownload" is "true"', () => {
    Object.assign(initialProps.styles, {
      allowDownload: true,
    })
    driver.mount.proGallery(initialProps)
    const item = driver.find.hook('item-download');
    //check 6 items for download button
    expect(item).to.have.lengthOf(6);
    driver.detach.proGallery();
  });

  it('should not render "item-download" when "allowDownload" is "false"', () => {
    Object.assign(initialProps.styles, {
      allowDownload: false,
    })
    driver.mount.proGallery(initialProps)
    const item = driver.find.hook('item-download');
    expect(item).to.have.lengthOf(0);
    driver.detach.proGallery();
  });

  it('should set class ".populated-item" to "item-social" when only "allowDownload" is enabled', () => {
    Object.assign(initialProps.styles, {
      allowDownload: true,
      allowSocial: false,
      loveButton: false
    })
    driver.mount.proGallery(initialProps)
    const item = driver.find.hook('item-social').at(0);
    expect(item.hasClass('populated-item')).to.be.true;
    driver.detach.proGallery();
  });

  it('should set class ".pull-right" to "item-download" when allowSocial is "false"', () => {
    Object.assign(initialProps.styles, {
      allowDownload: true,
      allowSocial: false,
    })
    driver.mount.proGallery(initialProps)
    const item = driver.find.hook('item-download').at(0);
    expect(item.hasClass('pull-right')).to.be.true;
    driver.detach.proGallery();
  });

  it('should not set class ".pull-right" to "item-download" when allowSocial is "true"', () => {
    Object.assign(initialProps.styles, {
      allowDownload: true,
      allowSocial: true,
    })
    driver.mount.proGallery(initialProps)
    const item = driver.find.hook('item-download').at(0);
    expect(item.hasClass('pull-right')).to.be.false;
    driver.detach.proGallery();
  });
})