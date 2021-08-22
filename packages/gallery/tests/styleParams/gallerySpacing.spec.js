import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { mergeNestedObjects } from 'pro-gallery-lib';
import { images2 } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles';
import { GALLERY_CONSTS } from 'pro-gallery-lib';

describe('styleParam - gallerySpacing', () => {
  let driver;
  let initialProps;

  beforeEach(() => {
    driver = new GalleryDriver();
    initialProps = {
      container,
      items: images2,
      styles: styleParams,
    };
  });

  it('should set the gallery with a margin of 20px in a vertical gallery', async () => {
    initialProps.styles = mergeNestedObjects(initialProps.styles, {
      layoutParams: { gallerySpacing: 20 },
      galleryLayout: 2,

      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const marginContainer = driver.find
      .selector('#pro-gallery-margin-container')
      .getDOMNode();
    const margin = getComputedStyle(marginContainer).margin;
    expect(margin).to.eq('20px');
    driver.detach.proGallery();
  });
  it('should set the gallery with a margin of (gallerySpacing - (itemSpacing / 2)) in a horizontal gallery', async () => {
    initialProps.styles = mergeNestedObjects(initialProps.styles, {
      layoutParams: {
        gallerySpacing: 20,
        itemSpacing: 10,
      },
      galleryLayout: 2,
      scrollDirection: GALLERY_CONSTS.scrollDirection.HORIZONTAL,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const galleryContainer = driver.find
      .selector('.pro-gallery-parent-container')
      .getDOMNode();
    const margin = getComputedStyle(galleryContainer).margin;
    // expect the margin to be (gallerySpacing - (itemSpacing / 2)
    expect(margin).to.eq('15px');
    driver.detach.proGallery();
  });
});
