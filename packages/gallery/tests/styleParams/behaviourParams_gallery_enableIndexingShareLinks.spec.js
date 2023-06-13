import { GALLERY_CONSTS, optionsMap } from 'pro-gallery-lib';
import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { itemsWithDirectShareLink } from '../drivers/mocks/items';
import ItemView from '../../src/components/item/itemView';

describe('options - behaviourParams_gallery_enableIndexingShareLinks', () => {
  let driver;

  function getSampleItemViewProps(options) {
    driver = new GalleryDriver();
    const sampleItem = itemsWithDirectShareLink[0];
    const sampleItemViewProps = driver.props.itemView(sampleItem);
    return Object.assign(sampleItemViewProps, {
      options: {
        ...sampleItemViewProps.options,
        ...options,
      },
    });
  }

  async function mountUpdateAndGetLinkProps(sample) {
    driver.mount(ItemView, sample);
    await driver.update();
    const linkProps = driver.find.selector('[data-hook="item-link-wrapper"]').props();
    return linkProps;
  }

  it('should not use "rel" attribute for preventing seo indexing - behaviourParams_item_clickAction = action', async () => {
    const sample = getSampleItemViewProps({
      [optionsMap.behaviourParams.gallery.enableIndexingShareLinks]: true,
      [optionsMap.behaviourParams.item.clickAction]: GALLERY_CONSTS[optionsMap.behaviourParams.item.clickAction].ACTION,
    });
    const linkProps = await mountUpdateAndGetLinkProps(sample);
    expect(linkProps).to.not.include({ rel: 'nofollow' });
  });

  it('should use "rel" attribute for preventing seo indexing - behaviourParams_item_clickAction = action', async () => {
    const sample = getSampleItemViewProps({
      [optionsMap.behaviourParams.item.clickAction]: GALLERY_CONSTS[optionsMap.behaviourParams.item.clickAction].ACTION,
      [optionsMap.behaviourParams.gallery.enableIndexingShareLinks]: false,
    });
    const linkProps = await mountUpdateAndGetLinkProps(sample);
    expect(linkProps).to.include({ rel: 'nofollow' });
  });
});
