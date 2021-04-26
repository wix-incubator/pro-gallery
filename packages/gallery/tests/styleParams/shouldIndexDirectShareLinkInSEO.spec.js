import { GALLERY_CONSTS } from 'pro-gallery-lib';
import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { images2 } from '../drivers/mocks/items';
import ItemView from '../../src/components/item/itemView';

describe('styleParam - shouldIndexDirectShareLinkInSEO', () => {
  let driver;
  let sampleItemViewProps;
  let sampleItem;

  beforeEach(() => {
    driver = new GalleryDriver();
    // sample image with directShareLink
    sampleItem = images2[0];
    sampleItemViewProps = driver.props.itemView(sampleItem);
  });
  it('should use "rel" attribute for preventing seo indexing', async () => {
    Object.assign(sampleItemViewProps, {
      styleParams: {
        itemClick: GALLERY_CONSTS.itemClick.EXPAND,
        shouldIndexDirectShareLinkInSEO: false,
        isSlideshow: false,
        galleryLayout: GALLERY_CONSTS.layout.GRID,
      },
    });
    driver.mount(ItemView, sampleItemViewProps);
    await driver.update();
    const linkProps = driver.find.selector('a').props();
    expect(linkProps).to.include({ rel: 'nofollow' });
  });

  it('should not use "rel" attribute for preventing seo indexing', async () => {
    Object.assign(sampleItemViewProps, {
      styleParams: {
        itemClick: GALLERY_CONSTS.itemClick.EXPAND,
        shouldIndexDirectShareLinkInSEO: true,
        isSlideshow: false,
        galleryLayout: GALLERY_CONSTS.layout.GRID,
      },
    });
    driver.mount(ItemView, sampleItemViewProps);
    await driver.update();
    const linkProps = driver.find.selector('a').props();
    expect(linkProps).to.not.include({ rel: 'nofollow' });
  });
});
