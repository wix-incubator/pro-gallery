import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { images2 } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles';

describe('styleParam - oneRow', () => {
  let driver;
  const initialProps = {
    container,
    items: [...images2, ...images2],
    styles: styleParams,
  };

  beforeEach(() => {
    driver = new GalleryDriver();
  });

  it('should render element "#gallery-horizontal-scroll" when "oneRow" is "true"', () => {
    Object.assign(initialProps.styles, {
      oneRow: true,
      scrollDirection: null, // make sure scroll direction doesnt change oneRow
      galleryLayout: 2,
    });
    driver.mount.proGallery(initialProps);
    const elem = driver.find.selector('#gallery-horizontal-scroll');
    expect(elem).to.have.lengthOf(1);
    driver.detach.proGallery();
  });
  it('should render element "#pro-gallery-margin-container" when "oneRow" is "false"', () => {
    Object.assign(initialProps.styles, {
      oneRow: false,
      scrollDirection: null, // make sure scroll direction doesnt change oneRow
      galleryLayout: 2,
    });
    driver.mount.proGallery(initialProps);
    const elem = driver.find.selector('#pro-gallery-margin-container');
    expect(elem).to.have.lengthOf(1);
    driver.detach.proGallery();
  });
  it('should set margin on items to "0px" when oneRow is false(vertical)', () => {
    Object.assign(initialProps.styles, {
      oneRow: false,
      scrollDirection: null, // make sure scroll direction doesnt change oneRow
      galleryLayout: 2,
    });
    driver.mount.proGallery(initialProps);
    const item = driver.find.hook('item-container').at(0).getDOMNode();
    const { margin } = getComputedStyle(item);

    expect(margin).to.eq('0px');
    driver.detach.proGallery();
  });
});
