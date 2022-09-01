import { GALLERY_CONSTS } from 'pro-gallery-lib';
import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { mergeNestedObjects } from 'pro-gallery-lib';
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
    initialProps.options = mergeNestedObjects(initialProps.options, {
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      behaviourParams: {
        item: {
          secondaryMedia: options,
        },
      },
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
  };
  it('should wrapp item with secondary media container', async () => {
    await mountGalleryWithSecondaryMediaOptions({
      trigger: GALLERY_CONSTS.secondaryMediaTrigger.HOVER,
    });
    const items = driver.find.selector('.item-with-secondary-media-container');
    expect(items.length).to.eq(itemsWithSecondaryMedia.length);
    driver.detach.proGallery();
  });
  it('should not wrapp item with secondary media container', async () => {
    await mountGalleryWithSecondaryMediaOptions({
      trigger: GALLERY_CONSTS.secondaryMediaTrigger.OFF,
    });
    const items = driver.find.selector('.item-with-secondary-media-container');
    expect(items.length).to.eq(0);
    driver.detach.proGallery();
  });
  it('should not show item when there is no hover', async () => {
    await mountGalleryWithSecondaryMediaOptions({
      trigger: GALLERY_CONSTS.secondaryMediaTrigger.HOVER,
    });
    const shownItems = driver.find.selector('.secondary-media-item.show');
    expect(shownItems.length).to.eq(0);
    driver.detach.proGallery();
  });
  it('should show item on hover', async () => {
    await mountGalleryWithSecondaryMediaOptions({
      trigger: GALLERY_CONSTS.secondaryMediaTrigger.HOVER,
    });
    const item = driver.find.selector('.secondary-media-item').at(0);
    item.simulate('mouseover');
    const shownItems = driver.find.selector('.secondary-media-item.show');
    expect(shownItems.length).to.eq(1);
    driver.detach.proGallery();
  });
});
