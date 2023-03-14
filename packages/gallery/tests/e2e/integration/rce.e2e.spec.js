import GalleryDriver from '../../drivers/pptrDriver';
import { toMatchImageSnapshot } from '../../drivers/matchers';
import { GALLERY_CONSTS, optionsMap } from 'pro-gallery-lib';

expect.extend({ toMatchImageSnapshot });

describe('RCE Integration test', () => {
  /** @type {GalleryDriver} */
  let driver;

  beforeAll(async () => {
    driver = new GalleryDriver();
    await driver.openPage();
  });

  afterAll(async () => {
    await driver.closePage();
  });
  it('should match screenshot with default RCE styles', async () => {
    await driver.navigate({
      [optionsMap.layoutParams.structure.gallerySpacing]: 0,
      [optionsMap.layoutParams.crop.ratios]: [1],
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
      [optionsMap.layoutParams.targetItemSize.unit]:
        GALLERY_CONSTS[optionsMap.layoutParams.targetItemSize.unit].PIXEL,
      [optionsMap.layoutParams.targetItemSize.value]: 300,
      [optionsMap.layoutParams.structure.scrollDirection]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection]
          .VERTICAL,
      [optionsMap.layoutParams.thumbnails.alignment]:
        GALLERY_CONSTS[optionsMap.layoutParams.thumbnails.alignment].BOTTOM,
      [optionsMap.layoutParams.structure.layoutOrientation]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.layoutOrientation]
          .HORIZONTAL,
      [optionsMap.layoutParams.structure.itemSpacing]: 20,
      [optionsMap.layoutParams.thumbnails.spacing]: 0,
      [optionsMap.layoutParams.crop.method]:
        GALLERY_CONSTS[optionsMap.layoutParams.crop.method].FILL,
      [optionsMap.behaviourParams.gallery.vertical.loadMore.enable]: false,
      [optionsMap.layoutParams.info.placement]:
        GALLERY_CONSTS[optionsMap.layoutParams.info.placement].OVERLAY,
      [optionsMap.behaviourParams.item.clickAction]:
        GALLERY_CONSTS[optionsMap.behaviourParams.item.clickAction].LINK,
      [optionsMap.layoutParams.navigationArrows.enable]: false,
      [optionsMap.layoutParams.structure.responsiveMode]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.responsiveMode]
          .SET_ITEMS_PER_ROW,
      [optionsMap.layoutParams.thumbnails.size]: 120,
      [optionsMap.behaviourParams.item.video.enablePlayButton]: true,
      [optionsMap.behaviourParams.item.video.playTrigger]:
        GALLERY_CONSTS[optionsMap.behaviourParams.item.video.playTrigger].CLICK,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(400);
    const page = await driver.grab.partialScreenshot();
    expect(page).toMatchImageSnapshot();
  });
});
