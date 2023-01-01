import { GALLERY_CONSTS } from 'pro-gallery-lib';
import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { itemsWithDirectShareLink } from '../drivers/mocks/items';
import ItemView from '../../src/components/item/itemView';

describe('options - shouldIndexDirectShareLinkInSEO', () => {
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
    const linkProps = driver.find
      .selector('[data-hook="item-link-wrapper"]')
      .props();
    return linkProps;
  }
  it('should use "rel" attribute for preventing seo indexing - itemClick = expand', async () => {
    const sample = getSampleItemViewProps({
      shouldIndexDirectShareLinkInSEO: false,
      itemClick: GALLERY_CONSTS.itemClick.EXPAND,
    });
    const linkProps = await mountUpdateAndGetLinkProps(sample);
    expect(linkProps).to.include({ rel: 'nofollow' });
  });

  it('should not use "rel" attribute for preventing seo indexing - itemClick = expand', async () => {
    const sample = getSampleItemViewProps({
      shouldIndexDirectShareLinkInSEO: true,
      itemClick: GALLERY_CONSTS.itemClick.EXPAND,
    });
    const linkProps = await mountUpdateAndGetLinkProps(sample);
    expect(linkProps).to.not.include({ rel: 'nofollow' });
  });

  it('should use "rel" attribute for preventing seo indexing - itemClick = fullscreen', async () => {
    const sample = getSampleItemViewProps({
      itemClick: GALLERY_CONSTS.itemClick.FULLSCREEN,
      shouldIndexDirectShareLinkInSEO: false,
    });
    const linkProps = await mountUpdateAndGetLinkProps(sample);
    expect(linkProps).to.include({ rel: 'nofollow' });
  });

  it('should not use "rel" attribute for preventing seo indexing - itemClick = fullscreen', async () => {
    const sample = getSampleItemViewProps({
      itemClick: GALLERY_CONSTS.itemClick.FULLSCREEN,
      shouldIndexDirectShareLinkInSEO: true,
    });
    const linkProps = await mountUpdateAndGetLinkProps(sample);
    expect(linkProps).to.not.include({ rel: 'nofollow' });
  });
});
