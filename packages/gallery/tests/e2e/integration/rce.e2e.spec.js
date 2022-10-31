import GalleryDriver from '../../drivers/pptrDriver';
import { toMatchImageSnapshot } from '../../drivers/matchers';
import { GALLERY_CONSTS, optionsMap } from 'pro-gallery-lib';

expect.extend({ toMatchImageSnapshot });

describe('RCE Integration test', () => {
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
      [optionsMap.layoutParams.targetItemSize.unit]: 'px',
      [optionsMap.layoutParams.targetItemSize.value]: 300,
      [optionsMap.layoutParams.structure.scrollDirection]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection]
          .VERTICAL,
      [optionsMap.layoutParams.thumbnails.alignment]: 'bottom',
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
  // it('should match screenshot with mibile and title styles for RCE', async () => {
  //   const styleParams = {
  //     [optionsMap.layoutParams.structure.galleryLayout]: GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
  //     [optionsMap.layoutParams.targetItemSize.units]: 'px',
  //     [optionsMap.layoutParams.targetItemSize.value]: 300,
  //     galleryMargin: 0,
  //     [optionsMap.layoutParams.structure.scrollDirection]: GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].VERTICAL,
  //     cropRatio: 1,
  //     [optionsMap.layoutParams.thumbnails.alignment]: 'bottom',
  //     [optionsMap.layoutParams.structure.layoutOrientation] : GALLERY_CONSTS[optionsMap.layoutParams.structure.layoutOrientation].HORIZONTAL,
  //     [optionsMap.layoutParams.structure.itemSpacing]: 20,
  //     [optionsMap.layoutParams.thumbnails.spacing]: 0,
  //     [optionsMap.layoutParams.crop.method]: GALLERY_CONSTS[optionsMap.layoutParams.crop.method].FILL,
  //     [optionsMap.behaviourParams.gallery.vertical.loadMore.enable]: false,
  //     [optionsMap.layoutParams.info.placement]: GALLERY_CONSTS[optionsMap.layoutParams.info.placement].OVERLAY
  //     allowHover: false,
  //     [optionsMap.behaviourParams.item.clickAction]: GALLERY_CONSTS[optionsMap.behaviourParams.item.clickAction].LINK,
  //     fullscreen: false,
  //     [optionsMap.layoutParams.navigationArrows.enable]: false,
  //     [optionsMap.layoutParams.structure.responsiveMode]: GALLERY_CONSTS[optionsMap.layoutParams.structure.responsiveMode].SET_ITEMS_PER_ROW,
  //     loveButton: false,
  //     allowSocial: false,
  //     allowDownload: false,
  //     mobileSwipeAnimation: 'NO_EFFECT',
  //     [optionsMap.layoutParams.thumbnails.size]: 120,
  //     gotStyleParams: true,
  //     [optionsMap.behaviourParams.item.video.enablePlayButton]: true,
  //     [optionsMap.behaviourParams.item.video.playTrigger]: GALLERY_CONSTS[optionsMap.behaviourParams.item.video.playTrigger].CLICK,
  //   };
  //   await driver.navigate({
  //     ...styleParams,
  //     allowHover: true, //for mobile
  //     isVertical: styleParams.galleryLayout === 1, // allow titles...
  //     allowTitle: true,
  //     galleryTextAlign: 'center',
  //     textsHorizontalPadding: 0,
  //     [optionsMap.layoutParams.info.layout]: 'NO_BACKGROUND',
  //     [optionsMap.behaviourParams.item.overlay.hoveringBehaviour]: 'APPEARS',
  //     textsVerticalPadding: 0,
  //     [optionsMap.layoutParams.info.placement]: GALLERY_CONSTS[optionsMap.layoutParams.info.placement].BELOW,
  //     calculateTextBoxHeightMode: 'AUTOMATIC',
  //   });
  //   await driver.waitFor.hookToBeVisible('item-container');
  //   await driver.waitFor.timer(400);
  //   const page = await driver.grab.partialScreenshot();
  //   expect(page).toMatchImageSnapshot();
  // });
});
