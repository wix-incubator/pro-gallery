import GalleryDriver from '../../drivers/pptrDriver';
import {toMatchImageSnapshot} from '../../drivers/matchers';
import GALLERY_CONSTS from '../../../src/common/constants';

jest.setTimeout(30000)

expect.extend({ toMatchImageSnapshot });

describe('groupTypes - e2e', () => {
  let driver;
  
  beforeEach(async () => {
    driver = new GalleryDriver();
    await driver.launchBrowser();
  });

  afterEach(() => {
    driver.closeBrowser();
  });
  it('should set groups of "1,2v,2h"', async () => {
    await driver.openPage({
      galleryLayout: GALLERY_CONSTS.layout.EMPTY,
      groupTypes: '1,2v,2h'
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
  it('should set groups of "1,3v,3b,3t"', async () => {
    await driver.openPage({
      galleryLayout: GALLERY_CONSTS.layout.EMPTY,
      groupTypes: '1,3v,3b,3t'
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
  it('should set groups of "1"', async () => {
    await driver.openPage({
      galleryLayout: GALLERY_CONSTS.layout.EMPTY,
      groupTypes: '1,'
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
})