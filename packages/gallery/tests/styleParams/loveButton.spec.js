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

  it('should', () => {
    Object.assign(initialProps.styles, {
      allowSocial: true,
    })
    driver.mount.proGallery(initialProps);
    driver.detach.proGallery();
  });
})