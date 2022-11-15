import { GALLERY_CONSTS, optionsMap } from 'pro-gallery-lib';
import GalleryDriver from '../../drivers/pptrDriver';
import { toMatchImageSnapshot } from '../../drivers/matchers';

expect.extend({ toMatchImageSnapshot });

describe('magic - e2e', () => {
  let driver;

  beforeAll(async () => {
    driver = new GalleryDriver();
    await driver.openPage();
  });

  afterAll(async () => {
    await driver.closePage();
  });
  it('magic - scrollDirection = vertical, magicLayoutSeed = 1 (vertical)', async () => {
    await driver.navigate({
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].MAGIC,
      magicLayoutSeed: 1,
      [optionsMap.layoutParams.structure.scrollDirection]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection]
          .VERTICAL,
    });
    // await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });

  it('magic - scrollDirection = horizontal, magicLayoutSeed = 1 (vertical)', async () => {
    await driver.navigate({
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].MAGIC,
      magicLayoutSeed: 1,
      [optionsMap.layoutParams.structure.scrollDirection]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection]
          .HORIZONTAL,
    });
    // await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
  // it('magic - scrollDirection = vertical, magicLayoutSeed = 2 (horizontal)', async () => {
  //   await driver.navigate({
  //     [optionsMap.layoutParams.structure.galleryLayout]: GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].MAGIC,
  //     magicLayoutSeed: 2,
  //     [optionsMap.layoutParams.structure.scrollDirection]:GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].VERTICAL
  //   });
  //   // await driver.waitFor.hookToBeVisible('item-container');
  //   await driver.waitFor.timer(200);
  //   const page = await driver.grab.screenshot();
  //   expect(page).toMatchImageSnapshot();
  // });
  //
  // it('magic - scrollDirection = horizontal, magicLayoutSeed = 2 (horizontal)', async () => {
  //   await driver.navigate({
  //     [optionsMap.layoutParams.structure.galleryLayout]: GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].MAGIC,
  //     magicLayoutSeed: 2,
  //     [optionsMap.layoutParams.structure.scrollDirection]:GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].HORIZONTAL
  //   });
  //   // await driver.waitFor.hookToBeVisible('item-container');
  //   await driver.waitFor.timer(200);
  //   const page = await driver.grab.screenshot();
  //   expect(page).toMatchImageSnapshot();
  // });
});
