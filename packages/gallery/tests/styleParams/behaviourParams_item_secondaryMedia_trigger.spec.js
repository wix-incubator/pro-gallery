import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { GALLERY_CONSTS, optionsMap } from 'pro-gallery-lib';
import { itemsWithSecondaryMedia } from '../drivers/mocks/items';
import { options, container } from '../drivers/mocks/styles';

describe('options - behaviourParams_item_secondaryMedia_trigger', () => {
  let driver;
  let initialProps;

  beforeEach(() => {
    driver = new GalleryDriver();
    initialProps = {
      container,
      items: itemsWithSecondaryMedia,
      options,
    };
  });
  const mountGalleryWithSecondaryMediaOptions = async (options) => {
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
      ...options,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
  };
  it('should wrapp item with secondary media container', async () => {
    await mountGalleryWithSecondaryMediaOptions({
      [optionsMap.behaviourParams.item.secondaryMedia.trigger]:
        GALLERY_CONSTS[optionsMap.behaviourParams.item.secondaryMedia.trigger]
          .HOVER,
    });
    const items = driver.find.selector('.item-with-secondary-media-container');
    expect(items.length).to.eq(itemsWithSecondaryMedia.length);
    driver.detach.proGallery();
  });
  it('should not wrapp item with secondary media container', async () => {
    await mountGalleryWithSecondaryMediaOptions({
      [optionsMap.behaviourParams.item.secondaryMedia.trigger]:
        GALLERY_CONSTS[optionsMap.behaviourParams.item.secondaryMedia.trigger]
          .OFF,
    });
    const items = driver.find.selector('.item-with-secondary-media-container');
    expect(items.length).to.eq(0);
    driver.detach.proGallery();
  });
  it('should not show item when there is no hover', async () => {
    await mountGalleryWithSecondaryMediaOptions({
      [optionsMap.behaviourParams.item.secondaryMedia.trigger]:
        GALLERY_CONSTS[optionsMap.behaviourParams.item.secondaryMedia.trigger]
          .HOVER,
    });
    const shownItems = driver.find.selector('.secondary-media-item.show');
    expect(shownItems.length).to.eq(0);
    driver.detach.proGallery();
  });
  it.skip('should show item on hover', async () => {
    await mountGalleryWithSecondaryMediaOptions({
      [optionsMap.behaviourParams.item.secondaryMedia.trigger]:
        GALLERY_CONSTS[optionsMap.behaviourParams.item.secondaryMedia.trigger]
          .HOVER,
    });
    const item = driver.find.selector('.secondary-media-item').at(0);
    // TODO:  I fixed a bug (https://github.com/wix/pro-gallery/pull/991) by replacing the mouseover to mouseEnter and mouseout to mouseleave. Enzyme cannot simulate the mouseEnter event correctly so I need to skip this test. Luckily we have a e2e test that makes sure that second media is working (https://github.com/wix/pro-gallery/blob/56310c380ee2aeb686dc1f11c7af7c98a5b4acdf/packages/gallery/tests/e2e/styleParams/behaviourParams_item_secondaryMedia_trigger.e2e.spec.js#L35)
    item.simulate('mouseover');
    const shownItems = driver.find.selector('.secondary-media-item.show');
    expect(shownItems.length).to.eq(1);
    driver.detach.proGallery();
  });
});
