import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { GALLERY_CONSTS, optionsMap } from 'pro-gallery-lib';
import { images2 } from '../drivers/mocks/items';
import { options, container } from '../drivers/mocks/styles';
describe('options - scrollDirection', () => {
  let driver;
  let initialProps;

  beforeEach(() => {
    driver = new GalleryDriver();
    initialProps = {
      container,
      items: [...images2, ...images2],
      options,
    };
  });

  it('should render element ".gallery-horizontal-scroll" when "scrollDirection" is horizontal', async () => {
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.scrollDirection]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection]
          .HORIZONTAL,
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const elem = driver.find.selector('.gallery-horizontal-scroll');
    expect(elem).to.have.lengthOf(1);
    driver.detach.proGallery();
  });
  it('should render element ".pro-gallery-margin-container" when "scrollDirection" is vertical', async () => {
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.scrollDirection]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection]
          .VERTICAL,
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const elem = driver.find.selector('.pro-gallery-margin-container');
    expect(elem).to.have.lengthOf(1);
    driver.detach.proGallery();
  });
  it('should set margin on items to "0px" when scrollDirection is false(vertical)', async () => {
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.scrollDirection]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection]
          .VERTICAL,
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const item = driver.find.hook('item-container').at(0).getDOMNode();
    const { margin } = getComputedStyle(item);

    expect(margin).to.eq('0px');
    driver.detach.proGallery();
  });
});
