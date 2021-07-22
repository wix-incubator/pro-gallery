import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { images2 } from '../drivers/mocks/items';
import { styleParams, dimensions } from '../drivers/mocks/styles';
import { GALLERY_CONSTS } from 'pro-gallery-lib';

describe('styleParam - scrollDirection', () => {
  let driver;
  const initialProps = {
    dimensions,
    items: [...images2, ...images2],
    styles: styleParams,
  };

  beforeEach(() => {
    driver = new GalleryDriver();
  });

  it('should render element "#gallery-horizontal-scroll" when "scrollDirection" is horizontal', async () => {
    Object.assign(initialProps.styles, {
      scrollDirection: GALLERY_CONSTS.scrollDirection.HORIZONTAL,
      galleryLayout: 2,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const elem = driver.find.selector('#gallery-horizontal-scroll');
    expect(elem).to.have.lengthOf(1);
    driver.detach.proGallery();
  });
  it('should render element "#pro-gallery-margin-container" when "scrollDirection" is vertical', async () => {
    Object.assign(initialProps.styles, {
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
      galleryLayout: 2,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const elem = driver.find.selector('#pro-gallery-margin-container');
    expect(elem).to.have.lengthOf(1);
    driver.detach.proGallery();
  });
  it('should set margin on items to "0px" when scrollDirection is false(vertical)', async () => {
    Object.assign(initialProps.styles, {
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
      galleryLayout: 2,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const item = driver.find.hook('item-container').at(0).getDOMNode();
    const { margin } = getComputedStyle(item);

    expect(margin).to.eq('0px');
    driver.detach.proGallery();
  });
});
