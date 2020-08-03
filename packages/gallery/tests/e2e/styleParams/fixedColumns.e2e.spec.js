import GalleryDriver from '../../drivers/pptrDriver';
import {toMatchImageSnapshot} from '../../drivers/matchers';
import { GALLERY_CONSTS } from 'pro-gallery-lib';

expect.extend({ toMatchImageSnapshot });

describe('fixedColumns - e2e', () => {
  let driver;

  beforeEach(async () => {
    driver = new GalleryDriver();
    await driver.launchBrowser();
  });

  afterEach(() => {
    driver.closeBrowser();
  });
  it('should set fixedColimns of "1"', async () => {
    await driver.openPage({
      galleryLayout: GALLERY_CONSTS.layout.EMPTY,
      groupSize:1,
      isVertical:true,
      fixedColumns: 1,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.partialScreenshot();
    expect(page).toMatchImageSnapshot();
  });
  it('should set fixedColimns of "2"', async () => {
    await driver.openPage({
      galleryLayout: GALLERY_CONSTS.layout.EMPTY,
      groupSize:1,
      isVertical:true,
      fixedColumns: 2,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
  it('should set fixedColimns of "3"', async () => {
    await driver.openPage({
      galleryLayout: GALLERY_CONSTS.layout.EMPTY,
      groupSize:1,
      isVertical:true,
      fixedColumns: 3,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
})
