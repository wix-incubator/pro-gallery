import { GALLERY_CONSTS } from 'pro-gallery-lib';
import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { itemsWithDirectShareLink } from '../drivers/mocks/items';
import ItemView from '../../src/components/item/itemView';

describe('styleParam - shouldIndexDirectShareLinkInSEO', () => {
  let driver;
  let sampleItemViewProps;
  let sampleItem;

  beforeEach(() => {
    driver = new GalleryDriver();
    // sample image with directShareLink
    sampleItem = itemsWithDirectShareLink[0];
    sampleItemViewProps = driver.props.itemView(sampleItem);
  });

  function getSampleItemViewProps(styleParams) {
    return Object.assign(sampleItemViewProps, {
      styleParams
    });
  }
  it('should use "rel" attribute for preventing seo indexing - itemClick = expand', async () => {
    const sample = getSampleItemViewProps({shouldIndexDirectShareLinkInSEO: false, itemClick: GALLERY_CONSTS.itemClick.EXPAND })
    driver.mount(ItemView, sample);
    await driver.update();
    const linkProps = driver.find.selector('a').props();
    expect(linkProps).to.include({ rel: 'nofollow' });
  });

  it('should not use "rel" attribute for preventing seo indexing - itemClick = expand', async () => {
    const sample = getSampleItemViewProps({shouldIndexDirectShareLinkInSEO: true})
    driver.mount(ItemView, sample);
    await driver.update();
    const linkProps = driver.find.selector('a').props();
    expect(linkProps).to.not.include({ rel: 'nofollow' });
  });

  it('should use "rel" attribute for preventing seo indexing - itemClick = fullscreen', async () => {
    const sample = getSampleItemViewProps({
        itemClick: GALLERY_CONSTS.itemClick.FULLSCREEN,
        shouldIndexDirectShareLinkInSEO: false,
      })
    driver.mount(ItemView, sample);
    await driver.update();
    const linkProps = driver.find.selector('a').props();
    expect(linkProps).to.include({ rel: 'nofollow' });
  });

  it('should not use "rel" attribute for preventing seo indexing - itemClick = fullscreen', async () => {
    const sample = getSampleItemViewProps(
      {itemClick: GALLERY_CONSTS.itemClick.FULLSCREEN,
        shouldIndexDirectShareLinkInSEO: true,
      })
    driver.mount(ItemView, sample);
    await driver.update();
    const linkProps = driver.find.selector('a').props();
    expect(linkProps).to.not.include({ rel: 'nofollow' });
  });
});
